<script setup lang="ts">
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import type { RiskControlAmlExposureDirection } from './riskControlAmlRecordDetailTypes';
import styles from './RiskControlAmlRecordDetailExposureBar.module.css';

const props = defineProps<{
  exposure: RiskControlAmlExposureDirection;
}>();

const { ui } = useAppI18n();

/** 序号 2–10，第 2 段起按表依次循环（共 9 色）。 */
const FOLLOW_SEGMENT_TONE_CLASSES = [
  styles.segmentToneFollow2,
  styles.segmentToneFollow3,
  styles.segmentToneFollow4,
  styles.segmentToneFollow5,
  styles.segmentToneFollow6,
  styles.segmentToneFollow7,
  styles.segmentToneFollow8,
  styles.segmentToneFollow9,
  styles.segmentToneFollow10,
] as const;

const hasSafeTail = computed(() => props.exposure.highRiskPercent < 100);

function segmentToneClass(index: number): string {
  if (index === 0) {
    return styles.segmentToneLead;
  }
  return FOLLOW_SEGMENT_TONE_CLASSES[(index - 1) % FOLLOW_SEGMENT_TONE_CLASSES.length]
    ?? styles.segmentToneFollow2;
}

function coloredSegmentCapClasses(index: number): string[] {
  const lastIndex = props.exposure.segments.length - 1;
  const classes: string[] = [];
  if (index === 0) {
    classes.push(styles.segmentCapStart);
  }
  if (index === lastIndex && !hasSafeTail.value) {
    classes.push(styles.segmentCapEnd);
  }
  return classes;
}
</script>

<template>
  <div :class="styles.host" :data-direction="exposure.direction">
    <div :class="styles.track" role="img" :aria-label="ui('AML exposure bar aria')">
      <div
        v-for="(segment, index) in exposure.segments"
        :key="segment.id"
        :class="[
          styles.segment,
          segmentToneClass(index),
          coloredSegmentCapClasses(index),
        ]"
        :style="{ flexGrow: segment.percent }"
      />
      <div
        v-if="hasSafeTail"
        :class="[styles.segment, styles.segmentFiller]"
        :style="{ flexGrow: 100 - exposure.highRiskPercent }"
      />
    </div>
    <div :class="styles.legend">
      <div
        v-for="(segment, index) in exposure.segments"
        :key="`${segment.id}-legend`"
        :class="styles.legendItem"
      >
        <span :class="[styles.legendSwatch, segmentToneClass(index)]" />
        <span :class="styles.legendText">
          {{ ui(segment.labelKey) }} · {{ segment.percent }}%
        </span>
      </div>
    </div>
  </div>
</template>
