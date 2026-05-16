package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"golang.org/x/crypto/bcrypt"

	"github.com/swadeshiops/swadeshiops/internal/config"
)

// Service handles authentication business logic
type Service struct {
	repo     *Repository
	cfg      *config.JWTConfig
	logger   zerolog.Logger
}

// NewService creates a new auth service
func NewService(repo *Repository, cfg *config.JWTConfig, logger zerolog.Logger) *Service {
	return &Service{
		repo:   repo,
		cfg:    cfg,
		logger: logger.With().Str("service", "auth").Logger(),
	}
}

// Register creates a new user account
func (s *Service) Register(ctx context.Context, req *RegisterRequest) (*User, error) {
	// Check if email already exists
	exists, err := s.repo.EmailExists(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check email: %w", err)
	}
	if exists {
		return nil, fmt.Errorf("email already registered")
	}

	// Check if username exists
	exists, err = s.repo.UsernameExists(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to check username: %w", err)
	}
	if exists {
		return nil, fmt.Errorf("username already taken")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user := &User{
		Email:        req.Email,
		Username:     req.Username,
		PasswordHash: string(hashedPassword),
		FullName:     req.FullName,
		Role:         "member",
		IsActive:     true,
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	s.logger.Info().
		Str("user_id", user.ID.String()).
		Str("email", user.Email).
		Msg("User registered")

	return user, nil
}

// Login authenticates a user and returns JWT tokens
func (s *Service) Login(ctx context.Context, req *LoginRequest) (*TokenResponse, *User, error) {
	user, err := s.repo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid credentials")
	}

	if !user.IsActive {
		return nil, nil, fmt.Errorf("account is deactivated")
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, nil, fmt.Errorf("invalid credentials")
	}

	// Generate tokens
	tokens, err := s.generateTokens(user)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Update last login
	_ = s.repo.UpdateLastLogin(ctx, user.ID)

	s.logger.Info().
		Str("user_id", user.ID.String()).
		Msg("User logged in")

	return tokens, user, nil
}

// GetUser retrieves a user by ID
func (s *Service) GetUser(ctx context.Context, userID uuid.UUID) (*User, error) {
	return s.repo.GetByID(ctx, userID)
}

// generateTokens creates access and refresh JWT tokens
func (s *Service) generateTokens(user *User) (*TokenResponse, error) {
	now := time.Now()

	// Access token
	accessClaims := jwt.MapClaims{
		"sub":      user.ID.String(),
		"email":    user.Email,
		"username": user.Username,
		"role":     user.Role,
		"iat":      now.Unix(),
		"exp":      now.Add(s.cfg.AccessTTL).Unix(),
		"type":     "access",
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenStr, err := accessToken.SignedString([]byte(s.cfg.Secret))
	if err != nil {
		return nil, err
	}

	// Refresh token
	refreshClaims := jwt.MapClaims{
		"sub":  user.ID.String(),
		"iat":  now.Unix(),
		"exp":  now.Add(s.cfg.RefreshTTL).Unix(),
		"type": "refresh",
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenStr, err := refreshToken.SignedString([]byte(s.cfg.Secret))
	if err != nil {
		return nil, err
	}

	return &TokenResponse{
		AccessToken:  accessTokenStr,
		RefreshToken: refreshTokenStr,
		ExpiresIn:    int64(s.cfg.AccessTTL.Seconds()),
		TokenType:    "Bearer",
	}, nil
}

// ValidateToken validates a JWT token and returns the claims
func (s *Service) ValidateToken(tokenStr string) (*Claims, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Try primary secret
		return []byte(s.cfg.Secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	mapClaims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	sub, ok := mapClaims["sub"].(string)
	if !ok {
		return nil, fmt.Errorf("invalid sub in token claims")
	}
	userID, err := uuid.Parse(sub)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID in token")
	}
	tokenType, _ := mapClaims["type"].(string)
	if tokenType != "access" {
		return nil, fmt.Errorf("invalid token type")
	}

	claims := &Claims{
		UserID: userID,
	}

	if email, ok := mapClaims["email"].(string); ok {
		claims.Email = email
	}
	if username, ok := mapClaims["username"].(string); ok {
		claims.Username = username
	}
	if role, ok := mapClaims["role"].(string); ok {
		claims.Role = role
	}

	return claims, nil
}
