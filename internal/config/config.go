package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds all application configuration
type Config struct {
	App        AppConfig
	Database   DatabaseConfig
	Redis      RedisConfig
	JWT        JWTConfig
	Encryption EncryptionConfig
	Docker     DockerConfig
	Log        LogConfig
	CORS       CORSConfig
	SMTP       SMTPConfig
	Telegram   TelegramConfig
	Supabase   SupabaseConfig
}

type AppConfig struct {
	Env    string
	Host   string
	Port   int
	Secret string
}

type DatabaseConfig struct {
	URL      string
	Host     string
	Port     int
	User     string
	Password string
	Name     string
	SSLMode  string
	MaxConns int
	MinConns int
}

func (d DatabaseConfig) DSN() string {
	if d.URL != "" {
		return d.URL
	}
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=%s",
		d.User, d.Password, d.Host, d.Port, d.Name, d.SSLMode,
	)
}

type RedisConfig struct {
	URL      string
	Host     string
	Port     int
	Password string
	DB       int
}

func (r RedisConfig) Addr() string {
	return fmt.Sprintf("%s:%d", r.Host, r.Port)
}

type JWTConfig struct {
	Secret     string
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

type EncryptionConfig struct {
	Key string
}

type DockerConfig struct {
	Socket     string
	MaxWorkers int
	Timeout    int // seconds
}

type LogConfig struct {
	Level  string
	Format string
}

type CORSConfig struct {
	Origins string
}

type SMTPConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	From     string
}

type TelegramConfig struct {
	BotToken string
}

type SupabaseConfig struct {
	URL       string
	AnonKey   string
	JWTSecret string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		App: AppConfig{
			Env:    getEnv("APP_ENV", "development"),
			Host:   getEnv("APP_HOST", "0.0.0.0"),
			Port:   getEnvInt("APP_PORT", 8080),
			Secret: getEnv("APP_SECRET", "dev-secret-change-me"),
		},
		Database: DatabaseConfig{
			URL:      getEnv("DATABASE_URL", ""),
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "swadeshiops"),
			Password: getEnv("DB_PASSWORD", "swadeshiops_dev"),
			Name:     getEnv("DB_NAME", "swadeshiops"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
			MaxConns: getEnvInt("DB_MAX_CONNS", 25),
			MinConns: getEnvInt("DB_MIN_CONNS", 5),
		},
		Redis: RedisConfig{
			URL:      getEnv("REDIS_URL", ""),
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnvInt("REDIS_PORT", 6379),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvInt("REDIS_DB", 0),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "dev-jwt-secret-change-me"),
			AccessTTL:  getEnvDuration("JWT_ACCESS_TTL", 15*time.Minute),
			RefreshTTL: getEnvDuration("JWT_REFRESH_TTL", 168*time.Hour),
		},
		Encryption: EncryptionConfig{
			Key: getEnv("ENCRYPTION_KEY", ""),
		},
		Docker: DockerConfig{
			Socket:     getEnv("DOCKER_SOCKET", "/var/run/docker.sock"),
			MaxWorkers: getEnvInt("RUNNER_MAX_WORKERS", 2),
			Timeout:    getEnvInt("RUNNER_TIMEOUT", 600),
		},
		Log: LogConfig{
			Level:  getEnv("LOG_LEVEL", "debug"),
			Format: getEnv("LOG_FORMAT", "console"),
		},
		CORS: CORSConfig{
			Origins: getEnv("CORS_ORIGINS", "http://localhost:5173"),
		},
		SMTP: SMTPConfig{
			Host:     getEnv("SMTP_HOST", ""),
			Port:     getEnvInt("SMTP_PORT", 587),
			User:     getEnv("SMTP_USER", ""),
			Password: getEnv("SMTP_PASSWORD", ""),
			From:     getEnv("SMTP_FROM", "noreply@swadeshiops.dev"),
		},
		Telegram: TelegramConfig{
			BotToken: getEnv("TELEGRAM_BOT_TOKEN", ""),
		},
		Supabase: SupabaseConfig{
			URL:       getEnv("SUPABASE_URL", ""),
			AnonKey:   getEnv("SUPABASE_ANON_KEY", ""),
			JWTSecret: getEnv("SUPABASE_JWT_SECRET", ""),
		},
	}

	if cfg.App.Env == "production" {
		if cfg.JWT.Secret == "" || cfg.JWT.Secret == "dev-jwt-secret-change-me" || cfg.JWT.Secret == "change-this-to-a-random-jwt-secret" {
			return nil, fmt.Errorf("JWT_SECRET must be set to a strong unique value in production")
		}
		if cfg.App.Secret == "" || cfg.App.Secret == "dev-secret-change-me" || cfg.App.Secret == "change-this-to-a-random-secret-key" {
			return nil, fmt.Errorf("APP_SECRET must be set to a strong unique value in production")
		}
		if cfg.Encryption.Key == "" {
			return nil, fmt.Errorf("ENCRYPTION_KEY must be set in production")
		}
	}

	return cfg, nil
}

// Helper functions for reading environment variables
func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if val, ok := os.LookupEnv(key); ok {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return fallback
}

func getEnvDuration(key string, fallback time.Duration) time.Duration {
	if val, ok := os.LookupEnv(key); ok {
		if d, err := time.ParseDuration(val); err == nil {
			return d
		}
	}
	return fallback
}
