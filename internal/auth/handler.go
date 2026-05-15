package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/swadeshiops/swadeshiops/internal/pkg/response"
	"strings"
)

// Handler handles auth HTTP requests
type Handler struct {
	service *Service
}

// NewHandler creates a new auth handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// Register handles user registration
// POST /api/v1/auth/register
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	user, err := h.service.Register(c.Request.Context(), &req)
	if err != nil {
		// Check for duplicate errors
		if err.Error() == "email already registered" || err.Error() == "username already taken" {
			response.Conflict(c, err.Error())
			return
		}
		response.InternalError(c, "Failed to register user")
		return
	}

	response.Created(c, user.ToResponse())
}

// Login handles user login
// POST /api/v1/auth/login
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	tokens, user, err := h.service.Login(c.Request.Context(), &req)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "AUTH_FAILED", err.Error())
		return
	}

	response.OK(c, gin.H{
		"tokens": tokens,
		"user":   user.ToResponse(),
	})
}

func (h *Handler) Sync(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required"`
		Username string `json:"username"`
		FullName string `json:"full_name"`
		ID       string `json:"id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	userID, err := uuid.Parse(req.ID)
	if err != nil {
		response.BadRequest(c, "Invalid UUID")
		return
	}

	if req.Username == "" {
		req.Username = strings.Split(req.Email, "@")[0]
	}

	user := &User{
		ID:       userID,
		Email:    req.Email,
		Username: req.Username,
		FullName: req.FullName,
		Role:     "member",
		IsActive: true,
	}

	if err := h.service.repo.Create(c.Request.Context(), user); err != nil {
		response.InternalError(c, "Failed to sync user: "+err.Error())
		return
	}

	response.Success(c, http.StatusOK, user.ToResponse())
}

// Me returns the current user profile
// GET /api/v1/auth/me
func (h *Handler) Me(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		response.Unauthorized(c, "Not authenticated")
		return
	}

	authClaims, ok := claims.(*Claims)
	if !ok {
		response.Unauthorized(c, "Invalid claims type")
		return
	}
	user, err := h.service.GetUser(c.Request.Context(), authClaims.UserID)
	if err != nil {
		response.NotFound(c, "User not found")
		return
	}

	response.OK(c, user.ToResponse())
}
