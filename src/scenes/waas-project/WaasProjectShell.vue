<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LayoutChromePageStack from '@/scenes/project/LayoutChromePageStack.vue';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import {
  isWaasOrderModeProject,
  isWaasOrderModeMenuItem,
  WAAS_SETTINGS_MENU_ITEM,
} from './waasMenuData';
import WaasModuleContentPage from './WaasModuleContentPage.vue';
import WaasOrderModeDataListPage from './WaasOrderModeDataListPage.vue';
import WaasProjectCreatePage from './WaasProjectCreatePage.vue';
import WaasProjectEmptyPage from './WaasProjectEmptyPage.vue';
import WaasProjectSettingsPage from './WaasProjectSettingsPage.vue';
import styles from './WaasProjectShell.module.css';

const props = defineProps<{
  menuItem: string | null;
}>();

const {
  hasProjects,
  shellView,
  selectedProject,
} = useWaasProjectStore();

const pageStackRef = ref<InstanceType<typeof LayoutChromePageStack> | null>(null);

const shellPageKey = computed(() => (shellView.value === 'create' ? 'create' : 'content'));

const showWaasEmpty = computed(
  () => !hasProjects.value && shellView.value !== 'create',
);

const showWaasSettings = computed(
  () =>
    hasProjects.value &&
    shellView.value === 'content' &&
    props.menuItem === WAAS_SETTINGS_MENU_ITEM,
);

const showWaasOrderModeList = computed(
  () =>
    hasProjects.value &&
    shellView.value === 'content' &&
    isWaasOrderModeProject(selectedProject.value) &&
    props.menuItem !== null &&
    props.menuItem !== WAAS_SETTINGS_MENU_ITEM &&
    isWaasOrderModeMenuItem(props.menuItem),
);

const showWaasStandardContent = computed(
  () =>
    hasProjects.value &&
    shellView.value === 'content' &&
    props.menuItem !== null &&
    props.menuItem !== WAAS_SETTINGS_MENU_ITEM &&
    !showWaasOrderModeList.value,
);

watch(shellView, (next, previous) => {
  if (next === 'create' && previous !== 'create') {
    pageStackRef.value?.setDirection('forward');
    return;
  }
  if (next !== 'create' && previous === 'create') {
    pageStackRef.value?.setDirection('backward');
  }
});
</script>

<template>
  <LayoutChromePageStack
    ref="pageStackRef"
    :enabled="true"
    :page-key="shellPageKey"
    :class="styles.pageStackHost"
  >
    <template #list>
      <div :class="styles.contentLayer">
        <WaasProjectEmptyPage v-show="showWaasEmpty" />
        <WaasProjectSettingsPage v-show="showWaasSettings" />
        <WaasOrderModeDataListPage
          v-if="showWaasOrderModeList && menuItem"
          v-show="showWaasOrderModeList"
          :key="`${selectedProject?.id ?? 'default'}:${menuItem}`"
          :menu-item="menuItem"
        />
        <WaasModuleContentPage
          v-if="showWaasStandardContent && menuItem"
          v-show="showWaasStandardContent"
          :key="`${selectedProject?.id ?? 'default'}:${menuItem}`"
          :menu-item="menuItem"
        />
      </div>
    </template>

    <template #create>
      <WaasProjectCreatePage embedded-in-page-stack />
    </template>
  </LayoutChromePageStack>
</template>
