<script setup lang="ts">
import { computed } from 'vue';
import {
  EgComboInputItem,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  type FlotationMenuItemPreset,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  formatMonthlyExportPeriodLabel,
  INVOICE_HEADER_KYB_COMPANY,
  INVOICE_HEADER_TEAM_COMPANY,
  listMonthlyExportMonthOptions,
  listMonthlyExportYears,
  parseMonthlyExportPeriodLabel,
  type StatementHeader,
  type StatementLang,
} from './teamAccountData';
import styles from './TeamAccountMonthlyExportFields.module.css';

const PERIOD_MENU_WIDTH = 168;
const MONTH_MENU_WIDTH = 140;

const period = defineModel<string>('period', { required: true });
const language = defineModel<StatementLang>('language', { required: true });
const header = defineModel<StatementHeader>('header', { required: true });

const props = defineProps<{
  languageItems: FlotationMenuItemPreset[];
}>();

const { ui } = useAppI18n();

const periodYears = computed(() => listMonthlyExportYears());

const selectedPeriod = computed(() => parseMonthlyExportPeriodLabel(period.value));

const langMenuItems = computed(() =>
  props.languageItems.map((item) => ({
    ...item,
    focused: item.label === language.value,
  })),
);

const headerTriggerLabel = computed(() =>
  header.value === 'kyb' ? ui('Use KYB Name') : ui('Use Team Name'),
);

function monthsForYear(year: number) {
  return listMonthlyExportMonthOptions(year);
}

function isYearSelected(year: number) {
  return selectedPeriod.value?.year === year;
}

function isMonthSelected(year: number, monthIndex: number) {
  return (
    selectedPeriod.value?.year === year && selectedPeriod.value.monthIndex === monthIndex
  );
}

function onPeriodMonthClick(
  year: number,
  monthIndex: number,
  closeYears: () => void,
  closeMonths: () => void,
) {
  period.value = formatMonthlyExportPeriodLabel(year, monthIndex);
  closeMonths();
  closeYears();
}

function onLanguageClick(item: FlotationMenuItemPreset) {
  if (item.label === 'English' || item.label === '简体中文' || item.label === '繁體中文') {
    language.value = item.label;
  }
}

function onHeaderClick(next: StatementHeader, close: () => void) {
  header.value = next;
  close();
}
</script>

<template>
  <div :class="styles.fields">
    <EgComboInputItem :label="ui('Month')">
      <EgFlotation
        trigger="click"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        boundary-selector=".app-preview"
        flip
        close-on-scroll
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="outline"
            size="md"
            width-mode="adaptive"
            :label="period"
            :expanded="expanded"
          />
        </template>
        <template #content="{ close: closeYears }">
          <EgFlotationMenu
            :class="['desktopTokens', styles.periodMenu]"
            data-no-corner-smoothing
            panel-flush
            panel-radius="radius-md"
            width-mode="fixed"
            :width="PERIOD_MENU_WIDTH"
            height-mode="adaptive"
            :scrollable="false"
            :show-add="false"
            :show-divider="false"
          >
            <div
              v-for="year in periodYears"
              :key="year"
              :class="styles.yearRowWrap"
            >
              <EgFlotation
                :class="styles.yearFlotation"
                placement="right"
                align="start"
                trigger="click"
                width-mode="fixed"
                :width="MONTH_MENU_WIDTH"
                :show-add="false"
                :show-menu-divider="false"
                boundary-selector=".app-preview"
                flip
                close-on-scroll
              >
                <template #trigger="{ expanded }">
                  <div :class="styles.yearRow" data-eds-trigger-metrics>
                    <EgFlotationMenuItem
                      host-tag="div"
                      box-type="text"
                      :label="String(year)"
                      :show-tag="false"
                      show-cascader
                      :focused="expanded || isYearSelected(year)"
                    />
                  </div>
                </template>
                <template #content="{ close: closeMonths }">
                  <EgFlotationMenu
                    :class="['desktopTokens', styles.monthMenu]"
                    data-no-corner-smoothing
                    panel-flush
                    panel-radius="radius-md"
                    width-mode="fixed"
                    :width="MONTH_MENU_WIDTH"
                    height-mode="adaptive"
                    :max-height="280"
                    list-scroll
                    :scrollable="true"
                    :show-add="false"
                    :show-divider="false"
                  >
                    <EgFlotationMenuItem
                      v-for="month in monthsForYear(year)"
                      :key="`${year}-${month.monthIndex}`"
                      box-type="text"
                      :label="month.shortLabel"
                      :show-tag="false"
                      :focused="isMonthSelected(year, month.monthIndex)"
                      @click="onPeriodMonthClick(year, month.monthIndex, closeYears, closeMonths)"
                    />
                  </EgFlotationMenu>
                </template>
              </EgFlotation>
            </div>
          </EgFlotationMenu>
        </template>
      </EgFlotation>
    </EgComboInputItem>
    <EgComboInputItem :label="ui('Statement Language')">
      <EgFlotation
        trigger="click"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        :items="langMenuItems"
        boundary-selector=".app-preview"
        flip
        close-on-scroll
        @item-click="onLanguageClick"
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="outline"
            size="md"
            width-mode="adaptive"
            :label="language"
            :expanded="expanded"
          />
        </template>
      </EgFlotation>
    </EgComboInputItem>
    <EgComboInputItem :label="ui('Invoice Header')">
      <EgFlotation
        trigger="click"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        boundary-selector=".app-preview"
        flip
        close-on-scroll
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="outline"
            size="md"
            width-mode="adaptive"
            :label="headerTriggerLabel"
            :expanded="expanded"
          />
        </template>
        <template #content="{ close }">
          <EgFlotationMenu
            :class="['desktopTokens', styles.headerMenu]"
            data-no-corner-smoothing
            panel-radius="radius-md"
            width-mode="adaptive"
            height-mode="adaptive"
            :scrollable="false"
            :show-add="false"
            :show-divider="false"
          >
            <EgFlotationMenuItem
              box-type="text"
              label-wrap
              :show-tag="false"
              :focused="header === 'team'"
              @click="onHeaderClick('team', close)"
            >
              <span :class="styles.headerCopy">
                <span>{{ ui('Use Team Name') }}</span>
                <span :class="styles.headerNote">({{ INVOICE_HEADER_TEAM_COMPANY }})</span>
              </span>
            </EgFlotationMenuItem>
            <EgFlotationMenuItem
              box-type="text"
              label-wrap
              :show-tag="false"
              :focused="header === 'kyb'"
              @click="onHeaderClick('kyb', close)"
            >
              <span :class="styles.headerCopy">
                <span>{{ ui('Use KYB Name') }}</span>
                <span :class="styles.headerNote">({{ INVOICE_HEADER_KYB_COMPANY }})</span>
              </span>
            </EgFlotationMenuItem>
          </EgFlotationMenu>
        </template>
      </EgFlotation>
    </EgComboInputItem>
  </div>
</template>
