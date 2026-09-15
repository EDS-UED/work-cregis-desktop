<script setup lang="ts">
import { computed } from 'vue';
import ProjectSettingsPageContent from '@/scenes/project/components/ProjectSettingsPageContent.vue';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';

const { selectedProject } = useWaasProjectStore();

const projectName = computed(() => selectedProject.value?.name ?? 'MetisDAO Ecosystem');
</script>

<template>
  <ProjectSettingsPageContent :project-name="projectName" />
</template>
