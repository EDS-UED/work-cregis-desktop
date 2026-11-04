<script setup lang="ts">
import { EgFieldOvfTooltip, EgIcon, EgIconButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './ManageFeeRecordsToolbarTimezoneHint.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <EgFieldOvfTooltip
    :class="styles.tooltip"
    :tooltip-text="ui('Fee Record Team Timezone Hint')"
    semantic-truncated
    trigger="hover"
    target-tone="inherit"
    boundary-selector=".app-preview"
    :max-width="328"
    :host-class="styles.fieldOvfHintHost"
  >
    <EgIconButton
      shape="square"
      size="xs"
      :class="styles.infoButton"
      :label="ui('Device information')"
      @click.stop
    >
      <EgIcon :class="styles.iconOutline" name="eds-information" fit />
      <EgIcon :class="styles.iconFill" name="eds-information-fill" fit />
    </EgIconButton>
  </EgFieldOvfTooltip>
</template>
