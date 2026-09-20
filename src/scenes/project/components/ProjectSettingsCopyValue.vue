<script setup lang="ts">
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import styles from './ProjectSettingsCopyValue.module.css';

const props = defineProps<{
  display: string;
  copyValue?: string;
}>();

const { ui } = useAppI18n();
const { copied, copyValue } = useCopyableValue();

const textToCopy = computed(() => props.copyValue ?? props.display);

async function onCopy(event?: MouseEvent) {
  await copyValue(textToCopy.value, event);
}
</script>

<template>
  <span
    :class="[styles.root, styles.rootCopyable]"
    data-project-settings-copy=""
    role="button"
    tabindex="0"
    @click="onCopy($event)"
    @keydown.enter.prevent="onCopy()"
    @keydown.space.prevent="onCopy()"
  >
    <span :class="styles.text">{{ display }}</span>
    <span :class="[styles.copyButton, copied && styles.copyButtonCopied]" @click.stop>
      <DetailValueActionIcon
        :label="ui('Copy')"
        :icon="copied ? 'eds-enable-fill' : 'eds-copy'"
        boundary-selector=".app-preview"
        @click="onCopy($event)"
      />
    </span>
  </span>
</template>
