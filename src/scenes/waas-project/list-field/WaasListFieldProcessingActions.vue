<script setup lang="ts">
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './WaasListFieldProcessingActions.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <div :class="styles.actionCell" @click.stop>
    <EgButton variant="text" tone="subtle" size="md">
      {{ ui('Cancel') }}
    </EgButton>
    <EgButton variant="solid" size="md" tone="decor">
      {{ ui('Transaction Acceleration') }}
    </EgButton>
  </div>
</template>
