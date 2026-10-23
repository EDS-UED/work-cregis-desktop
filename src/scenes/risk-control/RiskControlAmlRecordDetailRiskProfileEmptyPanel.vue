<script setup lang="ts">
import { EgDataList, EgDataListColumn } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import {
  AML_EMBEDDED_DATA_LIST_COLUMN_HEIGHT,
  AML_EMBEDDED_DATA_LIST_EMPTY_BODY_HEIGHT,
} from './riskControlAmlEmbeddedDataListLayout';
import emptyListStyles from './RiskControlAmlRecordDetailDataListEmpty.module.css';
import styles from './RiskControlAmlRecordDetailRiskProfileEmptyPanel.module.css';

const { ui } = useAppI18n();

const listHeightPx = AML_EMBEDDED_DATA_LIST_EMPTY_BODY_HEIGHT;
</script>

<template>
  <section :class="[detailChromeStyles.sectionContent, styles.section]">
    <div
      :class="[
        batchStyles.batchDetailDataList,
        batchStyles.batchDetailDataListSized,
        emptyListStyles.listWrap,
        emptyListStyles.listWrapEmpty,
        styles.listShell,
      ]"
      :style="{ height: `${listHeightPx}px` }"
    >
      <EgDataList
        :data-list="[]"
        :empty-text="ui('No data')"
        :header-height="0"
        :column-height="AML_EMBEDDED_DATA_LIST_COLUMN_HEIGHT"
      >
        <EgDataListColumn
          prop="placeholder"
          label=""
          min-width="240px"
          align="left"
          :sortable="false"
        />
      </EgDataList>
    </div>
  </section>
</template>
