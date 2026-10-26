<script setup lang="ts">
import { computed, watch } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import type { WebhookConfigRecord } from './webhookMockData';
import styles from './WebhookKeyRevealViewKeyBody.module.css';

const props = defineProps<{
  record: WebhookConfigRecord | null;
  active: boolean;
}>();

const { ui } = useAppI18n();
const { copied: secretCopied, copyValue: copySecretValue } = useCopyableValue();

const COPY_BOUNDARY = '.app-preview';

watch(
  () => props.active,
  (active) => {
    if (!active) secretCopied.value = false;
  },
  { immediate: true },
);

function copyIcon(copied: boolean) {
  return copied ? 'eds-enable-fill' : 'eds-copy';
}

async function onCopySecret(event?: MouseEvent) {
  const key = props.record?.secretKey?.trim() ?? '';
  if (!key) return;
  await copySecretValue(key, event);
}

function onCopyRowKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  void onCopySecret();
}

const displaySecret = computed(() => props.record?.secretKey ?? '');
</script>

<template>
  <div
    :class="[styles.row, styles.rowCopyable]"
    role="button"
    tabindex="0"
    data-project-settings-copy=""
    @click="onCopySecret"
    @keydown="onCopyRowKeydown"
  >
    <div :class="styles.keyStack">
      <span :class="styles.keyLabel">{{ ui('Webhook Key') }}</span>
      <div :class="styles.keyValueLine">
        <div :class="styles.keyValue">
          <EgListFieldOverflowText
            :text="displaySecret"
            variant="primary"
            tabular
            :boundary-selector="COPY_BOUNDARY"
          />
        </div>
        <span :class="styles.rowActions" @click.stop>
          <span :class="[styles.rowAction, secretCopied && styles.rowActionCopied]">
            <DetailValueActionIcon
              :label="ui('Copy')"
              :icon="copyIcon(secretCopied)"
              :boundary-selector="COPY_BOUNDARY"
              tooltip-align="end"
              @click="onCopySecret"
            />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>