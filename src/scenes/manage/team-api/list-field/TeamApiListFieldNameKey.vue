<script setup lang="ts">
import { computed } from 'vue';
import {
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgTag,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import titleStyles from '@/scenes/payment-engine/list-field/PaymentEngineListField.shared.module.css';
import styles from './TeamApiListFieldNameKey.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const apiName = computed(
  () => props.row.ruleName?.trim() || props.row.id,
);
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="titleStyles.callbackEventTitleRow">
        <EgListFieldOverflowText
          :text="apiName"
          variant="primary"
        />
        <EgTag
          v-if="row.teamApiAuthType"
          size="sm"
          family="system"
          system-type="gray"
          truncate
        >
          {{ row.teamApiAuthType }}
        </EgTag>
      </div>
      <EgListFieldHashLikeLine
        :text="row.teamApiKeyMasked ?? row.teamApiKeyFull ?? row.id"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
