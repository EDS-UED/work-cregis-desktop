<script setup lang="ts">
import { EgLayout, EgToolBar } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './WaasModuleContentPage.module.css';

defineProps<{
  menuItem: string;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.page">
    <EgLayout type="empty" show-toolbar>
      <template #toolbar>
        <EgToolBar :title="ui(menuItem)" :show-operation="false" :show-divider="true" />
      </template>
      <div :class="styles.body">
        <p :class="styles.hint">{{ ui('Main content area') }}</p>
      </div>
    </EgLayout>
  </div>
</template>
