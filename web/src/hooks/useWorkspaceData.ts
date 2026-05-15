import { useQuery } from '@tanstack/react-query';
import { deploymentsAPI, envVarsAPI, orgsAPI, pipelinesAPI, projectsAPI, secretsAPI, statsAPI } from '../services/api';
import type { Deployment, EnvVar, Organization, Pipeline, PipelineRun, Project, Secret, DashboardStats } from '../types';

export interface WorkspaceData {
  orgs: Organization[];
  activeOrg?: Organization;
  projects: Project[];
  pipelines: Pipeline[];
  runs: PipelineRun[];
  deployments: Deployment[];
  secrets: Secret[];
  envVars: EnvVar[];
  stats?: DashboardStats;
}

const emptyWorkspace: WorkspaceData = {
  orgs: [],
  projects: [],
  pipelines: [],
  runs: [],
  deployments: [],
  secrets: [],
  envVars: [],
};

export function useWorkspaceData() {
  return useQuery({
    queryKey: ['workspace-data'],
    queryFn: async (): Promise<WorkspaceData> => {
      const orgs = (await orgsAPI.list()).data ?? [];
      const activeOrg = orgs[0];
      if (!activeOrg) return emptyWorkspace;

      const [projectsRes, statsRes] = await Promise.all([
        projectsAPI.list(activeOrg.id),
        statsAPI.org(activeOrg.id),
      ]);
      const projects = projectsRes.data ?? [];

      const pipelineGroups = await Promise.all(projects.map((project) => pipelinesAPI.list(project.id)));
      const pipelines = pipelineGroups.flatMap((group) => group.data ?? []);

      const [runGroups, deploymentGroups, secretGroups, envVarGroups] = await Promise.all([
        Promise.all(pipelines.map((pipeline) => pipelinesAPI.runs(pipeline.id))),
        Promise.all(projects.map((project) => deploymentsAPI.list(project.id))),
        Promise.all(projects.map((project) => secretsAPI.list(project.id))),
        Promise.all(projects.map((project) => envVarsAPI.list(project.id))),
      ]);

      return {
        orgs,
        activeOrg,
        projects,
        pipelines,
        runs: runGroups.flatMap((group) => group.data ?? []),
        deployments: deploymentGroups.flatMap((group) => group.data ?? []),
        secrets: secretGroups.flatMap((group) => group.data ?? []),
        envVars: envVarGroups.flatMap((group) => group.data ?? []),
        stats: statsRes.data,
      };
    },
  });
}

export function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${seconds}s`;
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
