#!/bin/bash
set -e

# Configuration
REPO_URL="https://github.com/Jani-shiv/SwadeshiOps.git"
DEPLOY_DIR="/opt/swadeshiops"

echo "Starting deployment to $DEPLOY_DIR..."

# Create directory
sudo mkdir -p $DEPLOY_DIR
sudo chown -R $USER:$USER $DEPLOY_DIR

# Clone or Update
if [ ! -d "$DEPLOY_DIR/.git" ]; then
    echo "Cloning repository..."
    git clone $REPO_URL $DEPLOY_DIR
else
    echo "Updating repository..."
    cd $DEPLOY_DIR
    git fetch origin
    git reset --hard origin/main
fi

cd $DEPLOY_DIR

# Create production .env from local template if it doesn't exist
# We use placeholders for secrets that the user must fill
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat <<EOF > .env
# Server
APP_ENV=production
APP_PORT=8080
APP_HOST=0.0.0.0
APP_SECRET=$(openssl rand -hex 32)

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=swadeshiops
DB_PASSWORD=$(openssl rand -hex 16)
DB_NAME=swadeshiops
DB_SSLMODE=disable

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=$(openssl rand -hex 32)
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=168h

# Encryption
ENCRYPTION_KEY=$(openssl rand -hex 16)

# Supabase (USER ACTION REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Frontend
CORS_ORIGINS=*
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
EOF
fi

# Run with Docker Compose
echo "Starting containers..."
docker compose pull
docker compose up -d --build

echo "Deployment complete! SwadeshiOps is running."
echo "Note: You must edit $DEPLOY_DIR/.env with your Supabase keys and restart with 'docker compose up -d'."
