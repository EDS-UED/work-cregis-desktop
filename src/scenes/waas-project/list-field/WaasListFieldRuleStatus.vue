<script setup lang="ts">
import { EgSwitch } from '@eds/desktop-components';

defineProps<{
  enabled: boolean;
}>();
</script>

<template>
  <EgSwitch :model-value="enabled" size="md" disabled />
</template>
