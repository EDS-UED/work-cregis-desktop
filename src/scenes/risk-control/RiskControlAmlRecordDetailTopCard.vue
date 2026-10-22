<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgDivider } from '@eds/desktop-components';
import ellipticProviderLogoUrl from '@/assets/risk-control/elliptic-provider-logo.svg';
import { useAppI18n } from '@/composables/useAppI18n';
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailEntityTags from './RiskControlAmlRecordDetailEntityTags.vue';
import RiskControlAmlRecordDetailRiskRatingValue from './RiskControlAmlRecordDetailRiskRatingValue.vue';
import RiskControlAmlRecordDetailRiskScoreInfoTrigger from './RiskControlAmlRecordDetailRiskScoreInfoTrigger.vue';
import eyebrowStyles from './RiskControlAmlRecordDetailRiskScoreEyebrow.module.css';
import styles from './RiskControlAmlRecordDetailTopCard.module.css';
import { useRiskControlAmlRecordDetailFieldCopyScroll } from './useRiskControlAmlRecordDetailFieldCopyScroll';

const props = defineProps<{
  detail: RiskControlAmlQueryRecordDetail;
}>();

const { ui } = useAppI18n();

const entityDisplay = computed(() => {
  const trimmed = props.detail.belongingEntity.trim();
  if (!trimmed || trimmed === '--') return ui('NA');
  return trimmed;
});

const showEntityTags = computed(
  () => props.detail.entityTags.length > 0
    && !props.detail.isQueryFailed
    && !props.detail.isQueryException,
);

const scoreToneClass = computed(() => {
  const numerator = props.detail.riskScoreNumerator.trim();
  if (numerator === '--' || props.detail.riskLabelKey === 'NA') {
    return styles.scoreValueNa;
  }
  if (props.detail.riskCustomStyle === 'aml-danger') return styles.scoreValueDanger;
  if (props.detail.riskCustomStyle === 'aml-suspicious') return styles.scoreValueWarning;
  return styles.scoreValueSuccess;
});

const showEllipticProvider = computed(
  () => props.detail.serviceProvider.trim().toLowerCase() === 'elliptic',
);

const hostRef = ref<HTMLElement | null>(null);
const { fieldCopyCollapsed } = useRiskControlAmlRecordDetailFieldCopyScroll(hostRef);
</script>

<template>
  <div
    ref="hostRef"
    :class="styles.host"
    data-aml-record-top-card
    :data-field-copy-collapsed="fieldCopyCollapsed ? '' : undefined"
  >
    <div :class="styles.entityHeadlineGroup">
      <div :class="styles.entityHeadlineBody">
        <span :class="eyebrowStyles.eyebrowText">{{ ui('Belonging Entity') }}</span>
        <div :class="styles.entityNameRow">
          <div :class="styles.entityNameMain">
            <span :class="['typography-headline', styles.entityName]">
              {{ entityDisplay }}
            </span>
            <RiskControlAmlRecordDetailEntityTags
              v-if="showEntityTags"
              :tags="detail.entityTags"
            />
          </div>
          <img
            v-if="showEllipticProvider"
            :class="styles.providerLogo"
            :src="ellipticProviderLogoUrl"
            alt=""
            aria-hidden="true"
          />
          <span
            v-else-if="detail.serviceProvider.trim()"
            :class="['typography-body-small', styles.providerFallback]"
          >
            {{ detail.serviceProvider }}
          </span>
        </div>
        <div :class="styles.scoreMetaRow">
          <div :class="styles.scoreRow">
            <span :class="['typography-body-small', styles.scoreLabel]">
              {{ ui('Risk Score') }}:
            </span>
            <span :class="['typography-body-small-strong', scoreToneClass]">
              {{ detail.riskScoreNumerator }}
            </span>
            <span :class="['typography-body-small', styles.scoreDenominator]">
              / {{ detail.riskScoreMax }}
            </span>
            <RiskControlAmlRecordDetailRiskScoreInfoTrigger />
          </div>
          <EgDivider
            type="navigator"
            direction="vertical"
            :class="styles.metaDivider"
          />
          <RiskControlAmlRecordDetailRiskRatingValue
            :label-key="detail.riskLabelKey"
            :custom-style="detail.riskCustomStyle"
          />
        </div>
      </div>
    </div>

    <div :class="styles.fieldCopyCollapse">
      <ul :class="styles.fieldCopyList">
        <li :class="styles.fieldCopyItem">
          <div :class="styles.fieldBlock">
            <p :class="['typography-footnote', styles.fieldBody]">
              <span :class="['typography-footnote-strong', styles.fieldLabel]">
                {{ ui('Risk Summary') }}
              </span>
              {{ detail.riskSummaryText }}
            </p>
          </div>
        </li>

        <li :class="styles.fieldCopyItem">
          <div :class="styles.fieldBlock">
            <p :class="['typography-footnote', styles.fieldBody]">
              <span :class="['typography-footnote-strong', styles.fieldLabel]">
                {{ ui('Risk Rating Criteria') }}
              </span>
              {{ detail.riskClassificationText }}
            </p>
          </div>
        </li>

        <li :class="styles.fieldCopyItem">
          <span :class="['typography-footnote', styles.disclaimer]">
            {{ ui('AML query result disclaimer') }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
