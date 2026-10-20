<script setup lang="ts">
import {
  isManageRoleMenuItem,
  isManageWebhookConfigMenuItem,
  isManageWebhookPushRecordsMenuItem,
} from './manageMenuData';
import ManagePlaceholderPage from './ManagePlaceholderPage.vue';
import ManageRoleModuleHost from './role/ManageRoleModuleHost.vue';
import WebhookModuleHost from './webhook/WebhookModuleHost.vue';

defineProps<{
  menuItem: string | null;
}>();
</script>

<template>
  <WebhookModuleHost
    v-if="menuItem && (isManageWebhookConfigMenuItem(menuItem) || isManageWebhookPushRecordsMenuItem(menuItem))"
    :menu-item="menuItem"
  />
  <ManageRoleModuleHost v-else-if="menuItem && isManageRoleMenuItem(menuItem)" :menu-item="menuItem" />
  <ManagePlaceholderPage v-else-if="menuItem" :menu-item="menuItem" />
</template>
