package runner

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

// DockerExecutor runs pipeline steps in Docker containers
type DockerExecutor struct {
	dockerSocket string
	timeout      time.Duration
	logger       zerolog.Logger
}

// NewDockerExecutor creates a Docker-based step executor
func NewDockerExecutor(socket string, timeoutSec int, logger zerolog.Logger) *DockerExecutor {
	return &DockerExecutor{
		dockerSocket: socket,
		timeout:      time.Duration(timeoutSec) * time.Second,
		logger:       logger.With().Str("component", "docker_executor").Logger(),
	}
}

// Execute runs a pipeline step in a Docker container
func (d *DockerExecutor) Execute(ctx context.Context, step *StepConfig, env map[string]string, logWriter func(string)) (*StepResult, error) {
	startTime := time.Now()

	// If no image specified, run commands directly (for deploy steps)
	if step.Image == "" {
		return d.executeLocal(ctx, step, env, logWriter, startTime)
	}

	return d.executeDocker(ctx, step, env, logWriter, startTime)
}

// executeDocker runs commands inside a Docker container
func (d *DockerExecutor) executeDocker(ctx context.Context, step *StepConfig, env map[string]string, logWriter func(string), startTime time.Time) (*StepResult, error) {
	// Build the docker run command
	args := []string{
		"run", "--rm",
		"--name", fmt.Sprintf("swadeshiops-%s-%d", step.Name, time.Now().UnixNano()),
	}

	// Add environment variables
	for k, v := range env {
		args = append(args, "-e", fmt.Sprintf("%s=%s", k, v))
	}

	// Memory limit for cost optimization (256MB default)
	args = append(args, "--memory", "256m")
	args = append(args, "--cpus", "0.5")

	// Join commands with && for sequential execution
	shellCmd := strings.Join(step.Commands, " && ")
	args = append(args, step.Image, "sh", "-c", shellCmd)

	d.logger.Debug().
		Str("step", step.Name).
		Str("image", step.Image).
		Str("command", shellCmd).
		Msg("Running Docker container")

	// Create context with timeout
	execCtx, cancel := context.WithTimeout(ctx, d.timeout)
	defer cancel()

	cmd := exec.CommandContext(execCtx, "docker", args...)

	// Capture output
	output, err := cmd.CombinedOutput()
	duration := time.Since(startTime)

	outputStr := string(output)

	// Stream output to log writer
	if logWriter != nil && outputStr != "" {
		for _, line := range strings.Split(outputStr, "\n") {
			if line != "" {
				logWriter(line)
			}
		}
	}

	result := &StepResult{
		StepName: step.Name,
		Output:   outputStr,
		Duration: duration,
	}

	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			result.ExitCode = exitErr.ExitCode()
			result.Status = "failed"
		} else if execCtx.Err() == context.DeadlineExceeded {
			result.Status = "timeout"
			result.Error = fmt.Errorf("step timed out after %s", d.timeout)
		} else {
			result.Status = "failed"
			result.Error = err
		}
		return result, nil
	}

	result.Status = "success"
	result.ExitCode = 0
	return result, nil
}

// executeLocal runs commands directly on the host (for deploy/SSH steps)
func (d *DockerExecutor) executeLocal(ctx context.Context, step *StepConfig, env map[string]string, logWriter func(string), startTime time.Time) (*StepResult, error) {
	shellCmd := strings.Join(step.Commands, " && ")

	execCtx, cancel := context.WithTimeout(ctx, d.timeout)
	defer cancel()

	cmd := exec.CommandContext(execCtx, "sh", "-c", shellCmd)

	// Set environment
	for k, v := range env {
		cmd.Env = append(cmd.Env, fmt.Sprintf("%s=%s", k, v))
	}

	output, err := cmd.CombinedOutput()
	duration := time.Since(startTime)
	outputStr := string(output)

	if logWriter != nil && outputStr != "" {
		for _, line := range strings.Split(outputStr, "\n") {
			if line != "" {
				logWriter(line)
			}
		}
	}

	result := &StepResult{
		StepName: step.Name,
		Output:   outputStr,
		Duration: duration,
	}

	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			result.ExitCode = exitErr.ExitCode()
			result.Status = "failed"
		} else {
			result.Status = "failed"
			result.Error = err
		}
		return result, nil
	}

	result.Status = "success"
	result.ExitCode = 0
	return result, nil
}
