<script setup lang="ts">
import { MANAGE_ROLE_PERMISSION_SECTION_HINTS } from './manageRolePermissionSectionHints';
import ManageRolePermissionSectionHint from './ManageRolePermissionSectionHint.vue';

defineProps<{
  active: boolean;
}>();
</script>

<template>
  <ManageRolePermissionSectionHint
    v-for="hint in MANAGE_ROLE_PERMISSION_SECTION_HINTS"
    :key="hint.sectionIndex"
    :active="active"
    :section-index="hint.sectionIndex"
    :lead-catalog-key="hint.leadCatalogKey"
    :link-catalog-key="hint.linkCatalogKey"
  />
</template>
