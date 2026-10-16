<script setup lang="ts">
import { computed } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgIcon,
  EgIconButton,
  EgTooltip,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  TRANSACTION_RECORDS_TIMEZONE_OFFSETS,
  type TransactionRecordsTimezoneOffset,
} from '@/scenes/transaction-records/list-field/transactionRecordsTimezoneOffsets';
import styles from './TeamAccountDisplayTimezoneControl.module.css';

const DISPLAY_TIMEZONE_HINT =
  'The timezone shown below is standardized for all team members and unaffected by personal timezone settings.';

const model = defineModel<TransactionRecordsTimezoneOffset>({
  required: true,
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
  <div :class="styles.root">
    <div :class="styles.caption">
      <span :class="styles.label">{{ ui('Display Time Zone') }}</span>
      <EgTooltip
        :class="styles.hintTooltip"
        trigger="hover"
        placement="bottom"
        align="start"
        width-mode="fixed"
        :width="328"
        height-mode="adaptive"
        boundary-selector=".app-preview"
        close-on-scroll
        :scrollable="false"
        :open-delay="120"
        :close-delay="80"
        :token-scope-class="`desktopTokens eds-overflow-text-tooltip ${styles.hintTooltipPanel}`"
      >
        <EgIconButton
          shape="square"
          size="xs"
          :class="styles.hintButton"
          :label="ui(DISPLAY_TIMEZONE_HINT)"
          @click.stop
        >
          <EgIcon :class="styles.hintIconOutline" name="eds-information" fit />
          <EgIcon :class="styles.hintIconFill" name="eds-information-fill" fit />
        </EgIconButton>
        <template #content>
          {{ ui(DISPLAY_TIMEZONE_HINT) }}
        </template>
      </EgTooltip>
    </div>
    <EgFlotation
      placement="bottom"
      align="start"
      :show-add="false"
      :show-menu-divider="false"
      boundary-selector=".app-preview"
      flip
      close-on-scroll
    >
      <template #trigger="{ expanded }">
        <EgFlotationTrigger
          trigger-style="outline"
          size="sm"
          width-mode="adaptive"
          :label="model"
          :expanded="expanded"
          :aria-label="ui('Display Time Zone')"
        />
      </template>
      <template #content="{ close }">
        <EgFlotationMenu
          :class="['desktopTokens', styles.menu]"
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
  </div>
</template>
