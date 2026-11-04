<script setup lang="ts">
import { EgListFieldAddressLine } from '@eds/desktop-components';

defineProps<{
  address: string;
}>();
</script>

<template>
  <EgListFieldAddressLine :text="address" tooltip-trigger="hover" />
</template>
