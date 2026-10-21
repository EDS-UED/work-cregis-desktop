<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, toRef, watch } from 'vue';
import {
  EgButton,
  EgConfirmPopover,
  EgDetail,
  EgDetailPopup,
  EgIcon,
  EgIconButton,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { buildManageRoleDetailSections } from './buildManageRoleDetailSections';
import { manageRoleOverlayRegistry } from './manageRoleOverlayContext';
import { useManageRolePermissionEditState } from './manageRolePermissionEditState';
import {
  MANAGE_ROLE_UNSAVED_EXIT_AT_CLOSE,
  MANAGE_ROLE_UNSAVED_EXIT_AT_TOOLBAR,
} from './manageRoleUnsavedExitConfirm';
import permissionStyles from './manageRoleDetailPermission.module.css';
import listActionStyles from './list-field/RoleListFieldActions.module.css';
import ManageRolePermissionSectionHints from './ManageRolePermissionSectionHints.vue';
import ManageRolePermissionCheckboxValue from './ManageRolePermissionCheckboxValue.vue';
import { buildManageRolePermissionValueSlots } from './manageRolePermissionValueSlots';

const props = withDefaults(
  defineProps<{
    open: boolean;
    row: PaymentEngineRecordRow | null;
    initialEnterEdit?: boolean;
    enterEditNonce?: number;
  }>(),
  {
    initialEnterEdit: false,
    enterEditNonce: 0,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'consume-initial-enter-edit': [];
}>();

const { ui, locale } = useAppI18n();

const rowRef = toRef(props, 'row');
const openRef = toRef(props, 'open');

const overlaySurface = computed(() => manageRoleOverlayRegistry.value);

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

const {
  permissionsEditing,
  permissionStates,
  isPermissionDraftDirty,
  setPermissionEnabled,
  enterPermissionEdit,
  commitPermissionDraft,
  leavePermissionEditWithoutSave,
} = useManageRolePermissionEditState(rowRef, openRef);

const showUnsavedExitGuard = computed(
  () => permissionsEditing.value && isPermissionDraftDirty.value,
);

const unsavedExitConfirmMessage = computed(() => ui('Role permission unsaved exit confirm message'));

const detailHostClass = computed(() => [
  detailChromeStyles.detailHost,
  permissionStyles.detailPermissionHost,
  showUnsavedExitGuard.value && permissionStyles.detailPermissionHostUnsavedExit,
]);

onMounted(() => {
  overlaySurface.value?.setSavePermissionsVerifiedHandler(() => {
    commitPermissionDraft();
  });
});

onBeforeUnmount(() => {
  overlaySurface.value?.setSavePermissionsVerifiedHandler(null);
});

function tryEnterEditFromFlowTrigger() {
  if (!openRef.value || !props.row) return;
  enterPermissionEdit();
}

watch(
  () => props.initialEnterEdit,
  (shouldEnter) => {
    if (!shouldEnter) return;
    tryEnterEditFromFlowTrigger();
    emit('consume-initial-enter-edit');
  },
);

watch(
  () => props.enterEditNonce,
  () => {
    tryEnterEditFromFlowTrigger();
  },
);

watch(popupOpen, (open) => {
  if (open && props.initialEnterEdit) {
    tryEnterEditFromFlowTrigger();
    emit('consume-initial-enter-edit');
  }
});

const sections = computed(() => {
  void locale.value;
  if (!props.row) return [];
  return buildManageRoleDetailSections(props.row.id, ui);
});

const permissionValueSlots = computed(() => {
  if (!props.row) return [];
  return buildManageRolePermissionValueSlots(props.row.id);
});

const headline = computed(() => props.row?.ruleName?.trim() ?? '');

const detailToolbarPageKey = computed(() => {
  const suffix = permissionsEditing.value ? 'edit' : 'view';
  return props.row ? `${props.row.id}:role-permissions:${suffix}` : 'manage-role-detail';
});

function onDetailClose() {
  if (showUnsavedExitGuard.value) return;
  if (permissionsEditing.value) {
    leavePermissionEditWithoutSave();
  }
  popupOpen.value = false;
}

function onConfirmDiscardAndCloseDetail() {
  leavePermissionEditWithoutSave();
  popupOpen.value = false;
}

function onConfirmDiscardAndLeaveEdit() {
  leavePermissionEditWithoutSave();
}

function onToolbarDeleteClick() {
  if (!props.row) return;
  overlaySurface.value?.requestDeleteRole(props.row);
}

function onToolbarEditPermissions() {
  if (!props.row) return;
  enterPermissionEdit();
}

function onToolbarCancelEdit() {
  if (permissionsEditing.value && !isPermissionDraftDirty.value) {
    leavePermissionEditWithoutSave();
  }
}

function onToolbarConfirmSave() {
  overlaySurface.value?.requestVerify('save-permissions');
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div data-manage-role-detail-permission :class="detailHostClass">
      <ManageRolePermissionSectionHints
        :key="`${row?.id ?? 'none'}-${locale}`"
        :active="Boolean(row && popupOpen && !permissionsEditing && !detailShellSuspended)"
      />
      <div
        v-if="showUnsavedExitGuard"
        :class="permissionStyles.detailCloseConfirmHost"
      >
        <EgConfirmPopover
          v-bind="MANAGE_ROLE_UNSAVED_EXIT_AT_CLOSE"
          :title="ui('Warm reminder')"
          :message="unsavedExitConfirmMessage"
          :confirm-label="ui('Confirm')"
          :close-label="ui('Close')"
          confirm-tone="danger"
          @confirm="onConfirmDiscardAndCloseDetail"
        >
          <template #trigger="{ onClick, active }">
            <span
              :class="[
                permissionStyles.detailCloseConfirmTrigger,
                active && permissionStyles.detailCloseConfirmTriggerActive,
              ]"
            >
              <EgIconButton
                shape="square"
                size="md"
                :label="ui('Close')"
                motion="asym"
                :aria-expanded="active"
                @click.stop="onClick"
              >
                <EgIcon name="eds-close-circle-fill" fit />
              </EgIconButton>
            </span>
          </template>
        </EgConfirmPopover>
      </div>
      <EgDetail
        v-if="row"
        :toolbar-page-key="detailToolbarPageKey"
        :headline="headline"
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
        <template
          v-for="slot in permissionValueSlots"
          :key="slot.key"
          #[`item-value-${slot.key}`]
        >
          <ManageRolePermissionCheckboxValue
            :label-key="slot.labelKey"
            :enabled="permissionStates[slot.key] ?? slot.enabled"
            :editable="permissionsEditing"
            @update:enabled="setPermissionEnabled(slot.key, $event)"
          />
        </template>

        <template #toolbar-actions>
          <template v-if="permissionsEditing">
            <EgConfirmPopover
              v-if="showUnsavedExitGuard"
              v-bind="MANAGE_ROLE_UNSAVED_EXIT_AT_TOOLBAR"
              :title="ui('Warm reminder')"
              :message="unsavedExitConfirmMessage"
              :confirm-label="ui('Confirm')"
              :close-label="ui('Close')"
              confirm-tone="danger"
              @confirm="onConfirmDiscardAndLeaveEdit"
            >
              <template #trigger="{ onClick, active }">
                <EgButton
                  variant="text"
                  tone="subtle"
                  size="md"
                  :active="active"
                  :aria-expanded="active"
                  @click="onClick"
                >
                  {{ ui('Cancel') }}
                </EgButton>
              </template>
            </EgConfirmPopover>
            <EgButton
              v-else
              variant="text"
              tone="subtle"
              size="md"
              @click="onToolbarCancelEdit"
            >
              {{ ui('Cancel') }}
            </EgButton>
            <EgButton
              variant="solid"
              size="md"
              tone="decor"
              @click="onToolbarConfirmSave"
            >
              {{ ui('Confirm') }}
            </EgButton>
          </template>
          <template v-else>
            <EgButton
              variant="text"
              tone="subtle"
              size="md"
              :class="listActionStyles.deleteButton"
              @click="onToolbarDeleteClick"
            >
              {{ ui('Delete') }}
            </EgButton>
            <EgButton
              variant="solid"
              size="md"
              tone="decor"
              @click="onToolbarEditPermissions"
            >
              {{ ui('Edit Permissions') }}
            </EgButton>
          </template>
        </template>
      </EgDetail>
    </div>
  </EgDetailPopup>
</template>
