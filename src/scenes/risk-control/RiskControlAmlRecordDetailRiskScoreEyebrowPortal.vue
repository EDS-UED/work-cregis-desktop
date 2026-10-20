<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import RiskControlAmlRecordDetailRiskScoreEyebrow from './RiskControlAmlRecordDetailRiskScoreEyebrow.vue';

const props = defineProps<{
  hostRef: HTMLElement | null | undefined;
  pageKey?: string;
}>();

const eyebrowAnchor = ref<HTMLElement | null>(null);

function unmountStructure() {
  eyebrowAnchor.value?.remove();
  eyebrowAnchor.value = null;
}

function mountStructure() {
  unmountStructure();

  const host = props.hostRef;
  if (!host) return;

  const headline = host.querySelector('header[class*="headline"]');
  const headlineMain = headline?.querySelector('[class*="headlineMain"]');
  const headlineRow = headline?.querySelector('[class*="headlineRow"]');
  if (!(headline instanceof HTMLElement) || !(headlineRow instanceof HTMLElement)) return;

  const mountParent =
    headlineMain instanceof HTMLElement ? headlineMain : headline;

  const eyebrowEl = document.createElement('div');
  eyebrowEl.setAttribute('data-detail-headline-eyebrow', '');
  eyebrowEl.className = detailChromeStyles.detailHeadlineEyebrowHost;
  mountParent.insertBefore(eyebrowEl, headlineRow);
  eyebrowAnchor.value = eyebrowEl;
}

function scheduleMount() {
  void nextTick(() => {
    mountStructure();
    requestAnimationFrame(mountStructure);
  });
}

watch(
  () => [props.hostRef, props.pageKey] as const,
  scheduleMount,
);

onMounted(scheduleMount);

onBeforeUnmount(unmountStructure);
</script>

<template>
  <Teleport v-if="eyebrowAnchor" :to="eyebrowAnchor">
    <RiskControlAmlRecordDetailRiskScoreEyebrow />
  </Teleport>
</template>
