<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgComboPageButton,
  EgLayout,
  EgToolBar,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import styles from './layoutChromeConfigFormPage.shared.module.css';

const props = defineProps<{
  title: string;
  confirmLabel: string;
  canSubmit: boolean;
  /** 正文高度变化时触发 scrim 重算（如切换收款/出款）。 */
  contentRevision?: string;
}>();

const emit = defineEmits<{
  back: [];
  cancel: [];
  confirm: [];
}>();

const { ui } = useAppI18n();

const scrollRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const { canScroll, topScrim, update } = useScrollChromeScrim(scrollRef, {
  contentRef,
});

const toolbarScrimActive = computed(() => canScroll.value && topScrim.value);

function onConfirm() {
  if (!props.canSubmit) return;
  emit('confirm');
}

watch(
  () => props.contentRevision,
  () => {
    update();
  },
);

watch(canScroll, () => {
  update();
});
</script>

<template>
  <div class="desktopTokens" :class="[styles.page, styles.pageEmbedded]">
    <div :class="styles.pageShell">
      <EgLayout
        type="empty"
        :show-toolbar="true"
        :show-paginer="canScroll"
        :class="styles.configFormLayout"
      >
        <template #toolbar>
          <EgToolBar
            :title="title"
            :show-back="true"
            :show-operation="false"
            :show-divider="toolbarScrimActive"
            @back="emit('back')"
          />
        </template>

        <div ref="scrollRef" :class="styles.configFormScrollHost">
          <div ref="contentRef" :class="styles.configFormScrollContent">
            <slot />
          </div>
        </div>

        <template v-if="canScroll" #paginer>
          <EgComboPageButton
            tone="decor"
            direction="left"
            page-chrome
            divider
            :confirm-disabled="!canSubmit"
            :confirm-label="confirmLabel"
            :cancel-label="ui('Cancel')"
            @confirm="onConfirm"
            @cancel="emit('cancel')"
          />
        </template>
      </EgLayout>

      <div v-if="!canScroll" :class="styles.pageFooter">
        <EgComboPageButton
          tone="decor"
          direction="left"
          divider
          :confirm-disabled="!canSubmit"
          :confirm-label="confirmLabel"
          :cancel-label="ui('Cancel')"
          @confirm="onConfirm"
          @cancel="emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>
