<script setup lang="ts">
import { computed } from 'vue';
import ProjectSettingsPageContent from '@/scenes/project/components/ProjectSettingsPageContent.vue';
import { IP_WHITELIST_DEMO_EMPTY } from '@/scenes/project/components/projectSettingsIpWhitelistDemo';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';

const { selectedProject } = useWaasProjectStore();

const projectName = computed(() => selectedProject.value?.name ?? 'MetisDAO Ecosystem');
const depositMode = computed(() => selectedProject.value?.depositMode);
const tabPreset = computed(() =>
  depositMode.value === 'order' ? 'waas-order' : 'waas',
);
</script>

<template>
  <ProjectSettingsPageContent
    :tab-preset="tabPreset"
    :project-name="projectName"
    :deposit-mode="depositMode"
    :ip-whitelist-empty="IP_WHITELIST_DEMO_EMPTY"
  />
</template>
