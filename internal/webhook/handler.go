package webhook

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/swadeshiops/swadeshiops/internal/pkg/response"
)

// PushEvent represents a standardized git push event from any provider
type PushEvent struct {
	Provider      string `json:"provider"`       // github, gitlab, gitea
	Ref           string `json:"ref"`            // refs/heads/main
	Branch        string `json:"branch"`         // main
	CommitSHA     string `json:"commit_sha"`
	CommitMessage string `json:"commit_message"`
	CommitAuthor  string `json:"commit_author"`
	RepoURL       string `json:"repo_url"`
	RepoFullName  string `json:"repo_full_name"`
	Event         string `json:"event"`          // push, pull_request
}

// Handler handles incoming git webhooks
type Handler struct {
	logger    zerolog.Logger
	onPush    func(event *PushEvent) error // callback when push event received
}

// NewHandler creates a new webhook handler
func NewHandler(logger zerolog.Logger, onPush func(event *PushEvent) error) *Handler {
	return &Handler{
		logger: logger.With().Str("component", "webhook").Logger(),
		onPush: onPush,
	}
}

// HandleGitHub processes GitHub webhook events
func (h *Handler) HandleGitHub(c *gin.Context) {
	event := c.GetHeader("X-GitHub-Event")
	signature := c.GetHeader("X-Hub-Signature-256")

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		response.BadRequest(c, "Failed to read request body")
		return
	}

	h.logger.Debug().
		Str("event", event).
		Str("delivery", c.GetHeader("X-GitHub-Delivery")).
		Msg("GitHub webhook received")

	// TODO: Verify HMAC signature against project webhook_secret
	_ = signature

	if event != "push" {
		response.OK(c, gin.H{"message": "event ignored", "event": event})
		return
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		response.BadRequest(c, "Invalid JSON payload")
		return
	}

	pushEvent := h.parseGitHubPush(payload)
	if pushEvent == nil {
		response.BadRequest(c, "Failed to parse push event")
		return
	}

	if h.onPush != nil {
		if err := h.onPush(pushEvent); err != nil {
			h.logger.Error().Err(err).Msg("Failed to process push event")
			response.InternalError(c, "Failed to process webhook")
			return
		}
	}

	response.OK(c, gin.H{"message": "webhook processed", "commit": pushEvent.CommitSHA})
}

// HandleGitLab processes GitLab webhook events
func (h *Handler) HandleGitLab(c *gin.Context) {
	event := c.GetHeader("X-Gitlab-Event")
	token := c.GetHeader("X-Gitlab-Token")

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		response.BadRequest(c, "Failed to read request body")
		return
	}

	h.logger.Debug().Str("event", event).Msg("GitLab webhook received")

	_ = token // TODO: Verify against project webhook_secret

	if event != "Push Hook" {
		response.OK(c, gin.H{"message": "event ignored", "event": event})
		return
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		response.BadRequest(c, "Invalid JSON payload")
		return
	}

	pushEvent := h.parseGitLabPush(payload)
	if pushEvent == nil {
		response.BadRequest(c, "Failed to parse push event")
		return
	}

	if h.onPush != nil {
		if err := h.onPush(pushEvent); err != nil {
			h.logger.Error().Err(err).Msg("Failed to process push event")
			response.InternalError(c, "Failed to process webhook")
			return
		}
	}

	response.OK(c, gin.H{"message": "webhook processed", "commit": pushEvent.CommitSHA})
}

// HandleGitea processes Gitea webhook events
func (h *Handler) HandleGitea(c *gin.Context) {
	event := c.GetHeader("X-Gitea-Event")

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		response.BadRequest(c, "Failed to read request body")
		return
	}

	h.logger.Debug().Str("event", event).Msg("Gitea webhook received")

	if event != "push" {
		response.OK(c, gin.H{"message": "event ignored", "event": event})
		return
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		response.BadRequest(c, "Invalid JSON payload")
		return
	}

	// Gitea uses same format as GitHub
	pushEvent := h.parseGitHubPush(payload)
	if pushEvent != nil {
		pushEvent.Provider = "gitea"
	}

	if h.onPush != nil && pushEvent != nil {
		if err := h.onPush(pushEvent); err != nil {
			h.logger.Error().Err(err).Msg("Failed to process push event")
			response.InternalError(c, "Failed to process webhook")
			return
		}
	}

	response.OK(c, gin.H{"message": "webhook processed"})
}

// parseGitHubPush extracts a PushEvent from GitHub webhook payload
func (h *Handler) parseGitHubPush(payload map[string]interface{}) *PushEvent {
	ref, _ := payload["ref"].(string)
	branch := strings.TrimPrefix(ref, "refs/heads/")

	event := &PushEvent{
		Provider: "github",
		Ref:      ref,
		Branch:   branch,
		Event:    "push",
	}

	// Extract head commit
	if headCommit, ok := payload["head_commit"].(map[string]interface{}); ok {
		event.CommitSHA, _ = headCommit["id"].(string)
		event.CommitMessage, _ = headCommit["message"].(string)
		if author, ok := headCommit["author"].(map[string]interface{}); ok {
			event.CommitAuthor, _ = author["name"].(string)
		}
	}

	// Extract repo info
	if repo, ok := payload["repository"].(map[string]interface{}); ok {
		event.RepoURL, _ = repo["clone_url"].(string)
		event.RepoFullName, _ = repo["full_name"].(string)
	}

	return event
}

// parseGitLabPush extracts a PushEvent from GitLab webhook payload
func (h *Handler) parseGitLabPush(payload map[string]interface{}) *PushEvent {
	ref, _ := payload["ref"].(string)
	branch := strings.TrimPrefix(ref, "refs/heads/")

	event := &PushEvent{
		Provider: "gitlab",
		Ref:      ref,
		Branch:   branch,
		Event:    "push",
	}

	// Last commit
	if commits, ok := payload["commits"].([]interface{}); ok && len(commits) > 0 {
		if lastCommit, ok := commits[len(commits)-1].(map[string]interface{}); ok {
			event.CommitSHA, _ = lastCommit["id"].(string)
			event.CommitMessage, _ = lastCommit["message"].(string)
			if author, ok := lastCommit["author"].(map[string]interface{}); ok {
				event.CommitAuthor, _ = author["name"].(string)
			}
		}
	}

	// Repo info
	if project, ok := payload["project"].(map[string]interface{}); ok {
		event.RepoURL, _ = project["git_http_url"].(string)
		event.RepoFullName, _ = project["path_with_namespace"].(string)
	}

	return event
}

// VerifyGitHubSignature verifies the HMAC-SHA256 signature from GitHub
func VerifyGitHubSignature(body []byte, signature, secret string) bool {
	if secret == "" || signature == "" {
		return false
	}

	sig := strings.TrimPrefix(signature, "sha256=")
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	expected := hex.EncodeToString(mac.Sum(nil))

	return hmac.Equal([]byte(sig), []byte(expected))
}

// Compile-time check that Handler implements the correct interface
var _ http.Handler = (*Handler)(nil)

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// This is for direct http.Handler compatibility if needed
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, `{"status":"ok"}`)
}
