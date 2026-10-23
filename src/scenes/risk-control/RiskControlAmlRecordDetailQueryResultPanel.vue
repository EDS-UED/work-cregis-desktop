<script setup lang="ts">
import { computed, inject } from 'vue';
import { closeAllAnchoredTooltips, EgButton, EgIcon } from '@eds/desktop-components';
import { navigateToBlacklistCreateFromAml } from './blacklist/riskControlBlacklistCreateIntent';
import { useAppI18n } from '@/composables/useAppI18n';
import { riskControlAmlRecordDetailActionsKey } from './riskControlAmlRecordDetailActionsKey';
import {
  resolveAmlManualReviewDefaultRiskLevel,
  resolveAmlManualReviewShowSafeWaasHintWhenSelectingSafe,
} from './resolveAmlManualReviewDefaultRiskLevel';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { riskControlAmlRecordDetailOverlayRegistry } from './riskControlAmlRecordDetailOverlayContext';
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailExposureBar from './RiskControlAmlRecordDetailExposureBar.vue';
import RiskControlAmlRecordDetailManualReviewPopover from './RiskControlAmlRecordDetailManualReviewPopover.vue';
import styles from './RiskControlAmlRecordDetailQueryResultPanel.module.css';
import triggerStyles from './riskControlAmlActionPopoverTrigger.module.css';

const props = withDefaults(
  defineProps<{
    detail: RiskControlAmlQueryRecordDetail;
    /** 由 RiskProfileTabAppend 提供外层 append 壳时设为 true。 */
    embedded?: boolean;
  }>(),
  { embedded: false },
);

const { ui } = useAppI18n();

const overlay = computed(() => riskControlAmlRecordDetailOverlayRegistry.value);

const showBlacklistAction = computed(
  () => props.detail.riskCustomStyle === 'aml-danger',
);

const manualReviewDefaultRiskLevel = computed(() =>
  resolveAmlManualReviewDefaultRiskLevel(props.detail),
);

const manualReviewShowSafeWaasHintWhenSelectingSafe = computed(() =>
  resolveAmlManualReviewShowSafeWaasHintWhenSelectingSafe(props.detail),
);

const amlRecordDetailActions = inject(riskControlAmlRecordDetailActionsKey, null);

function onAddBlacklistNavigate() {
  closeAllAnchoredTooltips();
  amlRecordDetailActions?.closeDetail();
  const recordId =
    props.detail.collaborationNumber.trim() || props.detail.ruleNumber.trim();
  navigateToBlacklistCreateFromAml({
    address: props.detail.targetValue.trim(),
    networkLabel: props.detail.networkLabel.trim(),
    amlQueryRecordId: recordId || undefined,
    prefilledFromAmlQueryRecord: true,
  });
}

function formatDirectionHighRiskPercent(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
</script>

<template>
  <div
    :class="[
      !embedded && detailChromeStyles.appendSection,
      !embedded && styles.queryResultAppendSection,
      embedded && styles.queryResultEmbeddedStack,
    ]"
  >
    <section :class="detailChromeStyles.sectionContent">
      <div :class="detailChromeStyles.sectionTitleRow">
        <h3 :class="['typography-body-small-strong', detailChromeStyles.sectionTitle]">
          {{ ui('AML risk composition title') }}
        </h3>
      </div>

      <div :class="styles.sectionBody">
        <div :class="styles.shallowSubsectionCard">
          <div :class="styles.compositionStack">
            <div :class="styles.directionBlock">
              <div :class="styles.directionLabelRow">
                <span
                  :class="[
                    styles.directionSectionIcon,
                    styles.directionSectionIconSource,
                  ]"
                >
                  <span :class="styles.directionSectionIconGlyph">
                    <EgIcon name="eds-arrow-entry" fit />
                  </span>
                </span>
                <span :class="['typography-body-medium', styles.directionLabel]">
                  {{ ui('Inbound direction') }}
                  <span :class="styles.directionLabelPercent">
                    ({{ formatDirectionHighRiskPercent(detail.sourceExposure.highRiskPercent) }}%)
                  </span>
                </span>
              </div>
              <RiskControlAmlRecordDetailExposureBar :exposure="detail.sourceExposure" />
            </div>

            <div :class="styles.directionBlock">
              <div :class="styles.directionLabelRow">
                <span
                  :class="[
                    styles.directionSectionIcon,
                    styles.directionSectionIconDestination,
                  ]"
                >
                  <span :class="styles.directionSectionIconGlyph">
                    <EgIcon name="eds-arrow-outflow" fit />
                  </span>
                </span>
                <span :class="['typography-body-medium', styles.directionLabel]">
                  {{ ui('Outbound direction') }}
                  <span :class="styles.directionLabelPercent">
                    ({{ formatDirectionHighRiskPercent(detail.destinationExposure.highRiskPercent) }}%)
                  </span>
                </span>
              </div>
              <RiskControlAmlRecordDetailExposureBar :exposure="detail.destinationExposure" />
            </div>

            <div v-if="detail.riskSummaryText.trim()" :class="styles.compositionSummaryBlock">
              <p :class="['typography-footnote', styles.compositionSummaryText]">
                <span :class="['typography-footnote-strong', styles.compositionSummaryLabel]">
                  {{ ui('Risk Summary') }}
                </span>
                {{ detail.riskSummaryText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section :class="detailChromeStyles.sectionContent">
      <div :class="[detailChromeStyles.sectionTitleRow, styles.handlingTitleRow]">
        <div :class="styles.handlingIntro">
          <h3 :class="['typography-body-small-strong', styles.handlingSectionTitle]">
            {{ ui('AML handling recommendations title') }}
          </h3>
          <p :class="styles.handlingLead">
            {{ ui('AML handling recommendations lead') }}
          </p>
        </div>
      </div>

      <div :class="styles.sectionBody">
        <div :class="styles.actionCardRow">
          <div v-if="showBlacklistAction" :class="styles.actionCard">
            <div :class="styles.actionCardHead">
              <span
                :class="[styles.actionCardIconShell, styles.actionCardIconShellBlacklist]"
              >
                <span :class="styles.actionCardIconGlyph">
                  <EgIcon name="eds-black-list-fill" fit fill-tone="primary" />
                </span>
              </span>
              <div :class="styles.actionCardCopy">
                <span :class="styles.actionTitle">
                  {{ ui('AML handling blacklist title') }}
                </span>
                <span :class="styles.actionDesc">
                  {{ ui('AML handling blacklist desc') }}
                </span>
              </div>
            </div>
            <div :class="styles.actionCardAction">
              <span :class="triggerStyles.triggerHost">
                <EgButton
                  variant="solid"
                  tone="danger"
                  size="md"
                  @click="onAddBlacklistNavigate"
                >
                  {{ ui('Add Blacklist') }}
                </EgButton>
              </span>
            </div>
          </div>

          <div :class="styles.actionCard">
            <div :class="styles.actionCardHead">
              <span :class="styles.actionCardIconShell">
                <span :class="styles.actionCardIconGlyph">
                  <EgIcon name="eds-stamp-fill" fit fill-tone="primary" />
                </span>
              </span>
              <div :class="styles.actionCardCopy">
                <span :class="styles.actionTitle">
                  {{ ui('AML handling manual review title') }}
                </span>
                <span :class="styles.actionDesc">
                  {{ ui('AML handling manual review desc') }}
                </span>
              </div>
            </div>
            <div :class="styles.actionCardAction">
              <RiskControlAmlRecordDetailManualReviewPopover
                :initial-risk-level="manualReviewDefaultRiskLevel"
                :show-safe-waas-hint-when-selecting-safe="manualReviewShowSafeWaasHintWhenSelectingSafe"
                @submit="(level) => overlay?.onManualReviewSubmit(level)"
              />
            </div>
          </div>

          <div :class="styles.actionCard">
            <div :class="styles.actionCardHead">
              <span :class="styles.actionCardIconShell">
                <span :class="styles.actionCardIconGlyph">
                  <EgIcon name="eds-text-order-fill" fit fill-tone="primary" />
                </span>
              </span>
              <div :class="styles.actionCardCopy">
                <span :class="styles.actionTitle">
                  {{ ui('AML handling report title') }}
                </span>
                <span :class="styles.actionDesc">
                  {{ ui('AML handling report desc') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
