<script setup lang="ts">
import { computed, watch } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import type { TeamApiConfigRecord } from './teamApiMockData';
import insetStyles from '@/scenes/manage/webhook/WebhookKeyRevealCreatedBody.module.css';
import styles from '@/scenes/manage/webhook/WebhookKeyRevealViewKeyBody.module.css';

const props = defineProps<{
  record: TeamApiConfigRecord | null;
  active: boolean;
}>();

const { ui } = useAppI18n();
const { copied: keyCopied, copyValue: copyKeyValue } = useCopyableValue();

const COPY_BOUNDARY = '.app-preview';

watch(
  () => props.active,
  (active) => {
    if (!active) keyCopied.value = false;
  },
  { immediate: true },
);

function copyIcon(copied: boolean) {
  return copied ? 'eds-enable-fill' : 'eds-copy';
}

async function onCopyKey(event?: MouseEvent) {
  const key = props.record?.apiKeyFull?.trim() ?? '';
  if (!key) return;
  await copyKeyValue(key, event);
}

function onCopyRowKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  void onCopyKey();
}

const displayKey = computed(() => props.record?.apiKeyFull ?? '');
</script>

<template>
  <div :class="insetStyles.composeBodyInset">
  <div
    :class="[styles.row, styles.rowCopyable]"
    role="button"
    tabindex="0"
    data-project-settings-copy=""
    @click="onCopyKey"
    @keydown="onCopyRowKeydown"
  >
    <div :class="styles.keyStack">
      <span :class="styles.keyLabel">{{ ui('API Key') }}</span>
      <div :class="styles.keyValueLine">
        <div :class="styles.keyValue">
          <EgListFieldOverflowText
            :text="displayKey"
            variant="primary"
            tabular
            :boundary-selector="COPY_BOUNDARY"
          />
        </div>
        <span :class="styles.rowActions" @click.stop>
          <span :class="[styles.rowAction, keyCopied && styles.rowActionCopied]">
            <DetailValueActionIcon
              :label="ui('Copy')"
              :icon="copyIcon(keyCopied)"
              :boundary-selector="COPY_BOUNDARY"
              tooltip-align="end"
              @click="onCopyKey"
            />
          </span>
        </span>
      </div>
    </div>
  </div>
  </div>
</template>
