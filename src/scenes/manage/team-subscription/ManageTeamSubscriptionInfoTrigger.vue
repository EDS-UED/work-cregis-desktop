<script setup lang="ts">
import { EgIcon, EgIconProButton, EgTooltip } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './ManageTeamSubscriptionPage.module.css';

const props = defineProps<{
  labelKey: string;
  hintKey: string;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <EgTooltip
    :class="styles.infoTooltip"
    trigger="hover"
    placement="bottom"
    align="start"
    panel-kind="flotation"
    width-mode="adaptive"
    :max-width="328"
    height-mode="adaptive"
    boundary-selector=".app-preview"
    close-on-scroll
    :scrollable="false"
    :open-delay="120"
    :close-delay="80"
  >
    <template #trigger="{ open }">
      <EgIconProButton
        :class="styles.infoButton"
        :label="ui(labelKey)"
        :active="open"
        :aria-expanded="open"
      >
        <EgIcon name="eds-information" size="sm" />
      </EgIconProButton>
    </template>
    <template #content>
      <p class="typography-body-small">{{ ui(hintKey) }}</p>
    </template>
  </EgTooltip>
</template>
