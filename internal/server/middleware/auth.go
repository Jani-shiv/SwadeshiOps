package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/swadeshiops/swadeshiops/internal/auth"
	"github.com/swadeshiops/swadeshiops/internal/pkg/response"
)

// Auth creates JWT authentication middleware
func Auth(authService *auth.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			response.Unauthorized(c, "Missing authorization header")
			c.Abort()
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			response.Unauthorized(c, "Invalid authorization format")
			c.Abort()
			return
		}

		claims, err := authService.ValidateToken(parts[1])
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "TOKEN_INVALID", "Invalid or expired token")
			c.Abort()
			return
		}

		// Set claims in context for downstream handlers
		c.Set("claims", claims)
		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)

		c.Next()
	}
}
