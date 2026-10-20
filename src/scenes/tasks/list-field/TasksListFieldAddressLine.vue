<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCryptoAddressTags,
  EgListFieldAddressLine,
  EgListFieldOverflowText,
  EgFieldOvfTooltip,
  hasAddressTags,
  splitTagsForDisplay,
  type CryptoAddressSideTags,
  type TagSystemType,
} from '@eds/desktop-components';
import { resolveListFieldAddressLineModel, truncateAddressMiddle } from './listFieldAddressLineModel';
import { useAppI18n } from '@/composables/useAppI18n';
import { buildCurrencySideAddressData } from './listFieldCurrencyAddressCustomize';
import TasksListFieldRowTag from './TasksListFieldRowTag.vue';
import styles from './TasksListFieldAddressLine.module.css';

const props = withDefaults(
  defineProps<{
    prefix: 'from' | 'to';
    customize: Record<string, unknown>;
    tags?: CryptoAddressSideTags;
    showRowTag?: boolean;
    rowTagLabel?: string;
    rowTagSystemType?: TagSystemType;
    secondaryText?: string;
    /** 发送方列：主行钱包名 + 副行地址（tooltip 仍展示 from 完整地址）。 */
    walletAsPrimary?: boolean;
    walletDisplayName?: string;
    tooltipTrigger?: 'hover' | 'focus';
    alignEnd?: boolean;
  }>(),
  {
    showRowTag: false,
    rowTagLabel: 'Tag',
    rowTagSystemType: 'gray',
    secondaryText: '',
    walletAsPrimary: false,
    walletDisplayName: '',
    tooltipTrigger: 'hover',
    alignEnd: false,
  },
);

const { ui } = useAppI18n();

const model = computed(() => resolveListFieldAddressLineModel(props.prefix, props.customize));
const sideData = computed(() => buildCurrencySideAddressData(props.prefix, props.customize));
const useWalletPrimaryLayout = computed(
  () =>
    props.walletAsPrimary
    && String(props.walletDisplayName ?? '').trim().length > 0
    && sideData.value.count <= 2,
);
/** 多地址 (>2) 走 EgListFieldAddressLine；单地址别名 / 钱包主行走业务布局。 */
const useAliasLayout = computed(
  () => useWalletPrimaryLayout.value || (Boolean(model.value.alias) && sideData.value.count <= 2),
);
/** 有别名：主行别名、副行截断地址（与发送方 walletAsPrimary 两行一致）。 */
const useAliasAsPrimaryStack = computed(
  () =>
    Boolean(model.value.alias)
    && sideData.value.count <= 2
    && !useWalletPrimaryLayout.value,
);
const primaryLineText = computed(() => {
  if (useWalletPrimaryLayout.value) {
    return String(props.walletDisplayName ?? '').trim();
  }
  return model.value.alias;
});
const secondaryLineText = computed(() => {
  if (useWalletPrimaryLayout.value || useAliasAsPrimaryStack.value) {
    return truncateAddressMiddle(model.value.address);
  }
  return String(props.secondaryText ?? '').trim();
});
const showRowTag = computed(
  () => props.showRowTag && String(props.rowTagLabel ?? '').trim().length > 0,
);
const displayRowTagLabel = computed(() => ui(String(props.rowTagLabel ?? 'Tag')));

const showSecondaryText = computed(() => secondaryLineText.value.length > 0);
const showTags = computed(() => hasAddressTags(props.tags?.system, props.tags?.custom));
const hiddenTagCount = computed(
  () => splitTagsForDisplay(props.tags?.system, props.tags?.custom).hidden.length,
);
const showMoreTag = computed(() => hiddenTagCount.value > 0);
const copyLabel = computed(() => `${ui('Copy address')} ${model.value.address}`.trim());
const addressTooltipHostClass = computed(() =>
  [styles.addressTooltipHost, props.alignEnd && styles.addressTooltipHostAlignEnd]
    .filter(Boolean)
    .join(' '),
);
const tooltipTriggerBodyClass = computed(() =>
  [styles.tooltipTriggerBody, props.alignEnd && styles.tooltipTriggerBodyAlignEnd]
    .filter(Boolean)
    .join(' '),
);
const walletMetaRowClass = computed(() =>
  [styles.walletMetaRow, props.alignEnd && styles.walletMetaRowAlignEnd]
    .filter(Boolean)
    .join(' '),
);
const walletMetaAddressTooltipHostClass = computed(() =>
  [styles.walletMetaAddressLine, styles.walletMetaAddressTooltipHost]
    .filter(Boolean)
    .join(' '),
);
/** 勿叠 metaSecondaryText：固定色会挡住 EDS hover brand + 虚线（measure 继承 __target--secondary）。 */
const walletMetaAddressMeasureClass = computed(() => styles.walletMetaAddressMeasure);
/** measureRef 专用：覆盖 EDS .measure 的 nowrap，勿与 walletMetaRow 混用。 */
const showWalletMetaRow = computed(() => showSecondaryText.value || showTags.value);

/** 与 EDS menuNeedsListScroll 对齐：行内已展示的 Tag 不重复进 Menu，仅 +N 隐藏 Tag 需 Menu meta。 */
const overflowMenuTags = computed(() => (showMoreTag.value ? props.tags : undefined));
</script>

<template>
  <div v-if="!useAliasLayout" :class="[styles.addressLineHost, alignEnd && styles.addressLineHostAlignEnd]">
    <EgListFieldAddressLine
      :text="model.address"
      :address-count="sideData.count"
      :addresses="sideData.addresses"
      :tags="tags"
      :show-row-tag="showRowTag"
      :row-tag-label="displayRowTagLabel"
      :row-tag-system-type="rowTagSystemType"
      :secondary-text="secondaryText"
      :tooltip-trigger="tooltipTrigger"
    />
  </div>

  <div
    v-else-if="useWalletPrimaryLayout"
    :class="[styles.aliasHost, styles.walletAliasHost, alignEnd && styles.aliasHostAlignEnd]"
  >
    <div :class="styles.aliasPrimaryRow">
      <div :class="styles.walletPrimaryText">
        <EgListFieldOverflowText
          :text="primaryLineText"
          :tooltip-trigger="tooltipTrigger"
          boundary-selector=".eds-data-list"
        />
      </div>
      <TasksListFieldRowTag
        v-if="showRowTag"
        :label="displayRowTagLabel"
        :system-type="rowTagSystemType"
      />
    </div>

    <div v-if="showWalletMetaRow" :class="walletMetaRowClass">
      <EgFieldOvfTooltip
        v-if="showSecondaryText"
        :tooltip-text="model.address"
        :copy-value="model.address"
        :trigger="tooltipTrigger"
        semantic-truncated
        target-tone="secondary"
        :typography-class="styles.metaSecondaryText"
        :measure-class="walletMetaAddressMeasureClass"
        :copy-label="copyLabel"
        show-tooltip-copy
        boundary-selector=".eds-data-list"
        :host-class="walletMetaAddressTooltipHostClass"
      >
        {{ secondaryLineText }}
      </EgFieldOvfTooltip>

      <EgCryptoAddressTags
        v-if="showTags || showMoreTag"
        :class="styles.walletMetaTags"
        :tags="tags"
      />
    </div>
  </div>

  <div
    v-else
    :class="[
      styles.aliasHost,
      useAliasAsPrimaryStack && styles.walletAliasHost,
      alignEnd && styles.aliasHostAlignEnd,
    ]"
  >
    <EgFieldOvfTooltip
      :tooltip-text="model.address"
      :copy-value="model.address"
      :trigger="tooltipTrigger"
      semantic-truncated
      target-tone="primary"
      :typography-class="styles.aliasLine"
      :measure-class="tooltipTriggerBodyClass"
      :copy-label="copyLabel"
      show-tooltip-copy
      defer-hover-target
      :menu-alias="model.alias"
      :menu-tags="overflowMenuTags"
      boundary-selector=".eds-data-list"
      :host-class="addressTooltipHostClass"
    >
      <div :class="tooltipTriggerBodyClass">
        <div :class="styles.aliasPrimaryRow">
          <span
            :class="[
              styles.aliasLine,
              styles.addressHoverMotion,
              'eds-hover-tooltip-trigger__target',
              'eds-hover-tooltip-trigger__target--primary',
            ]"
          >
            {{ primaryLineText }}
          </span>
          <TasksListFieldRowTag
            v-if="showRowTag"
            :label="displayRowTagLabel"
            :system-type="rowTagSystemType"
          />
        </div>

        <span v-if="showSecondaryText" :class="styles.metaSecondaryText">
          {{ secondaryLineText }}
        </span>

        <div v-if="showTags || showMoreTag" :class="[styles.metaRow, styles.metaRowInteractive]">
          <EgCryptoAddressTags v-if="showTags || showMoreTag" :tags="tags" />
        </div>
      </div>
    </EgFieldOvfTooltip>
  </div>
</template>
