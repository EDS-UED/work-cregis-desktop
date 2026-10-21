<script setup lang="ts">
import { EgCheckbox } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './ManageRolePermissionCheckboxValue.module.css';

const props = defineProps<{
  labelKey: string;
  enabled: boolean;
  editable?: boolean;
}>();

const emit = defineEmits<{
  'update:enabled': [value: boolean];
}>();

const { ui } = useAppI18n();

function onCheckboxUpdate(value: boolean) {
  if (!props.editable) return;
  emit('update:enabled', value);
}

function toggleEnabled() {
  if (!props.editable) return;
  emit('update:enabled', !props.enabled);
}

function onRowClick(event: MouseEvent) {
  if (!props.editable) return;
  const target = event.target;
  if (target instanceof Element && target.closest('.eds-checkbox')) return;
  toggleEnabled();
}

function onRowKeydown(event: KeyboardEvent) {
  if (!props.editable) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  toggleEnabled();
}
</script>

<template>
  <div
    :class="[
      styles.rolePermissionValue,
      editable && styles.rolePermissionValueEditable,
    ]"
    data-manage-role-permission-value
    :role="editable ? 'button' : undefined"
    :tabindex="editable ? 0 : undefined"
    @click="onRowClick"
    @keydown="onRowKeydown"
  >
    <EgCheckbox
      :disabled="!editable"
      :model-value="enabled"
      @update:model-value="onCheckboxUpdate"
    />
    <span :class="styles.label">{{ ui(labelKey) }}</span>
  </div>
</template>
