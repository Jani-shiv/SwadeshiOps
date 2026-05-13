# 🇮🇳 SwadeshiOps

**India-first, open-source, self-hosted DevOps platform.**

> Atmanirbhar DevOps — Built for Indian startups, agencies, and developers.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.22-00ADD8.svg)](https://go.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)

---

## 🎯 What is SwadeshiOps?

SwadeshiOps is a **low-cost, self-hosted CI/CD platform** designed specifically for the Indian developer ecosystem. It provides everything you need to build, test, deploy, and monitor your applications — all running on your own infrastructure.

### Why SwadeshiOps?

- **💸 Low Cost**: Runs on a ₹500/month VPS (2GB RAM)
- **🇮🇳 India-First**: Hindi localization, WhatsApp/Telegram notifications, GST-ready
- **🔓 Self-Hosted**: Your code, your servers, your data
- **⚡ Simple**: No Kubernetes required — Docker Compose is enough
- **🧩 Modular**: Use only what you need

---

## ✨ Features (MVP)

- ✅ User authentication (JWT)
- ✅ Project management
- ✅ Git webhook listener (GitHub, GitLab, Gitea)
- ✅ Pipeline YAML parser with dependency resolution
- ✅ Docker-based pipeline runners
- ✅ Live log streaming (WebSocket)
- ✅ SSH deployments
- ✅ Pipeline execution history
- ✅ Status dashboard
- ✅ Role-based access control
- ✅ Encrypted secrets management (AES-256-GCM)
- ✅ Environment variables
- ✅ Telegram & Discord notifications
- ✅ Prometheus metrics

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Go 1.22+ (for development)
- Node.js 20+ (for frontend development)

### 1. Clone & Setup

```bash
git clone https://github.com/swadeshiops/swadeshiops.git
cd swadeshiops
cp .env.example .env
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL, Redis, Prometheus, Grafana
docker compose up -d
```

### 3. Run the API

```bash
# Development mode
make dev

# Or build and run
make build
make run
```

### 4. Start Frontend (optional)

```bash
make web-install
make web-dev
```

### 5. Access

| Service       | URL                          |
|---------------|------------------------------|
| API           | http://localhost:8080         |
| Frontend      | http://localhost:5173         |
| Grafana       | http://localhost:3000         |
| Prometheus    | http://localhost:9090         |

---

## 📝 Pipeline Configuration

Create a `.swadeshiops.yml` in your project root:

```yaml
version: "1"

pipeline:
  name: "My App CI/CD"

  stages:
    build:
      image: node:20-alpine
      commands:
        - npm ci
        - npm run build

    test:
      image: node:20-alpine
      commands:
        - npm test
      depends_on:
        - build

    deploy:
      type: ssh
      host: ${DEPLOY_HOST}
      commands:
        - cd /app && docker compose pull && docker compose up -d
      depends_on:
        - test
      when:
        branch: main

  notifications:
    telegram:
      on: [success, failure]
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                React Frontend               │
├─────────────────────────────────────────────┤
│         Go API Server (Gin)                 │
│   Auth │ Projects │ Pipelines │ Deploy      │
├─────────────────────────────────────────────┤
│  Redis Queue  │  Worker Pool  │  Docker     │
├─────────────────────────────────────────────┤
│  PostgreSQL   │  Redis Cache  │  File Store │
└─────────────────────────────────────────────┘
```

- **Monolith-first** architecture
- **Worker pool** for pipeline execution
- **Redis queue** for job management
- **Docker containers** for isolated execution
- **WebSocket** for live log streaming

---

## 🛠️ Tech Stack

| Component    | Technology              |
|-------------|------------------------|
| Backend     | Go 1.22, Gin           |
| Frontend    | React 18, TypeScript   |
| Database    | PostgreSQL 16          |
| Cache/Queue | Redis 7                |
| Runners     | Docker                 |
| Monitoring  | Prometheus + Grafana   |
| Logging     | Zerolog + Loki         |

---

## 📁 Project Structure

```
swadeshiops/
├── cmd/server/          # Application entry point
├── internal/
│   ├── auth/            # Authentication service
│   ├── pipeline/        # Pipeline engine
│   ├── notification/    # Notification service
│   ├── server/          # HTTP server & middleware
│   └── pkg/             # Shared packages
├── web/                 # React frontend
├── deployments/         # Docker & K8s configs
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/contributing.md) for guidelines.

### Good First Issues

Look for issues labeled `good-first-issue` — they're designed for newcomers.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `make test`
5. Submit a PR

---

## 📜 License

Apache License 2.0 — See [LICENSE](LICENSE) for details.

---

## 🌟 Star History

If SwadeshiOps helps you, please ⭐ star the repo!

---

<p align="center">
  Made with ❤️ in India 🇮🇳
</p>
