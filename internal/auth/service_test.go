package auth

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/swadeshiops/swadeshiops/internal/config"
)

func TestValidateTokenRejectsRefreshToken(t *testing.T) {
	t.Parallel()

	secret := "test-secret"
	userID := uuid.New()
	service := NewService(nil, &config.JWTConfig{
		Secret:     secret,
		AccessTTL:  15 * time.Minute,
		RefreshTTL: time.Hour,
	}, zerolog.Nop())

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  userID.String(),
		"iat":  time.Now().Unix(),
		"exp":  time.Now().Add(time.Hour).Unix(),
		"type": "refresh",
	})
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("failed to sign token: %v", err)
	}

	if _, err := service.ValidateToken(tokenString); err == nil {
		t.Fatal("expected refresh token to be rejected")
	}
}
