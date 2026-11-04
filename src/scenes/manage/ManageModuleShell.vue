<script setup lang="ts">
import {
  isManageApiManageMenuItem,
  isManageRoleMenuItem,
  isManageMemberMenuItem,
  isManageFeeRecordsMenuItem,
  isManageGasProxyPaymentRecordsMenuItem,
  isManageOverviewMenuItem,
  isManageTeamSubscriptionMenuItem,
  isManageOrderManagementMenuItem,
  isManageTeamSecurityMenuItem,
  isManageWebhookConfigMenuItem,
  isManageWebhookPushRecordsMenuItem,
} from './manageMenuData';
import ManageFeeRecordsModuleHost from './fee-records/ManageFeeRecordsModuleHost.vue';
import ManageGasProxyPaymentRecordsModuleHost from './gas-proxy-payment-records/ManageGasProxyPaymentRecordsModuleHost.vue';
import ManageOverviewPage from './overview/ManageOverviewPage.vue';
import ManageTeamSecurityModuleHost from './team-security/ManageTeamSecurityModuleHost.vue';
import ManagePlaceholderPage from './ManagePlaceholderPage.vue';
import ManageTeamSubscriptionPage from './team-subscription/ManageTeamSubscriptionPage.vue';
import ManageOrderManagementModuleHost from './order-management/ManageOrderManagementModuleHost.vue';
import ManageRoleModuleHost from './role/ManageRoleModuleHost.vue';
import ManageMemberModuleHost from './member/ManageMemberModuleHost.vue';
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
  <ManageMemberModuleHost v-else-if="menuItem && isManageMemberMenuItem(menuItem)" :menu-item="menuItem" />
  <ManageTeamApiModuleHost
    v-else-if="menuItem && isManageApiManageMenuItem(menuItem)"
    :menu-item="menuItem"
  />
  <ManageTeamSecurityModuleHost
    v-else-if="menuItem && isManageTeamSecurityMenuItem(menuItem)"
  />
  <ManageTeamSubscriptionPage
    v-else-if="menuItem && isManageTeamSubscriptionMenuItem(menuItem)"
  />
  <ManageOrderManagementModuleHost
    v-else-if="menuItem && isManageOrderManagementMenuItem(menuItem)"
    :menu-item="menuItem"
  />
  <ManageOverviewPage
    v-else-if="menuItem && isManageOverviewMenuItem(menuItem)"
  />
  <ManageFeeRecordsModuleHost
    v-else-if="menuItem && isManageFeeRecordsMenuItem(menuItem)"
    :menu-item="menuItem"
  />
  <ManageGasProxyPaymentRecordsModuleHost
    v-else-if="menuItem && isManageGasProxyPaymentRecordsMenuItem(menuItem)"
    :menu-item="menuItem"
  />
  <ManagePlaceholderPage v-else-if="menuItem" :menu-item="menuItem" />
</template>
