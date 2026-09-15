import { computed, ref } from 'vue';
import type { ProjectShellView, WaasProject, WaasProjectDepositMode } from './types';

const projects = ref<WaasProject[]>([]);
const selectedProjectId = ref<string | null>(null);
const shellView = ref<ProjectShellView>('empty');

const selectedProject = computed(() =>
  projects.value.find((project) => project.id === selectedProjectId.value) ?? null,
);

const hasProjects = computed(() => projects.value.length > 0);

function syncShellViewFromProjects() {
  if (shellView.value === 'create') return;
  shellView.value = projects.value.length > 0 ? 'content' : 'empty';
}

function openCreateProject() {
  shellView.value = 'create';
}

function cancelCreateProject() {
  syncShellViewFromProjects();
}

function createProject(input: {
  name: string;
  depositEnabled: boolean;
  depositMode: WaasProjectDepositMode;
  payoutEnabled: boolean;
  payoutWalletId?: string;
}) {
  const trimmedName = input.name.trim();
  if (!trimmedName) return;

  const project: WaasProject = {
    id: `project-${Date.now()}`,
    name: trimmedName,
    depositEnabled: input.depositEnabled,
    depositMode: input.depositMode,
    payoutEnabled: input.payoutEnabled,
    payoutWalletId: input.payoutWalletId,
  };

  projects.value = [...projects.value, project];
  selectedProjectId.value = project.id;
  shellView.value = 'content';
}

function selectProject(projectId: string) {
  selectedProjectId.value = projectId;
}

export function useWaasProjectStore() {
  return {
    projects,
    selectedProjectId,
    selectedProject,
    hasProjects,
    shellView,
    openCreateProject,
    cancelCreateProject,
    createProject,
    selectProject,
    syncShellViewFromProjects,
  };
}
