<script setup lang="ts">
import { EgColorfulTag, EgDivider } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import sharedStyles from '@/scenes/waas-project/settings/waasSettings.shared.module.css';
import styles from './ProjectSettingsPolicyWalletRow.module.css';

const props = defineProps<{
  walletName: string;
  tagKey: 'Default Payout' | 'Default Payment';
  tagStyle: 'apricot' | 'grass';
  copyValue: string;
}>();

const { ui } = useAppI18n();
const { copied, copyValue: copyText } = useCopyableValue();

async function onCopy(event?: MouseEvent) {
  await copyText(props.copyValue, event);
}
</script>

<template>
  <div
    :class="[sharedStyles.policyWalletRow, sharedStyles.policyWalletRowCopyable]"
    data-project-settings-copy=""
    role="button"
    tabindex="0"
    @click="onCopy($event)"
    @keydown.enter.prevent="onCopy()"
    @keydown.space.prevent="onCopy()"
  >
    <span :class="sharedStyles.policyValue">{{ walletName }}</span>
    <EgColorfulTag :colorful-style="tagStyle" size="sm">
      ★{{ ui(tagKey) }}
    </EgColorfulTag>
    <EgDivider
      :class="sharedStyles.policyWalletDivider"
      type="page"
      direction="vertical"
    />
    <span :class="styles.idCluster">
      <span :class="styles.idText">ID: {{ props.copyValue }}</span>
      <span :class="[styles.copyButton, copied && styles.copyButtonCopied]" @click.stop>
        <DetailValueActionIcon
          :label="ui('Copy')"
          :icon="copied ? 'eds-enable-fill' : 'eds-copy'"
          boundary-selector=".app-preview"
          @click="onCopy($event)"
        />
      </span>
    </span>
  </div>
</template>
