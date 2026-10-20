<script setup lang="ts">
import { EgButton, EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import styles from './WaasProjectEmptyPage.module.css';

const { ui } = useAppI18n();
const { openCreateProject } = useWaasProjectStore();
</script>

<template>
  <div class="desktopTokens" :class="styles.page">
    <div :class="styles.content">
      <span :class="styles.iconHost" aria-hidden="true">
        <EgIcon name="eds-business-7" size="lg" fit />
      </span>
      <div :class="styles.textBlock">
        <h1 :class="styles.title">{{ ui('No Project') }}</h1>
        <p :class="styles.subtitle">
          {{ ui('Create Project > API access completed > Start business collaboration') }}
        </p>
      </div>
      <div :class="styles.actions">
        <EgButton tone="decor" variant="solid" size="md" @click="openCreateProject">
          {{ ui('Create Project') }}
        </EgButton>
        <EgButton tone="subtle" variant="text" size="md">
          {{ ui('View Documentation') }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
