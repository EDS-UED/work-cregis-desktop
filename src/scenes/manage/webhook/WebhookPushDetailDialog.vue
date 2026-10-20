<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgButton, EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import DetailToolbarSlot from '@/scenes/tasks/shared/DetailToolbarSlot.vue';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import {
  buildWebhookPushDetailSections,
  resolveWebhookPushDetailHeadlineStatus,
  webhookPushDetailShowsRequestContent,
} from './buildWebhookPushDetailSections';
import WebhookPushRequestContentAppend from './WebhookPushRequestContentAppend.vue';

const props = defineProps<{
  open: boolean;
  row: PaymentEngineRecordRow | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  repush: [];
}>();

const { ui, locale } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

const sections = computed(() => {
  void locale.value;
  if (!props.row) return [];
  return buildWebhookPushDetailSections(props.row, ui);
});

const headline = computed(() => props.row?.ruleName?.trim() ?? '');

const headlineStatus = computed(() => {
  if (!props.row) return null;
  return resolveWebhookPushDetailHeadlineStatus(props.row, ui);
});

const showRepush = computed(() => props.row?.webhookPushStatusKey === 'failed');

const showRequestContent = computed(() =>
  props.row ? webhookPushDetailShowsRequestContent(props.row) : false,
);

const requestContentPayload = computed(() => props.row?.webhookPushPayloadJson?.trim() ?? '');

const detailToolbarPageKey = computed(() => props.row?.id ?? 'webhook-push-detail');

function onDetailClose() {
  popupOpen.value = false;
}

function onRepushClick() {
  emit('repush');
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
      >
        <template v-if="showRequestContent" #append>
          <WebhookPushRequestContentAppend :payload-json="requestContentPayload" />
        </template>
        <template v-if="showRepush" #toolbar>
          <DetailToolbarSlot :show-toolbar-nav="false" toolbar-divider-pinned>
            <template #actions>
              <EgButton variant="solid" tone="decor" size="md" @click="onRepushClick">
                {{ ui('Repush') }}
              </EgButton>
            </template>
          </DetailToolbarSlot>
        </template>
      </EgDetail>
    </div>
  </EgDetailPopup>
</template>
