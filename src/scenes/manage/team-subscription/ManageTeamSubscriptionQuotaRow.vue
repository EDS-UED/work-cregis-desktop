<script setup lang="ts">
import {
  EgButton,
  EgColorfulTag,
  EgDivider,
  EgProgress,
} from '@eds/desktop-components';
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import type { TeamSubscriptionRowSpec } from './manageTeamSubscriptionDemo';
import ManageTeamSubscriptionInfoTrigger from './ManageTeamSubscriptionInfoTrigger.vue';
import styles from './ManageTeamSubscriptionPage.module.css';

const props = defineProps<{
  row: TeamSubscriptionRowSpec;
  showDivider: boolean;
}>();

const { ui } = useAppI18n();

const primaryText = computed(() => {
  if (props.row.primaryValue === 'Team Subscription Activated') {
    return ui('Team Subscription Activated');
  }
  return props.row.primaryValue;
});
</script>

<template>
  <div :class="styles.quotaRowBlock">
    <div :class="styles.quotaRow">
      <div :class="styles.quotaLeading">
        <div :class="styles.quotaLabelRow">
          <span class="typography-body-medium">{{ ui(row.labelKey) }}</span>
          <ManageTeamSubscriptionInfoTrigger
            v-if="row.infoHintKey"
            :label-key="row.labelKey"
            :hint-key="row.infoHintKey"
          />
        </div>
        <div v-if="row.metaLine || row.badgeLabelKey" :class="styles.quotaMetaRow">
          <span
            v-if="row.metaLine"
            class="typography-footnote"
            :class="row.metaDanger ? styles.metaDanger : styles.metaSecondary"
          >
            {{ row.metaLine }}
          </span>
          <EgColorfulTag
            v-if="row.badgeLabelKey"
            :colorful-style="row.badgeColorfulStyle ?? 'rose'"
            size="sm"
          >
            {{ ui(row.badgeLabelKey) }}
          </EgColorfulTag>
        </div>
        <div
          v-if="row.progressPercent != null"
          :class="styles.quotaProgress"
        >
          <EgProgress
            :value="row.progressPercent"
            :show-tooltip="row.progressShowBubble === true"
            :aria-label="ui(row.labelKey)"
          />
        </div>
      </div>
      <div :class="styles.quotaTrailing">
        <span
          class="typography-body-medium-strong"
          :class="row.primaryBrand ? styles.quotaValueBrand : styles.quotaValue"
        >
          {{ primaryText }}
        </span>
        <div v-if="row.actions?.length" :class="styles.quotaActions">
          <EgButton
            v-for="(action, index) in row.actions"
            :key="`${row.id}-${index}`"
            :variant="action.variant"
            :tone="action.tone"
            :size="action.size"
          >
            {{ ui(action.labelKey) }}
          </EgButton>
        </div>
      </div>
    </div>
    <EgDivider v-if="showDivider" :class="styles.rowDivider" />
  </div>
</template>
