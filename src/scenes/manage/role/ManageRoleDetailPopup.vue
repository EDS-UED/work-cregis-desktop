<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toRef,
  watch,
} from 'vue';
import { EgButton, EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { buildManageRoleDetailSections } from './buildManageRoleDetailSections';
import { MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS } from './manageRolePermissionTabLabelKeys';
import permissionStyles from './manageRoleDetailPermission.module.css';
import ManageRolePermissionAnchorRail from './ManageRolePermissionAnchorRail.vue';
import ManageRolePermissionCheckboxValue from './ManageRolePermissionCheckboxValue.vue';
import { buildManageRolePermissionValueSlots } from './manageRolePermissionValueSlots';

const props = defineProps<{
  open: boolean;
  row: PaymentEngineRecordRow | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { ui, locale } = useAppI18n();

const activeTab = ref(0);
const detailHostRef = ref<HTMLElement | null>(null);
const permissionAnchorMountEl = ref<HTMLElement | null>(null);
const scrollSpyPaused = ref(false);
const TAB_SCROLL_SPY_PAUSE_MS = 600;

let detailScrollEl: HTMLElement | null = null;
let scrollSpyRaf = 0;

watch(
  () => props.row?.id,
  () => {
    activeTab.value = 0;
  },
);

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    detachDetailScrollSpy();
    permissionAnchorMountEl.value = null;
    emit('update:open', false);
  },
});

function syncPermissionAnchorMount() {
  permissionAnchorMountEl.value = resolveDetailScrollEl();
}

const detailTabLabels = computed(() => {
  void locale.value;
  return MANAGE_ROLE_PERMISSION_TAB_LABEL_KEYS.map((key) => ui(key));
});

const sections = computed(() => {
  void locale.value;
  if (!props.row) return [];
  return buildManageRoleDetailSections(props.row.id, ui);
});

const permissionValueSlots = computed(() => {
  void locale.value;
  if (!props.row) return [];
  return buildManageRolePermissionValueSlots(props.row.id, ui);
});

const headline = computed(() => props.row?.ruleName?.trim() ?? '');

const detailToolbarPageKey = computed(() =>
  props.row ? `${props.row.id}:role-permissions` : 'manage-role-detail',
);

function resolveDetailScrollEl(): HTMLElement | null {
  const root = detailHostRef.value?.querySelector('.eds-detail');
  if (!(root instanceof HTMLElement)) return null;

  for (const node of root.querySelectorAll('[class*="scroll"]')) {
    if (!(node instanceof HTMLElement)) continue;
    if (/scrollContent|scrollBody|scrollTop|scrollPage|ScrollViewport/i.test(node.className)) {
      continue;
    }
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
  }

  return null;
}

function resolveStickyHeadlineHeight(host: HTMLElement): number {
  const sticky = host.querySelector('.eds-detail [class*="headlineSticky"]');
  return sticky instanceof HTMLElement ? sticky.getBoundingClientRect().height : 0;
}

function resolveSectionScrollAnchor(host: HTMLElement, section: HTMLElement): HTMLElement {
  const titleRow = section.querySelector('[class*="sectionTitleRow"]');
  return titleRow instanceof HTMLElement ? titleRow : section;
}

function resolveActiveTabFromScroll(): number {
  const scrollEl = detailScrollEl ?? resolveDetailScrollEl();
  const host = detailHostRef.value;
  if (!scrollEl || !host) return activeTab.value;

  const sectionNodes = host.querySelectorAll('[class*="sectionContent"]');
  if (!sectionNodes.length) return 0;

  const anchorY =
    scrollEl.getBoundingClientRect().top + resolveStickyHeadlineHeight(host) + 4;
  let nextIndex = 0;

  sectionNodes.forEach((node, index) => {
    if (!(node instanceof HTMLElement)) return;
    const anchor = resolveSectionScrollAnchor(host, node);
    if (anchor.getBoundingClientRect().top <= anchorY) {
      nextIndex = index;
    }
  });

  return nextIndex;
}

function syncActiveTabFromScroll() {
  if (scrollSpyPaused.value) return;

  const nextIndex = resolveActiveTabFromScroll();
  if (nextIndex === activeTab.value) return;

  scrollSpyPaused.value = true;
  activeTab.value = nextIndex;
  void nextTick(() => {
    scrollSpyPaused.value = false;
  });
}

function onDetailScroll() {
  if (scrollSpyRaf) return;
  scrollSpyRaf = window.requestAnimationFrame(() => {
    scrollSpyRaf = 0;
    syncActiveTabFromScroll();
  });
}

function attachDetailScrollSpy() {
  detachDetailScrollSpy();
  detailScrollEl = resolveDetailScrollEl();
  detailScrollEl?.addEventListener('scroll', onDetailScroll, { passive: true });
}

function detachDetailScrollSpy() {
  if (scrollSpyRaf) {
    window.cancelAnimationFrame(scrollSpyRaf);
    scrollSpyRaf = 0;
  }
  detailScrollEl?.removeEventListener('scroll', onDetailScroll);
  detailScrollEl = null;
}

function scrollDetailToTab(tabIndex: number) {
  const host = detailHostRef.value;
  const scrollEl = detailScrollEl ?? resolveDetailScrollEl();
  if (!host || !scrollEl) return;

  const sectionNodes = host.querySelectorAll('[class*="sectionContent"]');
  const section = sectionNodes.item(tabIndex);
  if (!(section instanceof HTMLElement)) return;

  const anchor = resolveSectionScrollAnchor(host, section);
  const stickyHeight = resolveStickyHeadlineHeight(host);
  const nextScrollTop =
    scrollEl.scrollTop +
    anchor.getBoundingClientRect().top -
    scrollEl.getBoundingClientRect().top -
    stickyHeight;

  scrollSpyPaused.value = true;
  scrollEl.scrollTo({
    top: Math.max(0, nextScrollTop),
    behavior: 'smooth',
  });

  window.setTimeout(() => {
    scrollSpyPaused.value = false;
  }, TAB_SCROLL_SPY_PAUSE_MS);
}

watch(activeTab, async (tabIndex, previousTab) => {
  if (scrollSpyPaused.value || tabIndex === previousTab) return;
  await nextTick();
  scrollDetailToTab(tabIndex);
});

watch(
  () => popupOpen.value && popupMounted.value,
  async (shouldAttach) => {
    if (!shouldAttach) {
      detachDetailScrollSpy();
      return;
    }
    activeTab.value = 0;
    await nextTick();
    syncPermissionAnchorMount();
    attachDetailScrollSpy();
    syncActiveTabFromScroll();
  },
);

watch(sections, () => {
  void nextTick(() => {
    syncPermissionAnchorMount();
  });
});

onBeforeUnmount(() => {
  detachDetailScrollSpy();
});

function onPermissionAnchorSelect(tabIndex: number) {
  activeTab.value = tabIndex;
}

function onDetailClose() {
  popupOpen.value = false;
}

function onToolbarDelete() {
  popupOpen.value = false;
}

function onToolbarSavePermissions() {
  popupOpen.value = false;
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div
      ref="detailHostRef"
      :class="[
        detailChromeStyles.detailHost,
        permissionStyles.detailPermissionHost,
      ]"
    >
      <EgDetail
          v-if="row"
          :toolbar-page-key="detailToolbarPageKey"
          :headline="headline"
          :show-eyebrow="false"
          :show-status-tag="false"
          :show-tabs="false"
          :sections="sections"
          :show-toolbar="true"
          toolbar-divider-pinned
          :show-toolbar-nav="false"
          :show-toolbar-note="false"
          toolbar-tone="decor"
          toolbar-direction="right"
          @close="onDetailClose"
        >
        <template
          v-for="slot in permissionValueSlots"
          :key="slot.key"
          #[`item-value-${slot.key}`]
        >
          <ManageRolePermissionCheckboxValue
            :label="slot.label"
            :enabled="slot.enabled"
          />
        </template>

        <template #toolbar-actions>
          <EgButton
            variant="text"
            tone="danger"
            size="md"
            @click="onToolbarDelete"
          >
            {{ ui('Delete') }}
          </EgButton>
          <EgButton
            variant="solid"
            size="md"
            tone="decor"
            @click="onToolbarSavePermissions"
          >
            {{ ui('Edit Permissions') }}
          </EgButton>
        </template>
      </EgDetail>
      <Teleport v-if="permissionAnchorMountEl && row" :to="permissionAnchorMountEl">
        <ManageRolePermissionAnchorRail
          :item-labels="detailTabLabels"
          :active-index="activeTab"
          @select="onPermissionAnchorSelect"
        />
      </Teleport>
    </div>
  </EgDetailPopup>
</template>
