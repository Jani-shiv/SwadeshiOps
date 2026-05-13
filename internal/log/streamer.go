package log

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Streamer manages live log streaming via WebSocket and Redis PubSub
type Streamer struct {
	redis  *redis.Client
	logger zerolog.Logger
	mu     sync.RWMutex
}

// NewStreamer creates a new log streamer
func NewStreamer(rdb *redis.Client, logger zerolog.Logger) *Streamer {
	return &Streamer{
		redis:  rdb,
		logger: logger.With().Str("component", "log_streamer").Logger(),
	}
}

// channelName returns the Redis PubSub channel for a run
func channelName(runID uuid.UUID) string {
	return fmt.Sprintf("swadeshiops:logs:%s", runID.String())
}

// Publish sends a log line to the Redis PubSub channel for a run
func (s *Streamer) Publish(ctx context.Context, runID uuid.UUID, line string) error {
	return s.redis.Publish(ctx, channelName(runID), line).Err()
}

// CreateLogWriter returns a function that can be passed as a log writer for pipeline execution
func (s *Streamer) CreateLogWriter(runID uuid.UUID) func(string) {
	return func(line string) {
		timestamp := time.Now().Format("15:04:05.000")
		formattedLine := fmt.Sprintf("[%s] %s", timestamp, line)

		ctx := context.Background()
		if err := s.Publish(ctx, runID, formattedLine); err != nil {
			s.logger.Error().Err(err).Str("run_id", runID.String()).Msg("Failed to publish log line")
		}
	}
}

// HandleStream handles WebSocket connections for live log streaming
// GET /api/v1/runs/:runId/logs/stream
func (s *Streamer) HandleStream(c *gin.Context) {
	runIDStr := c.Param("runId")
	runID, err := uuid.Parse(runIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid run ID"})
		return
	}

	// Upgrade to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		s.logger.Error().Err(err).Msg("Failed to upgrade to WebSocket")
		return
	}
	defer conn.Close()

	s.logger.Info().Str("run_id", runID.String()).Msg("WebSocket client connected for log streaming")

	// Subscribe to Redis PubSub channel
	ctx, cancel := context.WithCancel(c.Request.Context())
	defer cancel()

	pubsub := s.redis.Subscribe(ctx, channelName(runID))
	defer pubsub.Close()

	ch := pubsub.Channel()

	// Read from WebSocket to detect disconnects
	go func() {
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				cancel()
				return
			}
		}
	}()

	// Stream logs to WebSocket
	for {
		select {
		case msg, ok := <-ch:
			if !ok {
				return
			}

			if err := conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
				s.logger.Debug().Err(err).Msg("WebSocket write failed, client disconnected")
				return
			}

		case <-ctx.Done():
			return
		}
	}
}
