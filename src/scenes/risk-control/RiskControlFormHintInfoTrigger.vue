<script setup lang="ts">
import { computed } from 'vue';
import {
  EgFieldOvfTooltip,
  EgIcon,
  EgIconButton,
  EgTooltip,
  TEXT_OVERFLOW_TOOLTIP_TOKEN_SCOPE,
} from '@eds/desktop-components';
import fieldOvfPanelStyles from '@eds/desktop-components/molecules/tooltip/TextOverflowTooltip.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './RiskControlAmlRecordDetailRiskScoreInfoTrigger.module.css';

const props = withDefaults(
  defineProps<{
    buttonLabelKey: string;
    hintKeys?: readonly string[];
    bulletHints?: boolean;
    /** 风险分区间说明（0.0 / 10.0 着色）；面板样式对齐 EgFieldOvfTooltip。 */
    richRiskScoreHint?: boolean;
    showRiskScoreUnavailableHint?: boolean;
    boundarySelector?: string;
  }>(),
  {
    hintKeys: () => [],
    bulletHints: false,
    richRiskScoreHint: false,
    showRiskScoreUnavailableHint: false,
    boundarySelector: '.app-preview',
  },
);

const { ui } = useAppI18n();

const fieldOvfTokenScopeClass = computed(
  () => `${TEXT_OVERFLOW_TOOLTIP_TOKEN_SCOPE} ${fieldOvfPanelStyles.panel}`,
);

function riskScoreRangeMaxLeadText() {
  return ui('Auto rule risk score range hint max lead').replace(/^[;；]\s*/, '');
}

const resolvedTooltipText = computed(() => {
  if (props.richRiskScoreHint) return '';
  if (props.bulletHints && props.hintKeys.length > 1) {
    return props.hintKeys.map((key) => `· ${ui(key)}`).join('\n');
  }
  if (props.hintKeys.length === 1) {
    return ui(props.hintKeys[0]);
  }
  return '';
});
</script>

<template>
  <EgTooltip
    v-if="richRiskScoreHint"
    :class="styles.tooltip"
    trigger="hover"
    placement="bottom"
    align="start"
    panel-kind="flotation"
    width-mode="adaptive"
    :max-width="328"
    height-mode="adaptive"
    :boundary-selector="boundarySelector"
    close-on-scroll
    :scrollable="false"
    :open-delay="120"
    :close-delay="80"
    :token-scope-class="fieldOvfTokenScopeClass"
  >
    <EgIconButton
      shape="square"
      size="xs"
      :class="styles.infoButton"
      :label="ui(buttonLabelKey)"
      @click.stop
    >
      <EgIcon :class="styles.iconOutline" name="eds-information" fit />
      <EgIcon :class="styles.iconFill" name="eds-information-fill" fit />
    </EgIconButton>

    <template #content>
      <div :class="styles.hintContent">
        <p :class="styles.hintLine">
          · {{ ui('Auto rule risk score range hint min lead') }}<span
            :class="styles.hintLineMarkSuccess"
            >0.0</span
          >{{ ui('Auto rule risk score range hint min tail') }}
        </p>
        <p :class="styles.hintLine">
          · {{ riskScoreRangeMaxLeadText() }}<span :class="styles.hintLineMarkDanger">10.0</span
          >{{ ui('Auto rule risk score range hint max tail') }}
        </p>
        <p v-if="showRiskScoreUnavailableHint" :class="styles.hintLine">
          · {{ ui('Risk score unavailable hint') }}
        </p>
      </div>
    </template>
  </EgTooltip>

  <EgFieldOvfTooltip
    v-else
    :class="styles.tooltip"
    :tooltip-text="resolvedTooltipText"
    semantic-truncated
    trigger="hover"
    target-tone="inherit"
    :boundary-selector="boundarySelector"
    :max-width="328"
    :host-class="styles.fieldOvfHintHost"
  >
    <EgIconButton
      shape="square"
      size="xs"
      :class="styles.infoButton"
      :label="ui(buttonLabelKey)"
      @click.stop
    >
      <EgIcon :class="styles.iconOutline" name="eds-information" fit />
      <EgIcon :class="styles.iconFill" name="eds-information-fill" fit />
    </EgIconButton>
  </EgFieldOvfTooltip>
</template>
