<script setup lang="ts">
import { computed } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
  EgIconButton,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import dataListStyles from '../../../../../eds-desktop/packages/components/src/organisms/data-list/DataList.module.css';
import {
  TRANSACTION_RECORDS_TIMEZONE_OFFSETS,
  type TransactionRecordsTimezoneOffset,
} from './transactionRecordsTimezoneOffsets';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    align?: 'start' | 'end' | 'center';
    boundarySelector?: string;
  }>(),
  {
    disabled: false,
    align: 'start',
    boundarySelector: '.app-preview',
  },
);

const model = defineModel<TransactionRecordsTimezoneOffset>({
  default: 'UTC+08:00',
});

const { ui } = useAppI18n();

const selectedIndex = computed(() =>
  TRANSACTION_RECORDS_TIMEZONE_OFFSETS.indexOf(model.value),
);

function chooseTimezone(offset: TransactionRecordsTimezoneOffset, close: () => void) {
  model.value = offset;
  close();
}
</script>

<template>
  <EgFlotation
    :class="dataListStyles.sortDropdown"
    placement="bottom"
    :align="align"
    :disabled="disabled"
    :show-add="false"
    :show-menu-divider="false"
    :boundary-selector="boundarySelector"
    flip
    close-on-scroll
  >
    <template #trigger="{ expanded }">
      <EgIconButton
        shape="square"
        size="xs"
        data-no-corner-smoothing
        :label="ui('Timezone')"
        :aria-expanded="expanded"
        :disabled="disabled"
        :class="[
          dataListStyles.sortTrigger,
          expanded && dataListStyles.sortTriggerFocus,
          disabled && dataListStyles.sortTriggerDisabled,
        ]"
      >
        <EgIcon name="eds-arrow-integrated-sort-mini" fit />
      </EgIconButton>
    </template>

    <template #content="{ close }">
      <EgFlotationMenu
        :class="[dataListStyles.sortMenu, 'desktopTokens']"
        data-no-corner-smoothing
        panel-radius="radius-md"
        width-mode="adaptive"
        height-mode="fixed"
        :height="306"
        :scrollable="true"
        list-scroll
        :show-add="false"
        :show-divider="false"
        :selected-index="selectedIndex >= 0 ? selectedIndex : null"
        scroll-selected-to-center
      >
        <EgFlotationMenuItem
          v-for="offset in TRANSACTION_RECORDS_TIMEZONE_OFFSETS"
          :key="offset"
          box-type="text"
          :label="offset"
          :show-tag="false"
          :focused="model === offset"
          @click="chooseTimezone(offset, close)"
        />
      </EgFlotationMenu>
    </template>
  </EgFlotation>
</template>
