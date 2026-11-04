<script setup lang="ts">
import { useAppI18n } from '@/composables/useAppI18n';
import type { TeamSubscriptionSectionSpec } from './manageTeamSubscriptionDemo';
import ManageTeamSubscriptionInfoTrigger from './ManageTeamSubscriptionInfoTrigger.vue';
import ManageTeamSubscriptionQuotaRow from './ManageTeamSubscriptionQuotaRow.vue';
import styles from './ManageTeamSubscriptionPage.module.css';

defineProps<{
  section: TeamSubscriptionSectionSpec;
}>();

const { ui } = useAppI18n();
</script>

<template>
  <section :class="styles.sectionCard">
    <header :class="styles.sectionHeader">
      <h2 class="typography-body-medium-strong">{{ ui(section.titleKey) }}</h2>
      <div v-if="section.walletAside" :class="styles.sectionAside">
        <span class="typography-body-medium">{{ ui(section.walletAside.labelKey) }}</span>
        <ManageTeamSubscriptionInfoTrigger
          :label-key="section.walletAside.labelKey"
          :hint-key="section.walletAside.infoHintKey"
        />
        <span class="typography-body-medium-strong">{{ section.walletAside.value }}</span>
      </div>
    </header>
    <div :class="section.walletAside ? styles.sectionBodySplit : styles.sectionBody">
      <ManageTeamSubscriptionQuotaRow
        v-for="(row, index) in section.rows"
        :key="row.id"
        :row="row"
        :show-divider="index < section.rows.length - 1"
      />
    </div>
  </section>
</template>
