package app

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/swadeshiops/swadeshiops/internal/auth"
	"github.com/swadeshiops/swadeshiops/internal/pkg/crypto"
	"github.com/swadeshiops/swadeshiops/internal/pkg/response"
)

type Handler struct {
	repo  *Repository
	vault *crypto.Vault
}

func NewHandler(repo *Repository, vault *crypto.Vault) *Handler {
	return &Handler{repo: repo, vault: vault}
}

func (h *Handler) CreateOrganization(c *gin.Context) {
	var req createOrgRequest
	if !bind(c, &req) {
		return
	}
	if req.Slug == "" {
		req.Slug = slugify(req.Name)
	}
	org, err := h.repo.CreateOrganization(c.Request.Context(), req.Name, req.Slug, currentUserID(c))
	writeResult(c, http.StatusCreated, org, err)
}

func (h *Handler) ListOrganizations(c *gin.Context) {
	orgs, err := h.repo.ListOrganizations(c.Request.Context(), currentUserID(c))
	writeResult(c, http.StatusOK, orgs, err)
}

func (h *Handler) GetOrganization(c *gin.Context) {
	orgID, ok := parseID(c, "orgId")
	if !ok {
		return
	}
	org, err := h.repo.GetOrganization(c.Request.Context(), orgID, currentUserID(c))
	writeResult(c, http.StatusOK, org, err)
}

func (h *Handler) UpdateOrganization(c *gin.Context) {
	orgID, ok := parseID(c, "orgId")
	if !ok {
		return
	}
	var req createOrgRequest
	if !bind(c, &req) {
		return
	}
	if req.Slug == "" {
		req.Slug = slugify(req.Name)
	}
	org, err := h.repo.UpdateOrganization(c.Request.Context(), orgID, currentUserID(c), req.Name, req.Slug)
	writeResult(c, http.StatusOK, org, err)
}

func (h *Handler) CreateProject(c *gin.Context) {
	orgID, ok := parseID(c, "orgId")
	if !ok {
		return
	}
	var req createProjectRequest
	if !bind(c, &req) {
		return
	}
	if req.Slug == "" {
		req.Slug = slugify(req.Name)
	}
	project, err := h.repo.CreateProject(c.Request.Context(), orgID, currentUserID(c), req, req.Slug)
	writeResult(c, http.StatusCreated, project, err)
}

func (h *Handler) ListProjects(c *gin.Context) {
	orgID, ok := parseID(c, "orgId")
	if !ok {
		return
	}
	projects, err := h.repo.ListProjects(c.Request.Context(), orgID, currentUserID(c))
	writeResult(c, http.StatusOK, projects, err)
}

func (h *Handler) GetProject(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	project, err := h.repo.GetProject(c.Request.Context(), projectID, currentUserID(c))
	writeResult(c, http.StatusOK, project, err)
}

func (h *Handler) UpdateProject(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	var req createProjectRequest
	if !bind(c, &req) {
		return
	}
	if req.Slug == "" {
		req.Slug = slugify(req.Name)
	}
	project, err := h.repo.UpdateProject(c.Request.Context(), projectID, currentUserID(c), req, req.Slug)
	writeResult(c, http.StatusOK, project, err)
}

func (h *Handler) DeleteProject(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	if err := h.repo.DeleteProject(c.Request.Context(), projectID, currentUserID(c)); err != nil {
		writeError(c, err)
		return
	}
	response.NoContent(c)
}

func (h *Handler) CreatePipeline(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	var req createPipelineRequest
	if !bind(c, &req) {
		return
	}
	pipeline, err := h.repo.CreatePipeline(c.Request.Context(), projectID, currentUserID(c), req)
	writeResult(c, http.StatusCreated, pipeline, err)
}

func (h *Handler) ListPipelines(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	pipelines, err := h.repo.ListPipelines(c.Request.Context(), projectID, currentUserID(c))
	writeResult(c, http.StatusOK, pipelines, err)
}

func (h *Handler) GetPipeline(c *gin.Context) {
	pipelineID, ok := parseID(c, "pipelineId")
	if !ok {
		return
	}
	pipeline, err := h.repo.GetPipeline(c.Request.Context(), pipelineID, currentUserID(c))
	writeResult(c, http.StatusOK, pipeline, err)
}

func (h *Handler) TriggerPipeline(c *gin.Context) {
	pipelineID, ok := parseID(c, "pipelineId")
	if !ok {
		return
	}
	var req triggerPipelineRequest
	if !bindOptional(c, &req) {
		return
	}
	run, err := h.repo.TriggerPipeline(c.Request.Context(), pipelineID, currentUserID(c), req)
	writeResult(c, http.StatusCreated, run, err)
}

func (h *Handler) ListRuns(c *gin.Context) {
	pipelineID, ok := parseID(c, "pipelineId")
	if !ok {
		return
	}
	runs, err := h.repo.ListRuns(c.Request.Context(), pipelineID, currentUserID(c))
	writeResult(c, http.StatusOK, runs, err)
}

func (h *Handler) GetRun(c *gin.Context) {
	runID, ok := parseID(c, "runId")
	if !ok {
		return
	}
	run, err := h.repo.GetRun(c.Request.Context(), runID, currentUserID(c))
	writeResult(c, http.StatusOK, run, err)
}

func (h *Handler) CancelRun(c *gin.Context) {
	runID, ok := parseID(c, "runId")
	if !ok {
		return
	}
	run, err := h.repo.CancelRun(c.Request.Context(), runID, currentUserID(c))
	writeResult(c, http.StatusOK, run, err)
}

func (h *Handler) CreateDeployment(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	var req createDeploymentRequest
	if !bind(c, &req) {
		return
	}
	deployment, err := h.repo.CreateDeployment(c.Request.Context(), projectID, currentUserID(c), req)
	writeResult(c, http.StatusCreated, deployment, err)
}

func (h *Handler) ListDeployments(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	deployments, err := h.repo.ListDeployments(c.Request.Context(), projectID, currentUserID(c))
	writeResult(c, http.StatusOK, deployments, err)
}

func (h *Handler) CreateSecret(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	if h.vault == nil {
		response.InternalError(c, "Secrets vault is not configured")
		return
	}
	var req createSecretRequest
	if !bind(c, &req) {
		return
	}
	encrypted, err := h.vault.Encrypt(req.Value)
	if err != nil {
		response.InternalError(c, "Failed to encrypt secret")
		return
	}
	secret, err := h.repo.CreateSecret(c.Request.Context(), projectID, currentUserID(c), req, encrypted)
	writeResult(c, http.StatusCreated, secret, err)
}

func (h *Handler) ListSecrets(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	secrets, err := h.repo.ListSecrets(c.Request.Context(), projectID, currentUserID(c))
	writeResult(c, http.StatusOK, secrets, err)
}

func (h *Handler) DeleteSecret(c *gin.Context) {
	secretID, ok := parseID(c, "secretId")
	if !ok {
		return
	}
	if err := h.repo.DeleteSecret(c.Request.Context(), secretID, currentUserID(c)); err != nil {
		writeError(c, err)
		return
	}
	response.NoContent(c)
}

func (h *Handler) CreateEnvVar(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	var req createEnvVarRequest
	if !bind(c, &req) {
		return
	}
	envVar, err := h.repo.CreateEnvVar(c.Request.Context(), projectID, currentUserID(c), req)
	writeResult(c, http.StatusCreated, envVar, err)
}

func (h *Handler) ListEnvVars(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	envVars, err := h.repo.ListEnvVars(c.Request.Context(), projectID, currentUserID(c))
	writeResult(c, http.StatusOK, envVars, err)
}

func (h *Handler) OrgStats(c *gin.Context) {
	orgID, ok := parseID(c, "orgId")
	if !ok {
		return
	}
	stats, err := h.repo.OrgStats(c.Request.Context(), orgID, currentUserID(c))
	writeResult(c, http.StatusOK, stats, err)
}

func (h *Handler) ProjectStats(c *gin.Context) {
	projectID, ok := parseID(c, "projectId")
	if !ok {
		return
	}
	stats, err := h.repo.ProjectStats(c.Request.Context(), projectID, currentUserID(c))
	writeResult(c, http.StatusOK, stats, err)
}

func currentUserID(c *gin.Context) uuid.UUID {
	if id, ok := c.Get("user_id"); ok {
		if userID, ok := id.(uuid.UUID); ok {
			return userID
		}
	}
	if claims, ok := c.Get("claims"); ok {
		if authClaims, ok := claims.(*auth.Claims); ok {
			return authClaims.UserID
		}
	}
	return uuid.Nil
}

func parseID(c *gin.Context, name string) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param(name))
	if err != nil {
		response.BadRequest(c, "Invalid "+name)
		return uuid.Nil, false
	}
	return id, true
}

func bind(c *gin.Context, dst interface{}) bool {
	if err := c.ShouldBindJSON(dst); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return false
	}
	return true
}

func bindOptional(c *gin.Context, dst interface{}) bool {
	if c.Request.Body == nil || c.Request.ContentLength == 0 {
		return true
	}
	return bind(c, dst)
}

func writeResult(c *gin.Context, status int, data interface{}, err error) {
	if err != nil {
		writeError(c, err)
		return
	}
	response.Success(c, status, data)
}

func writeError(c *gin.Context, err error) {
	if errors.Is(err, pgx.ErrNoRows) {
		response.NotFound(c, "Resource not found")
		return
	}
	msg := strings.ToLower(err.Error())
	if strings.Contains(msg, "duplicate key") || strings.Contains(msg, "unique constraint") {
		response.Conflict(c, "Resource already exists")
		return
	}
	response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Request failed")
}

var slugPattern = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(value string) string {
	slug := strings.ToLower(strings.TrimSpace(value))
	slug = slugPattern.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")
	if slug == "" {
		return "resource"
	}
	return slug
}
