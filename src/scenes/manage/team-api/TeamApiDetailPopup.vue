<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { manageTeamApiOverlayRegistry } from './manageTeamApiOverlayContext';
import {
  buildTeamApiDetailSections,
  resolveTeamApiDetailHeadlineStatus,
} from './buildTeamApiDetailSections';

const props = defineProps<{
  open: boolean;
  row: PaymentEngineRecordRow | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { ui, locale } = useAppI18n();

const overlaySurface = computed(() => manageTeamApiOverlayRegistry.value);

const detailShellSuspended = computed(
  () =>
    (overlaySurface.value?.verifyOpen.value ?? false)
    || (overlaySurface.value?.deleteDialogOpen.value ?? false)
    || (overlaySurface.value?.statusToggleDialogOpen.value ?? false)
    || (overlaySurface.value?.keyDialogOpen.value ?? false),
);

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  suspended: detailShellSuspended,
  onClosed: () => {
    emit('update:open', false);
  },
});

const sections = computed(() => {
  void locale.value;
  if (!props.row) return [];
  return buildTeamApiDetailSections(props.row, ui);
});

const headline = computed(() => props.row?.ruleName?.trim() ?? '');

const headlineStatus = computed(() => {
  if (!props.row) return null;
  return resolveTeamApiDetailHeadlineStatus(props.row, ui);
});

const detailToolbarPageKey = computed(() => props.row?.id ?? 'team-api-detail');

function onDetailClose() {
  popupOpen.value = false;
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div :class="detailChromeStyles.detailHost">
      <EgDetail
        v-if="row"
        :toolbar-page-key="detailToolbarPageKey"
        :headline="headline"
        :show-eyebrow="false"
        :show-status-tag="Boolean(headlineStatus)"
        :status-tag="headlineStatus?.label ?? ''"
        status-tag-size="lg"
        :status-tag-status="headlineStatus?.status ?? 'success'"
        :show-tabs="false"
        :sections="sections"
        :show-toolbar="false"
        :value-copy-label="ui('Copy')"
        @close="onDetailClose"
      />
    </div>
  </EgDetailPopup>
</template>
