<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { EgRadio } from '@eds/desktop-components';
import styles from './ProjectCreateModeCard.module.css';

const slots = useSlots();

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    selected?: boolean;
    radioName?: string;
    radioValue?: string;
    /** 默认横向 radio + 文案；stack 为 #media + 主副文案。 */
    contentLayout?: 'row' | 'stack';
    /** stack 布局预设；aml-direction = AML 方向 Tooltip 卡片（纵向堆叠 + 内容居中）。 */
    stackPreset?: 'default' | 'aml-direction';
    /** 副文案排版；footnote-primary = 12px + 主色。 */
    descriptionTypography?: 'footnote' | 'body-small' | 'footnote-primary';
    /** 主文案与副文案横向排列（选择器 + 主 + 副同一行）。 */
    titleDescriptionLayout?: 'stack' | 'inline';
    /** grouped = 多项共用一个外容器，行背景透明。 */
    surface?: 'standalone' | 'grouped';
    /** grouped 行内边距：compact = 上下 spacing-1、左右 spacing-2、gap spacing-2。 */
    groupedRowSpacing?: 'default' | 'compact';
    /** grouped compact 行圆角 radius-sm。 */
    groupedRowRounded?: boolean;
    /** grouped 内选中行保留 event-focus-brand-subtle（容器不变色）。 */
    groupedHighlightSelectedRow?: boolean;
    /**
     * legacy：选中行绿底 + `.body` 缩进（WaaS / Webhook 等默认）。
     * embeddedPanel：绿壳 + bodyPanel（仅业务显式 opt-in）。
     */
    expandStyle?: 'legacy' | 'embeddedPanel';
    showRadio?: boolean;
    /** 未选中行：fill = 浅底；outline = 描边无底（选中/ hover 仍走默认）。 */
    idleSurface?: 'fill' | 'outline';
  }>(),
  {
    contentLayout: 'row',
    stackPreset: 'default',
    description: '',
    descriptionTypography: 'footnote',
    titleDescriptionLayout: 'stack',
    surface: 'standalone',
    groupedRowSpacing: 'default',
    groupedRowRounded: false,
    groupedHighlightSelectedRow: false,
    expandStyle: 'legacy',
    showRadio: true,
    idleSurface: 'fill',
  },
);

const hasDefaultSlot = computed(() => Boolean(slots.default));

const useEmbeddedPanel = computed(
  () =>
    props.expandStyle === 'embeddedPanel'
    && props.selected
    && hasDefaultSlot.value,
);

const useLegacyBody = computed(
  () =>
    props.expandStyle === 'legacy'
    && props.selected
    && hasDefaultSlot.value,
);

const itemRowClass = computed(() => [
  styles.itemRow,
  props.idleSurface === 'outline' && styles.itemRowOutline,
  props.contentLayout === 'stack'
    && props.stackPreset === 'default'
    && styles.itemRowStack,
  props.contentLayout === 'stack'
    && props.stackPreset === 'aml-direction'
    && styles.itemRowAmlDirection,
  props.selected && !useEmbeddedPanel.value && styles.itemRowSelected,
  useEmbeddedPanel.value && styles.itemRowExpandedHeader,
]);

const optionClass = computed(() => [
  styles.option,
  props.surface === 'grouped' && styles.optionGrouped,
  props.surface === 'grouped'
    && props.groupedRowSpacing === 'compact'
    && styles.optionGroupedCompact,
  props.surface === 'grouped'
    && props.groupedRowSpacing === 'compact'
    && props.groupedRowRounded
    && styles.optionGroupedCompactRounded,
  props.surface === 'grouped'
    && props.groupedHighlightSelectedRow
    && styles.optionGroupedHighlightSelectedRow,
]);

const itemValueStackClass = computed(() => [
  styles.itemValueStack,
  props.titleDescriptionLayout === 'inline' && styles.itemValueInline,
]);

const descriptionClass = computed(() => {
  if (props.descriptionTypography === 'body-small') {
    return styles.modeDescriptionBodySmall;
  }
  if (props.descriptionTypography === 'footnote-primary') {
    return styles.modeDescriptionFootnotePrimary;
  }
  return styles.modeDescription;
});

const emit = defineEmits<{
  select: [];
}>();

function onRowActivate(event: MouseEvent | KeyboardEvent) {
  const wasSelected = props.selected;
  emit('select');
  if (wasSelected && event.currentTarget instanceof HTMLElement) {
    event.currentTarget.blur();
  }
}
</script>

<template>
  <div :class="optionClass">
    <template v-if="useEmbeddedPanel">
      <div :class="styles.optionExpanded">
        <div
          :class="itemRowClass"
          :role="showRadio ? 'radio' : 'button'"
          tabindex="0"
          :aria-checked="showRadio ? selected : undefined"
          @click="onRowActivate"
          @keydown.enter.prevent="onRowActivate"
          @keydown.space.prevent="onRowActivate"
        >
          <EgRadio
            v-if="showRadio"
            :class="styles.radio"
            :model-value="selected"
            :name="radioName"
            :value="radioValue"
            tabindex="-1"
            aria-hidden="true"
          />
          <div v-if="contentLayout === 'stack' && $slots.media" :class="styles.media">
            <slot name="media" />
          </div>
          <div :class="itemValueStackClass">
            <span :class="styles.modeTitle">{{ title }}</span>
            <span v-if="description || $slots.description" :class="descriptionClass">
              <template v-if="description">{{ description }}</template>
              <slot v-else name="description" />
            </span>
          </div>
          <div v-if="$slots.trailing" :class="styles.trailing">
            <slot name="trailing" />
          </div>
        </div>
        <div :class="styles.bodyPanel">
          <slot />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        :class="itemRowClass"
        :role="showRadio ? 'radio' : 'button'"
        tabindex="0"
        :aria-checked="showRadio ? selected : undefined"
        @click="onRowActivate"
        @keydown.enter.prevent="onRowActivate"
        @keydown.space.prevent="onRowActivate"
      >
        <EgRadio
          v-if="showRadio"
          :class="styles.radio"
          :model-value="selected"
          :name="radioName"
          :value="radioValue"
          tabindex="-1"
          aria-hidden="true"
        />
        <div v-if="contentLayout === 'stack' && $slots.media" :class="styles.media">
          <slot name="media" />
        </div>
        <div :class="itemValueStackClass">
          <span :class="styles.modeTitle">{{ title }}</span>
          <span v-if="description || $slots.description" :class="descriptionClass">
            <template v-if="description">{{ description }}</template>
            <slot v-else name="description" />
          </span>
        </div>
        <div v-if="$slots.trailing" :class="styles.trailing">
          <slot name="trailing" />
        </div>
      </div>
      <div v-if="useLegacyBody" :class="styles.body">
        <slot />
      </div>
    </template>
  </div>
</template>
