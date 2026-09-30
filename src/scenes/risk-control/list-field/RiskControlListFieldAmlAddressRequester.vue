<script setup lang="ts">
import { computed } from 'vue';
import {
  EgAvatar,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgTag,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import generalStyles from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.module.css';
import styles from './RiskControlListFieldAmlAddressRequester.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const targetValue = computed(
  () => props.row.amlTargetValue ?? props.row.walletToAddress ?? props.row.id,
);
const networkLabel = computed(() => props.row.amlNetworkLabel?.trim() ?? '');
const triggerModeLabel = computed(() => ui(props.row.amlTriggerModeKey ?? 'Manual'));
const requesterName = computed(
  () => props.row.amlRequesterName?.trim() || props.row.id,
);
const avatarColorSeed = computed(() => `risk-aml-${requesterName.value}`);
</script>

<template>
  <div
    class="desktopTokens list-field-general-structure"
    :class="[generalStyles.host, styles.host]"
  >
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="styles.titleRow">
        <EgListFieldHashLikeLine
          :text="targetValue"
          variant="primary"
          tooltip-trigger="hover"
          :copy-on-row-hover="false"
        />
        <EgTag
          v-if="networkLabel"
          family="system"
          system-type="stroke-subtle"
          size="sm"
          truncate
        >
          {{ networkLabel }}
        </EgTag>
        <EgTag family="system" system-type="gray" size="sm" truncate>
          {{ triggerModeLabel }}
        </EgTag>
      </div>
      <div :class="styles.requesterRow">
        <EgAvatar
          size="xs"
          :name="requesterName"
          :color-seed="avatarColorSeed"
          :class="generalStyles.avatar"
        />
        <EgListFieldOverflowText
          :text="requesterName"
          variant="secondary"
        />
      </div>
    </span>
  </div>
</template>
