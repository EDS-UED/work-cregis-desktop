<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import {
  EgButton,
  EgIcon,
  EgIconProButton,
  EgTooltip,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAmlManualQueryFormPage from './aml-manual-query/RiskControlAmlManualQueryFormPage.vue';
import RiskControlAmlManualQueryPageShell from './aml-manual-query/RiskControlAmlManualQueryPageShell.vue';
import { riskControlAmlManualQueryPageStackKey } from './aml-manual-query/riskControlAmlManualQueryPageStackContext';
import { registerRiskControlAmlManualQueryOverlay } from './aml-manual-query/riskControlAmlManualQueryOverlayContext';
import { useRiskControlAmlManualQueryFlow } from './aml-manual-query/useRiskControlAmlManualQueryFlow';
import PaymentEngineDataListPage from '@/scenes/payment-engine/PaymentEngineDataListPage.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import batchSigningStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import '@/scenes/tasks/signing/batch/batchSigning.networkPickerMenu.css';
import { registerRiskControlAutoRuleFlow } from './auto-rule/riskControlAutoRuleFlowContext';
import {
  registerRiskControlAutoRuleOverlay,
  riskControlAutoRuleOverlayRegistry,
} from './auto-rule/riskControlAutoRuleOverlayContext';
import { resolveRiskControlAutoRuleCreatePermission } from './auto-rule/riskControlAutoRulePermission';
import RiskControlAutoRuleCreatePageShell from './auto-rule/RiskControlAutoRuleCreatePageShell.vue';
import RiskControlAutoRuleFormPage from './auto-rule/RiskControlAutoRuleFormPage.vue';
import { riskControlAutoRulePageStackKey } from './auto-rule/riskControlAutoRulePageStackContext';
import { useRiskControlAutoRuleFlow } from './auto-rule/useRiskControlAutoRuleFlow';
import { riskControlAutoRuleRowsRef } from './auto-rule/riskControlAutoRuleStore';
import { buildRiskControlRecordRows } from './riskControlRecordData';
import { resolveRiskControlRecordConfig } from './riskControlRecordConfigs';
import {
  isRiskControlAmlMenuItem,
  isRiskControlAutoRulesMenuItem,
  shouldOpenRiskControlDetailOnRowClick,
} from './riskControlMenuData';

const props = defineProps<{
  menuItem: string;
}>();

const { ui } = useAppI18n();

const amlManualQueryFlow = useRiskControlAmlManualQueryFlow();
const amlManualQueryFormRef = ref<InstanceType<typeof RiskControlAmlManualQueryFormPage> | null>(
  null,
);

provide(riskControlAmlManualQueryPageStackKey, {
  configFormOpen: amlManualQueryFlow.formOpen,
  closeConfigForm: amlManualQueryFlow.closeForm,
  onConfigFormPageSettled: amlManualQueryFlow.onConfigFormPageSettled,
});

const amlManualQueryCanSubmit = computed(
  () => amlManualQueryFormRef.value?.canSubmit ?? false,
);

const amlManualQueryContentRevision = computed(
  () => amlManualQueryFormRef.value?.contentRevision ?? '',
);

const autoRuleFlow = useRiskControlAutoRuleFlow();
const autoRuleSurface = autoRuleFlow.overlaySurface;

provide(riskControlAutoRulePageStackKey, {
  configFormOpen: autoRuleSurface.formOpen,
  closeConfigForm: autoRuleSurface.closeForm,
  onConfigFormPageSettled: autoRuleSurface.onConfigFormPageSettled,
});

const autoRuleFormToolbarTitleKey = computed(() => {
  const isEdit = autoRuleSurface.formMode.value === 'edit';
  const isOutflow = autoRuleSurface.formDraft.value.direction === 'outflow';
  if (isEdit) {
    return isOutflow ? 'Edit Outflow Rule' : 'Edit Inflow Rule';
  }
  return isOutflow ? 'Create Outflow Rule' : 'Create Inflow Rule';
});

watch(
  () => props.menuItem,
  () => {
    if (!isRiskControlAutoRulesMenuItem(props.menuItem) && autoRuleSurface.formOpen.value) {
      autoRuleSurface.closeForm();
    }
    if (!isRiskControlAmlMenuItem(props.menuItem) && amlManualQueryFlow.formOpen.value) {
      amlManualQueryFlow.closeForm();
    }
  },
);

const autoRuleFormPageRef = ref<InstanceType<typeof RiskControlAutoRuleFormPage> | null>(null);

const autoRuleFormCanSubmit = computed(() => autoRuleFormPageRef.value?.canSubmit ?? false);

const autoRuleFormConfirmLabel = computed(
  () => autoRuleFormPageRef.value?.confirmLabel ?? ui('Create'),
);

const autoRuleFormContentRevision = computed(() => {
  const draft = autoRuleSurface.formDraft.value;
  return [
    autoRuleSurface.formMode.value,
    draft.direction,
    draft.withdrawalTypeKey,
    draft.exceptionHandlingKey,
    draft.exceptionHandlerMemberIds.join(','),
    draft.riskAlertRecipientKeys.join(','),
    draft.riskAlertInAppRecipientIds.join(','),
    draft.riskAlertEmailTeamMemberIds.join(','),
    draft.riskAlertOtherEmails.join(','),
  ].join(':');
});

const autoRuleDirectionPanelOpen = ref(false);
const autoRuleDirectionTooltipRef = ref<{ close?: () => void } | null>(null);

onMounted(() => {
  registerRiskControlAutoRuleFlow({
    startEdit: autoRuleFlow.startEdit,
    requestDelete: autoRuleFlow.requestDelete,
    requestStatusToggle: autoRuleFlow.requestStatusToggle,
  });
  registerRiskControlAutoRuleOverlay(autoRuleFlow.overlaySurface);
  registerRiskControlAmlManualQueryOverlay(amlManualQueryFlow.overlaySurface);
});

onBeforeUnmount(() => {
  registerRiskControlAutoRuleFlow(null);
  registerRiskControlAutoRuleOverlay(null);
  registerRiskControlAmlManualQueryOverlay(null);
});

function onToolbarAction(key: string): boolean {
  if (key === 'addNew' && isRiskControlAmlMenuItem(props.menuItem)) {
    amlManualQueryFlow.openForm();
    return true;
  }
  return false;
}

function onAutoRuleAddClickCapture(event: MouseEvent) {
  if (!isRiskControlAutoRulesMenuItem(props.menuItem)) return;
  if (resolveRiskControlAutoRuleCreatePermission()) return;

  event.preventDefault();
  event.stopPropagation();
  const surface = riskControlAutoRuleOverlayRegistry.value;
  if (surface) surface.noPermissionDialogOpen.value = true;
}

function onAutoRuleDirectionOpen() {
  autoRuleDirectionPanelOpen.value = true;
}

function onAutoRuleDirectionClose() {
  autoRuleDirectionPanelOpen.value = false;
}

function dismissAutoRuleDirectionTooltip() {
  autoRuleDirectionTooltipRef.value?.close?.();
}

function onAutoRuleDirectionSelect(direction: 'inflow' | 'outflow') {
  riskControlAutoRuleOverlayRegistry.value?.confirmCreateDirection(direction);
  dismissAutoRuleDirectionTooltip();
}

function canOpenDetailOnRowClick(row: PaymentEngineRecordRow, menuItem: string): boolean {
  return shouldOpenRiskControlDetailOnRowClick(menuItem, row);
}

function buildRows(menuItem: string, count: number) {
  void riskControlAutoRuleRowsRef.value;
  return buildRiskControlRecordRows(menuItem, count);
}
</script>

<template>
  <PaymentEngineDataListPage
    :menu-item="menuItem"
    :module-layout-page-stack="
      isRiskControlAutoRulesMenuItem(menuItem) || isRiskControlAmlMenuItem(menuItem)
    "
    :resolve-config="resolveRiskControlRecordConfig"
    :build-rows="buildRows"
    :open-detail-on-row-click="false"
    :can-open-detail-on-row-click="canOpenDetailOnRowClick"
    :toolbar-action-handler="onToolbarAction"
  >
    <template v-if="isRiskControlAmlMenuItem(menuItem)" #module-stack-create>
      <RiskControlAmlManualQueryPageShell
        :title="ui('AML Query')"
        :confirm-label="ui('Confirm')"
        :can-submit="amlManualQueryCanSubmit"
        :content-revision="amlManualQueryContentRevision"
        @back="amlManualQueryFlow.closeForm()"
        @cancel="amlManualQueryFlow.closeForm()"
        @confirm="amlManualQueryFormRef?.submitForm()"
      >
        <RiskControlAmlManualQueryFormPage
          ref="amlManualQueryFormRef"
          @submit="amlManualQueryFlow.requestSubmit()"
        />
      </RiskControlAmlManualQueryPageShell>
    </template>

    <template
      v-if="isRiskControlAmlMenuItem(menuItem)"
      #toolbar-add-new="{ button }"
    >
      <EgIconProButton
        :label="ui('Manual Query')"
        :disabled="button.item.disabled"
        @click="onToolbarAction('addNew')"
      >
        <EgIcon :name="button.item.icon" size="sm" />
      </EgIconProButton>
    </template>

    <template v-if="isRiskControlAutoRulesMenuItem(menuItem)" #module-stack-create>
      <RiskControlAutoRuleCreatePageShell
        :title="ui(autoRuleFormToolbarTitleKey)"
        :confirm-label="autoRuleFormConfirmLabel"
        :can-submit="autoRuleFormCanSubmit"
        :content-revision="autoRuleFormContentRevision"
        @back="autoRuleSurface.closeForm()"
        @cancel="autoRuleSurface.closeForm()"
        @confirm="autoRuleFormPageRef?.submitForm()"
      >
        <RiskControlAutoRuleFormPage
          ref="autoRuleFormPageRef"
          :mode="autoRuleSurface.formMode.value"
          :draft="autoRuleSurface.formDraft.value"
          :exclude-rule-id="autoRuleSurface.editingRow.value?.id"
          :name-exists="autoRuleSurface.autoRuleNameExists"
          :scope-taken="autoRuleSurface.autoRuleOutflowScopeTaken"
          :request-skip-disable-confirm="autoRuleSurface.requestSkipDisableConfirm"
          @update:draft="(value) => { autoRuleSurface.formDraft.value = value }"
          @submit="autoRuleSurface.requestSubmit()"
        />
      </RiskControlAutoRuleCreatePageShell>
    </template>

    <template
      v-if="isRiskControlAutoRulesMenuItem(menuItem)"
      #toolbar-add-new="{ button }"
    >
      <span @click.capture="onAutoRuleAddClickCapture">
        <EgTooltip
          ref="autoRuleDirectionTooltipRef"
          trigger="click"
          placement="bottom"
          align="start"
          width-mode="fixed"
          :width="380"
          height-mode="adaptive"
          :scrollable="false"
          panel-flush
          :click-toggle="false"
          :disabled="Boolean(button.item.disabled)"
          boundary-selector=".app-preview"
          teleport-to=".app-preview"
          @open="onAutoRuleDirectionOpen"
          @close="onAutoRuleDirectionClose"
        >
          <EgIconProButton
            :label="ui(button.item.label)"
            :disabled="button.item.disabled"
            :active="autoRuleDirectionPanelOpen"
          >
            <EgIcon :name="button.item.icon" size="sm" />
          </EgIconProButton>

          <template #content>
            <div class="networkPickerRowsAutoRuleDirection">
              <header class="networkPickerHeader networkPickerHeaderAutoRuleDirection">
                <div class="networkPickerHeaderContent">
                  <div :class="batchSigningStyles.batchDetailDataListCell">
                    <p :class="batchSigningStyles.batchSectionTitle">
                      {{ ui('Create Rule') }}
                    </p>
                    <p class="typography-body-small networkPickerAutoRuleDirectionHint">
                      {{ ui('Auto rule create direction hint') }}
                    </p>
                  </div>
                </div>
              </header>
              <div
                class="networkPickerListAutoRuleDirection"
                role="group"
                :aria-label="ui('Auto rule create direction hint')"
              >
                <ProjectCreateModeCard
                  content-layout="stack"
                  stack-preset="aml-direction"
                  description-typography="footnote-primary"
                  :show-radio="false"
                  :title="ui('Inflow')"
                  :description="ui('Screen inflow funds')"
                  @select="onAutoRuleDirectionSelect('inflow')"
                >
                  <template #media>
                    <div
                      class="networkPickerAutoRuleDirectionIcon networkPickerAutoRuleDirectionIconInflow"
                    >
                      <div class="networkPickerAutoRuleDirectionIconGlyph">
                        <EgIcon name="eds-arrow-entry" fit />
                      </div>
                    </div>
                  </template>
                </ProjectCreateModeCard>
                <ProjectCreateModeCard
                  content-layout="stack"
                  stack-preset="aml-direction"
                  description-typography="footnote-primary"
                  :show-radio="false"
                  :title="ui('Outflow')"
                  :description="ui('Screen the receiving address before withdrawal')"
                  @select="onAutoRuleDirectionSelect('outflow')"
                >
                  <template #media>
                    <div
                      class="networkPickerAutoRuleDirectionIcon networkPickerAutoRuleDirectionIconOutflow"
                    >
                      <div class="networkPickerAutoRuleDirectionIconGlyph">
                        <EgIcon name="eds-arrow-outflow" fit />
                      </div>
                    </div>
                  </template>
                </ProjectCreateModeCard>
              </div>
            </div>
          </template>
        </EgTooltip>
      </span>
    </template>
  </PaymentEngineDataListPage>
</template>
