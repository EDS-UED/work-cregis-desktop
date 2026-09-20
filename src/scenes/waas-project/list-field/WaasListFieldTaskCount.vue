<script setup lang="ts">
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './WaasListFieldTaskCount.module.css';

defineProps<{
  count: string;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.host">
    <span :class="styles.countText">{{ count }} {{ ui('Signing transaction count unit') }}</span>
  </div>
</template>
