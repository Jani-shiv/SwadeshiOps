package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/swadeshiops/swadeshiops/internal/pkg/response"
)

// RequireRole creates RBAC middleware that checks user role
func RequireRole(roles ...string) gin.HandlerFunc {
	roleMap := make(map[string]bool)
	for _, r := range roles {
		roleMap[r] = true
	}

	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists {
			response.Error(c, http.StatusForbidden, "FORBIDDEN", "Access denied")
			c.Abort()
			return
		}

		roleStr, ok := role.(string)
		if !ok || !roleMap[roleStr] {
			response.Error(c, http.StatusForbidden, "FORBIDDEN", "Insufficient permissions")
			c.Abort()
			return
		}

		c.Next()
	}
}
