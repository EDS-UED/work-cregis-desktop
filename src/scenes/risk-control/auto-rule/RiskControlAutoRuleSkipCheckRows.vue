<script setup lang="ts">
import { EgDecide } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './RiskControlAutoRuleFormPage.module.css';

defineProps<{
  skipWhitelist: boolean;
  skipInternal: boolean;
}>();

const emit = defineEmits<{
  skipUpdate: [field: 'skipWhitelist' | 'skipInternal', next: boolean];
}>();

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.cardBodyChecksSection">
    <span :class="styles.cardBodySectionTitle">
      {{ ui('Auto rule outflow filtering') }}
    </span>
    <div :class="styles.cardBodyChecks">
      <div :class="styles.cardBodyCheckRow">
        <EgDecide
          :model-value="skipWhitelist"
          @update:model-value="(next) => emit('skipUpdate', 'skipWhitelist', next)"
        />
        <span :class="styles.cardBodyCheckLabel">
          {{ ui('Skip addresses in whitelist') }}
        </span>
      </div>
      <div :class="styles.cardBodyCheckRow">
        <EgDecide
          :model-value="skipInternal"
          @update:model-value="(next) => emit('skipUpdate', 'skipInternal', next)"
        />
        <span :class="styles.cardBodyCheckLabel">
          {{ ui('Skip internal team addresses') }}
        </span>
      </div>
    </div>
  </div>
</template>
