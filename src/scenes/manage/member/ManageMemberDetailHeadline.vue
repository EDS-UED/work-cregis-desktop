<script setup lang="ts">
import { computed } from 'vue';
import { maskDisplayEmail } from '@/utils/maskDisplayEmail';
import { EgAvatar, EgTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveWebhookConfigCreatorAvatarColorSeed } from '@/scenes/manage/webhook/filter/buildWebhookConfigCreatorFilterOptions';
import styles from './ManageMemberDetailHeadline.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const nickname = computed(() => props.row.logOperatorName?.trim() || props.row.id);

const email = computed(() => {
  const raw = props.row.webhookCreatorEmail?.trim() || '';
  return raw ? maskDisplayEmail(raw) : '';
});

const roleName = computed(() => props.row.ruleName?.trim() || '');

const showCreatorTag = computed(() => Boolean(props.row.manageMemberShowCreatorTag));

const avatarColorSeed = computed(
  () => resolveWebhookConfigCreatorAvatarColorSeed(nickname.value) || props.row.id,
);
</script>

<template>
  <div :class="styles.headline">
    <EgAvatar size="2xl" :name="nickname" :color-seed="avatarColorSeed" />
    <div :class="styles.textGroup">
      <div :class="styles.titleRow">
        <h2 :class="['typography-headline', styles.nickname]">
          {{ nickname }}
        </h2>
        <EgTag
          v-if="showCreatorTag"
          family="system"
          system-type="stroke-solid"
          size="md"
        >
          {{ ui('Member list creator tag') }}
        </EgTag>
        <EgTag
          v-if="roleName"
          family="system"
          system-type="stroke-subtle"
          size="md"
        >
          {{ roleName }}
        </EgTag>
      </div>
      <p v-if="email" :class="['typography-body-medium', styles.email]">
        {{ email }}
      </p>
    </div>
  </div>
</template>
