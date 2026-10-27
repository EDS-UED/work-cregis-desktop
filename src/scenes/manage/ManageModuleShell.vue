<script setup lang="ts">
import {
  isManageApiManageMenuItem,
  isManageRoleMenuItem,
  isManageTeamSecurityMenuItem,
  isManageWebhookConfigMenuItem,
  isManageWebhookPushRecordsMenuItem,
} from './manageMenuData';
import ManageTeamSecurityModuleHost from './team-security/ManageTeamSecurityModuleHost.vue';
import ManagePlaceholderPage from './ManagePlaceholderPage.vue';
import ManageRoleModuleHost from './role/ManageRoleModuleHost.vue';
import ManageTeamApiModuleHost from './team-api/ManageTeamApiModuleHost.vue';
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
  <ManageTeamApiModuleHost
    v-else-if="menuItem && isManageApiManageMenuItem(menuItem)"
    :menu-item="menuItem"
  />
  <ManageTeamSecurityModuleHost
    v-else-if="menuItem && isManageTeamSecurityMenuItem(menuItem)"
  />
  <ManagePlaceholderPage v-else-if="menuItem" :menu-item="menuItem" />
</template>
