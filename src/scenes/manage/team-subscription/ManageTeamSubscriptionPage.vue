<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgButton,
  EgColorfulTag,
  EgLayout,
  EgToolBar,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import ManageTeamSubscriptionSectionCard from './ManageTeamSubscriptionSectionCard.vue';
import {
  TEAM_SUBSCRIPTION_PLAN,
  TEAM_SUBSCRIPTION_SECTIONS,
} from './manageTeamSubscriptionDemo';
import styles from './ManageTeamSubscriptionPage.module.css';

const { ui } = useAppI18n();

const scrollRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const { canScroll, topScrim, update } = useScrollChromeScrim(scrollRef, {
  contentRef,
});

const toolbarScrimActive = computed(() => canScroll.value && topScrim.value);

const planExpiryLabel = computed(() =>
  ui('Team Subscription Expires On').replace('{date}', TEAM_SUBSCRIPTION_PLAN.expiresDate),
);

const planUrgentLabel = computed(() =>
  ui('Team Subscription Expires In Days').replace(
    '{days}',
    String(TEAM_SUBSCRIPTION_PLAN.expiresInDays),
  ),
);

watch(canScroll, () => {
  update();
});
</script>

<template>
  <div :class="styles.page">
    <EgLayout type="empty" show-toolbar>
      <template #toolbar>
        <EgToolBar
          :title="ui('Subscription')"
          :show-operation="true"
          :show-divider="toolbarScrimActive"
          :frosted="toolbarScrimActive"
        >
          <template #operation>
            <div :class="styles.toolbarOperation">
              <span :class="styles.toolbarHint">
                {{ ui('Team Subscription Auto Renewal Hint') }}
              </span>
              <EgButton variant="outline" tone="decor" size="sm">
                {{ ui('Team Subscription Auto Renewal Manage') }}
              </EgButton>
            </div>
          </template>
        </EgToolBar>
      </template>

      <div ref="scrollRef" :class="styles.scrollBody">
        <main ref="contentRef" :class="styles.content">
          <article :class="styles.planCard">
            <div :class="styles.planLeading">
              <h1 class="typography-title-small" :class="styles.planName">
                {{ ui(TEAM_SUBSCRIPTION_PLAN.planNameKey) }}
              </h1>
              <div :class="styles.planMetaRow">
                <span :class="styles.planExpiry">{{ planExpiryLabel }}</span>
                <EgColorfulTag colorful-style="apricot" size="sm">
                  {{ planUrgentLabel }}
                </EgColorfulTag>
              </div>
            </div>
            <div :class="styles.planActions">
              <EgButton variant="outline" tone="decor" size="md">
                {{ ui('Renewal') }}
              </EgButton>
              <EgButton variant="solid" tone="decor" size="md">
                {{ ui('Upgrade') }}
              </EgButton>
            </div>
          </article>

          <ManageTeamSubscriptionSectionCard
            v-for="section in TEAM_SUBSCRIPTION_SECTIONS"
            :key="section.id"
            :section="section"
          />
        </main>
      </div>
    </EgLayout>
  </div>
</template>
