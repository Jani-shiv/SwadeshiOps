package server

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"

	"github.com/swadeshiops/swadeshiops/internal/auth"
	"github.com/swadeshiops/swadeshiops/internal/config"
	"github.com/swadeshiops/swadeshiops/internal/server/middleware"
)

// Server holds all dependencies and the router
type Server struct {
	cfg         *config.Config
	db          *pgxpool.Pool
	redis       *redis.Client
	logger      zerolog.Logger
	router      *gin.Engine
	authService *auth.Service
}

// New creates a new server with all dependencies wired
func New(cfg *config.Config, db *pgxpool.Pool, rdb *redis.Client, logger zerolog.Logger) *Server {
	// Set Gin mode
	if cfg.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	s := &Server{
		cfg:    cfg,
		db:     db,
		redis:  rdb,
		logger: logger,
	}

	// Initialize services
	authRepo := auth.NewRepository(db)
	s.authService = auth.NewService(authRepo, &cfg.JWT, logger)

	// Setup router
	s.setupRouter()

	return s
}

// Router returns the HTTP handler
func (s *Server) Router() *gin.Engine {
	return s.router
}

func (s *Server) setupRouter() {
	r := gin.New()

	// Global middleware
	r.Use(gin.Recovery())
	r.Use(middleware.Logger(s.logger))
	r.Use(middleware.CORS(s.cfg.CORS.Origins))

	// Rate limiter: 100 requests per minute per IP
	limiter := middleware.NewRateLimiter(100, time.Minute)
	r.Use(limiter.RateLimit())

	// Security headers
	r.Use(func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Next()
	})

	// Health checks
	r.GET("/healthz", s.healthCheck)
	r.GET("/readyz", s.readyCheck)

	// API v1
	v1 := r.Group("/api/v1")
	{
		// Public health endpoint (used by CI/CD pipelines)
		v1.GET("/health", s.healthCheck)

		s.registerAuthRoutes(v1)
		s.registerProtectedRoutes(v1)
	}

	s.router = r
}

func (s *Server) registerAuthRoutes(rg *gin.RouterGroup) {
	authHandler := auth.NewHandler(s.authService)

	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
	}

	// Protected auth routes
	authProtected := rg.Group("/auth")
	authProtected.Use(middleware.Auth(s.authService))
	{
		authProtected.GET("/me", authHandler.Me)
	}
}

func (s *Server) registerProtectedRoutes(rg *gin.RouterGroup) {
	protected := rg.Group("")
	protected.Use(middleware.Auth(s.authService))
	{
		// Organizations
		protected.POST("/orgs", s.placeholderHandler("create_org"))
		protected.GET("/orgs", s.placeholderHandler("list_orgs"))
		protected.GET("/orgs/:orgId", s.placeholderHandler("get_org"))
		protected.PUT("/orgs/:orgId", s.placeholderHandler("update_org"))

		// Projects
		protected.POST("/orgs/:orgId/projects", s.placeholderHandler("create_project"))
		protected.GET("/orgs/:orgId/projects", s.placeholderHandler("list_projects"))
		protected.GET("/projects/:projectId", s.placeholderHandler("get_project"))
		protected.PUT("/projects/:projectId", s.placeholderHandler("update_project"))
		protected.DELETE("/projects/:projectId", s.placeholderHandler("delete_project"))

		// Pipelines
		protected.POST("/projects/:projectId/pipelines", s.placeholderHandler("create_pipeline"))
		protected.GET("/projects/:projectId/pipelines", s.placeholderHandler("list_pipelines"))
		protected.GET("/pipelines/:pipelineId", s.placeholderHandler("get_pipeline"))
		protected.POST("/pipelines/:pipelineId/trigger", s.placeholderHandler("trigger_pipeline"))

		// Pipeline Runs
		protected.GET("/pipelines/:pipelineId/runs", s.placeholderHandler("list_runs"))
		protected.GET("/runs/:runId", s.placeholderHandler("get_run"))
		protected.POST("/runs/:runId/cancel", s.placeholderHandler("cancel_run"))

		// Deployments
		protected.POST("/projects/:projectId/deployments", s.placeholderHandler("create_deployment"))
		protected.GET("/projects/:projectId/deployments", s.placeholderHandler("list_deployments"))

		// Secrets
		protected.POST("/projects/:projectId/secrets", s.placeholderHandler("create_secret"))
		protected.GET("/projects/:projectId/secrets", s.placeholderHandler("list_secrets"))
		protected.DELETE("/secrets/:secretId", s.placeholderHandler("delete_secret"))

		// Env Vars
		protected.POST("/projects/:projectId/envvars", s.placeholderHandler("create_envvar"))
		protected.GET("/projects/:projectId/envvars", s.placeholderHandler("list_envvars"))

		// Dashboard Stats
		protected.GET("/orgs/:orgId/stats", s.placeholderHandler("org_stats"))
		protected.GET("/projects/:projectId/stats", s.placeholderHandler("project_stats"))
	}

	// Webhook routes (no auth — validated by HMAC signature)
	webhooks := rg.Group("/webhooks")
	{
		webhooks.POST("/github", s.placeholderHandler("github_webhook"))
		webhooks.POST("/gitlab", s.placeholderHandler("gitlab_webhook"))
		webhooks.POST("/gitea", s.placeholderHandler("gitea_webhook"))
	}
}

// placeholderHandler returns a handler that indicates the route is registered but not yet implemented
func (s *Server) placeholderHandler(name string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"success": true,
			"message": name + " endpoint registered — implementation coming soon",
		})
	}
}

func (s *Server) healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":  "healthy",
		"service": "swadeshiops",
		"version": "0.1.0-alpha",
	})
}

func (s *Server) readyCheck(c *gin.Context) {
	// Check database
	if err := s.db.Ping(c.Request.Context()); err != nil {
		c.JSON(503, gin.H{"status": "not ready", "error": "database unavailable"})
		return
	}

	// Check Redis
	if err := s.redis.Ping(c.Request.Context()).Err(); err != nil {
		c.JSON(503, gin.H{"status": "not ready", "error": "redis unavailable"})
		return
	}

	c.JSON(200, gin.H{"status": "ready"})
}
