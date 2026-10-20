<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgCregisModuleMenu,
  EgCregisNavBar,
  EgIcon,
  EgLayout,
  EgNavBarBottomIcon,
  navBarDefaultBottomUtilities,
} from '@eds/desktop-components';
import TeamWorkspaceSwitcher from '@/components/TeamWorkspaceSwitcher.vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { useAppShellNavigation } from '@/composables/useAppShellNavigation';
import PreferencePage from '@/scenes/account-settings/PreferencePage.vue';
import TeamAccountPage from '@/scenes/manage/team-account/TeamAccountPage.vue';
import {
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  navLabelShouldHideModuleMenu,
  resolveNavBarClickState,
  type CregisModuleMenuBusinessTitle,
} from '@/presets/module-menu/businessModuleTitles';
import { resolveEnglishUiText } from '@/i18n/translateUiText';
import { customerServiceState } from '@/scenes/customer-service/customerServiceState';
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
import WaasProjectShell from '@/scenes/waas-project/WaasProjectShell.vue';
import {
  isWaasMenuBranchOnlyItem,
  isWaasMenuItemValidForProject,
  resolveDefaultWaasMenuItem,
} from '@/scenes/waas-project/waasMenuData';
import { useWaasModuleMenuGroups } from '@/scenes/waas-project/useWaasModuleMenuGroups';
import PaymentEngineProjectSettingsPage from '@/scenes/payment-engine/PaymentEngineProjectSettingsPage.vue';
import RiskControlAmlQueryPage from '@/scenes/risk-control/RiskControlAmlQueryPage.vue';
import RiskControlDataListPage from '@/scenes/risk-control/RiskControlDataListPage.vue';
import {
  DEFAULT_RISK_CONTROL_MENU_ITEM,
  isRiskControlAmlQueryMenuItem,
  isRiskControlDataListMenuItem,
  isRiskControlModuleMenuItem,
} from '@/scenes/risk-control/riskControlMenuData';

const { messages, ui, locale } = useAppI18n();
const { state: shellNavState } = useAppShellNavigation();

const navBarBottomUtilities = computed(() =>
  navBarDefaultBottomUtilities.map((utility) => {
    if (utility.label !== 'Earphone') return utility;
    return {
      ...utility,
      icon: 'eds-question',
      focusIcon: 'eds-question',
    };
  }),
);

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

/** When set, module-title watcher applies this item instead of the module default. */
let pendingShellMenuItem: string | null = null;

const isWaasModule = computed(() => isWaasModuleTitle(activeModuleTitle.value));
const isPaymentEngineModule = computed(() => isPaymentEngineModuleTitle(activeModuleTitle.value));
const isRiskControlModule = computed(() => activeModuleTitle.value === 'Risk Control');
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

const showTeamAccountPage = computed(
  () =>
    activeModuleTitle.value === 'Manage' && activeModuleMenuItem.value === 'Team Account Balance',
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

const showRiskControlAmlQueryPage = computed(
  () =>
    isRiskControlModule.value &&
    activeModuleMenuItem.value !== null &&
    isRiskControlAmlQueryMenuItem(activeModuleMenuItem.value),
);

const showRiskControlDataList = computed(
  () =>
    isRiskControlModule.value &&
    activeModuleMenuItem.value !== null &&
    isRiskControlDataListMenuItem(activeModuleMenuItem.value),
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
  if (pendingShellMenuItem != null) {
    activeModuleMenuItem.value = pendingShellMenuItem;
    pendingShellMenuItem = null;
    return;
  }
  if (title === 'Tasks') {
    activeModuleMenuItem.value = DEFAULT_TASKS_DATA_LIST_MENU_ITEM;
    return;
  }
  if (title === 'Account Settings') {
    activeModuleMenuItem.value = 'Preference';
    return;
  }
  if (title === 'Manage') {
    activeModuleMenuItem.value = 'Team Account Balance';
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
  if (title === 'Risk Control') {
    activeModuleMenuItem.value = DEFAULT_RISK_CONTROL_MENU_ITEM;
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

function isCustomerServiceNavLabel(label: string) {
  const trimmed = label.trim();
  return trimmed === 'Earphone' || trimmed === ui('Earphone');
}

function onNavClick(event: MouseEvent) {
  const button = (event.target as HTMLElement | null)?.closest('button');
  if (!button?.closest('.eds-nav-bar')) return;

  const label = button.getAttribute('aria-label') ?? '';
  if (isCustomerServiceNavLabel(label)) {
    customerServiceState.open = !customerServiceState.open;
    return;
  }

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

watch(
  [activeModuleTitle, activeModuleMenuItem],
  ([title, item]) => {
    customerServiceState.locationTitle = title;
    customerServiceState.locationItem = item;
  },
  { immediate: true },
);

watch(
  () => customerServiceState.open,
  async (open) => {
    if (open) return;
    await nextTick();
    requestAnimationFrame(() => {
      const button = findNavBarButton(activeNavLabel.value);
      if (button && button.getAttribute('aria-pressed') !== 'true') {
        button.click();
      }
    });
  },
);

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

  if (activeModuleTitle.value === 'Manage') {
    activeModuleMenuItem.value = label;
    return;
  }

  if (isWaasModuleTitle(activeModuleTitle.value)) {
    if (isWaasMenuBranchOnlyItem(label)) return;
    activeModuleMenuItem.value = label;
    return;
  }

  if (isPaymentEngineModuleTitle(activeModuleTitle.value)) {
    activeModuleMenuItem.value = label;
    return;
  }

  if (activeModuleTitle.value === 'Risk Control') {
    if (isRiskControlModuleMenuItem(label)) {
      activeModuleMenuItem.value = label;
    }
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

function findNavBarButton(navLabel: string): HTMLButtonElement | null {
  const nav = document.querySelector('.eds-nav-bar');
  if (!nav) return null;
  const translated = ui(navLabel);
  for (const button of nav.querySelectorAll('button[aria-label]')) {
    const label = button.getAttribute('aria-label') ?? '';
    if (label === navLabel || label === translated) {
      return button as HTMLButtonElement;
    }
  }
  return null;
}

function syncModuleMenuItemFocus(menuItem: string) {
  const translated = ui(menuItem);
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    'button.eds-module-menu-item',
  )) {
    const text = button.textContent?.trim() ?? '';
    if (text !== menuItem && text !== translated) continue;
    if (button.getAttribute('aria-pressed') === 'true') return;
    button.click();
    return;
  }
}

watch(
  () => shellNavState.requestId,
  async () => {
    const target = shellNavState.target;
    if (!target) return;

    const navLabel = target.navLabel ?? target.moduleTitle;
    pendingShellMenuItem = target.menuItem;
    activeNavLabel.value = navLabel;

    await nextTick();
    const navButton = findNavBarButton(navLabel);
    const navAlreadyFocused = navButton?.getAttribute('aria-pressed') === 'true';

    if (navButton && !navAlreadyFocused) {
      navButton.click();
    } else if (activeModuleTitle.value !== target.moduleTitle) {
      activeModuleTitle.value = target.moduleTitle;
    } else {
      activeModuleMenuItem.value = target.menuItem;
      pendingShellMenuItem = null;
    }

    await nextTick();
    if (pendingShellMenuItem != null) {
      activeModuleMenuItem.value = pendingShellMenuItem;
      pendingShellMenuItem = null;
    }
    await nextTick();
    syncModuleMenuItemFocus(target.menuItem);
  },
);
</script>

<template>
  <EgLayout type="free">
    <template #nav>
      <div class="app-shell-nav" @click.capture="onNavClick">
        <EgCregisNavBar :translate="ui">
          <template #corporation>
            <TeamWorkspaceSwitcher />
          </template>
          <template #utilities>
            <EgNavBarBottomIcon
              v-for="(utility, index) in navBarBottomUtilities"
              :key="`nav-utility-${index}`"
              :label="utility.label"
            >
              <EgIcon :name="utility.icon" size="sm" fit />
              <template #focusIcon>
                <EgIcon :name="utility.focusIcon" size="sm" fit />
              </template>
            </EgNavBarBottomIcon>
          </template>
        </EgCregisNavBar>
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
    <TeamAccountPage v-else-if="showTeamAccountPage" />

    <WaasProjectShell
      v-else-if="isWaasModule"
      :menu-item="activeModuleMenuItem"
    />

    <template v-else-if="isPaymentEngineModule">
      <PaymentEngineProjectSettingsPage v-if="showPaymentEngineSettings" />
      <PaymentEngineDataListPage
        v-else-if="showPaymentEngineContent && activeModuleMenuItem"
        :key="`${paymentEngineTitleFlotationSelectedIndex}:${activeModuleMenuItem}`"
        :menu-item="activeModuleMenuItem"
      />
    </template>

    <TransactionRecordsDataListPage v-else-if="showReportPage" />

    <RiskControlAmlQueryPage v-else-if="showRiskControlAmlQueryPage" />

    <RiskControlDataListPage
      v-else-if="showRiskControlDataList && activeModuleMenuItem"
      :key="activeModuleMenuItem"
      :menu-item="activeModuleMenuItem"
    />

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
