<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDetail,
  EgDialog,
  EgIcon,
  EgIconButton,
  EgPopup,
  EgVerify,
  closeAllAnchoredTooltips,
  useVerifySubmit,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import { paymentEngineState, usePaymentEnginePage } from './usePaymentEnginePage';
import { paymentEngineSettingsState } from './paymentEngineSettings';
import styles from './PaymentEngineFlowHost.module.css';

const { ui } = useAppI18n();
const page = usePaymentEnginePage(() => 'Order Record');
const { activeTab } = page;

const detailShell = usePopupShellLifecycle({
  open: () => paymentEngineState.detailOpen,
  onClosed: () => {
    paymentEngineState.detailOpen = false;
  },
});

const disableCallbackShell = usePopupShellLifecycle({
  open: () => paymentEngineSettingsState.disableCallbackOpen,
  onClosed: () => {
    paymentEngineSettingsState.disableCallbackOpen = false;
  },
});

const exportShell = usePopupShellLifecycle({
  open: () => paymentEngineState.exportOpen,
  onClosed: () => {
    paymentEngineState.exportOpen = false;
  },
});

const {
  verify,
  onComplete,
  onRecover,
  reset,
  wasAccepted,
} = useVerifySubmit({
  submit: (code) => /^\d{6}$/.test(code),
  requestClose: () => {
    paymentEngineSettingsState.googleVerifyOpen = false;
  },
});

const googleVerifyShell = usePopupShellLifecycle({
  open: () => paymentEngineSettingsState.googleVerifyOpen,
  onBeforeOpen: () => {
    closeAllAnchoredTooltips();
    reset();
  },
  onClosed: () => {
    paymentEngineSettingsState.googleVerifyOpen = false;
    if (wasAccepted()) {
      paymentEngineSettingsState.exceptionCallbackEnabled = true;
      paymentEngineSettingsState.exceptionCallbackUrl =
        paymentEngineSettingsState.pendingCallbackUrl;
      paymentEngineSettingsState.callbackSkidOpen = false;
    }
    reset();
  },
});

const EXPORT_UPGRADE_BODY =
  "We've optimized the data architecture, integrating orders, payments, refunds and settlements into categorized tabs. The layout is more intuitive and clearer than ever, helping you quickly find the financial details you need.";

const disableCallbackMessage = computed(
  () =>
    ui(
      'By clicking "Confirm," you agree that all exception payment callbacks will no longer be sent to the saved URL.',
    ),
);

const exportUpgradeMessage = computed(() => ui(EXPORT_UPGRADE_BODY));

function onDisableCallbackConfirm() {
  paymentEngineSettingsState.exceptionCallbackEnabled = false;
  disableCallbackShell.popupOpen.value = false;
}

function closeExportPopup() {
  exportShell.popupOpen.value = false;
}

function closeGoogleVerify() {
  googleVerifyShell.popupOpen.value = false;
}
</script>

<template>
  <EgPopup
    v-if="detailShell.popupMounted.value"
    v-model:open="detailShell.popupOpen.value"
    uses="detail"
    @close="detailShell.onPopupClosed"
  >
    <EgDetail
      :eyebrow="page.detailEyebrow.value"
      :headline="page.detailHeadline.value"
      :status-tag="page.detailStatus.value"
      :status-tag-status="page.detailStatusKind.value"
      show-status-tag
      :show-tabs="page.showDetailTabs.value"
      :tab-labels="page.tabLabels.value"
      v-model:active-tab="activeTab"
      :sections="page.detailSections.value"
      :show-toolbar="false"
      @close="detailShell.popupOpen.value = false"
    />
  </EgPopup>

  <EgPopup
    v-if="disableCallbackShell.popupMounted.value"
    v-model:open="disableCallbackShell.popupOpen.value"
    uses="dialog"
    dialog-type="symbol"
    @close="disableCallbackShell.onPopupClosed"
  >
    <EgDialog
      type="symbol"
      :title="ui('Disable Payment Exception Callback')"
      :secondary-text="disableCallbackMessage"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      toolbar-tone="decor"
      @confirm="onDisableCallbackConfirm"
      @cancel="disableCallbackShell.popupOpen.value = false"
    />
  </EgPopup>

  <EgPopup
    v-if="exportShell.popupMounted.value"
    v-model:open="exportShell.popupOpen.value"
    uses="dialog"
    dialog-type="symbol"
    @close="exportShell.onPopupClosed"
  >
    <div :class="styles.exportDialogHost">
      <div :class="styles.systemBarClose">
        <EgIconButton
          shape="square"
          size="md"
          :label="ui('Close')"
          motion="asym"
          @click="closeExportPopup"
        >
          <EgIcon name="eds-close-circle-fill" fit />
        </EgIconButton>
      </div>
      <EgDialog
        type="symbol"
        :title="ui('Transaction Record Full Upgraded')"
        :secondary-text="exportUpgradeMessage"
        :confirm-label="ui('Try New Version')"
        :cancel-label="ui('Export Old Version')"
        toolbar-tone="decor"
      />
    </div>
  </EgPopup>

  <EgPopup
    v-if="googleVerifyShell.popupMounted.value"
    v-model:open="googleVerifyShell.popupOpen.value"
    uses="verify"
    verify-type="single-google"
    @close="googleVerifyShell.onPopupClosed"
  >
    <EgVerify
      v-model="verify.code"
      type="single-google"
      action-tone="decor"
      :state="verify.state"
      :title="ui('Google verification')"
      :secondary-text="ui('Please enter the 6-digit verification code from Google Authenticator')"
      :placeholder="ui('Please Enter')"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      :switch-disabled="true"
      :countdown-seconds="verify.state === 'error' ? null : undefined"
      @complete="onComplete"
      @recover="onRecover"
      @switch="closeGoogleVerify"
      @cancel="closeGoogleVerify"
    />
  </EgPopup>
</template>
