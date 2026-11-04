<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgButton, EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import ManageRolePermissionSectionHints from '../role/ManageRolePermissionSectionHints.vue';
import permissionStyles from '../role/manageRoleDetailPermission.module.css';
import {
  buildManageMemberDetailSections,
  buildManageMemberPermissionValueSlots,
} from './buildManageMemberDetailSections';
import ManageMemberDetailHeadline from './ManageMemberDetailHeadline.vue';
import ManageMemberPermissionCheckboxValue from './ManageMemberPermissionCheckboxValue.vue';
import { manageMemberOverlayRegistry } from './manageMemberOverlayContext';
import { resolveManageMemberLinkedRoleId } from './memberRecordData';

const props = defineProps<{
  open: boolean;
  row: PaymentEngineRecordRow | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { ui, locale } = useAppI18n();

const openRef = toRef(props, 'open');

const overlaySurface = computed(() => manageMemberOverlayRegistry.value);

const detailShellSuspended = computed(
  () =>
    (overlaySurface.value?.verifyOpen.value ?? false)
    || (overlaySurface.value?.deleteDialogOpen.value ?? false),
);

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: openRef,
  suspended: detailShellSuspended,
  onClosed: () => {
    emit('update:open', false);
  },
});

const detailHostClass = computed(() => [
  detailChromeStyles.detailHost,
  permissionStyles.detailPermissionHost,
  permissionStyles.detailPermissionHostMemberReadonly,
]);

const linkedRoleId = computed(() =>
  props.row ? resolveManageMemberLinkedRoleId(props.row) : '',
);

const sections = computed(() => {
  void locale.value;
  if (!linkedRoleId.value) return [];
  return buildManageMemberDetailSections(linkedRoleId.value, ui);
});

const permissionValueSlots = computed(() => {
  if (!linkedRoleId.value) return [];
  return buildManageMemberPermissionValueSlots(linkedRoleId.value);
});

const detailToolbarPageKey = computed(() =>
  props.row ? `${props.row.id}:member-permissions:view` : 'manage-member-detail',
);

function onDetailClose() {
  popupOpen.value = false;
}

function onToolbarDeleteClick() {
  if (!props.row) return;
  overlaySurface.value?.requestDeleteMember(props.row);
}

/** 成员编辑后续规划；占位按钮，暂不接入 overlay / 权限编辑。 */
function onToolbarEditClick() {
  void props.row;
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div data-manage-member-detail-permission :class="detailHostClass">
      <ManageRolePermissionSectionHints
        :key="`${linkedRoleId}-${locale}`"
        :active="Boolean(row && popupOpen && !detailShellSuspended)"
      />
      <EgDetail
        v-if="row"
        :toolbar-page-key="detailToolbarPageKey"
        headline=""
        :show-eyebrow="false"
        :show-status-tag="false"
        :show-tabs="false"
        :show-toolbar-nav="false"
        :sections="sections"
        :show-toolbar="true"
        toolbar-divider-pinned
        :show-toolbar-note="false"
        toolbar-tone="decor"
        toolbar-direction="right"
        @close="onDetailClose"
      >
        <template #headline-main>
          <ManageMemberDetailHeadline :row="row" />
        </template>

        <template
          v-for="slot in permissionValueSlots"
          :key="slot.key"
          #[`item-value-${slot.key}`]
        >
          <ManageMemberPermissionCheckboxValue :label-key="slot.labelKey" />
        </template>

        <template #toolbar-actions>
          <EgButton
            variant="text"
            tone="danger"
            size="md"
            @click="onToolbarDeleteClick"
          >
            {{ ui('Delete') }}
          </EgButton>
          <EgButton
            variant="solid"
            size="md"
            tone="decor"
            @click="onToolbarEditClick"
          >
            {{ ui('Edit') }}
          </EgButton>
        </template>
      </EgDetail>
    </div>
  </EgDetailPopup>
</template>
