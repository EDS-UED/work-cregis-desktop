import { ref, watch } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  autoRuleNameExists,
  autoRuleInflowScopeTaken,
  autoRuleOutflowScopeTaken,
  buildNewAutoRuleRowFromDraft,
  deleteAutoRuleRow,
  updateAutoRuleRowEnabled,
  upsertAutoRuleRow,
} from './riskControlAutoRuleStore';

type RiskControlAutoRuleVerifyIntent = 'form-submit' | 'delete';
import type { RiskControlAutoRuleOutflowCurrencyEntry } from './riskControlAutoRuleOutflowCurrencyOptions';
import {
  INFLOW_TRIGGER_TYPE_OPTIONS,
  isInflowTriggerTypeKey,
} from './riskControlAutoRuleInflowTriggerOptions';
import {
  joinManualOutflowWalletLabels,
  outflowWalletIdsFromScopeText,
} from './riskControlAutoRuleOutflowScopeOptions';

const WITHDRAWAL_TYPE_MANUAL = 'Manual Transfer';

function resolveOutflowScopeLabel(draft: RiskControlAutoRuleFormDraft): string {
  if (draft.withdrawalTypeKey === WITHDRAWAL_TYPE_MANUAL) {
    return joinManualOutflowWalletLabels(draft.scopeWalletIds);
  }
  return draft.scopeTarget.trim();
}

export type RiskControlAutoRuleFormMode = 'create' | 'edit';

export type RiskControlAutoRuleFormDraft = {
  direction: 'inflow' | 'outflow';
  ruleName: string;
  withdrawalTypeKey: string;
  scopeTarget: string;
  /** 人工出款 · 出款钱包（多选）。 */
  scopeWalletIds: string[];
  /** 人工出款 · 币种阈值（可选填金额，空=0）。 */
  currencyEntries: RiskControlAutoRuleOutflowCurrencyEntry[];
  skipWhitelist: boolean;
  skipInternal: boolean;
  screeningNodeKey: string;
  riskScoreThreshold: string;
  riskControlActionKey: string;
  exceptionHandlingKey: string;
  exceptionHandlerMemberIds: string[];
  riskAlertRecipientKeys: string[];
  riskAlertInAppRecipientIds: string[];
  riskAlertEmailTeamMemberIds: string[];
  riskAlertOtherEmails: string[];
  serviceProvider: string;
  waasProject: string;
};

const MOCK_TRADE_PASSWORD = '111111';
const AML_QUERY_UNIT_FEE_USD = '0.50';

function resolveStatusToggleConfirmMessage(
  translate: (key: string) => string,
  direction: 'inflow' | 'outflow',
  enabling: boolean,
): string {
  const withFee = (template: string) =>
    template.replace('{fee}', AML_QUERY_UNIT_FEE_USD);
  if (direction === 'outflow') {
    return enabling
      ? withFee(translate('Auto rule enable outflow confirm'))
      : translate('Auto rule disable outflow confirm');
  }
  return enabling
    ? withFee(translate('Auto rule enable inflow confirm'))
    : translate('Auto rule disable inflow confirm');
}

function defaultDraft(direction: 'inflow' | 'outflow'): RiskControlAutoRuleFormDraft {
  return {
    direction,
    ruleName: '',
    withdrawalTypeKey: '',
    scopeTarget: '',
    scopeWalletIds: [],
    currencyEntries: [],
    skipWhitelist: true,
    skipInternal: true,
    screeningNodeKey: 'Before approval process',
    riskScoreThreshold: '7.0',
    riskControlActionKey: 'Alarm the reviewer(s)/signer(s)',
    exceptionHandlingKey: 'Skip the query',
    exceptionHandlerMemberIds: [],
    riskAlertRecipientKeys: [],
    riskAlertInAppRecipientIds: [],
    riskAlertEmailTeamMemberIds: [],
    riskAlertOtherEmails: [],
    serviceProvider: '',
    waasProject: '',
  };
}

function draftFromRow(row: PaymentEngineRecordRow): RiskControlAutoRuleFormDraft {
  const direction = row.autoRuleDirection ?? 'inflow';
  const scopeKeyFromRow = row.autoRuleScopeKey ?? 'Manual Transfer';
  const withdrawalTypeKey =
    direction === 'inflow'
      ? (isInflowTriggerTypeKey(scopeKeyFromRow)
          ? scopeKeyFromRow
          : INFLOW_TRIGGER_TYPE_OPTIONS[0]?.titleKey ?? '')
      : scopeKeyFromRow;
  const scopeText = row.autoRuleWaasProject?.trim() ?? '';
  const isManualOutflow =
    direction === 'outflow' && withdrawalTypeKey === WITHDRAWAL_TYPE_MANUAL;
  return {
    ...defaultDraft(direction),
    ruleName: row.ruleName?.trim() ?? '',
    withdrawalTypeKey,
    scopeTarget: isManualOutflow ? '' : scopeText,
    scopeWalletIds: isManualOutflow ? outflowWalletIdsFromScopeText(scopeText) : [],
    waasProject: scopeText,
    serviceProvider: row.autoRuleServiceProvider?.trim() ?? 'Elliptic',
  };
}

export function useRiskControlAutoRuleFlow() {
  const { ui } = useAppI18n();

  const noPermissionDialogOpen = ref(false);
  const editBlockedDialogOpen = ref(false);
  const pendingEditBlockedRow = ref<PaymentEngineRecordRow | null>(null);
  const formOpen = ref(false);
  const verifyOpen = ref(false);

  const formMode = ref<RiskControlAutoRuleFormMode>('create');
  const formDraft = ref<RiskControlAutoRuleFormDraft>(defaultDraft('outflow'));
  const editingRow = ref<PaymentEngineRecordRow | null>(null);
  const pendingDirection = ref<'inflow' | 'outflow'>('outflow');
  const skipDisableDialogOpen = ref(false);
  const pendingSkipOffField = ref<'skipWhitelist' | 'skipInternal' | null>(null);

  const skipDisableMessageKey = ref('Auto rule skip whitelist disable confirm');

  const deleteDialogOpen = ref(false);
  const pendingDeleteRow = ref<PaymentEngineRecordRow | null>(null);
  const verifyIntent = ref<RiskControlAutoRuleVerifyIntent>('form-submit');

  const statusToggleDialogOpen = ref(false);
  const statusToggleConfirmMessage = ref('');
  const pendingStatusToggle = ref<{ rowId: string; nextEnabled: boolean } | null>(null);

  function closeForm() {
    formOpen.value = false;
  }

  function onConfigFormPageSettled() {
    if (!formOpen.value) {
      editingRow.value = null;
    }
  }

  function confirmCreateDirection(direction: 'inflow' | 'outflow') {
    closeAllAnchoredTooltips();
    pendingDirection.value = direction;
    formMode.value = 'create';
    editingRow.value = null;
    formDraft.value = defaultDraft(direction);
    formOpen.value = true;
  }

  function startEdit(row: PaymentEngineRecordRow) {
    closeAllAnchoredTooltips();
    if (row.ruleEnabled) {
      pendingEditBlockedRow.value = row;
      editBlockedDialogOpen.value = true;
      return;
    }
    formMode.value = 'edit';
    editingRow.value = row;
    formDraft.value = draftFromRow(row);
    formOpen.value = true;
  }

  function requestSubmit() {
    verifyIntent.value = 'form-submit';
    verifyOpen.value = true;
  }

  function requestDelete(row: PaymentEngineRecordRow) {
    closeAllAnchoredTooltips();
    pendingDeleteRow.value = row;
    deleteDialogOpen.value = true;
  }

  function confirmDelete() {
    if (!pendingDeleteRow.value) return;
    deleteDialogOpen.value = false;
    verifyIntent.value = 'delete';
    verifyOpen.value = true;
  }

  function cancelDelete() {
    deleteDialogOpen.value = false;
    pendingDeleteRow.value = null;
  }

  function requestStatusToggle(row: PaymentEngineRecordRow, nextEnabled: boolean) {
    closeAllAnchoredTooltips();
    pendingStatusToggle.value = { rowId: row.id, nextEnabled };
    statusToggleConfirmMessage.value = resolveStatusToggleConfirmMessage(
      ui,
      row.autoRuleDirection ?? 'inflow',
      nextEnabled,
    );
    statusToggleDialogOpen.value = true;
  }

  function confirmStatusToggle() {
    const pending = pendingStatusToggle.value;
    statusToggleDialogOpen.value = false;
    pendingStatusToggle.value = null;
    if (pending) {
      updateAutoRuleRowEnabled(pending.rowId, pending.nextEnabled);
    }
  }

  function cancelStatusToggle() {
    statusToggleDialogOpen.value = false;
    pendingStatusToggle.value = null;
  }

  function confirmEditBlockedDisable() {
    const row = pendingEditBlockedRow.value;
    editBlockedDialogOpen.value = false;
    pendingEditBlockedRow.value = null;
    if (!row) return;
    updateAutoRuleRowEnabled(row.id, false);
    startEdit({ ...row, ruleEnabled: false });
  }

  function cancelEditBlocked() {
    editBlockedDialogOpen.value = false;
    pendingEditBlockedRow.value = null;
  }

  watch(editBlockedDialogOpen, (open) => {
    if (open) return;
    pendingEditBlockedRow.value = null;
  });

  function submitTradePassword(code: string): boolean {
    return code.trim() === MOCK_TRADE_PASSWORD;
  }

  function requestSkipDisableConfirm(field: 'skipWhitelist' | 'skipInternal') {
    closeAllAnchoredTooltips();
    pendingSkipOffField.value = field;
    skipDisableMessageKey.value =
      field === 'skipInternal'
        ? 'Auto rule skip internal disable confirm'
        : 'Auto rule skip whitelist disable confirm';
    skipDisableDialogOpen.value = true;
  }

  function confirmSkipDisableOff() {
    skipDisableDialogOpen.value = false;
    const field = pendingSkipOffField.value;
    pendingSkipOffField.value = null;
    if (field) {
      formDraft.value = {
        ...formDraft.value,
        [field]: false,
      };
    }
  }

  function cancelSkipDisableOff() {
    skipDisableDialogOpen.value = false;
    pendingSkipOffField.value = null;
  }

  watch(skipDisableDialogOpen, (open) => {
    if (open) return;
    if (pendingSkipOffField.value !== null) {
      pendingSkipOffField.value = null;
    }
  });

  function onVerifyClosed(accepted: boolean) {
    verifyOpen.value = false;
    if (!accepted) {
      if (verifyIntent.value === 'delete') {
        pendingDeleteRow.value = null;
      }
      return;
    }

    if (verifyIntent.value === 'delete') {
      const row = pendingDeleteRow.value;
      pendingDeleteRow.value = null;
      verifyIntent.value = 'form-submit';
      if (row) {
        deleteAutoRuleRow(row.id);
        if (editingRow.value?.id === row.id) {
          closeForm();
        }
        showAppEndFeedbackAfterOverlay();
      }
      return;
    }

    const draft = formDraft.value;
    const existing = editingRow.value;
    const row = buildNewAutoRuleRowFromDraft({
      direction: draft.direction,
      ruleName: draft.ruleName,
      withdrawalTypeKey: draft.withdrawalTypeKey,
      scopeLabel: resolveOutflowScopeLabel(draft),
      waasProject: draft.waasProject,
      serviceProvider: draft.serviceProvider,
      existingId: existing?.id,
      existingNumber: existing?.ruleNumber,
      createdAt: existing?.createdAt,
    });
    upsertAutoRuleRow(row);
    closeForm();
    showAppEndFeedbackAfterOverlay();
  }

  const overlaySurface = {
    noPermissionDialogOpen,
    editBlockedDialogOpen,
    confirmEditBlockedDisable,
    cancelEditBlocked,
    formOpen,
    verifyOpen,
    formMode,
    formDraft,
    editingRow,
    pendingDirection,
    confirmCreateDirection,
    startEdit,
    closeForm,
    onConfigFormPageSettled,
    requestSubmit,
    submitTradePassword,
    onVerifyClosed,
    autoRuleNameExists,
    autoRuleScopeTaken(
      scopeLabel: string,
      withdrawalTypeKey: string,
      excludeRuleId?: string,
    ) {
      if (formDraft.value.direction === 'inflow') {
        return autoRuleInflowScopeTaken(scopeLabel, excludeRuleId);
      }
      return autoRuleOutflowScopeTaken(scopeLabel, withdrawalTypeKey, excludeRuleId);
    },
    skipDisableDialogOpen,
    skipDisableMessageKey,
    requestSkipDisableConfirm,
    confirmSkipDisableOff,
    cancelSkipDisableOff,
    deleteDialogOpen,
    requestDelete,
    confirmDelete,
    cancelDelete,
    statusToggleDialogOpen,
    statusToggleConfirmMessage,
    requestStatusToggle,
    confirmStatusToggle,
    cancelStatusToggle,
  };

  return {
    overlaySurface,
    startEdit,
    requestDelete,
    requestStatusToggle,
  };
}
