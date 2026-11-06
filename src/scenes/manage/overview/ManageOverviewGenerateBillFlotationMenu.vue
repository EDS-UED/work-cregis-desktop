<script setup lang="ts">
import {
  EgButton,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgIcon,
  EgIconButton,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { computed, ref, watch } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import {
  OVERVIEW_BILL_GENERATION_RECORDS,
  OVERVIEW_BILL_HEADER_OPTIONS,
  OVERVIEW_BILL_LANGUAGE_OPTIONS,
  OVERVIEW_BILL_MONTH_OPTIONS,
} from './manageOverviewGenerateBillData';
import {
  OVERVIEW_GENERATE_BILL_FLOTATION_MAX_HEIGHT,
  OVERVIEW_GENERATE_BILL_FLOTATION_WIDTH,
} from './manageOverviewGenerateBill.constants';
import styles from './ManageOverviewGenerateBillFlotationMenu.module.css';
import '@/styles/flotation-inner-backdrop.css';
import '@/scenes/tasks/signing/batch/batchSigning.networkPickerMenu.css';

const { ui } = useAppI18n();

const selectedMonthId = ref(OVERVIEW_BILL_MONTH_OPTIONS[0]?.id ?? '');
const selectedLanguageId = ref(OVERVIEW_BILL_LANGUAGE_OPTIONS[0]?.id ?? '');
const selectedHeaderId = ref(OVERVIEW_BILL_HEADER_OPTIONS[0]?.id ?? '');

const selectedMonthLabel = computed(
  () =>
    OVERVIEW_BILL_MONTH_OPTIONS.find((item) => item.id === selectedMonthId.value)
      ?.label ?? '',
);

const selectedLanguageLabel = computed(
  () =>
    OVERVIEW_BILL_LANGUAGE_OPTIONS.find((item) => item.id === selectedLanguageId.value)
      ?.label ?? '',
);

const selectedHeaderLabel = computed(() => {
  const option = OVERVIEW_BILL_HEADER_OPTIONS.find(
    (item) => item.id === selectedHeaderId.value,
  );
  return option ? ui(option.labelKey) : '';
});

const pickerShellStyle = {
  width: `${OVERVIEW_GENERATE_BILL_FLOTATION_WIDTH}px`,
  minWidth: `${OVERVIEW_GENERATE_BILL_FLOTATION_WIDTH}px`,
  height: `${OVERVIEW_GENERATE_BILL_FLOTATION_MAX_HEIGHT}px`,
  maxHeight: `${OVERVIEW_GENERATE_BILL_FLOTATION_MAX_HEIGHT}px`,
};

const scrollRef = ref<HTMLElement | null>(null);
const rowsRef = ref<HTMLElement | null>(null);

const { canScroll, topScrim, bottomScrim, update } = useScrollChromeScrim(scrollRef, {
  contentRef: rowsRef,
});

watch(
  () => OVERVIEW_BILL_GENERATION_RECORDS.length,
  () => {
    update();
  },
);

function onGenerateClick() {
  // Mock：仅演示入口；落库 / 下载由后续接入。
}
</script>

<template>
  <div
    class="networkPickerRoot desktopTokens effect-flotation-box motion-flotation eds-flotation-inner-backdrop"
    :style="pickerShellStyle"
  >
    <div class="networkPickerRows">
      <header class="networkPickerHeader">
        <div class="networkPickerHeaderContent">
          <p :class="batchStyles.batchSectionTitle">
            {{ ui('Overview Generate Bill') }}
          </p>
        </div>
      </header>

      <EgDivider
        v-if="canScroll"
        type="module"
        direction="horizontal"
        :class="[
          comboActionStyles.divider,
          comboActionStyles.dividerAnimated,
          !topScrim && comboActionStyles.dividerAnimatedHidden,
          'networkPickerHeaderDivider',
        ]"
        :hide="!topScrim"
      />

      <div
        ref="scrollRef"
        class="networkPickerListScroll"
        :class="{ networkPickerListScrollFadeBottom: bottomScrim }"
      >
        <div ref="rowsRef">
        <div :class="styles.formBlock">
          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Overview Bill Month Field') }}</span>
            <EgFlotation
              :class="styles.scopeFlotationHost"
              placement="bottom"
              align="start"
              width-mode="trigger"
              :show-add="false"
              :show-menu-divider="false"
              :close-on-scroll="false"
              flip
            >
              <template #trigger="{ expanded }">
                <EgFlotationTrigger
                  :class="styles.flotationTrigger"
                  trigger-style="subtle"
                  size="md"
                  width-mode="adaptive"
                  :label="selectedMonthLabel"
                  :expanded="expanded"
                />
              </template>
              <template #content="{ menuWidth, menuWidthMode, close }">
                <EgFlotationMenu
                  panel-radius="radius-md"
                  :width-mode="menuWidthMode"
                  :width="menuWidth"
                  height-mode="adaptive"
                  :show-add="false"
                  :show-divider="false"
                >
                  <EgFlotationMenuItem
                    v-for="option in OVERVIEW_BILL_MONTH_OPTIONS"
                    :key="option.id"
                    box-type="text"
                    :label="option.label"
                    :focused="option.id === selectedMonthId"
                    @click="
                      selectedMonthId = option.id;
                      close();
                    "
                  />
                </EgFlotationMenu>
              </template>
            </EgFlotation>
          </div>

          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Overview Bill Language Field') }}</span>
            <EgFlotation
              :class="styles.scopeFlotationHost"
              placement="bottom"
              align="start"
              width-mode="trigger"
              :show-add="false"
              :show-menu-divider="false"
              :close-on-scroll="false"
              flip
            >
              <template #trigger="{ expanded }">
                <EgFlotationTrigger
                  :class="styles.flotationTrigger"
                  trigger-style="subtle"
                  size="md"
                  width-mode="adaptive"
                  :label="selectedLanguageLabel"
                  :expanded="expanded"
                />
              </template>
              <template #content="{ menuWidth, menuWidthMode, close }">
                <EgFlotationMenu
                  panel-radius="radius-md"
                  :width-mode="menuWidthMode"
                  :width="menuWidth"
                  height-mode="adaptive"
                  :show-add="false"
                  :show-divider="false"
                >
                  <EgFlotationMenuItem
                    v-for="option in OVERVIEW_BILL_LANGUAGE_OPTIONS"
                    :key="option.id"
                    box-type="text"
                    :label="option.label"
                    :focused="option.id === selectedLanguageId"
                    @click="
                      selectedLanguageId = option.id;
                      close();
                    "
                  />
                </EgFlotationMenu>
              </template>
            </EgFlotation>
          </div>

          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Overview Bill Header Field') }}</span>
            <EgFlotation
              :class="styles.scopeFlotationHost"
              placement="bottom"
              align="start"
              width-mode="trigger"
              :show-add="false"
              :show-menu-divider="false"
              :close-on-scroll="false"
              flip
            >
              <template #trigger="{ expanded }">
                <EgFlotationTrigger
                  :class="styles.flotationTrigger"
                  trigger-style="subtle"
                  size="md"
                  width-mode="adaptive"
                  :label="selectedHeaderLabel"
                  :expanded="expanded"
                />
              </template>
              <template #content="{ menuWidth, menuWidthMode, close }">
                <EgFlotationMenu
                  panel-radius="radius-md"
                  :width-mode="menuWidthMode"
                  :width="menuWidth"
                  height-mode="adaptive"
                  :show-add="false"
                  :show-divider="false"
                >
                  <EgFlotationMenuItem
                    v-for="option in OVERVIEW_BILL_HEADER_OPTIONS"
                    :key="option.id"
                    box-type="text"
                    :label="ui(option.labelKey)"
                    :focused="option.id === selectedHeaderId"
                    @click="
                      selectedHeaderId = option.id;
                      close();
                    "
                  />
                </EgFlotationMenu>
              </template>
            </EgFlotation>
          </div>

          <div :class="styles.generateRow">
            <EgButton tone="brand" variant="solid" size="md" @click="onGenerateClick">
              {{ ui('Overview Bill Generate Action') }}
            </EgButton>
          </div>
        </div>

        <div :class="styles.recordsSection">
          <EgDivider type="page" direction="horizontal" :class="styles.recordsDivider" />
          <h3 :class="styles.recordsTitle">
            {{ ui('Overview Bill Records Section') }}
          </h3>
          <div :class="styles.recordList">
            <div
              v-for="record in OVERVIEW_BILL_GENERATION_RECORDS"
              :key="record.id"
              :class="styles.recordRow"
            >
              <div :class="styles.recordMain">
                <span :class="styles.recordTitle">{{ record.title }}</span>
                <span :class="styles.recordMetaLine">
                  {{ record.timezoneLabel }} {{ record.languageLabel }}
                </span>
                <div :class="styles.recordDetailRow">
                  <EgIcon
                    :class="styles.recordDetailIcon"
                    name="eds-user-information"
                    size="sm"
                    fit
                  />
                  <span :class="styles.recordDetailText">
                    {{ record.operatorName }} ({{ record.operatorEmailMasked }})
                  </span>
                </div>
                <div :class="styles.recordDetailRow">
                  <EgIcon
                    :class="styles.recordDetailIcon"
                    name="eds-clocks"
                    size="sm"
                    fit
                  />
                  <span :class="styles.recordDetailText">{{ record.generatedAt }}</span>
                </div>
              </div>
              <EgIconButton
                :class="styles.recordDownload"
                shape="square"
                size="sm"
                :label="ui('Overview Bill Download Action')"
                @click.stop
              >
                <EgIcon name="eds-arrow-download" fit />
              </EgIconButton>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
