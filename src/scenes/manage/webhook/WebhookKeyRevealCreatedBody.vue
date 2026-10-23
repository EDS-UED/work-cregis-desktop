<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import { WEBHOOK_MOCK_TEAM_ID, type WebhookConfigRecord } from './webhookMockData';
import styles from './WebhookKeyRevealCreatedBody.module.css';

const props = defineProps<{
  record: WebhookConfigRecord | null;
  active: boolean;
}>();

const { ui } = useAppI18n();
const secretVisible = ref(false);
const { copied: endpointCopied, copyValue: copyEndpointValue } = useCopyableValue();
const { copied: teamCopied, copyValue: copyTeamValue } = useCopyableValue();
const { copied: secretCopied, copyValue: copySecretValue } = useCopyableValue();

const COPY_BOUNDARY = '.app-preview';

function resetCopyFeedback() {
  endpointCopied.value = false;
  teamCopied.value = false;
  secretCopied.value = false;
}

watch(
  () => props.active,
  (active) => {
    if (!active) {
      secretVisible.value = false;
      resetCopyFeedback();
    }
  },
  { immediate: true },
);

function copyIcon(copied: boolean) {
  return copied ? 'eds-enable-fill' : 'eds-copy';
}

async function onCopyEndpoint(event?: MouseEvent) {
  const url = props.record?.endpointUrl?.trim() ?? '';
  if (!url) return;
  await copyEndpointValue(url, event);
}

async function onCopyTeam(event?: MouseEvent) {
  await copyTeamValue(WEBHOOK_MOCK_TEAM_ID, event);
}

async function onCopySecret(event?: MouseEvent) {
  const key = props.record?.secretKey?.trim() ?? '';
  if (!key) return;
  await copySecretValue(key, event);
}

function onCopyRowKeydown(
  event: KeyboardEvent,
  copyHandler: (event?: MouseEvent) => void | Promise<void>,
) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  void copyHandler();
}

const maskedSecret = computed(() => {
  const key = props.record?.secretKey ?? '';
  if (secretVisible.value) return key;
  if (key.length <= 6) return '*'.repeat(key.length);
  return `${key.slice(0, 6)}${'*'.repeat(Math.max(0, key.length - 6))}`;
});

const secretToggleIcon = computed(() =>
  secretVisible.value ? 'eds-uneye' : 'eds-eye',
);
</script>

<template>
  <div :class="styles.composeBodyInset">
    <div :class="styles.body">
      <div
        :class="[styles.row, styles.rowCopyable]"
        role="button"
        tabindex="0"
        data-project-settings-copy=""
        @click="onCopyEndpoint"
        @keydown="(event) => onCopyRowKeydown(event, onCopyEndpoint)"
      >
        <span :class="styles.rowLabel">{{ ui('Endpoint URL') }}</span>
        <div :class="styles.valueRow">
          <div :class="styles.rowValue">
            <EgListFieldOverflowText
              :text="record?.endpointUrl ?? ''"
              variant="primary"
            />
          </div>
          <span :class="styles.rowActions" @click.stop>
            <span :class="[styles.rowAction, endpointCopied && styles.rowActionCopied]">
              <DetailValueActionIcon
                :label="ui('Copy')"
                :icon="copyIcon(endpointCopied)"
                :boundary-selector="COPY_BOUNDARY"
                tooltip-align="end"
                @click="onCopyEndpoint"
              />
            </span>
          </span>
        </div>
      </div>
      <div
        :class="[styles.row, styles.rowCopyable]"
        role="button"
        tabindex="0"
        data-project-settings-copy=""
        @click="onCopyTeam"
        @keydown="(event) => onCopyRowKeydown(event, onCopyTeam)"
      >
        <span :class="styles.rowLabel">{{ ui('Team ID') }}</span>
        <div :class="styles.valueRow">
          <div :class="styles.rowValue">
            <EgListFieldOverflowText
              :text="WEBHOOK_MOCK_TEAM_ID"
              variant="primary"
              tabular
            />
          </div>
          <span :class="styles.rowActions" @click.stop>
            <span :class="[styles.rowAction, teamCopied && styles.rowActionCopied]">
              <DetailValueActionIcon
                :label="ui('Copy')"
                :icon="copyIcon(teamCopied)"
                :boundary-selector="COPY_BOUNDARY"
                tooltip-align="end"
                @click="onCopyTeam"
              />
            </span>
          </span>
        </div>
      </div>
      <div
        :class="[styles.row, styles.rowCopyable]"
        role="button"
        tabindex="0"
        data-project-settings-copy=""
        @click="onCopySecret"
        @keydown="(event) => onCopyRowKeydown(event, onCopySecret)"
      >
        <span :class="styles.rowLabel">{{ ui('Secret Key') }}</span>
        <div :class="styles.valueRow">
          <div :class="styles.rowValue">
            <EgListFieldOverflowText :text="maskedSecret" variant="primary" tabular />
          </div>
          <span :class="styles.rowActions" @click.stop>
            <span :class="styles.rowAction">
              <DetailValueActionIcon
                :label="ui('View')"
                :icon="secretToggleIcon"
                :boundary-selector="COPY_BOUNDARY"
                tooltip-align="end"
                @click.stop="secretVisible = !secretVisible"
              />
            </span>
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
      <p :class="styles.pushMechanismNote">
        {{ ui('Webhook push mechanism note') }}
      </p>
    </div>
  </div>
</template>
