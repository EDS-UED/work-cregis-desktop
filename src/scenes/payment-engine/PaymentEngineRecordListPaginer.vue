<script setup lang="ts">
import {
  EgIcon,
  EgPaginer,
  EgPaginationGroupButton,
  type PaginerStatisticsItem,
  type PaginationItemKind,
  type PaginationItemTone,
} from '@eds/desktop-components';
import type { PaginerManyPageItem } from '@/scenes/tasks/paginerManyPagination';

type PaginerButton = {
  kind: PaginationItemKind;
  tone: PaginationItemTone;
  disabled?: boolean;
  label?: string;
};

defineProps<{
  settingsLevelIndex: number;
  settingsJumpValue: string;
  showStatistics: boolean;
  statisticsItems: PaginerStatisticsItem[];
  dataVolumeTotal: string;
  dataVolumeCount: string;
  dataVolumeResults: string;
  settingsLevelLabels: string[];
  settingsLevelLabel: string;
  settingsJumpLabel: string;
  settingsJumpPlaceholder: string;
  firstPagination: PaginerButton;
  prevPagination: PaginerButton;
  pagePagination: PaginerButton;
  nextPagination: PaginerButton;
  lastPagination: PaginerButton;
  prevNavDisabled: boolean;
  nextNavDisabled: boolean;
  isManyPagination: boolean;
  manyPageItems: PaginerManyPageItem[];
  currentPage: number;
  isManyPageSelected: (item: PaginerManyPageItem, index: number) => boolean;
}>();

const emit = defineEmits<{
  'update:settingsLevelIndex': [value: number];
  'update:settingsJumpValue': [value: string];
  'settings-jump': [value: string];
  'go-first': [];
  'go-prev': [];
  'go-next': [];
  'go-last': [];
  'many-page-item-click': [item: PaginerManyPageItem];
}>();
</script>

<template>
  <EgPaginer
    :settings-level-index="settingsLevelIndex"
    :settings-jump-value="settingsJumpValue"
    :show-statistics="showStatistics"
    :statistics-items="statisticsItems"
    :data-volume-total="dataVolumeTotal"
    :data-volume-count="dataVolumeCount"
    :data-volume-results="dataVolumeResults"
    :settings-level-labels="settingsLevelLabels"
    :settings-level-label="settingsLevelLabel"
    :settings-jump-label="settingsJumpLabel"
    :settings-jump-placeholder="settingsJumpPlaceholder"
    @update:settings-level-index="emit('update:settingsLevelIndex', $event)"
    @update:settings-jump-value="emit('update:settingsJumpValue', $event)"
    @settings-jump="emit('settings-jump', $event)"
  >
    <EgPaginationGroupButton
      :kind="firstPagination.kind"
      :tone="firstPagination.tone"
      :disabled="prevNavDisabled || firstPagination.disabled"
      @click="emit('go-first')"
    >
      <EgIcon name="eds-arrow-go-first" fit />
    </EgPaginationGroupButton>
    <EgPaginationGroupButton
      :kind="prevPagination.kind"
      :tone="prevPagination.tone"
      :disabled="prevNavDisabled || prevPagination.disabled"
      @click="emit('go-prev')"
    >
      <EgIcon name="eds-arrow-left-mini-ios" fit />
    </EgPaginationGroupButton>
    <template v-if="!isManyPagination">
      <EgPaginationGroupButton
        :kind="pagePagination.kind"
        :tone="pagePagination.tone"
        selected
        :disabled="pagePagination.disabled"
        :label="String(currentPage)"
      />
    </template>
    <template v-else>
      <EgPaginationGroupButton
        v-for="(item, index) in manyPageItems"
        :key="`${item.kind}-${item.label}-${index}`"
        :kind="pagePagination.kind"
        :tone="pagePagination.tone"
        :interactive="item.kind !== 'ellipsis'"
        :selected="isManyPageSelected(item, index)"
        :disabled="pagePagination.disabled"
        :label="item.label"
        @click="emit('many-page-item-click', item)"
      />
    </template>
    <EgPaginationGroupButton
      :kind="nextPagination.kind"
      :tone="nextPagination.tone"
      :disabled="nextNavDisabled || nextPagination.disabled"
      @click="emit('go-next')"
    >
      <EgIcon name="eds-arrow-right-mini-ios" fit />
    </EgPaginationGroupButton>
    <EgPaginationGroupButton
      :kind="lastPagination.kind"
      :tone="lastPagination.tone"
      :disabled="nextNavDisabled || lastPagination.disabled"
      @click="emit('go-last')"
    >
      <EgIcon name="eds-arrow-go-last" fit />
    </EgPaginationGroupButton>
  </EgPaginer>
</template>
