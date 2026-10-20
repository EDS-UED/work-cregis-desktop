<script setup lang="ts">
import { EgCheckbox } from '@eds/desktop-components';
import styles from './ManageRolePermissionCheckboxValue.module.css';

defineProps<{
  label: string;
  enabled: boolean;
}>();
</script>

<template>
  <div :class="styles.rolePermissionValue">
    <EgCheckbox disabled :model-value="enabled" />
    <span :class="styles.label">{{ label }}</span>
  </div>
</template>
