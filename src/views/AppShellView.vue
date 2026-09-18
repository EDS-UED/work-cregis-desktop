<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgCregisModuleMenu, EgCregisNavBar, EgLayout } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import PreferencePage from '@/scenes/account-settings/PreferencePage.vue';
import {
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  navLabelShouldHideModuleMenu,
  resolveNavBarClickState,
  type CregisModuleMenuBusinessTitle,
} from '@/presets/module-menu/businessModuleTitles';
import { resolveEnglishUiText } from '@/i18n/translateUiText';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import {
  DEFAULT_PAYMENT_ENGINE_MENU_ITEM,
  PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
} from '@/scenes/payment-engine/paymentEngineMenuData';
import { usePaymentEngineProjectStore } from '@/scenes/payment-engine/paymentEngineProjectStore';
import {
  isPaymentEngineModuleTitle,
  isReportModuleTitle,
  isWaasModuleTitle,
} from '@/scenes/project/projectModuleTitles';
import { registerWaasProjectShellApi } from '@/scenes/project/waasProjectShellApi';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import TasksDataListPage from '@/scenes/tasks/TasksDataListPage.vue';
import { setMultiSignCollaborationModuleActive } from '@/scenes/tasks/signing/multiSignInvitation/multiSignInvitationStore';
import { useTasksModuleMenuGroups } from '@/scenes/tasks/useTasksModuleMenuGroups';
import TransactionRecordsDataListPage from '@/scenes/transaction-records/TransactionRecordsDataListPage.vue';
import {
  DEFAULT_TASKS_DATA_LIST_MENU_ITEM,
  isTasksDataListMenuItem,
  resolveTasksModuleMenuDisplayLabel,
  type TasksDataListMenuItemLabel,
} from '@/scenes/tasks/tasksDataListPageData';
import WaasModuleContentPage from '@/scenes/waas-project/WaasModuleContentPage.vue';
import WaasOrderModeDataListPage from '@/scenes/waas-project/WaasOrderModeDataListPage.vue';
import WaasProjectCreatePage from '@/scenes/waas-project/WaasProjectCreatePage.vue';
import WaasProjectEmptyPage from '@/scenes/waas-project/WaasProjectEmptyPage.vue';
import {
  isWaasMenuItemValidForProject,
  isWaasOrderModeMenuItem,
  isWaasOrderModeProject,
  resolveDefaultWaasMenuItem,
  WAAS_SETTINGS_MENU_ITEM,
} from '@/scenes/waas-project/waasMenuData';
import { useWaasModuleMenuGroups } from '@/scenes/waas-project/useWaasModuleMenuGroups';
import PaymentEngineProjectSettingsPage from '@/scenes/payment-engine/PaymentEngineProjectSettingsPage.vue';
import WaasProjectSettingsPage from '@/scenes/waas-project/WaasProjectSettingsPage.vue';

const { messages, ui, locale } = useAppI18n();
const {
  hasProjects: waasHasProjects,
  selectedProject: waasSelectedProject,
  shellView: waasShellView,
  titleFlotationItems: waasTitleFlotationItems,
  titleFlotationSelectedIndex: waasTitleFlotationSelectedIndex,
  openCreateProject: openWaasCreateProject,
  syncShellViewFromProjects: syncWaasShellViewFromProjects,
  resetWaasProjectsForDemo,
  clearWaasProjectsForQa,
  selectProject: selectWaasProjectById,
  selectProjectByFlotationIndex: selectWaasProjectByFlotationIndex,
} = useWaasProjectStore();

function translateModuleMenu(text: string) {
  return ui(resolveTasksModuleMenuDisplayLabel(text, locale.value));
}

const activeModuleTitle = ref<CregisModuleMenuBusinessTitle>(
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
);

const activeNavLabel = ref('Wallet');

const activeModuleMenuItem = ref<string | null>(null);

const isWaasModule = computed(() => isWaasModuleTitle(activeModuleTitle.value));
const isPaymentEngineModule = computed(() => isPaymentEngineModuleTitle(activeModuleTitle.value));
const showReportPage = computed(() => isReportModuleTitle(activeModuleTitle.value));

const showModuleMenu = computed(() => {
  if (navLabelShouldHideModuleMenu(activeNavLabel.value)) return false;
  if (isPaymentEngineModule.value) return true;
  if (isWaasModule.value) {
    return waasHasProjects.value && waasShellView.value === 'content';
  }
  return true;
});

const showTasksDataList = computed(
  () =>
    activeModuleTitle.value === 'Tasks' &&
    activeModuleMenuItem.value !== null &&
    isTasksDataListMenuItem(activeModuleMenuItem.value),
);

const showPreferencePage = computed(
  () => activeModuleTitle.value === 'Account Settings' && activeModuleMenuItem.value === 'Preference',
);

const showWaasEmpty = computed(
  () => isWaasModule.value && !waasHasProjects.value && waasShellView.value !== 'create',
);

const showWaasCreate = computed(
  () => isWaasModule.value && waasShellView.value === 'create',
);

const showWaasSettings = computed(
  () =>
    isWaasModule.value &&
    waasHasProjects.value &&
    waasShellView.value === 'content' &&
    activeModuleMenuItem.value === WAAS_SETTINGS_MENU_ITEM,
);

const showWaasOrderModeList = computed(
  () =>
    isWaasModule.value &&
    waasHasProjects.value &&
    waasShellView.value === 'content' &&
    isWaasOrderModeProject(waasSelectedProject.value) &&
    activeModuleMenuItem.value !== null &&
    activeModuleMenuItem.value !== WAAS_SETTINGS_MENU_ITEM &&
    isWaasOrderModeMenuItem(activeModuleMenuItem.value),
);

const showWaasStandardContent = computed(
  () =>
    isWaasModule.value &&
    waasHasProjects.value &&
    waasShellView.value === 'content' &&
    activeModuleMenuItem.value !== null &&
    activeModuleMenuItem.value !== WAAS_SETTINGS_MENU_ITEM &&
    !showWaasOrderModeList.value,
);

const showPaymentEngineSettings = computed(
  () =>
    isPaymentEngineModule.value &&
    activeModuleMenuItem.value === PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
);

const showPaymentEngineContent = computed(
  () =>
    isPaymentEngineModule.value &&
    activeModuleMenuItem.value !== null &&
    activeModuleMenuItem.value !== PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
);

const tasksModuleMenuGroups = useTasksModuleMenuGroups();
const waasModuleMenuGroups = useWaasModuleMenuGroups();
const {
  titleFlotationItems: paymentEngineTitleFlotationItems,
  titleFlotationSelectedIndex: paymentEngineTitleFlotationSelectedIndex,
  selectProjectByFlotationIndex,
} = usePaymentEngineProjectStore();

const moduleMenuGroups = computed(() => {
  if (activeModuleTitle.value === 'Tasks') return tasksModuleMenuGroups.value;
  if (isWaasModule.value) return waasModuleMenuGroups.value;
  return undefined;
});

const moduleMenuRemountKey = computed(() => {
  if (isWaasModule.value) {
    const mode = waasSelectedProject.value?.depositMode ?? 'sub-address';
    return `waas:${mode}`;
  }
  if (isPaymentEngineModule.value) {
    return 'payment-engine';
  }
  return activeModuleTitle.value;
});

watch(
  isWaasModule,
  (active) => {
    if (!active) {
      registerWaasProjectShellApi(null);
      return;
    }
    registerWaasProjectShellApi({
      setProjectsEmpty: (empty) => {
        if (empty) {
          clearWaasProjectsForQa();
          return;
        }
        resetWaasProjectsForDemo();
      },
      activateWaasModule: () => {
        activeNavLabel.value = 'WaaS';
        activeModuleTitle.value = 'WaaS';
      },
      selectProjectById: selectWaasProjectById,
    });
  },
  { immediate: true },
);

watch(activeModuleTitle, (title) => {
  if (title === 'Tasks') {
    activeModuleMenuItem.value = DEFAULT_TASKS_DATA_LIST_MENU_ITEM;
    return;
  }
  if (title === 'Account Settings') {
    activeModuleMenuItem.value = 'Preference';
    return;
  }
  if (title === 'WaaS') {
    activeModuleMenuItem.value = resolveDefaultWaasMenuItem(waasSelectedProject.value);
    syncWaasShellViewFromProjects();
    return;
  }
  if (title === 'Payment Engine') {
    activeModuleMenuItem.value = DEFAULT_PAYMENT_ENGINE_MENU_ITEM;
    return;
  }
  if (title === 'Report') {
    activeModuleMenuItem.value = null;
    return;
  }
  activeModuleMenuItem.value = null;
}, { immediate: true });

watch(
  activeModuleTitle,
  (title) => {
    setMultiSignCollaborationModuleActive(title === 'Tasks');
  },
  { immediate: true },
);

watch(waasSelectedProject, (project, previousProject) => {
  if (!isWaasModule.value || !project) return;

  const previousMode = previousProject?.depositMode ?? 'sub-address';
  const nextMode = project.depositMode;
  const currentItem = activeModuleMenuItem.value;

  if (
    previousMode !== nextMode
    || !isWaasMenuItemValidForProject(currentItem, project)
  ) {
    activeModuleMenuItem.value = resolveDefaultWaasMenuItem(project);
  }
});

function onNavClick(event: MouseEvent) {
  const button = (event.target as HTMLElement | null)?.closest('button');
  if (!button?.closest('.eds-nav-bar')) return;

  const label = button.getAttribute('aria-label') ?? '';
  const navState = resolveNavBarClickState(label, ui);
  if (navState) {
    activeNavLabel.value = navState.navLabel;
    if (navState.moduleTitle) {
      activeModuleTitle.value = navState.moduleTitle;
    }
    return;
  }

  const englishLabel = resolveEnglishUiText(locale.value, label);
  if (englishLabel.trim()) activeNavLabel.value = englishLabel;
}

function onModuleMenuItemSelect(label: string) {
  if (activeModuleTitle.value === 'Tasks') {
    if (isTasksDataListMenuItem(label)) {
      activeModuleMenuItem.value = label as TasksDataListMenuItemLabel;
    }
    return;
  }

  if (activeModuleTitle.value === 'Account Settings') {
    activeModuleMenuItem.value = label;
    return;
  }

  if (isWaasModuleTitle(activeModuleTitle.value) || isPaymentEngineModuleTitle(activeModuleTitle.value)) {
    activeModuleMenuItem.value = label;
  }
}

function onModuleMenuTitleAdd() {
  if (isWaasModuleTitle(activeModuleTitle.value)) {
    openWaasCreateProject();
  }
}

function onModuleMenuTitleFlotationItemSelect(_label: string, index: number) {
  if (isPaymentEngineModuleTitle(activeModuleTitle.value)) {
    selectProjectByFlotationIndex(index);
    return;
  }
  if (isWaasModuleTitle(activeModuleTitle.value)) {
    selectWaasProjectByFlotationIndex(index);
  }
}
</script>

<template>
  <EgLayout type="free">
    <template #nav>
      <div class="app-shell-nav" @click.capture="onNavClick">
        <EgCregisNavBar :translate="ui" />
      </div>
    </template>

    <template v-if="showModuleMenu" #moduleMenu>
      <EgCregisModuleMenu
        :key="moduleMenuRemountKey"
        :title="activeModuleTitle"
        :translate="translateModuleMenu"
        :groups="moduleMenuGroups"
        :title-flotation-items="
          isPaymentEngineModule
            ? paymentEngineTitleFlotationItems
            : isWaasModule
              ? waasTitleFlotationItems
              : undefined
        "
        :title-flotation-selected-index="
          isPaymentEngineModule
            ? paymentEngineTitleFlotationSelectedIndex
            : isWaasModule
              ? waasTitleFlotationSelectedIndex
              : undefined
        "
        @item-select="onModuleMenuItemSelect"
        @title-add="onModuleMenuTitleAdd"
        @title-flotation-item-select="onModuleMenuTitleFlotationItemSelect"
      />
    </template>

    <TasksDataListPage
      v-if="showTasksDataList && activeModuleMenuItem"
      :key="activeModuleMenuItem"
      :toolbar-title="activeModuleMenuItem"
    />
    <PreferencePage v-else-if="showPreferencePage" />

    <template v-else-if="isWaasModule">
      <WaasProjectEmptyPage v-if="showWaasEmpty" />
      <WaasProjectCreatePage v-else-if="showWaasCreate" />
      <WaasProjectSettingsPage v-else-if="showWaasSettings" />
      <WaasOrderModeDataListPage
        v-else-if="showWaasOrderModeList && activeModuleMenuItem"
        :key="`${waasSelectedProject?.id ?? 'default'}:${activeModuleMenuItem}`"
        :menu-item="activeModuleMenuItem"
      />
      <WaasModuleContentPage
        v-else-if="showWaasStandardContent && activeModuleMenuItem"
        :key="`${waasSelectedProject?.id ?? 'default'}:${activeModuleMenuItem}`"
        :menu-item="activeModuleMenuItem"
      />
    </template>

    <template v-else-if="isPaymentEngineModule">
      <PaymentEngineProjectSettingsPage v-if="showPaymentEngineSettings" />
      <PaymentEngineDataListPage
        v-else-if="showPaymentEngineContent && activeModuleMenuItem"
        :key="`${paymentEngineTitleFlotationSelectedIndex}:${activeModuleMenuItem}`"
        :menu-item="activeModuleMenuItem"
      />
    </template>

    <TransactionRecordsDataListPage v-else-if="showReportPage" />

    <div v-else class="app-shell-main">
      <p class="app-shell-main__hint">{{ messages.appShellMainHint }}</p>
    </div>
  </EgLayout>
</template>

<style scoped>
.app-shell-nav {
  display: contents;
}

.app-shell-main {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}

.app-shell-main__hint {
  margin: 0;
  color: var(--text-base-secondary);
  font-size: var(--eds-body-medium-size);
  font-weight: var(--eds-body-medium-weight);
  line-height: var(--eds-body-medium-line-height);
}
</style>
