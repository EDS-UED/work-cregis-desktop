<script setup lang="ts">
import LayoutChromeConfigFormPageChrome from '@/scenes/project/LayoutChromeConfigFormPageChrome.vue';

defineProps<{
  title: string;
  confirmLabel: string;
  canSubmit: boolean;
  contentRevision?: string;
}>();

const emit = defineEmits<{
  back: [];
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <LayoutChromeConfigFormPageChrome
    :title="title"
    :confirm-label="confirmLabel"
    :can-submit="canSubmit"
    :content-revision="contentRevision"
    @back="emit('back')"
    @cancel="emit('cancel')"
    @confirm="emit('confirm')"
  >
    <slot />
  </LayoutChromeConfigFormPageChrome>
</template>
