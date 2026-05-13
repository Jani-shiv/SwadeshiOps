import axios from 'axios';
import type { APIResponse, LoginResponse, User } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<APIResponse<LoginResponse>>('/auth/login', { email, password });
    if (data.data) {
      localStorage.setItem('access_token', data.data.tokens.access_token);
      localStorage.setItem('refresh_token', data.data.tokens.refresh_token);
    }
    return data;
  },

  register: async (email: string, username: string, password: string, full_name: string) => {
    const { data } = await api.post<APIResponse<User>>('/auth/register', {
      email, username, password, full_name,
    });
    return data;
  },

  me: async () => {
    const { data } = await api.get<APIResponse<User>>('/auth/me');
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },
};

// ─── Projects ──────────────────────────────────
export const projectsAPI = {
  list: async (orgId: string) => {
    const { data } = await api.get(`/orgs/${orgId}/projects`);
    return data;
  },

  get: async (projectId: string) => {
    const { data } = await api.get(`/projects/${projectId}`);
    return data;
  },

  create: async (orgId: string, project: { name: string; description?: string; repo_url?: string }) => {
    const { data } = await api.post(`/orgs/${orgId}/projects`, project);
    return data;
  },
};

// ─── Pipelines ─────────────────────────────────
export const pipelinesAPI = {
  list: async (projectId: string) => {
    const { data } = await api.get(`/projects/${projectId}/pipelines`);
    return data;
  },

  get: async (pipelineId: string) => {
    const { data } = await api.get(`/pipelines/${pipelineId}`);
    return data;
  },

  trigger: async (pipelineId: string, branch?: string) => {
    const { data } = await api.post(`/pipelines/${pipelineId}/trigger`, { branch });
    return data;
  },

  runs: async (pipelineId: string) => {
    const { data } = await api.get(`/pipelines/${pipelineId}/runs`);
    return data;
  },
};

// ─── Stats ─────────────────────────────────────
export const statsAPI = {
  org: async (orgId: string) => {
    const { data } = await api.get(`/orgs/${orgId}/stats`);
    return data;
  },

  project: async (projectId: string) => {
    const { data } = await api.get(`/projects/${projectId}/stats`);
    return data;
  },
};

export default api;
