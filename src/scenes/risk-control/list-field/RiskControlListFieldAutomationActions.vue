<script setup lang="ts">
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './RiskControlListFieldAutomationActions.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton variant="text" tone="subtle" size="md" :class="styles.deleteButton">
      {{ ui('Delete') }}
    </EgButton>
    <EgButton variant="solid" size="md" tone="decor">
      {{ ui('Edit') }}
    </EgButton>
  </div>
</template>
