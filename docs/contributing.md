# Contributing to SwadeshiOps

Thank you for your interest in contributing to SwadeshiOps! 🙏

## Getting Started

### Prerequisites

- Go 1.22+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)
- Redis 7 (via Docker)

### Development Setup

```bash
# Clone
git clone https://github.com/swadeshiops/swadeshiops.git
cd swadeshiops

# Setup environment
cp .env.example .env

# Start infrastructure
docker compose up -d postgres redis

# Install Go dependencies
go mod download

# Run API in dev mode
make dev

# In another terminal — frontend
cd web
npm install
npm run dev
```

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Use the bug report template
3. Include steps to reproduce
4. Include environment details (OS, Go version, Docker version)

### Feature Requests

1. Check the roadmap first
2. Open a discussion before building
3. Describe the use case, not just the solution

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Write tests for new functionality
4. Ensure `make test` passes
5. Ensure `make lint` passes
6. Submit a PR with a clear description

### Commit Messages

Follow conventional commits:

```
feat: add pipeline retry logic
fix: resolve webhook signature validation
docs: update API documentation
refactor: simplify runner worker pool
test: add pipeline parser edge cases
chore: update dependencies
```

## Code Style

### Go

- Follow standard Go conventions
- Use `gofmt` and `goimports`
- Write table-driven tests
- Use structured logging (zerolog)
- Handle errors explicitly — no panics in library code
- Use context for cancellation

### TypeScript/React

- Use functional components with hooks
- Use TypeScript strict mode
- Follow ESLint configuration
- Keep components small and focused

## Project Structure

```
internal/           # Private application code
internal/pkg/       # Shared internal packages
cmd/                # Application entry points
web/                # React frontend
deployments/        # Docker, K8s configs
docs/               # Documentation
scripts/            # Utility scripts
```

## Good First Issues

Look for issues labeled:
- `good-first-issue` — Simple tasks for newcomers
- `help-wanted` — More complex but documented tasks
- `documentation` — Documentation improvements

## Community

- GitHub Discussions for questions
- GitHub Issues for bugs and features
- Be respectful and inclusive

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
