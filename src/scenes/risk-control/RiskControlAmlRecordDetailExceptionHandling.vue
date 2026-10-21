<script setup lang="ts">
import { EgButton } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './RiskControlAmlRecordDetailExceptionHandling.module.css';

const { ui } = useAppI18n();
</script>

<template>
  <section :class="styles.host" data-aml-exception-handling>
    <p :class="['typography-body-medium-strong', styles.title]">
      {{ ui('AML exception handling title') }}
    </p>
    <p :class="['typography-body-medium', styles.lead]">
      {{ ui('AML exception handling lead') }}
    </p>
    <div :class="styles.actions">
      <div :class="styles.actionCard">
        <span :class="['typography-body-medium-strong', styles.actionTitle]">
          {{ ui('AML exception action retry') }}
        </span>
        <span :class="['typography-body-small', styles.actionDesc]">
          {{ ui('AML exception action retry desc') }}
        </span>
        <EgButton variant="solid" tone="decor" size="md">
          {{ ui('AML exception action retry') }}
        </EgButton>
      </div>
      <div :class="styles.actionCard">
        <span :class="['typography-body-medium-strong', styles.actionTitle]">
          {{ ui('AML exception action pass') }}
        </span>
        <span :class="['typography-body-small', styles.actionDesc]">
          {{ ui('AML exception action pass desc') }}
        </span>
        <EgButton variant="text" tone="subtle" size="md">
          {{ ui('AML exception action pass') }}
        </EgButton>
      </div>
      <div :class="styles.actionCard">
        <span :class="['typography-body-medium-strong', styles.actionTitle]">
          {{ ui('AML exception action reject') }}
        </span>
        <span :class="['typography-body-small', styles.actionDesc]">
          {{ ui('AML exception action reject desc') }}
        </span>
        <EgButton variant="text" tone="danger" size="md">
          {{ ui('AML exception action reject') }}
        </EgButton>
      </div>
    </div>
  </section>
</template>
