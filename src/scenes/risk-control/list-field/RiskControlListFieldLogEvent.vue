<script setup lang="ts">
import { computed } from 'vue';
import { EgAvatar, EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveLogsRecordOperatorAvatarColorSeed } from '@/scenes/risk-control/filter/buildLogsRecordOperatorFilterOptions';
import generalStyles from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.module.css';
import styles from './RiskControlListFieldLogEvent.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const operatorName = computed(
  () => props.row.logOperatorName?.trim() || props.row.id,
);
const actionLabel = computed(() => ui(props.row.logActionKey ?? 'created Policy'));
const strategyName = computed(
  () => props.row.logStrategyName?.trim() || props.row.ruleName?.trim() || '',
);
const avatarColorSeed = computed(
  () => resolveLogsRecordOperatorAvatarColorSeed(operatorName.value) || operatorName.value,
);
</script>

<template>
  <div
    class="desktopTokens list-field-general-structure"
    :class="[generalStyles.host, styles.host]"
  >
    <div :class="generalStyles.titleRow">
      <EgAvatar
        size="sm"
        :name="operatorName"
        :color-seed="avatarColorSeed"
        :class="generalStyles.avatar"
      />
      <div :class="generalStyles.titleTextSlot">
        <div :class="styles.primaryInlineRow">
          <EgListFieldOverflowText
            :text="operatorName"
            variant="primary"
            :class="styles.operatorNameSegment"
          />
          <EgListFieldOverflowText
            :text="actionLabel"
            variant="secondary"
            :class="styles.actionText"
          />
          <EgListFieldOverflowText
            v-if="strategyName"
            :text="strategyName"
            variant="primary"
            :class="styles.strategyNameSegment"
          />
        </div>
      </div>
    </div>
  </div>
</template>
