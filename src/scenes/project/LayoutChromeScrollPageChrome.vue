<script setup lang="ts">
/**
 * motion-page 内嵌整页（只读/滚动）：与 LayoutChromeConfigFormPageChrome 同 DOM，
 * 无 Combo 底栏；列表↔详情 Push/Pop 时 ToolBar+正文同壳进出场。
 */
import { computed, ref, watch, withDefaults } from 'vue';
import { EgLayout, EgToolBar } from '@eds/desktop-components';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import styles from './layoutChromeConfigFormPage.shared.module.css';

const props = withDefaults(
  defineProps<{
    title: string;
    /** 正文高度变化时触发 scrim 重算（Tab、计时等）。 */
    contentRevision?: string;
    /** 底栏槽（如分页器）常驻视口底部，与滚动正文分离。 */
    showPaginer?: boolean;
    /** 仅覆盖 configFormScrollContent 默认 padding 等业务页边距（勿改共享类名本身）。 */
    scrollContentClass?: string;
  }>(),
  {
    showPaginer: false,
    scrollContentClass: undefined,
  },
);

const emit = defineEmits<{
  back: [];
}>();

const scrollRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const { canScroll, topScrim, update } = useScrollChromeScrim(scrollRef, {
  contentRef,
});

const toolbarScrimActive = computed(() => canScroll.value && topScrim.value);

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
        :show-paginer="showPaginer"
        :class="styles.configFormLayout"
      >
        <template #toolbar>
          <EgToolBar
            :title="title"
            :show-back="true"
            :show-operation="false"
            :show-divider="toolbarScrimActive"
            :frosted="toolbarScrimActive"
            @back="emit('back')"
          />
        </template>

        <div ref="scrollRef" :class="styles.configFormScrollHost">
          <div
            ref="contentRef"
            :class="[styles.configFormScrollContent, props.scrollContentClass]"
          >
            <slot />
          </div>
        </div>

        <template v-if="showPaginer" #paginer>
          <slot name="paginer" />
        </template>
      </EgLayout>
    </div>
  </div>
</template>
