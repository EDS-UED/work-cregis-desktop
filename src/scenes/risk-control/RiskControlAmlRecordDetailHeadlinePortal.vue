<script setup lang="ts">
/**
 * Pages / 旧 EDS 无 EgDetail `#headline-main` 时，slot 内容会被丢弃；
 * 将 AML TopCard 挂入 headlineMain，与 slot 路径互斥（见 data-aml-record-top-card）。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailHeadline from './RiskControlAmlRecordDetailHeadline.vue';

const props = defineProps<{
  hostRef: HTMLElement | null | undefined;
  detail: RiskControlAmlQueryRecordDetail;
  pageKey?: string;
}>();

const mountAnchor = ref<HTMLElement | null>(null);

function unmountPortal() {
  mountAnchor.value?.remove();
  mountAnchor.value = null;
}

function resolveHeadlineMain(): HTMLElement | null {
  const host = props.hostRef;
  if (!host) return null;

  const headline = host.querySelector('header[class*="headline"]');
  const headlineMain = headline?.querySelector('[class*="headlineMain"]');
  return headlineMain instanceof HTMLElement ? headlineMain : null;
}

function tryMountPortal() {
  unmountPortal();

  const headlineMain = resolveHeadlineMain();
  if (!headlineMain) return;

  if (headlineMain.querySelector('[data-aml-record-top-card]')) {
    return;
  }

  const anchor = document.createElement('div');
  anchor.setAttribute('data-aml-record-headline-portal', '');
  anchor.style.width = '100%';
  headlineMain.replaceChildren(anchor);
  mountAnchor.value = anchor;
}

function scheduleMountPortal() {
  void nextTick(() => {
    tryMountPortal();
    requestAnimationFrame(tryMountPortal);
  });
}

watch(
  () =>
    [
      props.hostRef,
      props.pageKey,
      props.detail.collaborationNumber,
      props.detail.targetValue,
    ] as const,
  scheduleMountPortal,
);

onMounted(scheduleMountPortal);

onBeforeUnmount(unmountPortal);
</script>

<template>
  <Teleport v-if="mountAnchor" :to="mountAnchor">
    <RiskControlAmlRecordDetailHeadline :detail="detail" />
  </Teleport>
</template>
