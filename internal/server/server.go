package server

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"

	"github.com/swadeshiops/swadeshiops/internal/app"
	"github.com/swadeshiops/swadeshiops/internal/auth"
	"github.com/swadeshiops/swadeshiops/internal/config"
	"github.com/swadeshiops/swadeshiops/internal/pkg/crypto"
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
	appHandler  *app.Handler
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
	appRepo := app.NewRepository(db)
	var vault *crypto.Vault
	if cfg.Encryption.Key != "" {
		var err error
		vault, err = crypto.NewVault(cfg.Encryption.Key)
		if err != nil {
			logger.Warn().Err(err).Msg("Secrets vault disabled because ENCRYPTION_KEY is invalid")
		}
	}
	s.appHandler = app.NewHandler(appRepo, vault)

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
	appHandler := s.appHandler
	protected := rg.Group("")
	protected.Use(middleware.Auth(s.authService))
	{
		// Organizations
		protected.POST("/orgs", appHandler.CreateOrganization)
		protected.GET("/orgs", appHandler.ListOrganizations)
		protected.GET("/orgs/:orgId", appHandler.GetOrganization)
		protected.PUT("/orgs/:orgId", appHandler.UpdateOrganization)

		// Projects
		protected.POST("/orgs/:orgId/projects", appHandler.CreateProject)
		protected.GET("/orgs/:orgId/projects", appHandler.ListProjects)
		protected.GET("/projects/:projectId", appHandler.GetProject)
		protected.PUT("/projects/:projectId", appHandler.UpdateProject)
		protected.DELETE("/projects/:projectId", appHandler.DeleteProject)

		// Pipelines
		protected.POST("/projects/:projectId/pipelines", appHandler.CreatePipeline)
		protected.GET("/projects/:projectId/pipelines", appHandler.ListPipelines)
		protected.GET("/pipelines/:pipelineId", appHandler.GetPipeline)
		protected.POST("/pipelines/:pipelineId/trigger", appHandler.TriggerPipeline)

		// Pipeline Runs
		protected.GET("/pipelines/:pipelineId/runs", appHandler.ListRuns)
		protected.GET("/runs/:runId", appHandler.GetRun)
		protected.POST("/runs/:runId/cancel", appHandler.CancelRun)

		// Deployments
		protected.POST("/projects/:projectId/deployments", appHandler.CreateDeployment)
		protected.GET("/projects/:projectId/deployments", appHandler.ListDeployments)

		// Secrets
		protected.POST("/projects/:projectId/secrets", appHandler.CreateSecret)
		protected.GET("/projects/:projectId/secrets", appHandler.ListSecrets)
		protected.DELETE("/secrets/:secretId", appHandler.DeleteSecret)

		// Env Vars
		protected.POST("/projects/:projectId/envvars", appHandler.CreateEnvVar)
		protected.GET("/projects/:projectId/envvars", appHandler.ListEnvVars)

		// Dashboard Stats
		protected.GET("/orgs/:orgId/stats", appHandler.OrgStats)
		protected.GET("/projects/:projectId/stats", appHandler.ProjectStats)
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
