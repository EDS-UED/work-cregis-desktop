<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgIcon,
  EgLayout,
  EgNavBar,
  EgNavBarBottomIcon,
  navBarDefaultBottomUtilities,
} from '@eds/desktop-components';
import CregisModuleMenu from '@/components/CregisModuleMenu.vue';
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
import { getCregisModuleMenuGroups } from '@/presets/module-menu/cregisModuleMenuGroups';
import { cregisNavBarDeclarativeAttrs } from '@/presets/nav/cregisNavBarDeclarative';
import PaymentEnginePage from '@/scenes/payment-engine/PaymentEnginePage.vue';
import {
  DEFAULT_PAYMENT_ENGINE_MENU_ITEM,
  isPaymentEngineMenuItem,
} from '@/scenes/payment-engine/paymentEngineData';
import TasksDataListPage from '@/scenes/tasks/TasksDataListPage.vue';
import { setMultiSignCollaborationModuleActive } from '@/scenes/tasks/signing/multiSignInvitation/multiSignInvitationStore';
import { useTasksModuleMenuGroups } from '@/scenes/tasks/useTasksModuleMenuGroups';
import {
  DEFAULT_TASKS_DATA_LIST_MENU_ITEM,
  isTasksDataListMenuItem,
  type TasksDataListMenuItemLabel,
} from '@/scenes/tasks/tasksDataListPageData';
import TransactionRecordsDataListPage from '@/scenes/transaction-records/TransactionRecordsDataListPage.vue';
import BulkTransferRecordPage from '@/scenes/waas/BulkTransferRecordPage.vue';
import { customerServiceState } from '@/scenes/customer-service/customerServiceState';

const { messages, ui } = useAppI18n();
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

const navBarAttrs = computed(() => ({
  ...cregisNavBarDeclarativeAttrs,
  moduleLabel1: ui('Wallet'),
  moduleLabel2: ui('Tasks'),
  moduleLabel3: ui('WaaS'),
  moduleLabel4: ui('Payment Engine'),
  moduleLabel5: ui('Report'),
  moduleLabel6: ui('Risk Control'),
  moduleLabel7: ui('Manage'),
  moduleLabel8: ui('Marketplace'),
  appEntryLabel1: ui('UniChain'),
  appEntryLabel2: ui('MetaMask'),
}));

const activeModuleTitle = ref<CregisModuleMenuBusinessTitle>(
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
);

const activeNavLabel = ref('Wallet');

const activeModuleMenuItem = ref<string | null>(null);

const showModuleMenu = computed(() => !navLabelShouldHideModuleMenu(activeNavLabel.value));

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
  () => activeModuleTitle.value === 'Manage' && activeModuleMenuItem.value === 'Team Account Balance',
);

const showPaymentEnginePage = computed(
  () =>
    activeModuleTitle.value === 'Payment Engine' &&
    activeModuleMenuItem.value !== null &&
    isPaymentEngineMenuItem(activeModuleMenuItem.value),
);

/** Report has no module menu — open transaction records directly. */
const showReportPage = computed(() => activeModuleTitle.value === 'Report');

const showWaasBulkTransferPage = computed(
  () =>
    activeModuleTitle.value === 'WaaS'
    && activeModuleMenuItem.value === 'Bulk Transfer Record',
);

const tasksModuleMenuGroups = useTasksModuleMenuGroups();

/** When set, module-title watcher applies this item instead of the module default. */
let pendingShellMenuItem: string | null = null;

const moduleMenuGroups = computed(() => {
  if (activeModuleTitle.value === 'Tasks') {
    return tasksModuleMenuGroups.value;
  }
  return getCregisModuleMenuGroups(activeModuleTitle.value);
});

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
    activeModuleMenuItem.value = 'Team Subscription';
    return;
  }
  if (title === 'Payment Engine') {
    activeModuleMenuItem.value = DEFAULT_PAYMENT_ENGINE_MENU_ITEM;
    return;
  }
  if (title === 'WaaS') {
    activeModuleMenuItem.value = 'Order Record';
    return;
  }
  if (title === 'Report') {
    activeModuleMenuItem.value = null;
    return;
  }
  activeModuleMenuItem.value = null;
}, { immediate: true });

watch(
  [activeModuleTitle, activeModuleMenuItem],
  ([title, item]) => {
    setMultiSignCollaborationModuleActive(title === 'Tasks' && item === 'Signing');
  },
  { immediate: true },
);

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
  if (!navState) return;

  activeNavLabel.value = navState.navLabel;
  if (navState.moduleTitle) {
    activeModuleTitle.value = navState.moduleTitle;
  }
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

  if (activeModuleTitle.value === 'Payment Engine') {
    if (isPaymentEngineMenuItem(label)) {
      activeModuleMenuItem.value = label;
    }
    return;
  }

  if (activeModuleTitle.value === 'WaaS') {
    activeModuleMenuItem.value = label;
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

/** EgModuleMenuItem focus is internal (first item default); click syncs highlight to target. */
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
      // Sync NavBar focus; capture handler updates module title, watcher applies pending menu.
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
        <EgNavBar v-bind="navBarAttrs">
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
        </EgNavBar>
      </div>
    </template>

    <template v-if="showModuleMenu" #moduleMenu>
      <CregisModuleMenu
        :title="activeModuleTitle"
        :groups="moduleMenuGroups"
        :focused-label="activeModuleMenuItem"
        @item-select="onModuleMenuItemSelect"
      />
    </template>

    <TasksDataListPage
      v-if="showTasksDataList && activeModuleMenuItem"
      :key="activeModuleMenuItem"
      :toolbar-title="activeModuleMenuItem"
    />
    <PreferencePage v-else-if="showPreferencePage" />
    <TeamAccountPage v-else-if="showTeamAccountPage" />
    <BulkTransferRecordPage v-else-if="showWaasBulkTransferPage" />
    <PaymentEnginePage
      v-else-if="showPaymentEnginePage && activeModuleMenuItem"
      :key="activeModuleMenuItem"
      :menu-item="activeModuleMenuItem"
    />
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
