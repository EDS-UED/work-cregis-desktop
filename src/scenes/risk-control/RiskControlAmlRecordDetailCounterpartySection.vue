<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import type { RiskControlAmlCounterpartyRow } from './riskControlAmlRecordDetailTypes';
import RiskControlAmlRecordDetailCounterpartyTable from './RiskControlAmlRecordDetailCounterpartyTable.vue';
import styles from './RiskControlAmlRecordDetailQueryResultPanel.module.css';
import sectionStyles from './RiskControlAmlRecordDetailCounterpartySection.module.css';

const props = defineProps<{
  rows: RiskControlAmlCounterpartyRow[];
}>();

const { ui } = useAppI18n();

const displayRows = ref<RiskControlAmlCounterpartyRow[]>([]);

const allRows = computed(() => props.rows);

function onPaginatedChange(rows: RiskControlAmlCounterpartyRow[]) {
  displayRows.value = rows;
}
</script>

<template>
  <section :class="detailChromeStyles.sectionContent">
    <div :class="styles.sectionBody">
      <div :class="styles.handlingIntro">
        <h3
          :class="[
            'typography-body-small-strong',
            detailChromeStyles.sectionTitle,
            styles.handlingSectionTitle,
          ]"
        >
          {{ ui('AML counterparty risk title') }}
        </h3>
        <p :class="styles.handlingLead">
          {{ ui('AML counterparty risk hint') }}
        </p>
      </div>
      <div :class="[styles.tableWrap, sectionStyles.tableRegion]">
        <RiskControlAmlRecordDetailCounterpartyTable :rows="displayRows" />
        <div :class="sectionStyles.paginer">
          <SigningBatchDataListPaginerBar
            :items="allRows"
            @paginated-change="onPaginatedChange"
          />
        </div>
      </div>
    </div>
  </section>
</template>
