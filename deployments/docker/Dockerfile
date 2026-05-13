# ============================================
# SwadeshiOps — Multi-stage Docker Build
# ============================================

# Stage 1: Build
FROM golang:1.22-alpine AS builder

ARG VERSION=dev
ARG COMMIT_SHA=unknown

RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary with version info
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-w -s -X main.version=${VERSION} -X main.commitSHA=${COMMIT_SHA}" \
    -o /bin/swadeshiops \
    ./cmd/server

# Stage 2: Runtime
FROM alpine:3.23

RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy binary
COPY --from=builder /bin/swadeshiops /app/swadeshiops

# Create data directories
RUN mkdir -p /app/data/logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

ENTRYPOINT ["/app/swadeshiops"]
