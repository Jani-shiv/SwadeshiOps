package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Standard API response envelope
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

type Meta struct {
	Page       int   `json:"page,omitempty"`
	PerPage    int   `json:"per_page,omitempty"`
	Total      int64 `json:"total,omitempty"`
	TotalPages int   `json:"total_pages,omitempty"`
}

// Success sends a successful response
func Success(c *gin.Context, status int, data interface{}) {
	c.JSON(status, APIResponse{
		Success: true,
		Data:    data,
	})
}

// OK sends a 200 success response
func OK(c *gin.Context, data interface{}) {
	Success(c, http.StatusOK, data)
}

// Created sends a 201 response
func Created(c *gin.Context, data interface{}) {
	Success(c, http.StatusCreated, data)
}

// Paginated sends a paginated response
func Paginated(c *gin.Context, data interface{}, page, perPage int, total int64) {
	totalPages := int(total) / perPage
	if int(total)%perPage > 0 {
		totalPages++
	}

	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Data:    data,
		Meta: &Meta{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

// Error sends an error response
func Error(c *gin.Context, status int, code, message string) {
	c.JSON(status, APIResponse{
		Success: false,
		Error: &APIError{
			Code:    code,
			Message: message,
		},
	})
}

// ErrorWithDetails sends an error response with additional details
func ErrorWithDetails(c *gin.Context, status int, code, message, details string) {
	c.JSON(status, APIResponse{
		Success: false,
		Error: &APIError{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}

// Common error responses
func BadRequest(c *gin.Context, message string) {
	Error(c, http.StatusBadRequest, "BAD_REQUEST", message)
}

func Unauthorized(c *gin.Context, message string) {
	Error(c, http.StatusUnauthorized, "UNAUTHORIZED", message)
}

func Forbidden(c *gin.Context, message string) {
	Error(c, http.StatusForbidden, "FORBIDDEN", message)
}

func NotFound(c *gin.Context, message string) {
	Error(c, http.StatusNotFound, "NOT_FOUND", message)
}

func Conflict(c *gin.Context, message string) {
	Error(c, http.StatusConflict, "CONFLICT", message)
}

func InternalError(c *gin.Context, message string) {
	Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", message)
}

// NoContent sends a 204 response
func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
