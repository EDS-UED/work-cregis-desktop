<script setup lang="ts">
import { computed } from 'vue';
import {
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgTag,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import styles from './PaymentEngineListFieldCallbackAmountTime.module.css';
import titleStyles from './PaymentEngineListField.shared.module.css';

const props = defineProps<{
  businessTypeKey: string;
  callbackUrl: string;
  triggerMode?: 'auto' | 'manual';
}>();

const { ui } = useAppI18n();

const businessTypeLabel = computed(() => ui(props.businessTypeKey));
const callbackAddress = computed(() => props.callbackUrl?.trim() ?? '');
const pushMethodLabel = computed(() =>
  ui(props.triggerMode === 'manual' ? 'Manual' : 'Auto'),
);
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="titleStyles.callbackEventTitleRow">
        <EgListFieldOverflowText
          :text="businessTypeLabel"
          variant="primary"
        />
        <EgTag
          size="sm"
          family="system"
          system-type="gray"
          truncate
        >
          {{ pushMethodLabel }}
        </EgTag>
      </div>
      <EgListFieldHashLikeLine
        :text="callbackAddress"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
