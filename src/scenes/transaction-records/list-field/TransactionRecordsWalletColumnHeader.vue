<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDataListCellOverflow,
  EgIcon,
  EgIconButton,
  EgTooltip,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import { TRANSACTION_RECORDS_DEMO_WALLET_NAMES } from '../transactionRecordData';
import styles from '../TransactionRecordsDataListPage.module.css';

const { ui, locale } = useAppI18n();

const demoWalletNames = [...TRANSACTION_RECORDS_DEMO_WALLET_NAMES];

const walletHintPrefix = computed(() => ui('Affiliated wallet column hint'));

const walletNameSeparator = computed(() => (locale.value === 'en' ? ', ' : '、'));
</script>

<template>
  <div :class="styles.walletHeader">
    <EgDataListCellOverflow
      :content-class="pageStyles.comboHeaderSegmentText"
      context="header"
    >
      {{ ui('Affiliated Wallet') }}
    </EgDataListCellOverflow>
    <EgTooltip
      :class="styles.walletHeaderTooltip"
      trigger="hover"
      placement="bottom"
      align="start"
      width-mode="fixed"
      :width="328"
      height-mode="adaptive"
      boundary-selector=".eds-data-list"
      close-on-scroll
      :scrollable="false"
      :open-delay="120"
      :close-delay="80"
      :token-scope-class="`desktopTokens eds-overflow-text-tooltip ${styles.walletHeaderTooltipPanel}`"
    >
      <EgIconButton
        shape="square"
        size="xs"
        :class="styles.walletHeaderIconButton"
        :label="ui('Affiliated Wallet')"
        @click.stop
      >
        <EgIcon
          :class="styles.walletHeaderIconOutline"
          name="eds-information"
          fit
        />
        <EgIcon
          :class="styles.walletHeaderIconFill"
          name="eds-information-fill"
          fit
        />
      </EgIconButton>
      <template #content>
        {{ walletHintPrefix }}
        <template v-for="(name, index) in demoWalletNames" :key="name">
          <span v-if="index > 0">{{ walletNameSeparator }}</span>
          <span :class="['eds-code-text', styles.walletHeaderTooltipCode]">{{ name }}</span>
        </template>
      </template>
    </EgTooltip>
  </div>
</template>
