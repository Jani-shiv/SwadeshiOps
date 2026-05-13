.PHONY: build run dev test clean docker-up docker-down migrate lint fmt help

# ─── Variables ─────────────────────────────────
BINARY_NAME=swadeshiops
GO=go
DOCKER_COMPOSE=docker compose

# ─── Help ──────────────────────────────────────
help: ## Show this help
	@echo "SwadeshiOps — India-first DevOps Platform"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Development ───────────────────────────────
dev: ## Run the API server in development mode
	APP_ENV=development $(GO) run ./cmd/server

run: build ## Build and run the binary
	./bin/$(BINARY_NAME)

build: ## Build the Go binary
	$(GO) build -ldflags="-w -s" -o ./bin/$(BINARY_NAME) ./cmd/server

# ─── Testing ───────────────────────────────────
test: ## Run all tests
	$(GO) test -v -race -cover ./...

test-coverage: ## Run tests with coverage report
	$(GO) test -v -race -coverprofile=coverage.out ./...
	$(GO) tool cover -html=coverage.out -o coverage.html

# ─── Docker ────────────────────────────────────
docker-up: ## Start all services with Docker Compose
	$(DOCKER_COMPOSE) up -d

docker-down: ## Stop all services
	$(DOCKER_COMPOSE) down

docker-logs: ## View Docker Compose logs
	$(DOCKER_COMPOSE) logs -f

docker-build: ## Build Docker image
	$(DOCKER_COMPOSE) build api

docker-reset: ## Reset all Docker data (destructive)
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d

# ─── Database ──────────────────────────────────
migrate: ## Run database migrations
	$(GO) run ./cmd/server migrate

# ─── Code Quality ──────────────────────────────
lint: ## Run linter
	golangci-lint run ./...

fmt: ## Format code
	$(GO) fmt ./...
	goimports -w .

# ─── Cleanup ───────────────────────────────────
clean: ## Clean build artifacts
	rm -rf ./bin ./coverage.out ./coverage.html

# ─── Frontend ──────────────────────────────────
web-install: ## Install frontend dependencies
	cd web && npm install

web-dev: ## Run frontend dev server
	cd web && npm run dev

web-build: ## Build frontend for production
	cd web && npm run build

# ─── Full Stack ────────────────────────────────
start: docker-up dev ## Start everything (DB + Redis + API)

all: docker-up web-dev dev ## Start full stack with frontend
