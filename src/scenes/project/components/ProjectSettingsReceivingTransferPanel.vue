<script setup lang="ts">
import { ref } from 'vue';
import {
  EgCrypto,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgTag,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  RECEIVING_TRANSFER_ADDRESS_OPTIONS,
  RECEIVING_TRANSFER_DEMO_GROUPS,
  RECEIVING_TRANSFER_WALLET_OPTIONS,
  resolveReceivingTransferOptionLabel,
  type ProjectSettingsReceivingTransferTokenGroup,
} from '@/scenes/project/components/projectSettingsReceivingTransferDemo';
import styles from './ProjectSettingsReceivingTransferPanel.module.css';

const { ui } = useAppI18n();

const groups = ref<ProjectSettingsReceivingTransferTokenGroup[]>(
  RECEIVING_TRANSFER_DEMO_GROUPS.map((group) => ({
    ...group,
    networks: group.networks.map((network) => ({ ...network })),
  })),
);

function walletLabel(walletId: string | null) {
  return resolveReceivingTransferOptionLabel(RECEIVING_TRANSFER_WALLET_OPTIONS, walletId);
}

function addressLabel(addressId: string | null) {
  return resolveReceivingTransferOptionLabel(RECEIVING_TRANSFER_ADDRESS_OPTIONS, addressId);
}

function setWallet(networkId: string, walletId: string) {
  groups.value = groups.value.map((group) => ({
    ...group,
    networks: group.networks.map((network) =>
      network.id === networkId ? { ...network, walletId } : network,
    ),
  }));
}

function setAddress(networkId: string, addressId: string) {
  groups.value = groups.value.map((group) => ({
    ...group,
    networks: group.networks.map((network) =>
      network.id === networkId ? { ...network, addressId } : network,
    ),
  }));
}

function groupHeadingLabel(group: ProjectSettingsReceivingTransferTokenGroup) {
  if (!group.multichain) return group.symbol;
  return `${group.symbol} (${ui('Multichain')})`;
}

</script>

<template>
  <div :class="styles.panel">
    <h4 :class="styles.heading">{{ ui('Receiving Currency') }}</h4>

    <div :class="styles.table">
      <div :class="styles.tableHeader">
        <span>{{ ui('Token') }}</span>
        <span>{{ ui('Settlement Wallet') }}</span>
        <span>{{ ui('Wallet Address') }}</span>
      </div>

      <div :class="styles.tableBody">
        <div
          v-for="group in groups"
          :key="group.id"
          :class="styles.groupBlock"
        >
          <div
            v-if="group.multichain"
            :class="styles.groupHeadingRow"
          >
            <div :class="styles.tokenCell">
              <span :class="styles.cryptoIcon">
                <EgCrypto :name="group.cryptoName as CryptoName" size="sm" fit />
              </span>
              <span :class="styles.tokenLabel">{{ groupHeadingLabel(group) }}</span>
            </div>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </div>

          <div
            v-for="network in group.networks"
            :key="network.id"
            :class="styles.networkRow"
          >
            <div
              :class="group.multichain ? styles.networkTokenCell : styles.tokenCell"
            >
              <template v-if="!group.multichain">
                <span :class="styles.cryptoIcon">
                  <EgCrypto :name="group.cryptoName as CryptoName" size="sm" fit />
                </span>
                <span :class="styles.tokenLabel">{{ group.symbol }}</span>
              </template>
              <EgTag size="sm" system-type="stroke-subtle" truncate>
                {{ network.networkLabel }}
              </EgTag>
            </div>

            <div :class="styles.selectCell">
              <EgFlotation
                placement="bottom"
                align="start"
                width-mode="adaptive"
                :show-add="false"
                :show-menu-divider="false"
                close-on-scroll
              >
                <template #trigger="{ expanded }">
                  <EgFlotationTrigger
                    :class="styles.selectTrigger"
                    trigger-style="subtle"
                    size="md"
                    width-mode="adaptive"
                    :label="walletLabel(network.walletId) || ui('Please Select')"
                    :expanded="expanded"
                  />
                </template>
                <template #content>
                  <EgFlotationMenu
                    panel-radius="radius-md"
                    width-mode="adaptive"
                    height-mode="adaptive"
                    :show-add="false"
                    :show-divider="false"
                  >
                    <EgFlotationMenuItem
                      v-for="option in RECEIVING_TRANSFER_WALLET_OPTIONS"
                      :key="option.id"
                      box-type="text"
                      :label="option.label"
                      :selected="network.walletId === option.id"
                      @click="setWallet(network.id, option.id)"
                    />
                  </EgFlotationMenu>
                </template>
              </EgFlotation>
            </div>

            <div :class="styles.selectCell">
              <EgFlotation
                placement="bottom"
                align="start"
                width-mode="adaptive"
                :show-add="false"
                :show-menu-divider="false"
                close-on-scroll
              >
                <template #trigger="{ expanded }">
                  <EgFlotationTrigger
                    :class="styles.selectTrigger"
                    trigger-style="subtle"
                    size="md"
                    width-mode="adaptive"
                    :label="addressLabel(network.addressId) || ui('Please Select')"
                    :expanded="expanded"
                  />
                </template>
                <template #content>
                  <EgFlotationMenu
                    panel-radius="radius-md"
                    width-mode="adaptive"
                    height-mode="adaptive"
                    :show-add="false"
                    :show-divider="false"
                  >
                    <EgFlotationMenuItem
                      v-for="option in RECEIVING_TRANSFER_ADDRESS_OPTIONS"
                      :key="option.id"
                      box-type="text"
                      :label="option.label"
                      :selected="network.addressId === option.id"
                      @click="setAddress(network.id, option.id)"
                    />
                  </EgFlotationMenu>
                </template>
              </EgFlotation>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
