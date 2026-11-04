<script setup lang="ts">
import { EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './ManageMemberPermissionCheckboxValue.module.css';

defineProps<{
  labelKey: string;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div
    :class="styles.memberPermissionValue"
    data-manage-role-permission-value
    data-manage-member-permission-readonly
  >
    <span :class="styles.marker" aria-hidden="true">
      <EgIcon
        :class="styles.markerTickOn"
        name="eds-tick"
        size="md"
        fit
      />
    </span>
    <span :class="styles.label">{{ ui(labelKey) }}</span>
  </div>
</template>
