package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/swadeshiops/swadeshiops/internal/pkg/response"
)

// RateLimiter implements a simple in-memory token bucket rate limiter
type RateLimiter struct {
	mu       sync.Mutex
	visitors map[string]*visitor
	rate     int           // requests per window
	window   time.Duration // time window
}

type visitor struct {
	tokens    int
	lastReset time.Time
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(rate int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*visitor),
		rate:     rate,
		window:   window,
	}

	// Cleanup old visitors every minute
	go func() {
		for {
			time.Sleep(time.Minute)
			rl.cleanup()
		}
	}()

	return rl
}

func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	cutoff := time.Now().Add(-rl.window * 2)
	for key, v := range rl.visitors {
		if v.lastReset.Before(cutoff) {
			delete(rl.visitors, key)
		}
	}
}

// RateLimit returns the rate limiting middleware
func (rl *RateLimiter) RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		rl.mu.Lock()
		v, exists := rl.visitors[ip]
		now := time.Now()

		if !exists || now.Sub(v.lastReset) > rl.window {
			rl.visitors[ip] = &visitor{
				tokens:    rl.rate - 1,
				lastReset: now,
			}
			rl.mu.Unlock()
			c.Next()
			return
		}

		if v.tokens <= 0 {
			rl.mu.Unlock()
			response.Error(c, http.StatusTooManyRequests, "RATE_LIMITED", "Too many requests, please slow down")
			c.Abort()
			return
		}

		v.tokens--
		rl.mu.Unlock()
		c.Next()
	}
}
