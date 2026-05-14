package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/swadeshiops/swadeshiops/internal/config"
	"github.com/swadeshiops/swadeshiops/internal/pkg/cache"
	"github.com/swadeshiops/swadeshiops/internal/pkg/database"
	"github.com/swadeshiops/swadeshiops/internal/pkg/logger"
	"github.com/swadeshiops/swadeshiops/internal/server"
)

func main() {
	// Initialize structured logger
	log := logger.New()

	log.Info().Msg("🚀 Starting SwadeshiOps...")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load configuration")
	}

	// Connect to PostgreSQL
	db, err := database.NewPostgres(cfg.Database)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to PostgreSQL")
	}
	defer db.Close()
	log.Info().Msg("✅ Connected to PostgreSQL")

	// Connect to Redis
	rdb, err := cache.NewRedis(cfg.Redis)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to Redis")
	}
	defer rdb.Close()
	log.Info().Msg("✅ Connected to Redis")

	// Run database migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatal().Err(err).Msg("Failed to run database migrations")
	}
	log.Info().Msg("✅ Database migrations complete")

	// Initialize HTTP server
	srv := server.New(cfg, db, rdb, log)
	httpServer := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.App.Host, cfg.App.Port),
		Handler:      srv.Router(),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Info().
			Str("host", cfg.App.Host).
			Int("port", cfg.App.Port).
			Str("env", cfg.App.Env).
			Msg("🌐 Server listening")

		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("Server failed")
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info().Msg("🛑 Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("👋 Server exited cleanly")
}
