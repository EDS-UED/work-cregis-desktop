<script setup lang="ts">
import { computed } from 'vue';
import { EgButton, EgBusinessTag, EgDivider, EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { riskControlAmlRecordDetailOverlayRegistry } from './riskControlAmlRecordDetailOverlayContext';
import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailCounterpartyTable from './RiskControlAmlRecordDetailCounterpartyTable.vue';
import RiskControlAmlRecordDetailExposureBar from './RiskControlAmlRecordDetailExposureBar.vue';
import styles from './RiskControlAmlRecordDetailQueryResultPanel.module.css';

const props = defineProps<{
  detail: RiskControlAmlQueryRecordDetail;
}>();

const { ui } = useAppI18n();

const overlay = computed(() => riskControlAmlRecordDetailOverlayRegistry.value);

const showBlacklistAction = computed(
  () => props.detail.riskCustomStyle === 'aml-danger',
);

function onBlacklist() {
  overlay.value?.requestBlacklist();
}

function onManualReview() {
  overlay.value?.openManualReview();
}
</script>

<template>
  <div :class="detailChromeStyles.appendSection">
    <section :class="detailChromeStyles.sectionContent">
      <div :class="detailChromeStyles.sectionTitleRow">
        <h3 :class="['typography-body-small-strong', detailChromeStyles.sectionTitle]">
          {{ ui('AML risk profile title') }}
        </h3>
      </div>

      <div :class="styles.sectionBody">
        <div :class="styles.riskProfileCardRow">
          <div :class="styles.shallowSubsectionCard">
            <span :class="styles.subsectionTitle">
              {{ ui('AML risk composition title') }}
            </span>

            <div :class="styles.directionBlock">
              <span :class="styles.directionLabel">{{ ui('Inbound direction') }}</span>
              <RiskControlAmlRecordDetailExposureBar :exposure="detail.sourceExposure" />
            </div>

            <div :class="styles.directionBlock">
              <span :class="styles.directionLabel">{{ ui('Outbound direction') }}</span>
              <RiskControlAmlRecordDetailExposureBar :exposure="detail.destinationExposure" />
            </div>
          </div>

          <div :class="styles.shallowSubsectionCard">
            <span :class="styles.subsectionTitle">
              {{ ui('Source') }}
            </span>
            <div :class="styles.categoryList">
              <div
                v-for="share in detail.sourceCategoryShares"
                :key="share.id"
                :class="styles.categoryRow"
              >
                <EgBusinessTag family="custom" :custom-style="share.customStyle" size="md">
                  {{ ui(share.labelKey) }}
                </EgBusinessTag>
                <span class="typography-body-medium">{{ share.percent }}%</span>
              </div>
            </div>

            <span :class="styles.subsectionTitle">
              {{ ui('Outbound direction') }}
            </span>
            <div :class="styles.categoryList">
              <div
                v-for="share in detail.destinationCategoryShares"
                :key="share.id"
                :class="styles.categoryRow"
              >
                <EgBusinessTag family="custom" :custom-style="share.customStyle" size="md">
                  {{ ui(share.labelKey) }}
                </EgBusinessTag>
                <span class="typography-body-medium">{{ share.percent }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <EgDivider :class="detailChromeStyles.sectionDivider" type="module" direction="horizontal" />

    <section :class="detailChromeStyles.sectionContent">
      <div :class="styles.sectionBody">
        <div :class="styles.handlingIntro">
          <h3
            :class="[
              'typography-body-small-strong',
              detailChromeStyles.sectionTitle,
              styles.handlingSectionTitle,
            ]"
          >
            {{ ui('AML handling recommendations title') }}
          </h3>
          <p :class="styles.handlingLead">
            {{ ui('AML handling recommendations lead') }}
          </p>
        </div>

        <div :class="styles.actionCardRow">
          <div v-if="showBlacklistAction" :class="styles.actionCard">
            <div :class="styles.actionCardHead">
              <span :class="styles.actionCardIconShell">
                <EgIcon
                  name="eds-circle-pentagram"
                  size="md"
                  fit
                  fill-tone="primary"
                />
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
            <EgButton variant="solid" tone="danger" size="md" @click="onBlacklist">
              {{ ui('Add Blacklist') }}
            </EgButton>
          </div>

          <div :class="styles.actionCard">
            <div :class="styles.actionCardHead">
              <span :class="styles.actionCardIconShell">
                <EgIcon
                  name="eds-shield-check"
                  size="md"
                  fit
                  fill-tone="primary"
                />
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
            <EgButton variant="solid" tone="decor" size="md" @click="onManualReview">
              {{ ui('AML handling manual review title') }}
            </EgButton>
          </div>

          <div :class="styles.actionCard">
            <div :class="styles.actionCardHead">
              <span :class="styles.actionCardIconShell">
                <EgIcon
                  name="eds-text-note"
                  size="md"
                  fit
                  fill-tone="primary"
                />
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

    <EgDivider :class="detailChromeStyles.sectionDivider" type="module" direction="horizontal" />

    <section :class="detailChromeStyles.sectionContent">
      <div :class="detailChromeStyles.sectionTitleRow">
        <h3 :class="['typography-body-small-strong', detailChromeStyles.sectionTitle]">
          {{ ui('AML counterparty risk title') }}
        </h3>
      </div>
      <div :class="styles.sectionBody">
        <div :class="styles.tableWrap">
          <RiskControlAmlRecordDetailCounterpartyTable :rows="detail.counterpartyRows" />
        </div>
        <p :class="['typography-body-small', styles.hint]">
          {{ ui('AML counterparty risk hint') }}
        </p>
      </div>
    </section>
  </div>
</template>
