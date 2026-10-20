<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgIcon,
  EgIconButtonPro,
  EgLayout,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationItem,
  EgTag,
  EgToolBar,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import {
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
} from '@/scenes/tasks/tasksDataListPageData';
import { useDataListPaginer } from '@/scenes/tasks/useDataListPaginer';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import {
  BULK_TRANSFER_RECORD_ROWS,
  bulkTransferStatusKind,
  type BulkTransferRecordRow,
} from './bulkTransferRecordData';
import styles from './BulkTransferRecordPage.module.css';

const DATA_LIST_COLUMN_HEIGHT = 66;
const { ui } = useAppI18n();

const {
  settingsLevelIndex,
  settingsJumpValue,
  currentPage,
  totalRowCount,
  paginateItems,
  isManyPagination,
  manyPageItems,
  firstPagination,
  prevPagination,
  pagePagination,
  nextPagination,
  lastPagination,
  prevNavDisabled,
  nextNavDisabled,
  goFirstPage,
  goPrevPage,
  goNextPage,
  goLastPage,
  onManyPageItemClick,
  isManyPageSelected,
  onSettingsJump,
} = useDataListPaginer(() => BULK_TRANSFER_RECORD_ROWS.length);

const dataList = computed<DataListItem[]>(() =>
  paginateItems(BULK_TRANSFER_RECORD_ROWS).map((row) => ({ ...row })),
);

function asRow(data: DataListItem): BulkTransferRecordRow {
  return data as unknown as BulkTransferRecordRow;
}

function truncateAddress(address: string): string {
  if (address.length <= 28) return address;
  return `${address.slice(0, 26)}...`;
}
</script>

<template>
  <EgLayout type="empty" show-toolbar show-paginer>
    <template #toolbar>
      <EgToolBar :title="ui('Bulk Transfer Record')" show-divider>
        <template #functional>
          <EgIconButtonPro :label="ui('Refresh')">
            <EgIcon name="eds-arrow-refresh" size="sm" />
          </EgIconButtonPro>
          <EgIconButtonPro :label="ui('Filter')">
            <EgIcon name="eds-filter" size="sm" />
          </EgIconButtonPro>
          <EgIconButtonPro :label="ui('Export')">
            <EgIcon name="eds-arrow-download" size="sm" />
          </EgIconButtonPro>
        </template>
      </EgToolBar>
    </template>

    <div :class="styles.listRegion">
      <EgDataList
        :data-list="dataList"
        :header-height="DATA_LIST_FIGMA_HEADER_HEIGHT"
        :column-height="DATA_LIST_COLUMN_HEIGHT"
        :loading="false"
        :initing="false"
        :empty-text="ui('No matching records')"
      >
        <EgDataListColumn prop="token" :label="ui('Token')" min-width="280px" :sortable="false">
          <template #header>
            <div :class="styles.comboHeader">
              <div :class="styles.comboHeaderSegment">
                <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                  {{ ui('Token') }}
                </EgDataListCellOverflow>
              </div>
              <EgDivider type="navigator" direction="vertical" />
              <div :class="styles.comboHeaderSegment">
                <EgDataListCellOverflow :content-class="styles.comboHeaderSegmentText" context="header">
                  {{ ui('Address') }}
                </EgDataListCellOverflow>
              </div>
            </div>
          </template>
          <template #default="{ data }">
            <div :class="styles.tokenCell">
              <span :class="styles.tokenIcon">
                <EgCrypto
                  :name="resolveCryptoNameFromSymbol(asRow(data).token) ?? 'eds-usdt-tether'"
                  fit
                  :label="asRow(data).token"
                />
              </span>
              <div :class="styles.tokenBody">
                <div :class="styles.comboPrimary">
                  <EgListFieldOverflowText :text="asRow(data).token" size="medium" />
                  <EgTag size="sm" system-type="stroke-subtle">
                    {{ asRow(data).networkTag }}
                  </EgTag>
                </div>
                <span :class="styles.comboSecondary">
                  <EgListFieldOverflowText
                    :text="truncateAddress(asRow(data).address)"
                    variant="secondary"
                  />
                </span>
              </div>
            </div>
          </template>
        </EgDataListColumn>

        <EgDataListColumn prop="status" :label="ui('Status')" min-width="140px" :sortable="false">
          <template #default="{ data }">
            <EgTag family="status" :status="bulkTransferStatusKind(asRow(data).status)" size="lg">
              {{ ui(asRow(data).status) }}
            </EgTag>
          </template>
        </EgDataListColumn>

        <EgDataListColumn
          prop="amount"
          :label="ui('Amount')"
          min-width="120px"
          align="right"
          :sortable="false"
        >
          <template #default="{ data }">
            <EgListFieldOverflowText :text="asRow(data).amount" size="medium" tabular />
          </template>
        </EgDataListColumn>
      </EgDataList>
    </div>

    <template #paginer>
      <EgPaginer
        v-model:settings-level-index="settingsLevelIndex"
        v-model:settings-jump-value="settingsJumpValue"
        :show-statistics="false"
        :data-volume-total="ui('Total')"
        :data-volume-count="formatGroupedNumber(totalRowCount)"
        :data-volume-results="ui('Results')"
        :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
        :settings-level-label="ui('Items Per Page')"
        :settings-jump-label="ui('Go to Page')"
        :settings-jump-placeholder="ui('Please Enter')"
        @settings-jump="onSettingsJump"
      >
        <EgPaginationItem
          :kind="firstPagination.kind"
          :tone="firstPagination.tone"
          :disabled="prevNavDisabled || firstPagination.disabled"
          @click="goFirstPage"
        >
          <EgIcon name="eds-arrow-go-first" fit />
        </EgPaginationItem>
        <EgPaginationItem
          :kind="prevPagination.kind"
          :tone="prevPagination.tone"
          :disabled="prevNavDisabled || prevPagination.disabled"
          @click="goPrevPage"
        >
          <EgIcon name="eds-arrow-left-mini-ios" fit />
        </EgPaginationItem>
        <template v-if="!isManyPagination">
          <EgPaginationItem
            :kind="pagePagination.kind"
            :tone="pagePagination.tone"
            selected
            :disabled="pagePagination.disabled"
            :label="String(currentPage)"
          />
        </template>
        <template v-else>
          <EgPaginationItem
            v-for="(item, index) in manyPageItems"
            :key="`${item.kind}-${item.label}-${index}`"
            :kind="pagePagination.kind"
            :tone="pagePagination.tone"
            :interactive="item.kind !== 'ellipsis'"
            :selected="isManyPageSelected(item, index)"
            :disabled="pagePagination.disabled"
            :label="item.label"
            @click="onManyPageItemClick(item)"
          />
        </template>
        <EgPaginationItem
          :kind="nextPagination.kind"
          :tone="nextPagination.tone"
          :disabled="nextNavDisabled || nextPagination.disabled"
          @click="goNextPage"
        >
          <EgIcon name="eds-arrow-right-mini-ios" fit />
        </EgPaginationItem>
        <EgPaginationItem
          :kind="lastPagination.kind"
          :tone="lastPagination.tone"
          :disabled="nextNavDisabled || lastPagination.disabled"
          @click="goLastPage"
        >
          <EgIcon name="eds-arrow-go-last" fit />
        </EgPaginationItem>
      </EgPaginer>
    </template>
  </EgLayout>
</template>
