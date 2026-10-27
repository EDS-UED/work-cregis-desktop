<script setup lang="ts">
import { computed } from 'vue';
import { EgButton, EgColorfulTag, EgIcon } from '@eds/desktop-components';
import type { IconName } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type {
  ManageTeamSecurityChecklistActionTone,
  ManageTeamSecurityChecklistStatus,
} from './manageTeamSecurityDemo';
import styles from './ManageTeamSecurityChecklistRow.module.css';

const props = defineProps<{
  icon: IconName;
  titleKey: string;
  descriptionKey: string;
  status: ManageTeamSecurityChecklistStatus;
  actionLabelKey: string;
  actionTone: ManageTeamSecurityChecklistActionTone;
  showUpgradeTag?: boolean;
}>();

const emit = defineEmits<{
  action: [];
}>();

const { ui } = useAppI18n();

const statusIcon = computed(() =>
  props.status === 'complete' ? 'eds-enable-fill' : 'eds-warning-fill',
);
</script>

<template>
  <div :class="styles.row">
    <div :class="styles.leading">
      <div :class="styles.iconHost" aria-hidden="true">
        <EgIcon :name="icon" size="sm" fit fill-tone="primary" />
      </div>
      <div :class="styles.copy">
        <div :class="styles.titleRow">
          <span class="typography-body-medium-strong">{{ ui(titleKey) }}</span>
          <span
            :class="[
              styles.statusIcon,
              status === 'complete' ? styles.statusIconComplete : styles.statusIconAttention,
            ]"
            aria-hidden="true"
          >
            <EgIcon :name="statusIcon" size="md" fit fill-tone="primary" />
          </span>
          <EgColorfulTag
            v-if="showUpgradeTag"
            colorful-style="apricot"
            size="sm"
            :class="styles.upgradeTag"
          >
            {{ ui('Upgrade Verification Required') }}
          </EgColorfulTag>
        </div>
        <p class="typography-body-small" :class="styles.description">
          {{ ui(descriptionKey) }}
        </p>
      </div>
    </div>
    <div :class="styles.action">
      <EgButton
        v-if="actionTone === 'primary'"
        variant="solid"
        tone="decor"
        size="md"
        @click="emit('action')"
      >
        {{ ui(actionLabelKey) }}
      </EgButton>
      <EgButton
        v-else
        variant="solid"
        tone="subtle"
        size="md"
        @click="emit('action')"
      >
        {{ ui(actionLabelKey) }}
      </EgButton>
    </div>
  </div>
</template>
