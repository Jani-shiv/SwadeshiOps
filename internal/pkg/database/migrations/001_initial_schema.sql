-- ============================================
-- 001: Initial Schema — SwadeshiOps
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    username        VARCHAR(100) UNIQUE NOT NULL,
    password_hash   TEXT, -- Nullable for external auth
    full_name       VARCHAR(255),
    avatar_url      TEXT,
    role            VARCHAR(20) DEFAULT 'member',
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- Organizations
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    plan            VARCHAR(50) DEFAULT 'free',
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS org_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(20) DEFAULT 'member',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);

-- ============================================
-- Projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    description     TEXT,
    repo_url        TEXT,
    repo_provider   VARCHAR(20),
    repo_branch     VARCHAR(100) DEFAULT 'main',
    webhook_secret  TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(org_id);

-- ============================================
-- Pipelines
-- ============================================
CREATE TABLE IF NOT EXISTS pipelines (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    config_yaml     TEXT NOT NULL,
    config_parsed   JSONB,
    trigger_type    VARCHAR(50),
    trigger_branch  VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipelines_project ON pipelines(project_id);

-- ============================================
-- Pipeline Runs
-- ============================================
DO $$ BEGIN
    CREATE TYPE run_status AS ENUM (
        'queued', 'running', 'success', 'failed', 'cancelled', 'timeout'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id     UUID REFERENCES pipelines(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    run_number      INTEGER NOT NULL,
    status          run_status DEFAULT 'queued',
    trigger_type    VARCHAR(50),
    trigger_ref     VARCHAR(255),
    commit_sha      VARCHAR(64),
    commit_message  TEXT,
    commit_author   VARCHAR(255),
    config_snapshot JSONB,
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    duration_ms     BIGINT,
    runner_id       UUID,
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_runs_pipeline ON pipeline_runs(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_runs_project ON pipeline_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_created ON pipeline_runs(created_at DESC);

-- ============================================
-- Pipeline Steps
-- ============================================
CREATE TABLE IF NOT EXISTS pipeline_steps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id          UUID REFERENCES pipeline_runs(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    step_order      INTEGER NOT NULL,
    status          run_status DEFAULT 'queued',
    image           VARCHAR(255),
    commands        TEXT[],
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    duration_ms     BIGINT,
    exit_code       INTEGER,
    log_path        TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_steps_run ON pipeline_steps(run_id);

-- ============================================
-- Secrets
-- ============================================
CREATE TABLE IF NOT EXISTS secrets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    encrypted_value TEXT NOT NULL,
    description     TEXT,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, name)
);

-- ============================================
-- Environment Variables
-- ============================================
CREATE TABLE IF NOT EXISTS env_vars (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    value           TEXT NOT NULL,
    is_secret       BOOLEAN DEFAULT FALSE,
    environment     VARCHAR(50) DEFAULT 'all',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, name, environment)
);

-- ============================================
-- Deployments
-- ============================================
DO $$ BEGIN
    CREATE TYPE deploy_status AS ENUM (
        'pending', 'deploying', 'success', 'failed', 'rolled_back'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS deployments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    run_id          UUID REFERENCES pipeline_runs(id),
    environment     VARCHAR(50) NOT NULL,
    status          deploy_status DEFAULT 'pending',
    deploy_type     VARCHAR(50),
    target_host     VARCHAR(255),
    commit_sha      VARCHAR(64),
    deployed_by     UUID REFERENCES users(id),
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    rollback_of     UUID REFERENCES deployments(id),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deployments_project ON deployments(project_id);

-- ============================================
-- Notification Channels
-- ============================================
CREATE TABLE IF NOT EXISTS notification_channels (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    channel_type    VARCHAR(20) NOT NULL,
    config          JSONB NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Audit Logs
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    resource_type   VARCHAR(50),
    resource_id     UUID,
    details         JSONB DEFAULT '{}',
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ============================================
-- Runners
-- ============================================
CREATE TABLE IF NOT EXISTS runners (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    hostname        VARCHAR(255),
    status          VARCHAR(20) DEFAULT 'offline',
    labels          TEXT[] DEFAULT '{}',
    capacity        INTEGER DEFAULT 2,
    current_load    INTEGER DEFAULT 0,
    last_heartbeat  TIMESTAMPTZ,
    system_info     JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
