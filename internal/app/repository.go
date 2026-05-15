package app

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateOrganization(ctx context.Context, name, slug string, ownerID uuid.UUID) (*Organization, error) {
	org := &Organization{}
	err := r.db.QueryRow(ctx, `
		INSERT INTO organizations (name, slug, owner_id)
		VALUES ($1, $2, $3)
		RETURNING id, name, slug, owner_id, plan, created_at, updated_at
	`, name, slug, ownerID).Scan(&org.ID, &org.Name, &org.Slug, &org.OwnerID, &org.Plan, &org.CreatedAt, &org.UpdatedAt)
	if err != nil {
		return nil, err
	}
	_, err = r.db.Exec(ctx, `
		INSERT INTO org_members (org_id, user_id, role)
		VALUES ($1, $2, 'owner')
		ON CONFLICT (org_id, user_id) DO UPDATE SET role = EXCLUDED.role
	`, org.ID, ownerID)
	if err != nil {
		return nil, err
	}
	return org, nil
}

func (r *Repository) ListOrganizations(ctx context.Context, userID uuid.UUID) ([]Organization, error) {
	rows, err := r.db.Query(ctx, `
		SELECT o.id, o.name, o.slug, o.owner_id, o.plan, o.created_at, o.updated_at
		FROM organizations o
		JOIN org_members m ON m.org_id = o.id
		WHERE m.user_id = $1
		ORDER BY o.created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanOrganizations(rows)
}

func (r *Repository) GetOrganization(ctx context.Context, orgID, userID uuid.UUID) (*Organization, error) {
	org := &Organization{}
	err := r.db.QueryRow(ctx, `
		SELECT o.id, o.name, o.slug, o.owner_id, o.plan, o.created_at, o.updated_at
		FROM organizations o
		JOIN org_members m ON m.org_id = o.id
		WHERE o.id = $1 AND m.user_id = $2
	`, orgID, userID).Scan(&org.ID, &org.Name, &org.Slug, &org.OwnerID, &org.Plan, &org.CreatedAt, &org.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return org, nil
}

func (r *Repository) UpdateOrganization(ctx context.Context, orgID, userID uuid.UUID, name, slug string) (*Organization, error) {
	org := &Organization{}
	err := r.db.QueryRow(ctx, `
		UPDATE organizations o
		SET name = $3, slug = $4, updated_at = NOW()
		FROM org_members m
		WHERE o.id = $1 AND m.org_id = o.id AND m.user_id = $2 AND m.role IN ('owner', 'admin')
		RETURNING o.id, o.name, o.slug, o.owner_id, o.plan, o.created_at, o.updated_at
	`, orgID, userID, name, slug).Scan(&org.ID, &org.Name, &org.Slug, &org.OwnerID, &org.Plan, &org.CreatedAt, &org.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return org, nil
}

func (r *Repository) CreateProject(ctx context.Context, orgID, userID uuid.UUID, req createProjectRequest, slug string) (*Project, error) {
	if err := r.requireOrgAccess(ctx, orgID, userID); err != nil {
		return nil, err
	}
	if req.RepoBranch == "" {
		req.RepoBranch = "main"
	}
	project := &Project{}
	err := r.db.QueryRow(ctx, `
		INSERT INTO projects (org_id, name, slug, description, repo_url, repo_provider, repo_branch)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, org_id, name, slug, description, repo_url, repo_provider, repo_branch, is_active, created_at, updated_at
	`, orgID, req.Name, slug, req.Description, req.RepoURL, req.RepoProvider, req.RepoBranch).Scan(
		&project.ID, &project.OrgID, &project.Name, &project.Slug, &project.Description,
		&project.RepoURL, &project.RepoProvider, &project.RepoBranch, &project.IsActive,
		&project.CreatedAt, &project.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (r *Repository) ListProjects(ctx context.Context, orgID, userID uuid.UUID) ([]Project, error) {
	if err := r.requireOrgAccess(ctx, orgID, userID); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, org_id, name, slug, description, repo_url, repo_provider, repo_branch, is_active, created_at, updated_at
		FROM projects
		WHERE org_id = $1
		ORDER BY created_at DESC
	`, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanProjects(rows)
}

func (r *Repository) GetProject(ctx context.Context, projectID, userID uuid.UUID) (*Project, error) {
	project := &Project{}
	err := r.db.QueryRow(ctx, `
		SELECT p.id, p.org_id, p.name, p.slug, p.description, p.repo_url, p.repo_provider, p.repo_branch, p.is_active, p.created_at, p.updated_at
		FROM projects p
		JOIN org_members m ON m.org_id = p.org_id
		WHERE p.id = $1 AND m.user_id = $2
	`, projectID, userID).Scan(&project.ID, &project.OrgID, &project.Name, &project.Slug, &project.Description, &project.RepoURL, &project.RepoProvider, &project.RepoBranch, &project.IsActive, &project.CreatedAt, &project.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (r *Repository) UpdateProject(ctx context.Context, projectID, userID uuid.UUID, req createProjectRequest, slug string) (*Project, error) {
	if req.RepoBranch == "" {
		req.RepoBranch = "main"
	}
	project := &Project{}
	err := r.db.QueryRow(ctx, `
		UPDATE projects p
		SET name = $3, slug = $4, description = $5, repo_url = $6, repo_provider = $7, repo_branch = $8, updated_at = NOW()
		FROM org_members m
		WHERE p.id = $1 AND m.org_id = p.org_id AND m.user_id = $2 AND m.role IN ('owner', 'admin')
		RETURNING p.id, p.org_id, p.name, p.slug, p.description, p.repo_url, p.repo_provider, p.repo_branch, p.is_active, p.created_at, p.updated_at
	`, projectID, userID, req.Name, slug, req.Description, req.RepoURL, req.RepoProvider, req.RepoBranch).Scan(&project.ID, &project.OrgID, &project.Name, &project.Slug, &project.Description, &project.RepoURL, &project.RepoProvider, &project.RepoBranch, &project.IsActive, &project.CreatedAt, &project.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (r *Repository) DeleteProject(ctx context.Context, projectID, userID uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `
		DELETE FROM projects p
		USING org_members m
		WHERE p.id = $1 AND m.org_id = p.org_id AND m.user_id = $2 AND m.role IN ('owner', 'admin')
	`, projectID, userID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *Repository) CreatePipeline(ctx context.Context, projectID, userID uuid.UUID, req createPipelineRequest) (*Pipeline, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	if req.TriggerType == "" {
		req.TriggerType = "push"
	}
	if req.TriggerBranch == "" {
		req.TriggerBranch = "main"
	}
	pipeline := &Pipeline{}
	err := r.db.QueryRow(ctx, `
		INSERT INTO pipelines (project_id, name, config_yaml, trigger_type, trigger_branch)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, project_id, name, config_yaml, trigger_type, trigger_branch, is_active, created_at, updated_at
	`, projectID, req.Name, req.ConfigYAML, req.TriggerType, req.TriggerBranch).Scan(&pipeline.ID, &pipeline.ProjectID, &pipeline.Name, &pipeline.ConfigYAML, &pipeline.TriggerType, &pipeline.TriggerBranch, &pipeline.IsActive, &pipeline.CreatedAt, &pipeline.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return pipeline, nil
}

func (r *Repository) ListPipelines(ctx context.Context, projectID, userID uuid.UUID) ([]Pipeline, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, project_id, name, config_yaml, trigger_type, trigger_branch, is_active, created_at, updated_at
		FROM pipelines
		WHERE project_id = $1
		ORDER BY created_at DESC
	`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanPipelines(rows)
}

func (r *Repository) GetPipeline(ctx context.Context, pipelineID, userID uuid.UUID) (*Pipeline, error) {
	pipeline := &Pipeline{}
	err := r.db.QueryRow(ctx, `
		SELECT pl.id, pl.project_id, pl.name, pl.config_yaml, pl.trigger_type, pl.trigger_branch, pl.is_active, pl.created_at, pl.updated_at
		FROM pipelines pl
		JOIN projects p ON p.id = pl.project_id
		JOIN org_members m ON m.org_id = p.org_id
		WHERE pl.id = $1 AND m.user_id = $2
	`, pipelineID, userID).Scan(&pipeline.ID, &pipeline.ProjectID, &pipeline.Name, &pipeline.ConfigYAML, &pipeline.TriggerType, &pipeline.TriggerBranch, &pipeline.IsActive, &pipeline.CreatedAt, &pipeline.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return pipeline, nil
}

func (r *Repository) TriggerPipeline(ctx context.Context, pipelineID, userID uuid.UUID, req triggerPipelineRequest) (*PipelineRun, error) {
	pipeline, err := r.GetPipeline(ctx, pipelineID, userID)
	if err != nil {
		return nil, err
	}
	if req.Branch == "" {
		req.Branch = pipeline.TriggerBranch
	}
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)
	var runNumber int
	err = tx.QueryRow(ctx, `SELECT COALESCE(MAX(run_number), 0) + 1 FROM pipeline_runs WHERE pipeline_id = $1`, pipelineID).Scan(&runNumber)
	if err != nil {
		return nil, err
	}
	run := &PipelineRun{}
	err = tx.QueryRow(ctx, `
		INSERT INTO pipeline_runs (pipeline_id, project_id, run_number, status, trigger_type, trigger_ref, commit_sha, commit_message, commit_author, created_at)
		VALUES ($1, $2, $3, 'queued', 'manual', $4, $5, $6, $7, NOW())
		RETURNING id, pipeline_id, project_id, run_number, status, trigger_type, trigger_ref, commit_sha, commit_message, commit_author, started_at, finished_at, COALESCE(duration_ms, 0), COALESCE(error_message, ''), created_at
	`, pipelineID, pipeline.ProjectID, runNumber, req.Branch, req.CommitSHA, req.CommitMessage, req.CommitAuthor).Scan(&run.ID, &run.PipelineID, &run.ProjectID, &run.RunNumber, &run.Status, &run.TriggerType, &run.TriggerRef, &run.CommitSHA, &run.CommitMessage, &run.CommitAuthor, &run.StartedAt, &run.FinishedAt, &run.DurationMS, &run.ErrorMessage, &run.CreatedAt)
	if err != nil {
		return nil, err
	}
	return run, tx.Commit(ctx)
}

func (r *Repository) ListRuns(ctx context.Context, pipelineID, userID uuid.UUID) ([]PipelineRun, error) {
	if _, err := r.GetPipeline(ctx, pipelineID, userID); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, pipeline_id, project_id, run_number, status, COALESCE(trigger_type, ''), COALESCE(trigger_ref, ''),
		       COALESCE(commit_sha, ''), COALESCE(commit_message, ''), COALESCE(commit_author, ''),
		       started_at, finished_at, COALESCE(duration_ms, 0), COALESCE(error_message, ''), created_at
		FROM pipeline_runs
		WHERE pipeline_id = $1
		ORDER BY created_at DESC
		LIMIT 100
	`, pipelineID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanRuns(rows)
}

func (r *Repository) GetRun(ctx context.Context, runID, userID uuid.UUID) (*PipelineRun, error) {
	run := &PipelineRun{}
	err := r.db.QueryRow(ctx, `
		SELECT pr.id, pr.pipeline_id, pr.project_id, pr.run_number, pr.status, COALESCE(pr.trigger_type, ''), COALESCE(pr.trigger_ref, ''),
		       COALESCE(pr.commit_sha, ''), COALESCE(pr.commit_message, ''), COALESCE(pr.commit_author, ''),
		       pr.started_at, pr.finished_at, COALESCE(pr.duration_ms, 0), COALESCE(pr.error_message, ''), pr.created_at
		FROM pipeline_runs pr
		JOIN projects p ON p.id = pr.project_id
		JOIN org_members m ON m.org_id = p.org_id
		WHERE pr.id = $1 AND m.user_id = $2
	`, runID, userID).Scan(&run.ID, &run.PipelineID, &run.ProjectID, &run.RunNumber, &run.Status, &run.TriggerType, &run.TriggerRef, &run.CommitSHA, &run.CommitMessage, &run.CommitAuthor, &run.StartedAt, &run.FinishedAt, &run.DurationMS, &run.ErrorMessage, &run.CreatedAt)
	if err != nil {
		return nil, err
	}
	return run, nil
}

func (r *Repository) CancelRun(ctx context.Context, runID, userID uuid.UUID) (*PipelineRun, error) {
	run := &PipelineRun{}
	err := r.db.QueryRow(ctx, `
		UPDATE pipeline_runs pr
		SET status = 'cancelled', finished_at = NOW()
		FROM projects p
		JOIN org_members m ON m.org_id = p.org_id
		WHERE pr.id = $1 AND p.id = pr.project_id AND m.user_id = $2 AND pr.status IN ('queued', 'running')
		RETURNING pr.id, pr.pipeline_id, pr.project_id, pr.run_number, pr.status, COALESCE(pr.trigger_type, ''), COALESCE(pr.trigger_ref, ''),
		          COALESCE(pr.commit_sha, ''), COALESCE(pr.commit_message, ''), COALESCE(pr.commit_author, ''),
		          pr.started_at, pr.finished_at, COALESCE(pr.duration_ms, 0), COALESCE(pr.error_message, ''), pr.created_at
	`, runID, userID).Scan(&run.ID, &run.PipelineID, &run.ProjectID, &run.RunNumber, &run.Status, &run.TriggerType, &run.TriggerRef, &run.CommitSHA, &run.CommitMessage, &run.CommitAuthor, &run.StartedAt, &run.FinishedAt, &run.DurationMS, &run.ErrorMessage, &run.CreatedAt)
	if err != nil {
		return nil, err
	}
	return run, nil
}

func (r *Repository) CreateDeployment(ctx context.Context, projectID, userID uuid.UUID, req createDeploymentRequest) (*Deployment, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	if req.DeployType == "" {
		req.DeployType = "manual"
	}
	deployment := &Deployment{}
	err := r.db.QueryRow(ctx, `
		INSERT INTO deployments (project_id, run_id, environment, status, deploy_type, target_host, commit_sha, deployed_by)
		VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7)
		RETURNING id, project_id, run_id, environment, status, deploy_type, target_host, COALESCE(commit_sha, ''), started_at, finished_at, created_at
	`, projectID, req.RunID, req.Environment, req.DeployType, req.TargetHost, req.CommitSHA, userID).Scan(&deployment.ID, &deployment.ProjectID, &deployment.RunID, &deployment.Environment, &deployment.Status, &deployment.DeployType, &deployment.TargetHost, &deployment.CommitSHA, &deployment.StartedAt, &deployment.FinishedAt, &deployment.CreatedAt)
	if err != nil {
		return nil, err
	}
	return deployment, nil
}

func (r *Repository) ListDeployments(ctx context.Context, projectID, userID uuid.UUID) ([]Deployment, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, project_id, run_id, environment, status, COALESCE(deploy_type, ''), COALESCE(target_host, ''), COALESCE(commit_sha, ''), started_at, finished_at, created_at
		FROM deployments
		WHERE project_id = $1
		ORDER BY created_at DESC
		LIMIT 100
	`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanDeployments(rows)
}

func (r *Repository) CreateSecret(ctx context.Context, projectID, userID uuid.UUID, req createSecretRequest, encrypted string) (*Secret, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	secret := &Secret{}
	err := r.db.QueryRow(ctx, `
		INSERT INTO secrets (project_id, name, encrypted_value, description, created_by)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (project_id, name)
		DO UPDATE SET encrypted_value = EXCLUDED.encrypted_value, description = EXCLUDED.description, updated_at = NOW()
		RETURNING id, project_id, name, description, created_at, updated_at
	`, projectID, req.Name, encrypted, req.Description, userID).Scan(&secret.ID, &secret.ProjectID, &secret.Name, &secret.Description, &secret.CreatedAt, &secret.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return secret, nil
}

func (r *Repository) ListSecrets(ctx context.Context, projectID, userID uuid.UUID) ([]Secret, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, project_id, name, COALESCE(description, ''), created_at, updated_at
		FROM secrets
		WHERE project_id = $1
		ORDER BY name ASC
	`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var secrets []Secret
	for rows.Next() {
		var secret Secret
		if err := rows.Scan(&secret.ID, &secret.ProjectID, &secret.Name, &secret.Description, &secret.CreatedAt, &secret.UpdatedAt); err != nil {
			return nil, err
		}
		secrets = append(secrets, secret)
	}
	return secrets, rows.Err()
}

func (r *Repository) DeleteSecret(ctx context.Context, secretID, userID uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `
		DELETE FROM secrets s
		USING projects p, org_members m
		WHERE s.id = $1 AND p.id = s.project_id AND m.org_id = p.org_id AND m.user_id = $2
	`, secretID, userID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *Repository) CreateEnvVar(ctx context.Context, projectID, userID uuid.UUID, req createEnvVarRequest) (*EnvVar, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	if req.Environment == "" {
		req.Environment = "all"
	}
	envVar := &EnvVar{}
	err := r.db.QueryRow(ctx, `
		INSERT INTO env_vars (project_id, name, value, is_secret, environment)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (project_id, name, environment)
		DO UPDATE SET value = EXCLUDED.value, is_secret = EXCLUDED.is_secret, updated_at = NOW()
		RETURNING id, project_id, name, CASE WHEN is_secret THEN '' ELSE value END, is_secret, environment, created_at, updated_at
	`, projectID, req.Name, req.Value, req.IsSecret, req.Environment).Scan(&envVar.ID, &envVar.ProjectID, &envVar.Name, &envVar.Value, &envVar.IsSecret, &envVar.Environment, &envVar.CreatedAt, &envVar.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return envVar, nil
}

func (r *Repository) ListEnvVars(ctx context.Context, projectID, userID uuid.UUID) ([]EnvVar, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, project_id, name, CASE WHEN is_secret THEN '' ELSE value END, is_secret, environment, created_at, updated_at
		FROM env_vars
		WHERE project_id = $1
		ORDER BY environment ASC, name ASC
	`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var envVars []EnvVar
	for rows.Next() {
		var envVar EnvVar
		if err := rows.Scan(&envVar.ID, &envVar.ProjectID, &envVar.Name, &envVar.Value, &envVar.IsSecret, &envVar.Environment, &envVar.CreatedAt, &envVar.UpdatedAt); err != nil {
			return nil, err
		}
		envVars = append(envVars, envVar)
	}
	return envVars, rows.Err()
}

func (r *Repository) OrgStats(ctx context.Context, orgID, userID uuid.UUID) (*DashboardStats, error) {
	if err := r.requireOrgAccess(ctx, orgID, userID); err != nil {
		return nil, err
	}
	stats := &DashboardStats{}
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM projects WHERE org_id = $1`, orgID).Scan(&stats.TotalProjects); err != nil {
		return nil, err
	}
	if err := r.db.QueryRow(ctx, `
		SELECT COUNT(*)
		FROM pipelines pl
		JOIN projects p ON p.id = pl.project_id
		WHERE p.org_id = $1
	`, orgID).Scan(&stats.TotalPipelines); err != nil {
		return nil, err
	}
	if err := r.db.QueryRow(ctx, `
		SELECT COUNT(*), COALESCE(AVG(CASE WHEN pr.status = 'success' THEN 100.0 ELSE 0 END), 0)
		FROM pipeline_runs pr
		JOIN projects p ON p.id = pr.project_id
		WHERE p.org_id = $1
	`, orgID).Scan(&stats.TotalRuns, &stats.SuccessRate); err != nil {
		return nil, err
	}
	runs, err := r.recentRunsByOrg(ctx, orgID)
	if err != nil {
		return nil, err
	}
	deployments, err := r.activeDeploymentsByOrg(ctx, orgID)
	if err != nil {
		return nil, err
	}
	stats.RecentRuns = runs
	stats.ActiveDeployments = deployments
	return stats, nil
}

func (r *Repository) ProjectStats(ctx context.Context, projectID, userID uuid.UUID) (*DashboardStats, error) {
	if _, err := r.GetProject(ctx, projectID, userID); err != nil {
		return nil, err
	}
	stats := &DashboardStats{TotalProjects: 1}
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM pipelines WHERE project_id = $1`, projectID).Scan(&stats.TotalPipelines); err != nil {
		return nil, err
	}
	if err := r.db.QueryRow(ctx, `
		SELECT COUNT(*), COALESCE(AVG(CASE WHEN status = 'success' THEN 100.0 ELSE 0 END), 0)
		FROM pipeline_runs
		WHERE project_id = $1
	`, projectID).Scan(&stats.TotalRuns, &stats.SuccessRate); err != nil {
		return nil, err
	}
	runs, err := r.recentRunsByProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	deployments, err := r.activeDeploymentsByProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	stats.RecentRuns = runs
	stats.ActiveDeployments = deployments
	return stats, nil
}

func (r *Repository) requireOrgAccess(ctx context.Context, orgID, userID uuid.UUID) error {
	var exists bool
	err := r.db.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM org_members WHERE org_id = $1 AND user_id = $2)`, orgID, userID).Scan(&exists)
	if err != nil {
		return err
	}
	if !exists {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *Repository) recentRunsByOrg(ctx context.Context, orgID uuid.UUID) ([]PipelineRun, error) {
	rows, err := r.db.Query(ctx, `
		SELECT pr.id, pr.pipeline_id, pr.project_id, pr.run_number, pr.status, COALESCE(pr.trigger_type, ''), COALESCE(pr.trigger_ref, ''),
		       COALESCE(pr.commit_sha, ''), COALESCE(pr.commit_message, ''), COALESCE(pr.commit_author, ''),
		       pr.started_at, pr.finished_at, COALESCE(pr.duration_ms, 0), COALESCE(pr.error_message, ''), pr.created_at
		FROM pipeline_runs pr
		JOIN projects p ON p.id = pr.project_id
		WHERE p.org_id = $1
		ORDER BY pr.created_at DESC
		LIMIT 10
	`, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanRuns(rows)
}

func (r *Repository) recentRunsByProject(ctx context.Context, projectID uuid.UUID) ([]PipelineRun, error) {
	rows, err := r.db.Query(ctx, `
		SELECT pr.id, pr.pipeline_id, pr.project_id, pr.run_number, pr.status, COALESCE(pr.trigger_type, ''), COALESCE(pr.trigger_ref, ''),
		       COALESCE(pr.commit_sha, ''), COALESCE(pr.commit_message, ''), COALESCE(pr.commit_author, ''),
		       pr.started_at, pr.finished_at, COALESCE(pr.duration_ms, 0), COALESCE(pr.error_message, ''), pr.created_at
		FROM pipeline_runs pr
		WHERE pr.project_id = $1
		ORDER BY pr.created_at DESC
		LIMIT 10
	`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanRuns(rows)
}

func (r *Repository) activeDeploymentsByOrg(ctx context.Context, orgID uuid.UUID) ([]Deployment, error) {
	rows, err := r.db.Query(ctx, `
		SELECT d.id, d.project_id, d.run_id, d.environment, d.status, COALESCE(d.deploy_type, ''), COALESCE(d.target_host, ''), COALESCE(d.commit_sha, ''), d.started_at, d.finished_at, d.created_at
		FROM deployments d
		JOIN projects p ON p.id = d.project_id
		WHERE p.org_id = $1 AND d.status IN ('pending', 'deploying')
		ORDER BY d.created_at DESC
		LIMIT 10
	`, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanDeployments(rows)
}

func (r *Repository) activeDeploymentsByProject(ctx context.Context, projectID uuid.UUID) ([]Deployment, error) {
	rows, err := r.db.Query(ctx, `
		SELECT d.id, d.project_id, d.run_id, d.environment, d.status, COALESCE(d.deploy_type, ''), COALESCE(d.target_host, ''), COALESCE(d.commit_sha, ''), d.started_at, d.finished_at, d.created_at
		FROM deployments d
		WHERE d.project_id = $1 AND d.status IN ('pending', 'deploying')
		ORDER BY d.created_at DESC
		LIMIT 10
	`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanDeployments(rows)
}

func scanOrganizations(rows pgx.Rows) ([]Organization, error) {
	var orgs []Organization
	for rows.Next() {
		var org Organization
		if err := rows.Scan(&org.ID, &org.Name, &org.Slug, &org.OwnerID, &org.Plan, &org.CreatedAt, &org.UpdatedAt); err != nil {
			return nil, err
		}
		orgs = append(orgs, org)
	}
	return orgs, rows.Err()
}

func scanProjects(rows pgx.Rows) ([]Project, error) {
	var projects []Project
	for rows.Next() {
		var project Project
		if err := rows.Scan(&project.ID, &project.OrgID, &project.Name, &project.Slug, &project.Description, &project.RepoURL, &project.RepoProvider, &project.RepoBranch, &project.IsActive, &project.CreatedAt, &project.UpdatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	return projects, rows.Err()
}

func scanPipelines(rows pgx.Rows) ([]Pipeline, error) {
	var pipelines []Pipeline
	for rows.Next() {
		var pipeline Pipeline
		if err := rows.Scan(&pipeline.ID, &pipeline.ProjectID, &pipeline.Name, &pipeline.ConfigYAML, &pipeline.TriggerType, &pipeline.TriggerBranch, &pipeline.IsActive, &pipeline.CreatedAt, &pipeline.UpdatedAt); err != nil {
			return nil, err
		}
		pipelines = append(pipelines, pipeline)
	}
	return pipelines, rows.Err()
}

func scanRuns(rows pgx.Rows) ([]PipelineRun, error) {
	var runs []PipelineRun
	for rows.Next() {
		var run PipelineRun
		if err := rows.Scan(&run.ID, &run.PipelineID, &run.ProjectID, &run.RunNumber, &run.Status, &run.TriggerType, &run.TriggerRef, &run.CommitSHA, &run.CommitMessage, &run.CommitAuthor, &run.StartedAt, &run.FinishedAt, &run.DurationMS, &run.ErrorMessage, &run.CreatedAt); err != nil {
			return nil, err
		}
		runs = append(runs, run)
	}
	return runs, rows.Err()
}

func scanDeployments(rows pgx.Rows) ([]Deployment, error) {
	var deployments []Deployment
	for rows.Next() {
		var deployment Deployment
		if err := rows.Scan(&deployment.ID, &deployment.ProjectID, &deployment.RunID, &deployment.Environment, &deployment.Status, &deployment.DeployType, &deployment.TargetHost, &deployment.CommitSHA, &deployment.StartedAt, &deployment.FinishedAt, &deployment.CreatedAt); err != nil {
			return nil, err
		}
		deployments = append(deployments, deployment)
	}
	return deployments, rows.Err()
}
