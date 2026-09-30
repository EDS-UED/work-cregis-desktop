<script setup lang="ts">
import { ref } from 'vue';
import {
  EgDivider,
  EgIcon,
  EgLinkButton,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { RiskControlAmlRiskTraceSection } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import styles from './RiskControlAmlRecordDetailRiskTracePanel.module.css';

const props = defineProps<{
  sourceTrace: RiskControlAmlRiskTraceSection;
  destinationTrace: RiskControlAmlRiskTraceSection;
}>();

const { ui } = useAppI18n();

const expandedObjectId = ref<string | null>(
  props.destinationTrace.objects.at(-1)?.id ?? null,
);

function toggleObject(objectId: string) {
  expandedObjectId.value = expandedObjectId.value === objectId ? null : objectId;
}

function expandIconName(expanded: boolean) {
  return expanded ? 'eds-arrow-up-mini-ios' : 'eds-arrow-down-mini-ios';
}

function sectionIconName(direction: RiskControlAmlRiskTraceSection['direction']) {
  return direction === 'source' ? 'eds-arrow-down' : 'eds-arrow-up';
}

function sectionIconClass(direction: RiskControlAmlRiskTraceSection['direction']) {
  return direction === 'source' ? styles.sectionIconSource : styles.sectionIconDestination;
}

function formatTraceValue(value: string | undefined): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '--';
  return formatGroupedDecimalAmount(trimmed);
}

function resolveEntityTypeLabel(value: string | undefined): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '--';
  const translated = ui(trimmed);
  return translated === trimmed && /^[A-Z0-9_]+$/.test(trimmed) ? trimmed : translated;
}

function resolveRiskRatingLabel(value: string | undefined): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '--';
  return ui(trimmed);
}

function isObjectExpanded(objectId: string): boolean {
  return expandedObjectId.value === objectId;
}
</script>

<template>
  <div :class="detailChromeStyles.appendSection">
    <p :class="styles.manualHint">
      {{ ui('AML query records manual hint prefix') }}
      <EgLinkButton size="sm" tone="brand">
        {{ ui('Function Manual') }}
      </EgLinkButton>
    </p>

    <section
      v-for="section in [sourceTrace, destinationTrace]"
      :key="section.direction"
      :class="styles.section"
    >
      <div :class="styles.sectionHeader">
        <span :class="[styles.sectionIcon, sectionIconClass(section.direction)]">
          <EgIcon
            :name="sectionIconName(section.direction)"
            fit
            :class="styles.sectionIconGlyph"
          />
        </span>
        <span :class="styles.sectionTitle">
          {{
            section.direction === 'source'
              ? ui('Source Risk Score')
              : ui('Destination Risk Score')
          }}: {{ section.score }}
        </span>
      </div>

      <div :class="styles.objectList">
        <div
          v-for="(objectEntry, index) in section.objects"
          :key="objectEntry.id"
          :class="[
            styles.objectBlock,
            isObjectExpanded(objectEntry.id) && styles.objectBlockExpanded,
          ]"
        >
          <div
            :class="[
              styles.objectRow,
              styles.objectRowInteractive,
            ]"
            role="button"
            tabindex="0"
            :aria-expanded="isObjectExpanded(objectEntry.id)"
            @click="toggleObject(objectEntry.id)"
            @keydown.enter.prevent="toggleObject(objectEntry.id)"
            @keydown.space.prevent="toggleObject(objectEntry.id)"
          >
            <div :class="styles.objectLabelRow">
              <span :class="styles.objectLabel">
                {{ ui('Risk Associated Object') }} {{ index + 1 }}
              </span>
              <EgIcon
                name="eds-info-circle"
                size="sm"
                :class="styles.objectInfoIcon"
              />
            </div>
            <span :class="styles.objectValue">{{ objectEntry.label }}</span>
            <EgIcon
              :name="expandIconName(isObjectExpanded(objectEntry.id))"
              size="sm"
              :class="styles.objectChevron"
            />
          </div>

          <EgDivider
            v-if="isObjectExpanded(objectEntry.id)"
            type="page"
            direction="horizontal"
            :class="styles.objectDetailDivider"
          />

          <div
            v-if="isObjectExpanded(objectEntry.id)"
            :class="styles.objectDetail"
          >
            <div :class="styles.detailRow">
              <span :class="styles.detailLabel">{{ ui('Entity Type') }}</span>
              <span :class="styles.detailValue">
                {{ resolveEntityTypeLabel(objectEntry.entityType) }}
              </span>
            </div>
            <div :class="styles.detailRow">
              <span :class="styles.detailLabel">{{ ui('Risk Score') }}</span>
              <span :class="styles.detailValue">{{ objectEntry.riskScore ?? '--' }}</span>
            </div>
            <div :class="styles.detailRow">
              <span :class="styles.detailLabel">{{ ui('Risk Rating') }}</span>
              <span :class="styles.detailValue">
                {{ resolveRiskRatingLabel(objectEntry.riskRating) }}
              </span>
            </div>
            <div :class="styles.detailRow">
              <span :class="styles.detailLabel">{{ ui('Amount (USD)') }}</span>
              <span :class="styles.detailValue">
                {{ formatTraceValue(objectEntry.amountUsd) }}
              </span>
            </div>
            <div :class="styles.detailRow">
              <span :class="styles.detailLabel">{{ ui('Contribution Ratio (%)') }}</span>
              <span :class="styles.detailValue">
                {{ formatTraceValue(objectEntry.contributionPercent) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <EgDivider
        v-if="section.direction === 'source'"
        :class="detailChromeStyles.sectionDivider"
        type="page"
        direction="horizontal"
      />
    </section>
  </div>
</template>
