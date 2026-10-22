<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCryptoAddressTags,
  EgListFieldOverflowText,
  type CryptoAddressSideTags,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveRiskControlAmlQueryRecordDetail } from '@/scenes/risk-control/riskControlAmlQueryRecordDetailData';
import generalStyles from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.module.css';
import styles from './RiskControlListFieldAmlEntityAndTags.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const detail = computed(() => resolveRiskControlAmlQueryRecordDetail(props.row));
const entityLabel = computed(() => detail.value.belongingEntity);
const entityTagsForList = computed((): CryptoAddressSideTags => ({
  custom: detail.value.entityTags.map((tag) => ({
    label: tag.label,
    family: 'custom',
    customStyle: tag.customStyle,
    size: 'sm',
  })),
}));
</script>

<template>
  <div
    class="desktopTokens list-field-general-structure"
    :class="[generalStyles.host, styles.host]"
  >
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="styles.entityRow">
        <EgListFieldOverflowText
          :text="entityLabel"
          variant="primary"
        />
      </div>
      <div v-if="detail.entityTags.length" :class="styles.tagsRow">
        <EgCryptoAddressTags
          :tags="entityTagsForList"
          :default-show-more="false"
        />
      </div>
    </span>
  </div>
</template>
