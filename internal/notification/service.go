package notification

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Notifier defines the notification interface
type Notifier interface {
	Send(message *Message) error
	Type() string
}

// Message represents a notification message
type Message struct {
	Title     string
	Body      string
	Status    string // success, failed, canceled
	Project   string
	Pipeline  string
	Branch    string
	CommitSHA string
	Author    string
	Duration  time.Duration
	URL       string
}

// TelegramNotifier sends messages via Telegram Bot API
type TelegramNotifier struct {
	botToken string
	chatID   string
	client   *http.Client
}

// NewTelegramNotifier creates a Telegram notifier
func NewTelegramNotifier(botToken, chatID string) *TelegramNotifier {
	return &TelegramNotifier{
		botToken: botToken,
		chatID:   chatID,
		client:   &http.Client{Timeout: 10 * time.Second},
	}
}

func (t *TelegramNotifier) Type() string { return "telegram" }

func (t *TelegramNotifier) Send(msg *Message) error {
	emoji := "✅"
	if msg.Status == "failed" {
		emoji = "❌"
	} else if msg.Status == "canceled" {
		emoji = "⚠️"
	}

	text := fmt.Sprintf(
		"%s *%s* — %s\n\n"+
			"📦 Project: `%s`\n"+
			"🔀 Branch: `%s`\n"+
			"🔨 Commit: `%s`\n"+
			"👤 Author: %s\n"+
			"⏱ Duration: %s\n"+
			"\n[View Details](%s)",
		emoji, msg.Pipeline, msg.Status,
		msg.Project,
		msg.Branch,
		msg.CommitSHA[:8],
		msg.Author,
		msg.Duration.Round(time.Second),
		msg.URL,
	)

	payload := map[string]interface{}{
		"chat_id":    t.chatID,
		"text":       text,
		"parse_mode": "Markdown",
	}

	body, _ := json.Marshal(payload)
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", t.botToken)

	resp, err := t.client.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("telegram send failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("telegram API returned status %d", resp.StatusCode)
	}

	return nil
}

// DiscordNotifier sends messages via Discord webhooks
type DiscordNotifier struct {
	webhookURL string
	client     *http.Client
}

// NewDiscordNotifier creates a Discord notifier
func NewDiscordNotifier(webhookURL string) *DiscordNotifier {
	return &DiscordNotifier{
		webhookURL: webhookURL,
		client:     &http.Client{Timeout: 10 * time.Second},
	}
}

func (d *DiscordNotifier) Type() string { return "discord" }

func (d *DiscordNotifier) Send(msg *Message) error {
	color := 3066993 // green
	if msg.Status == "failed" {
		color = 15158332 // red
	}

	payload := map[string]interface{}{
		"embeds": []map[string]interface{}{
			{
				"title":       fmt.Sprintf("%s — %s", msg.Pipeline, msg.Status),
				"description": msg.Body,
				"color":       color,
				"fields": []map[string]interface{}{
					{"name": "Project", "value": msg.Project, "inline": true},
					{"name": "Branch", "value": msg.Branch, "inline": true},
					{"name": "Commit", "value": msg.CommitSHA[:8], "inline": true},
					{"name": "Author", "value": msg.Author, "inline": true},
					{"name": "Duration", "value": msg.Duration.Round(time.Second).String(), "inline": true},
				},
				"url":       msg.URL,
				"timestamp": time.Now().Format(time.RFC3339),
			},
		},
	}

	body, _ := json.Marshal(payload)
	resp, err := d.client.Post(d.webhookURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("discord send failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("discord API returned status %d", resp.StatusCode)
	}

	return nil
}

// Service manages notification dispatching
type Service struct {
	notifiers []Notifier
}

// NewService creates a notification service
func NewService() *Service {
	return &Service{
		notifiers: make([]Notifier, 0),
	}
}

// Register adds a notifier
func (s *Service) Register(n Notifier) {
	s.notifiers = append(s.notifiers, n)
}

// Notify sends a message to all registered notifiers
func (s *Service) Notify(msg *Message) []error {
	var errors []error
	for _, n := range s.notifiers {
		if err := n.Send(msg); err != nil {
			errors = append(errors, fmt.Errorf("[%s] %w", n.Type(), err))
		}
	}
	return errors
}
