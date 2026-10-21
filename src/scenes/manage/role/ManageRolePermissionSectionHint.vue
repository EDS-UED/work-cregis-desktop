<script setup lang="ts">
import { EgLinkButton } from '@eds/desktop-components';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import permissionStyles from './manageRoleDetailPermission.module.css';
import styles from './ManageRolePermissionSectionHint.module.css';

const TITLE_GROUP_ATTR = 'data-manage-role-permission-section-title-group';

const props = defineProps<{
  active: boolean;
  sectionIndex: number;
  leadCatalogKey: string;
  linkCatalogKey: string;
}>();

const { ui } = useAppI18n();
const teleportTarget = ref<HTMLElement | null>(null);
let titleGroupEl: HTMLElement | null = null;

function unwrapTitleGroup() {
  if (!titleGroupEl?.isConnected) {
    titleGroupEl = null;
    return;
  }

  const titleRow = titleGroupEl.parentElement;
  const titleSpan = titleGroupEl.querySelector('[class*="sectionTitle"]');
  if (titleRow instanceof HTMLElement && titleSpan instanceof HTMLElement) {
    titleRow.insertBefore(titleSpan, titleGroupEl);
  }
  titleGroupEl.remove();
  titleGroupEl = null;
}

function clearTarget() {
  teleportTarget.value = null;
  unwrapTitleGroup();
}

function ensureTitleGroup(titleRow: HTMLElement): HTMLElement | null {
  const titleSpan = titleRow.querySelector(':scope > [class*="sectionTitle"]');
  if (!(titleSpan instanceof HTMLElement)) return null;

  const groupSelector = `[${TITLE_GROUP_ATTR}="${props.sectionIndex}"]`;
  const existing = titleRow.querySelector(groupSelector);
  if (existing instanceof HTMLElement) {
    return existing;
  }

  const group = document.createElement('div');
  group.setAttribute(TITLE_GROUP_ATTR, String(props.sectionIndex));
  group.classList.add(permissionStyles.permissionSectionTitleGroup);
  titleRow.insertBefore(group, titleSpan);
  group.appendChild(titleSpan);
  return group;
}

async function syncTarget() {
  clearTarget();
  if (!props.active) return;

  await nextTick();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  const host = document.querySelector('[data-manage-role-detail-permission]');
  const sectionContents = host?.querySelectorAll(
    '.eds-detail [class*="sections"] > [class*="sectionContent"]',
  );
  const section = sectionContents?.[props.sectionIndex];
  const titleRow = section?.querySelector('[class*="sectionTitleRow"]');
  if (!(titleRow instanceof HTMLElement)) return;

  const group = ensureTitleGroup(titleRow);
  if (!group) return;

  titleGroupEl = group;
  teleportTarget.value = group;
}

watch(
  () => [props.active, props.sectionIndex] as const,
  () => {
    void syncTarget();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearTarget();
});
</script>

<template>
  <Teleport v-if="teleportTarget" :to="teleportTarget">
    <p
      :class="styles.hint"
      :data-manage-role-permission-section-hint="sectionIndex"
    >
      <span :class="styles.hintLead">{{ ui(leadCatalogKey) }}</span>
      <EgLinkButton size="sm" tone="brand" href="#">
        {{ ui(linkCatalogKey) }}
      </EgLinkButton>
    </p>
  </Teleport>
</template>
