package runner

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
)

// StepResult represents the result of executing a pipeline step
type StepResult struct {
	StepName  string
	Status    string
	ExitCode  int
	Output    string
	Duration  time.Duration
	Error     error
}

// JobRequest represents a pipeline execution request
type JobRequest struct {
	RunID     uuid.UUID
	Pipeline  string
	Steps     []StepConfig
	Env       map[string]string
	LogWriter func(line string)
}

// StepConfig represents a single step to execute
type StepConfig struct {
	Name     string
	Image    string
	Commands []string
	Env      map[string]string
}

// WorkerPool manages a pool of pipeline execution workers
type WorkerPool struct {
	maxWorkers int
	jobs       chan *JobRequest
	results    chan *StepResult
	wg         sync.WaitGroup
	ctx        context.Context
	cancel     context.CancelFunc
	logger     zerolog.Logger
	executor   Executor
}

// Executor defines the interface for running pipeline steps
type Executor interface {
	Execute(ctx context.Context, step *StepConfig, env map[string]string, logWriter func(string)) (*StepResult, error)
}

// NewWorkerPool creates a new worker pool
func NewWorkerPool(maxWorkers int, executor Executor, logger zerolog.Logger) *WorkerPool {
	ctx, cancel := context.WithCancel(context.Background())

	wp := &WorkerPool{
		maxWorkers: maxWorkers,
		jobs:       make(chan *JobRequest, 100),
		results:    make(chan *StepResult, 100),
		ctx:        ctx,
		cancel:     cancel,
		logger:     logger.With().Str("component", "worker_pool").Logger(),
		executor:   executor,
	}

	return wp
}

// Start launches the worker goroutines
func (wp *WorkerPool) Start() {
	wp.logger.Info().Int("workers", wp.maxWorkers).Msg("Starting worker pool")

	for i := 0; i < wp.maxWorkers; i++ {
		wp.wg.Add(1)
		go wp.worker(i)
	}
}

// Stop gracefully shuts down the worker pool
func (wp *WorkerPool) Stop() {
	wp.logger.Info().Msg("Stopping worker pool...")
	wp.cancel()
	close(wp.jobs)
	wp.wg.Wait()
	wp.logger.Info().Msg("Worker pool stopped")
}

// Submit adds a job to the queue
func (wp *WorkerPool) Submit(job *JobRequest) error {
	select {
	case wp.jobs <- job:
		wp.logger.Info().
			Str("run_id", job.RunID.String()).
			Str("pipeline", job.Pipeline).
			Int("steps", len(job.Steps)).
			Msg("Job submitted")
		return nil
	default:
		return fmt.Errorf("job queue is full")
	}
}

// worker is the goroutine that processes jobs
func (wp *WorkerPool) worker(id int) {
	defer wp.wg.Done()

	wp.logger.Debug().Int("worker_id", id).Msg("Worker started")

	for job := range wp.jobs {
		select {
		case <-wp.ctx.Done():
			return
		default:
			wp.processJob(id, job)
		}
	}
}

// processJob executes all steps in a pipeline job
func (wp *WorkerPool) processJob(workerID int, job *JobRequest) {
	wp.logger.Info().
		Int("worker_id", workerID).
		Str("run_id", job.RunID.String()).
		Msg("Processing job")

	startTime := time.Now()

	for _, step := range job.Steps {
		select {
		case <-wp.ctx.Done():
			wp.logger.Warn().Msg("Worker canceled during job execution")
			return
		default:
		}

		wp.logger.Info().
			Str("step", step.Name).
			Str("image", step.Image).
			Msg("Executing step")

		if job.LogWriter != nil {
			job.LogWriter(fmt.Sprintf("=== Step: %s ===", step.Name))
		}

		// Merge job env with step env
		env := make(map[string]string)
		for k, v := range job.Env {
			env[k] = v
		}
		for k, v := range step.Env {
			env[k] = v
		}

		result, err := wp.executor.Execute(wp.ctx, &step, env, job.LogWriter)
		if err != nil {
			wp.logger.Error().
				Err(err).
				Str("step", step.Name).
				Msg("Step execution failed")

			if job.LogWriter != nil {
				job.LogWriter(fmt.Sprintf("❌ Step '%s' failed: %s", step.Name, err.Error()))
			}

			wp.results <- &StepResult{
				StepName: step.Name,
				Status:   "failed",
				Error:    err,
				Duration: time.Since(startTime),
			}
			return // Stop pipeline on first failure
		}

		if result.ExitCode != 0 {
			if job.LogWriter != nil {
				job.LogWriter(fmt.Sprintf("❌ Step '%s' exited with code %d", step.Name, result.ExitCode))
			}

			wp.results <- result
			return
		}

		if job.LogWriter != nil {
			job.LogWriter(fmt.Sprintf("✅ Step '%s' completed in %s", step.Name, result.Duration.Round(time.Millisecond)))
		}

		wp.results <- result
	}

	totalDuration := time.Since(startTime)
	wp.logger.Info().
		Str("run_id", job.RunID.String()).
		Dur("duration", totalDuration).
		Msg("Job completed successfully")

	if job.LogWriter != nil {
		job.LogWriter(fmt.Sprintf("\n✅ Pipeline completed in %s", totalDuration.Round(time.Millisecond)))
	}
}
