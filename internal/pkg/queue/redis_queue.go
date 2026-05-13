package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Job represents a queue job
type Job struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`
	Payload   map[string]interface{} `json:"payload"`
	Priority  int                    `json:"priority"`
	Attempts  int                    `json:"attempts"`
	MaxRetry  int                    `json:"max_retry"`
	CreatedAt time.Time              `json:"created_at"`
}

// Queue provides a simple Redis-based job queue
type Queue struct {
	client *redis.Client
	name   string
}

// NewQueue creates a new queue instance
func NewQueue(client *redis.Client, name string) *Queue {
	return &Queue{
		client: client,
		name:   fmt.Sprintf("swadeshiops:queue:%s", name),
	}
}

// Enqueue adds a job to the queue
func (q *Queue) Enqueue(ctx context.Context, job *Job) error {
	data, err := json.Marshal(job)
	if err != nil {
		return fmt.Errorf("failed to marshal job: %w", err)
	}

	return q.client.LPush(ctx, q.name, data).Err()
}

// Dequeue blocks until a job is available, then returns it
func (q *Queue) Dequeue(ctx context.Context, timeout time.Duration) (*Job, error) {
	result, err := q.client.BRPop(ctx, timeout, q.name).Result()
	if err != nil {
		if err == redis.Nil {
			return nil, nil // timeout, no job
		}
		return nil, fmt.Errorf("failed to dequeue job: %w", err)
	}

	if len(result) < 2 {
		return nil, nil
	}

	var job Job
	if err := json.Unmarshal([]byte(result[1]), &job); err != nil {
		return nil, fmt.Errorf("failed to unmarshal job: %w", err)
	}

	return &job, nil
}

// Len returns the number of jobs in the queue
func (q *Queue) Len(ctx context.Context) (int64, error) {
	return q.client.LLen(ctx, q.name).Result()
}

// Purge removes all jobs from the queue
func (q *Queue) Purge(ctx context.Context) error {
	return q.client.Del(ctx, q.name).Err()
}
