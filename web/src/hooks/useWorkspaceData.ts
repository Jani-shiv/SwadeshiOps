import { useQuery } from '@tanstack/react-query';
import { orgsAPI } from '../services/api';
import type { WorkspaceData } from '../types';

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

      const res = await orgsAPI.workspace(activeOrg.id);
      if (!res.data) return emptyWorkspace;

      return {
        ...res.data,
        activeOrg, // Add this for convenience if needed
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
