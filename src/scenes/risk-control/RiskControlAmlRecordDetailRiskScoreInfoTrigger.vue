<script setup lang="ts">
import { EgIcon, EgIconButton, EgTooltip } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './RiskControlAmlRecordDetailRiskScoreInfoTrigger.module.css';

const { ui } = useAppI18n();

const hintLines = [
  'Risk score minimum is 0.0 (very safe)',
  'Risk score maximum is 10.0 (very dangerous)',
  'Risk score unavailable hint',
] as const;
</script>

<template>
  <EgTooltip
    :class="styles.tooltip"
    trigger="hover"
    placement="bottom"
    align="start"
    panel-kind="flotation"
    width-mode="adaptive"
    :max-width="328"
    height-mode="adaptive"
    boundary-selector=".eds-popup"
    close-on-scroll
    :scrollable="false"
    :open-delay="120"
    :close-delay="80"
    :token-scope-class="`desktopTokens eds-overflow-text-tooltip ${styles.tooltipPanel}`"
  >
    <EgIconButton
      shape="square"
      size="xs"
      :class="styles.infoButton"
      :label="ui('Risk score information')"
      @click.stop
    >
      <EgIcon :class="styles.iconOutline" name="eds-information" fit />
      <EgIcon :class="styles.iconFill" name="eds-information-fill" fit />
    </EgIconButton>

    <template #content>
      <div :class="styles.hintContent">
        <p
          v-for="lineKey in hintLines"
          :key="lineKey"
          :class="styles.hintLine"
        >
          · {{ ui(lineKey) }}
        </p>
      </div>
    </template>
  </EgTooltip>
</template>
