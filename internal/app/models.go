package app

import (
	"time"

	"github.com/google/uuid"
)

type Organization struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	OwnerID   uuid.UUID `json:"owner_id"`
	Plan      string    `json:"plan"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Project struct {
	ID           uuid.UUID `json:"id"`
	OrgID        uuid.UUID `json:"org_id"`
	Name         string    `json:"name"`
	Slug         string    `json:"slug"`
	Description  string    `json:"description,omitempty"`
	RepoURL      string    `json:"repo_url,omitempty"`
	RepoProvider string    `json:"repo_provider,omitempty"`
	RepoBranch   string    `json:"repo_branch"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Pipeline struct {
	ID            uuid.UUID `json:"id"`
	ProjectID     uuid.UUID `json:"project_id"`
	Name          string    `json:"name"`
	ConfigYAML    string    `json:"config_yaml"`
	TriggerType   string    `json:"trigger_type"`
	TriggerBranch string    `json:"trigger_branch"`
	IsActive      bool      `json:"is_active"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type PipelineRun struct {
	ID            uuid.UUID  `json:"id"`
	PipelineID    uuid.UUID  `json:"pipeline_id"`
	ProjectID     uuid.UUID  `json:"project_id"`
	RunNumber     int        `json:"run_number"`
	Status        string     `json:"status"`
	TriggerType   string     `json:"trigger_type"`
	TriggerRef    string     `json:"trigger_ref"`
	CommitSHA     string     `json:"commit_sha"`
	CommitMessage string     `json:"commit_message"`
	CommitAuthor  string     `json:"commit_author"`
	StartedAt     *time.Time `json:"started_at,omitempty"`
	FinishedAt    *time.Time `json:"finished_at,omitempty"`
	DurationMS    int64      `json:"duration_ms"`
	ErrorMessage  string     `json:"error_message,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
}

type Deployment struct {
	ID          uuid.UUID  `json:"id"`
	ProjectID   uuid.UUID  `json:"project_id"`
	RunID       *uuid.UUID `json:"run_id,omitempty"`
	Environment string     `json:"environment"`
	Status      string     `json:"status"`
	DeployType  string     `json:"deploy_type"`
	TargetHost  string     `json:"target_host"`
	CommitSHA   string     `json:"commit_sha"`
	StartedAt   *time.Time `json:"started_at,omitempty"`
	FinishedAt  *time.Time `json:"finished_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

type Secret struct {
	ID          uuid.UUID `json:"id"`
	ProjectID   uuid.UUID `json:"project_id"`
	Name        string    `json:"name"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type EnvVar struct {
	ID          uuid.UUID `json:"id"`
	ProjectID   uuid.UUID `json:"project_id"`
	Name        string    `json:"name"`
	Value       string    `json:"value,omitempty"`
	IsSecret    bool      `json:"is_secret"`
	Environment string    `json:"environment"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type DashboardStats struct {
	TotalProjects     int64         `json:"total_projects"`
	TotalPipelines    int64         `json:"total_pipelines"`
	TotalRuns         int64         `json:"total_runs"`
	SuccessRate       float64       `json:"success_rate"`
	RecentRuns        []PipelineRun `json:"recent_runs"`
	ActiveDeployments []Deployment  `json:"active_deployments"`
}

type createOrgRequest struct {
	Name string `json:"name" binding:"required,min=2,max=255"`
	Slug string `json:"slug" binding:"omitempty,min=2,max=100"`
}

type createProjectRequest struct {
	Name         string `json:"name" binding:"required,min=2,max=255"`
	Slug         string `json:"slug" binding:"omitempty,min=2,max=100"`
	Description  string `json:"description"`
	RepoURL      string `json:"repo_url"`
	RepoProvider string `json:"repo_provider"`
	RepoBranch   string `json:"repo_branch"`
}

type createPipelineRequest struct {
	Name          string `json:"name" binding:"required,min=2,max=255"`
	ConfigYAML    string `json:"config_yaml" binding:"required"`
	TriggerType   string `json:"trigger_type"`
	TriggerBranch string `json:"trigger_branch"`
}

type triggerPipelineRequest struct {
	Branch        string `json:"branch"`
	CommitSHA     string `json:"commit_sha"`
	CommitMessage string `json:"commit_message"`
	CommitAuthor  string `json:"commit_author"`
}

type createDeploymentRequest struct {
	RunID       *uuid.UUID `json:"run_id"`
	Environment string     `json:"environment" binding:"required,min=2,max=50"`
	DeployType  string     `json:"deploy_type"`
	TargetHost  string     `json:"target_host"`
	CommitSHA   string     `json:"commit_sha"`
}

type createSecretRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=255"`
	Value       string `json:"value" binding:"required"`
	Description string `json:"description"`
}

type createEnvVarRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=255"`
	Value       string `json:"value" binding:"required"`
	IsSecret    bool   `json:"is_secret"`
	Environment string `json:"environment"`
}
