<script setup lang="ts">
import { ref } from 'vue';
import { EgIcon, EgTooltipPanel } from '@eds/desktop-components';
import { markShellDebugUiInteraction } from './installShellDebugFloatLayerGuard';
import styles from './ShellDebugLauncherAnchored.module.css';

defineProps<{
  developerInspectActive: boolean;
  devInspectPanelOpen: boolean;
}>();

const emit = defineEmits<{
  'launcher-pointerdown': [event: PointerEvent];
  'trigger-click': [event: MouseEvent];
}>();

const launcherPointerOver = ref(false);
</script>

<template>
  <span
    data-eds-trigger-metrics
    :class="[
      styles.triggerMetrics,
      developerInspectActive && styles.triggerMetricsDevActive,
    ]"
    @pointerenter="markShellDebugUiInteraction(400)"
  >
    <EgTooltipPanel
        :class="styles.launcherShell"
        panel-kind="popup"
        panel-radius="radius-full"
        width-mode="adaptive"
        height-mode="adaptive"
        :scrollable="false"
      >
        <button
          type="button"
          :class="[
            styles.launcherButton,
            developerInspectActive && styles.launcherButtonDevActive,
            launcherPointerOver && styles.launcherButtonPointerOver,
          ]"
          aria-label="Toggle developer inspect tools"
          :aria-pressed="developerInspectActive"
          :aria-expanded="developerInspectActive"
          @pointerenter="launcherPointerOver = true"
          @pointerleave="launcherPointerOver = false"
          @pointerdown.stop="emit('launcher-pointerdown', $event)"
          @click.stop.prevent="emit('trigger-click', $event)"
        >
          <span :class="styles.launcherIcon" aria-hidden="true">
            <EgIcon name="eds-sign-hashtag" size="sm" />
          </span>
          <span :class="styles.launcherLabel">Dev</span>
        </button>
    </EgTooltipPanel>
  </span>
</template>
