<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgCregisModuleMenu, EgCregisNavBar, EgLayout } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import PreferencePage from '@/scenes/account-settings/PreferencePage.vue';
import {
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  navLabelShouldHideModuleMenu,
  resolveNavChromeLabelToModuleMenuTitle,
  type CregisModuleMenuBusinessTitle,
} from '@/presets/module-menu/businessModuleTitles';
import { resolveEnglishUiText } from '@/i18n/translateUiText';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import {
  DEFAULT_PAYMENT_ENGINE_MENU_ITEM,
  DEFAULT_WAAS_MENU_ITEM,
  PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
} from '@/scenes/payment-engine/paymentEngineMenuData';
import {
  isPaymentEngineModuleTitle,
  isWaasModuleTitle,
} from '@/scenes/project/projectModuleTitles';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import TasksDataListPage from '@/scenes/tasks/TasksDataListPage.vue';
import { setMultiSignCollaborationModuleActive } from '@/scenes/tasks/signing/multiSignInvitation/multiSignInvitationStore';
import { useTasksModuleMenuGroups } from '@/scenes/tasks/useTasksModuleMenuGroups';
import {
  DEFAULT_TASKS_DATA_LIST_MENU_ITEM,
  isTasksDataListMenuItem,
  resolveTasksModuleMenuDisplayLabel,
  type TasksDataListMenuItemLabel,
} from '@/scenes/tasks/tasksDataListPageData';
import WaasModuleContentPage from '@/scenes/waas-project/WaasModuleContentPage.vue';
import WaasProjectCreatePage from '@/scenes/waas-project/WaasProjectCreatePage.vue';
import WaasProjectEmptyPage from '@/scenes/waas-project/WaasProjectEmptyPage.vue';
import PaymentEngineProjectSettingsPage from '@/scenes/payment-engine/PaymentEngineProjectSettingsPage.vue';
import WaasProjectSettingsPage from '@/scenes/waas-project/WaasProjectSettingsPage.vue';

const { messages, ui, locale } = useAppI18n();
const {
  hasProjects: waasHasProjects,
  shellView: waasShellView,
  openCreateProject: openWaasCreateProject,
  syncShellViewFromProjects: syncWaasShellViewFromProjects,
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
    activeModuleMenuItem.value === PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
);

const showWaasContent = computed(
  () =>
    isWaasModule.value &&
    waasHasProjects.value &&
    waasShellView.value === 'content' &&
    activeModuleMenuItem.value !== null &&
    activeModuleMenuItem.value !== PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
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
    activeModuleMenuItem.value = DEFAULT_WAAS_MENU_ITEM;
    syncWaasShellViewFromProjects();
    return;
  }
  if (title === 'Payment Engine') {
    activeModuleMenuItem.value = DEFAULT_PAYMENT_ENGINE_MENU_ITEM;
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

function onNavClick(event: MouseEvent) {
  const button = (event.target as HTMLElement | null)?.closest('button');
  if (!button?.closest('.eds-nav-bar')) return;

  const label = button.getAttribute('aria-label') ?? '';
  const englishLabel = resolveEnglishUiText(locale.value, label);
  if (englishLabel.trim()) activeNavLabel.value = englishLabel;

  const title = resolveNavChromeLabelToModuleMenuTitle(englishLabel);
  if (title) activeModuleTitle.value = title;
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
        :title="activeModuleTitle"
        :translate="translateModuleMenu"
        :groups="activeModuleTitle === 'Tasks' ? tasksModuleMenuGroups : undefined"
        @item-select="onModuleMenuItemSelect"
        @title-add="onModuleMenuTitleAdd"
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
      <WaasModuleContentPage
        v-else-if="showWaasContent && activeModuleMenuItem"
        :key="activeModuleMenuItem"
        :menu-item="activeModuleMenuItem"
      />
    </template>

    <template v-else-if="isPaymentEngineModule">
      <PaymentEngineProjectSettingsPage v-if="showPaymentEngineSettings" />
      <PaymentEngineDataListPage
        v-else-if="showPaymentEngineContent && activeModuleMenuItem"
        :key="activeModuleMenuItem"
        :menu-item="activeModuleMenuItem"
      />
    </template>

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
