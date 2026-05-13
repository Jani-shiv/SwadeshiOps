package pipeline

import (
	"time"

	"github.com/google/uuid"
)

// RunStatus represents the status of a pipeline run
type RunStatus string

const (
	StatusQueued    RunStatus = "queued"
	StatusRunning   RunStatus = "running"
	StatusSuccess   RunStatus = "success"
	StatusFailed    RunStatus = "failed"
	StatusCancelled RunStatus = "cancelled"
	StatusTimeout   RunStatus = "timeout"
)

// Pipeline represents a pipeline definition
type Pipeline struct {
	ID            uuid.UUID       `json:"id"`
	ProjectID     uuid.UUID       `json:"project_id"`
	Name          string          `json:"name"`
	ConfigYAML    string          `json:"config_yaml"`
	ConfigParsed  *PipelineConfig `json:"config_parsed,omitempty"`
	TriggerType   string          `json:"trigger_type"`
	TriggerBranch string          `json:"trigger_branch"`
	IsActive      bool            `json:"is_active"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

// PipelineRun represents a single execution of a pipeline
type PipelineRun struct {
	ID             uuid.UUID  `json:"id"`
	PipelineID     uuid.UUID  `json:"pipeline_id"`
	ProjectID      uuid.UUID  `json:"project_id"`
	RunNumber      int        `json:"run_number"`
	Status         RunStatus  `json:"status"`
	TriggerType    string     `json:"trigger_type"`
	TriggerRef     string     `json:"trigger_ref"`
	CommitSHA      string     `json:"commit_sha"`
	CommitMessage  string     `json:"commit_message"`
	CommitAuthor   string     `json:"commit_author"`
	StartedAt      *time.Time `json:"started_at,omitempty"`
	FinishedAt     *time.Time `json:"finished_at,omitempty"`
	DurationMs     int64      `json:"duration_ms"`
	RunnerID       *uuid.UUID `json:"runner_id,omitempty"`
	ErrorMessage   string     `json:"error_message,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
}

// PipelineStep represents a single step within a pipeline run
type PipelineStep struct {
	ID         uuid.UUID  `json:"id"`
	RunID      uuid.UUID  `json:"run_id"`
	Name       string     `json:"name"`
	StepOrder  int        `json:"step_order"`
	Status     RunStatus  `json:"status"`
	Image      string     `json:"image"`
	Commands   []string   `json:"commands"`
	StartedAt  *time.Time `json:"started_at,omitempty"`
	FinishedAt *time.Time `json:"finished_at,omitempty"`
	DurationMs int64      `json:"duration_ms"`
	ExitCode   *int       `json:"exit_code,omitempty"`
	LogPath    string     `json:"log_path,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

// CreatePipelineRequest represents a request to create a pipeline
type CreatePipelineRequest struct {
	Name          string `json:"name" binding:"required"`
	ConfigYAML    string `json:"config_yaml" binding:"required"`
	TriggerType   string `json:"trigger_type"`
	TriggerBranch string `json:"trigger_branch"`
}

// TriggerRequest represents a manual pipeline trigger request
type TriggerRequest struct {
	Branch string            `json:"branch"`
	Env    map[string]string `json:"env,omitempty"`
}
