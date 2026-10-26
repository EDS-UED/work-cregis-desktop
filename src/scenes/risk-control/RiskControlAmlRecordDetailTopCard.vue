<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '@eds/desktop-components';
import ellipticProviderLogoUrl from '@/assets/risk-control/elliptic-provider-logo.svg';
import { useAppI18n } from '@/composables/useAppI18n';
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailEntityTags from './RiskControlAmlRecordDetailEntityTags.vue';
import RiskControlAmlRecordDetailRiskRatingValue from './RiskControlAmlRecordDetailRiskRatingValue.vue';
import RiskControlAmlRecordDetailRiskScoreInfoTrigger from './RiskControlAmlRecordDetailRiskScoreInfoTrigger.vue';
import eyebrowStyles from './RiskControlAmlRecordDetailRiskScoreEyebrow.module.css';
import styles from './RiskControlAmlRecordDetailTopCard.module.css';
import { AML_EXCEPTION_HANDLED_RISK_LABEL_KEY } from './riskControlAmlQueryRecordStore';
import { resolveAmlRiskRatingVisual } from './list-field/resolveAmlRiskRatingVisual';

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

const showRiskScoreMeta = computed(
  () => props.detail.riskLabelKey !== AML_EXCEPTION_HANDLED_RISK_LABEL_KEY,
);

const amlRiskVisual = computed(() => resolveAmlRiskRatingVisual(props.detail.riskCustomStyle));

const scoreRiskVisual = computed(() =>
  resolveAmlRiskRatingVisual(props.detail.riskScoreCustomStyle),
);

const scoreToneClass = computed(() => {
  const numerator = props.detail.riskScoreNumerator.trim();
  if (numerator === '--' || props.detail.riskLabelKey === 'NA') {
    return styles.scoreValueNa;
  }
  if (scoreRiskVisual.value.tone === 'danger') return styles.scoreValueDanger;
  if (scoreRiskVisual.value.tone === 'warning') return styles.scoreValueWarning;
  return styles.scoreValueSuccess;
});

const showEllipticProvider = computed(
  () => props.detail.serviceProvider.trim().toLowerCase() === 'elliptic',
);

const riskRatingCriteriaRuleName = computed(() => props.detail.ruleName.trim());

type RiskClassificationSegments = {
  rulePrefix: string;
  beforeThreshold: string;
  threshold: string;
  afterThreshold: string;
};

const riskClassificationSegments = computed((): RiskClassificationSegments | null => {
  const template = ui('AML query risk classification sentence').trim();
  if (!template || !template.includes('{threshold}')) return null;

  const [beforeRaw, afterThreshold = ''] = template.split('{threshold}');
  const threshold = String(props.detail.riskThreshold);
  const ruleName = riskRatingCriteriaRuleName.value;

  let rulePrefix = '';
  let beforeThreshold = beforeRaw;
  if (beforeRaw.includes('{ruleName}')) {
    const ruleIndex = beforeRaw.indexOf('{ruleName}');
    rulePrefix = ruleName;
    beforeThreshold = beforeRaw.slice(ruleIndex + '{ruleName}'.length);
  }

  return {
    rulePrefix,
    beforeThreshold,
    threshold,
    afterThreshold,
  };
});

const showRiskClassificationLine = computed(() => riskClassificationSegments.value !== null);
</script>

<template>
  <div :class="styles.host" data-aml-record-top-card>
    <div :class="styles.entityHeadlineGroup">
      <div :class="styles.entityHeadlineBody">
        <span :class="eyebrowStyles.eyebrowText">{{ ui('Entity of Target Address') }}</span>
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
          <RiskControlAmlRecordDetailRiskRatingValue
            :label-key="detail.riskLabelKey"
            :custom-style="detail.riskCustomStyle"
            :query-failed="detail.isQueryFailed"
            :query-exception="detail.isQueryException && !detail.exceptionHandlingResolved"
            :manual-review-completed="detail.manualReviewCompleted"
          />
          <template v-if="showRiskScoreMeta">
            <EgDivider
              type="navigator"
              direction="vertical"
              :class="styles.metaDivider"
            />
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
          </template>
        </div>
        <p
          v-if="showRiskClassificationLine && riskClassificationSegments"
          :class="['typography-footnote', styles.scoreMetaSubtext]"
        >
          <span
            v-if="riskClassificationSegments.rulePrefix"
            :class="styles.scoreMetaSubtextRuleName"
          >
            {{ riskClassificationSegments.rulePrefix }}
          </span>
          <span>{{ riskClassificationSegments.beforeThreshold }}</span>
          <span :class="['eds-code-text', styles.scoreMetaSubtextThreshold]">
            {{ riskClassificationSegments.threshold }}
          </span>
          <span>{{ riskClassificationSegments.afterThreshold }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
