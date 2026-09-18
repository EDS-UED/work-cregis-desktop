import { computed, ref } from 'vue';
import {
  cregisModuleMenuTitleFlotationItems,
  type FlotationMenuItemPreset,
} from '@eds/desktop-components';
import type { ProjectShellView, WaasProject, WaasProjectDepositMode } from './types';

export const WAAS_ORDER_MODE_DEMO_PROJECT_ID = 'waas-cascade';

const DEMO_WAAS_PROJECTS: WaasProject[] = [
  {
    id: 'waas-aurora',
    name: 'Aurora Merchant',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-1',
  },
  {
    id: 'waas-borealis',
    name: 'Borealis Acquire',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-2',
  },
  {
    id: WAAS_ORDER_MODE_DEMO_PROJECT_ID,
    name: 'Cascade Disburse',
    depositEnabled: true,
    depositMode: 'order',
    payoutEnabled: true,
    payoutWalletId: 'wallet-3',
  },
  {
    id: 'waas-delta',
    name: 'Delta Escrow',
    depositEnabled: true,
    depositMode: 'order',
    payoutEnabled: false,
  },
  {
    id: 'waas-ember',
    name: 'Ember Exchange',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-4',
  },
  {
    id: 'waas-flint',
    name: 'Flint Ledger',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-5',
  },
  {
    id: 'waas-granite',
    name: 'Granite Invoice',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: false,
  },
  {
    id: 'waas-harbor',
    name: 'Harbor Transit',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-6',
  },
  {
    id: 'waas-ivory',
    name: 'Ivory Vault',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-7',
  },
  {
    id: 'waas-jasper',
    name: 'Jasper Capture',
    depositEnabled: true,
    depositMode: 'sub-address',
    payoutEnabled: true,
    payoutWalletId: 'wallet-8',
  },
];

const projects = ref<WaasProject[]>([...DEMO_WAAS_PROJECTS]);
const selectedProjectId = ref<string | null>(DEMO_WAAS_PROJECTS[0]!.id);
const shellView = ref<ProjectShellView>('content');

const selectedProject = computed(() =>
  projects.value.find((project) => project.id === selectedProjectId.value) ?? null,
);

const hasProjects = computed(() => projects.value.length > 0);

export function buildWaasTitleFlotationItems(
  projectList: readonly WaasProject[],
): FlotationMenuItemPreset[] {
  return cregisModuleMenuTitleFlotationItems.map((item, index) => {
    const project = projectList[index];

    return {
      ...item,
      label: project?.name ?? item.label,
      modeTag: undefined,
    };
  });
}

function resolveProjectIndex(projectId: string | null): number {
  if (!projectId) return 0;
  const index = projects.value.findIndex((project) => project.id === projectId);
  return index >= 0 ? index : 0;
}

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
  if (!projects.value.some((project) => project.id === projectId)) return;
  selectedProjectId.value = projectId;
}

function selectProjectByFlotationIndex(index: number) {
  const project = projects.value[index];
  if (!project) return;
  selectedProjectId.value = project.id;
}

export function resetWaasProjectsForDemo() {
  projects.value = [...DEMO_WAAS_PROJECTS];
  selectedProjectId.value = DEMO_WAAS_PROJECTS[0]!.id;
  shellView.value = 'content';
}

export function clearWaasProjectsForQa() {
  projects.value = [];
  selectedProjectId.value = null;
  shellView.value = 'empty';
}

export function useWaasProjectStore() {
  const titleFlotationItems = computed(() => buildWaasTitleFlotationItems(projects.value));
  const titleFlotationSelectedIndex = computed(() => resolveProjectIndex(selectedProjectId.value));

  return {
    projects,
    selectedProjectId,
    selectedProject,
    hasProjects,
    shellView,
    titleFlotationItems,
    titleFlotationSelectedIndex,
    openCreateProject,
    cancelCreateProject,
    createProject,
    selectProject,
    selectProjectByFlotationIndex,
    syncShellViewFromProjects,
    resetWaasProjectsForDemo,
    clearWaasProjectsForQa,
  };
}
