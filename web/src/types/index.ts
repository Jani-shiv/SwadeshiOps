// ============================================
// SwadeshiOps API Types
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginResponse {
  tokens: TokenResponse;
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  created_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description?: string;
  repo_url?: string;
  repo_provider?: string;
  repo_branch: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RunStatus = 'queued' | 'running' | 'success' | 'failed' | 'cancelled' | 'timeout';

export interface PipelineRun {
  id: string;
  pipeline_id: string;
  project_id: string;
  run_number: number;
  status: RunStatus;
  trigger_type: string;
  trigger_ref: string;
  commit_sha: string;
  commit_message: string;
  commit_author: string;
  started_at?: string;
  finished_at?: string;
  duration_ms: number;
  error_message?: string;
  created_at: string;
}

export interface Pipeline {
  id: string;
  project_id: string;
  name: string;
  config_yaml: string;
  trigger_type: string;
  trigger_branch: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  run_id: string;
  environment: string;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolled_back';
  deploy_type: string;
  target_host: string;
  commit_sha: string;
  started_at?: string;
  finished_at?: string;
  created_at: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface DashboardStats {
  total_projects: number;
  total_pipelines: number;
  total_runs: number;
  success_rate: number;
  recent_runs: PipelineRun[];
  active_deployments: Deployment[];
}

export interface Secret {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EnvVar {
  id: string;
  project_id: string;
  name: string;
  value?: string;
  is_secret: boolean;
  environment: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceData {
  orgs: Organization[];
  projects: Project[];
  pipelines: Pipeline[];
  runs: PipelineRun[];
  deployments: Deployment[];
  secrets: Secret[];
  envVars: EnvVar[];
  stats?: DashboardStats;
}
