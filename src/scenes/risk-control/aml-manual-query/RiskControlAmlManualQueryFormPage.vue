<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgDivider,
  EgInput,
  EgLinkButton,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import ellipticProviderLogoUrl from '@/assets/risk-control/elliptic-provider-logo.svg';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import {
  AML_QUERY_DIRECTION_OPTIONS,
  AML_QUERY_FEE_DISPLAY,
  type AmlQueryDirectionId,
  type AmlQueryTypeId,
} from '@/scenes/risk-control/riskControlAmlQueryOptions';
import RiskControlAmlManualQueryNetworkField from './RiskControlAmlManualQueryNetworkField.vue';
import styles from './RiskControlAmlManualQueryFormPage.module.css';

const { ui } = useAppI18n();

const SERVICE_PROVIDER_ELLIPTIC = 'Elliptic';

const queryTypeId = ref<AmlQueryTypeId | ''>('');
const serviceProviderKey = ref('');
const directionId = ref<AmlQueryDirectionId | ''>('');
const network = ref('');
const addressValue = ref('');
const receivingAddressValue = ref('');
const transactionHashValue = ref('');

const isAddressQuery = computed(() => queryTypeId.value === 'address');
const isTransactionQuery = computed(() => queryTypeId.value === 'transaction-hash');

const selectedDirection = computed(
  () => AML_QUERY_DIRECTION_OPTIONS.find((option) => option.id === directionId.value),
);

function toggleQueryType(nextTypeId: AmlQueryTypeId) {
  queryTypeId.value = queryTypeId.value === nextTypeId ? '' : nextTypeId;
}

function toggleServiceProvider() {
  serviceProviderKey.value =
    serviceProviderKey.value === SERVICE_PROVIDER_ELLIPTIC ? '' : SERVICE_PROVIDER_ELLIPTIC;
}

const isEllipticProviderSelected = computed(
  () => serviceProviderKey.value === SERVICE_PROVIDER_ELLIPTIC,
);

function selectDirection(nextDirectionId: AmlQueryDirectionId, close: () => void) {
  directionId.value = nextDirectionId;
  close();
}

watch(queryTypeId, () => {
  directionId.value = '';
  network.value = '';
  addressValue.value = '';
  receivingAddressValue.value = '';
  transactionHashValue.value = '';
});

const canSubmit = computed(() => {
  if (!queryTypeId.value || !isEllipticProviderSelected.value) return false;
  if (!network.value.trim()) return false;
  if (isAddressQuery.value) {
    return addressValue.value.trim().length > 0;
  }
  return (
    Boolean(directionId.value)
    && receivingAddressValue.value.trim().length > 0
    && transactionHashValue.value.trim().length > 0
  );
});

const contentRevision = computed(() =>
  [
    queryTypeId.value,
    serviceProviderKey.value,
    directionId.value,
    network.value,
    addressValue.value.length,
    receivingAddressValue.value.length,
    transactionHashValue.value.length,
  ].join(':'),
);

const emit = defineEmits<{
  submit: [];
}>();

function submitForm() {
  if (!canSubmit.value) return;
  emit('submit');
}

defineExpose({
  canSubmit,
  contentRevision,
  submitForm,
});
</script>

<template>
  <div class="desktopTokens" :class="styles.formStack">
    <section :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Type') }}</span>
      <div
        :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]"
      >
        <ProjectCreateModeCard
          radio-name="aml-manual-query-type"
          radio-value="address"
          expand-style="embeddedPanel"
          :title="ui('Address Query')"
          :description="''"
          :selected="isAddressQuery"
          @select="toggleQueryType('address')"
        >
          <div :class="styles.embeddedPanelBody" @click.stop @mousedown.stop>
            <div :class="styles.cardBodyField">
              <span :class="styles.cardBodySectionTitle">{{ ui('Query Network') }}</span>
              <RiskControlAmlManualQueryNetworkField v-model="network" />
            </div>
            <div :class="styles.cardBodyField">
              <span :class="styles.cardBodySectionTitle">{{ ui('Address') }}</span>
              <EgInput
                v-model="addressValue"
                width-mode="full"
                size="md"
                :placeholder="ui('Please Enter')"
                :clearable="false"
              />
            </div>
          </div>
        </ProjectCreateModeCard>

        <ProjectCreateModeCard
          radio-name="aml-manual-query-type"
          radio-value="transaction-hash"
          expand-style="embeddedPanel"
          :title="ui('Transaction Query')"
          :description="''"
          :selected="isTransactionQuery"
          @select="toggleQueryType('transaction-hash')"
        >
          <div :class="styles.embeddedPanelBody" @click.stop @mousedown.stop>
            <div :class="styles.cardBodyField">
              <span :class="styles.cardBodySectionTitle">{{ ui('Direction') }}</span>
              <EgFlotation
              :class="styles.scopeFlotationHost"
              placement="bottom"
              align="start"
              width-mode="trigger"
              :show-add="false"
              :show-menu-divider="false"
              :close-on-scroll="false"
              flip
            >
              <template #trigger="{ expanded }">
                <EgFlotationTrigger
                  :class="styles.scopeFlotationTrigger"
                  trigger-style="subtle"
                  size="md"
                  width-mode="adaptive"
                  :label="
                    selectedDirection
                      ? ui(selectedDirection.labelKey)
                      : ui('Please Select')
                  "
                  :expanded="expanded"
                />
              </template>
              <template #content="{ menuWidth, menuWidthMode, close }">
                <EgFlotationMenu
                  panel-radius="radius-md"
                  :width-mode="menuWidthMode"
                  :width="menuWidth"
                  height-mode="adaptive"
                  :show-add="false"
                  :show-divider="false"
                >
                  <EgFlotationMenuItem
                    v-for="option in AML_QUERY_DIRECTION_OPTIONS"
                    :key="option.id"
                    box-type="text"
                    :label="ui(option.labelKey)"
                    :selected="directionId === option.id"
                    @click="selectDirection(option.id, close)"
                  />
                </EgFlotationMenu>
              </template>
            </EgFlotation>
            </div>
            <div :class="styles.cardBodyField">
              <span :class="styles.cardBodySectionTitle">{{ ui('Query Network') }}</span>
              <RiskControlAmlManualQueryNetworkField v-model="network" />
            </div>
            <div :class="styles.cardBodyField">
              <span :class="styles.cardBodySectionTitle">{{ ui('Receiving Address') }}</span>
              <EgInput
                v-model="receivingAddressValue"
                width-mode="full"
                size="md"
                :placeholder="ui('Please Enter')"
                :clearable="false"
              />
            </div>
            <div :class="styles.cardBodyField">
              <span :class="styles.cardBodySectionTitle">{{ ui('Transaction Hash') }}</span>
              <EgInput
                v-model="transactionHashValue"
                width-mode="full"
                size="md"
                :placeholder="ui('Please Enter')"
                :clearable="false"
              />
            </div>
          </div>
        </ProjectCreateModeCard>
      </div>
    </section>

    <section :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Service Provider') }}</span>
      <ProjectCreateModeCard
        radio-name="aml-manual-query-service-provider"
        radio-value="elliptic"
        :title="SERVICE_PROVIDER_ELLIPTIC"
        :selected="isEllipticProviderSelected"
        @select="toggleServiceProvider"
      >
        <template #description>
          <EgLinkButton
            tone="brand"
            size="sm"
            href="#"
            @click.stop
          >
            {{ ui('Learn more') }}
          </EgLinkButton>
        </template>
        <template #trailing>
          <img
            :class="styles.serviceProviderLogo"
            :src="ellipticProviderLogoUrl"
            alt=""
            aria-hidden="true"
          />
        </template>
      </ProjectCreateModeCard>
    </section>

    <section :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('AML Query Fee') }}</span>
      <div :class="styles.fieldBlockContent">
        <p :class="styles.queryFeeLine">
          <span :class="styles.queryFeeAmount">{{ AML_QUERY_FEE_DISPLAY }}</span>
          {{ ui('AML query fee suffix') }}
        </p>
      </div>
    </section>

    <EgDivider type="page" direction="horizontal" :class="styles.sectionDivider" />

    <section :class="styles.fieldBlock">
      <div :class="styles.fieldLabelGroup">
        <span :class="styles.warmReminderLabel">{{ ui('Warm reminder') }}</span>
      </div>
      <div :class="styles.fieldBlockContent">
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
      </div>
    </section>
  </div>
</template>
