package logger

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

// New creates a structured logger based on environment
func New() zerolog.Logger {
	level := os.Getenv("LOG_LEVEL")
	format := os.Getenv("LOG_FORMAT")

	// Set log level
	var zLevel zerolog.Level
	switch level {
	case "trace":
		zLevel = zerolog.TraceLevel
	case "debug":
		zLevel = zerolog.DebugLevel
	case "info":
		zLevel = zerolog.InfoLevel
	case "warn":
		zLevel = zerolog.WarnLevel
	case "error":
		zLevel = zerolog.ErrorLevel
	default:
		zLevel = zerolog.DebugLevel
	}

	zerolog.SetGlobalLevel(zLevel)

	// Console output for development, JSON for production
	if format == "json" {
		return zerolog.New(os.Stdout).
			With().
			Timestamp().
			Str("service", "swadeshiops").
			Logger()
	}

	return zerolog.New(zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: time.RFC3339,
	}).
		With().
		Timestamp().
		Logger()
}
