<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgButton,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgIcon,
  EgInput,
  EgLayout,
  EgLinkButton,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  AML_QUERY_FEE_DISPLAY,
  AML_QUERY_NETWORK_OPTIONS,
  AML_QUERY_PROVIDER_OPTIONS,
  AML_QUERY_TYPE_OPTIONS,
  type AmlQueryProviderId,
  type AmlQueryTypeId,
} from './riskControlAmlQueryOptions';
import styles from './RiskControlAmlQueryPage.module.css';

const { ui } = useAppI18n();

const queryTypeId = ref<AmlQueryTypeId>('address');
const network = ref<string>('');
const providerId = ref<AmlQueryProviderId>('elliptic');
const queryValue = ref('');

const selectedType = computed(
  () => AML_QUERY_TYPE_OPTIONS.find((option) => option.id === queryTypeId.value)
    ?? AML_QUERY_TYPE_OPTIONS[0],
);

const selectedProvider = computed(
  () => AML_QUERY_PROVIDER_OPTIONS.find((option) => option.id === providerId.value)
    ?? AML_QUERY_PROVIDER_OPTIONS[0],
);

const queryPlaceholderKey = computed(() =>
  queryTypeId.value === 'address'
    ? 'Please enter address'
    : 'Please enter transaction hash',
);

const canSubmit = computed(
  () => network.value.trim().length > 0 && queryValue.value.trim().length > 0,
);

function selectType(nextTypeId: AmlQueryTypeId) {
  queryTypeId.value = nextTypeId;
}

function selectNetwork(nextNetwork: string) {
  network.value = nextNetwork;
}

function selectProvider(nextProviderId: AmlQueryProviderId) {
  providerId.value = nextProviderId;
}

function onSubmit() {
  if (!canSubmit.value) return;
}
</script>

<template>
  <div class="desktopTokens" :class="styles.page">
    <EgLayout type="empty" :show-toolbar="false">
      <div :class="styles.pageBody">
        <div :class="styles.scrollBody">
          <div :class="styles.content">
            <section :class="styles.heroCard">
              <div :class="styles.searchBar">
              <div :class="styles.filters">
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
                      :class="styles.filterTrigger"
                      trigger-style="subtle"
                      size="sm"
                      width-mode="adaptive"
                      :label="ui(selectedType.labelKey)"
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
                        v-for="option in AML_QUERY_TYPE_OPTIONS"
                        :key="option.id"
                        box-type="text"
                        :label="ui(option.labelKey)"
                        :selected="queryTypeId === option.id"
                        @click="selectType(option.id)"
                      />
                    </EgFlotationMenu>
                  </template>
                </EgFlotation>

                <span :class="styles.filterDivider" aria-hidden="true" />

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
                      :class="styles.filterTrigger"
                      trigger-style="subtle"
                      size="sm"
                      width-mode="adaptive"
                      :label="network || ui('Please Select')"
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
                        v-for="option in AML_QUERY_NETWORK_OPTIONS"
                        :key="option"
                        box-type="text"
                        :label="option"
                        :selected="network === option"
                        @click="selectNetwork(option)"
                      />
                    </EgFlotationMenu>
                  </template>
                </EgFlotation>

                <span :class="styles.filterDivider" aria-hidden="true" />

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
                      :class="styles.filterTrigger"
                      trigger-style="subtle"
                      size="sm"
                      width-mode="adaptive"
                      :label="selectedProvider.label"
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
                        v-for="option in AML_QUERY_PROVIDER_OPTIONS"
                        :key="option.id"
                        box-type="text"
                        :label="option.label"
                        :selected="providerId === option.id"
                        @click="selectProvider(option.id)"
                      />
                    </EgFlotationMenu>
                  </template>
                </EgFlotation>
              </div>

              <div :class="styles.inputShell">
                <EgInput
                  v-model="queryValue"
                  width-mode="full"
                  size="md"
                  :placeholder="ui(queryPlaceholderKey)"
                  :clearable="false"
                  :overflow-feedback="false"
                />
              </div>

              <div :class="styles.searchAction">
                <EgButton
                  :class="styles.searchActionButton"
                  tone="decor"
                  variant="solid"
                  size="md"
                  type="button"
                  :disabled="!canSubmit"
                  @click="onSubmit"
                >
                  <EgIcon name="eds-aml-search" size="sm" />
                  {{ ui('Confirm') }}
                </EgButton>
              </div>
            </div>
            </section>

            <div :class="styles.noticeSection">
              <ul :class="styles.noticeList">
                <li :class="styles.noticeItem">
                  {{ ui('AML query caution dangerous address') }}
                </li>
                <li :class="styles.noticeItem">
                  {{ ui('AML query caution suspicious funds') }}
                </li>
                <li :class="styles.noticeItem">
                  {{ ui('AML query caution coverage limit') }}
                </li>
              </ul>

              <EgLinkButton tone="brand" size="sm" href="#">
                {{ ui('Learn more') }}
              </EgLinkButton>
            </div>
          </div>
        </div>

        <footer :class="styles.footer">
          <EgDivider type="page" direction="horizontal" hide />
          <div :class="styles.footerInner">
            <p :class="styles.feeLine">
              {{ ui('AML query fee prefix') }}
              <span :class="styles.feeAmount">{{ AML_QUERY_FEE_DISPLAY }}</span>
              {{ ui('AML query fee suffix') }}
            </p>
            <EgButton
              :class="styles.footerConfirm"
              tone="decor"
              variant="solid"
              size="md"
              type="button"
              :disabled="!canSubmit"
              @click="onSubmit"
            >
              {{ ui('Confirm') }}
            </EgButton>
          </div>
        </footer>
      </div>
    </EgLayout>
  </div>
</template>
