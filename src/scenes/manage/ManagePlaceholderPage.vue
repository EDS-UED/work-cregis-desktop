<script setup lang="ts">
import { EgLayout, EgToolBar } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';

defineProps<{
  menuItem: string;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <EgLayout type="empty" :show-toolbar="false">
    <EgToolBar :title="ui(menuItem)" :show-operation="false" />
    <div class="typography-body-medium" style="padding: var(--spacing-4); color: var(--text-base-secondary)">
      {{ ui('Manage module placeholder') }}
    </div>
  </EgLayout>
</template>
