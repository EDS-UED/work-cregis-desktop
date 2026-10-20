<script setup lang="ts">
import { EgLayout, EgToolBar } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import WaasProjectCreateFormContent from './WaasProjectCreateFormContent.vue';
import styles from './WaasProjectCreatePage.module.css';

const props = withDefaults(
  defineProps<{
    /** motion-page 内联 stack 时 true。 */
    embeddedInPageStack?: boolean;
  }>(),
  {
    embeddedInPageStack: false,
  },
);

const { ui } = useAppI18n();
const { cancelCreateProject } = useWaasProjectStore();

function onCancel() {
  cancelCreateProject();
}
</script>

<template>
  <div
    class="desktopTokens"
    :class="[styles.page, props.embeddedInPageStack && styles.pageEmbedded]"
  >
    <WaasProjectCreateFormContent
      v-if="props.embeddedInPageStack"
      embedded-in-page-stack
    />

    <EgLayout v-else type="empty" show-toolbar>
      <template #toolbar>
        <EgToolBar
          :title="ui('Create Project')"
          :show-back="true"
          :show-operation="false"
          @back="onCancel"
        />
      </template>

      <WaasProjectCreateFormContent />
    </EgLayout>
  </div>
</template>
