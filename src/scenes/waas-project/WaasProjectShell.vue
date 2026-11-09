<script setup lang="ts">
import { computed } from 'vue';
import LayoutChromePageStack from '@/scenes/project/LayoutChromePageStack.vue';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import {
  isWaasOrderModeProject,
  isWaasOrderModeMenuItem,
  WAAS_SETTINGS_MENU_ITEM,
} from './waasMenuData';
import {
  isWaasStandardDataListMenuItem,
} from './waasStandardMenuData';
import WaasModuleContentPage from './WaasModuleContentPage.vue';
import WaasOrderModeDataListPage from './WaasOrderModeDataListPage.vue';
import WaasProjectCreatePage from './WaasProjectCreatePage.vue';
import WaasProjectEmptyPage from './WaasProjectEmptyPage.vue';
import WaasProjectSettingsPage from './WaasProjectSettingsPage.vue';
import WaasStandardDataListPage from './WaasStandardDataListPage.vue';
import styles from './WaasProjectShell.module.css';

const props = defineProps<{
  menuItem: string | null;
}>();

const {
  hasProjects,
  shellView,
  selectedProject,
} = useWaasProjectStore();

const shellPageKey = computed(() => (shellView.value === 'create' ? 'create' : 'list'));

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

const showWaasStandardDataList = computed(
  () =>
    hasProjects.value &&
    shellView.value === 'content' &&
    !isWaasOrderModeProject(selectedProject.value) &&
    props.menuItem !== null &&
    props.menuItem !== WAAS_SETTINGS_MENU_ITEM &&
    isWaasStandardDataListMenuItem(props.menuItem),
);

const showWaasStandardContent = computed(
  () =>
    hasProjects.value &&
    shellView.value === 'content' &&
    props.menuItem !== null &&
    props.menuItem !== WAAS_SETTINGS_MENU_ITEM &&
    !showWaasOrderModeList.value &&
    !showWaasStandardDataList.value,
);
</script>

<template>
  <LayoutChromePageStack
    :enabled="true"
    :page-key="shellPageKey"
    :class="styles.pageStackHost"
  >
    <template #list>
      <div :class="styles.contentLayer">
        <WaasProjectEmptyPage v-if="showWaasEmpty" />
        <WaasProjectSettingsPage v-show="showWaasSettings" />
        <WaasOrderModeDataListPage
          v-if="showWaasOrderModeList && menuItem"
          v-show="showWaasOrderModeList"
          :key="`${selectedProject?.id ?? 'default'}:${menuItem}`"
          :menu-item="menuItem"
        />
        <WaasStandardDataListPage
          v-if="showWaasStandardDataList && menuItem"
          v-show="showWaasStandardDataList"
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
      <WaasProjectCreatePage />
    </template>
  </LayoutChromePageStack>
</template>
