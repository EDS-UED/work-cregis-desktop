<script setup lang="ts">
import { ref, watch } from 'vue';
import { EgSwitch } from '@eds/desktop-components';
import styles from './WaasListFieldRuleStatus.module.css';

const props = defineProps<{
  enabled: boolean;
}>();

const localEnabled = ref(props.enabled);

watch(
  () => props.enabled,
  (value) => {
    localEnabled.value = value;
  },
);
</script>

<template>
  <div :class="styles.host" @click.stop>
    <EgSwitch v-model="localEnabled" :class="styles.switch" size="md" />
  </div>
</template>
