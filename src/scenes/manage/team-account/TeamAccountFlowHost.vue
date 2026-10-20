<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgButton,
  EgCheckbox,
  EgComboActionFlotation,
  EgComboActionPopupWindow,
  EgComboInputItem,
  EgDetail,
  EgDialog,
  EgFlotation,
  EgFlotationTrigger,
  EgInput,
  EgPopup,
  EgRadio,
  EgSwitch,
} from '@eds/desktop-components';
import chromeScrimStyles from '@eds/desktop-components/styles/popupChromeScrim.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import { isChineseLocale } from '@/composables/useAppLocale';
import { navigateAppShell } from '@/composables/useAppShellNavigation';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import '@/styles/popup-inner-backdrop.css';
import {
  ALERT_MEMBERS,
  ALERT_NOTIFY_VISIBLE_COUNT,
  RECHARGE_ADDR,
  RECHARGE_NETWORKS,
  stmtMoney,
  stmtTypeLabel,
  txDisplayTitleKey,
  type StatementLang,
} from './teamAccountData';
import {
  POPUP_CUSTOM_BOX_LG_HEIGHT,
  POPUP_CUSTOM_BOX_LG_WIDTH,
} from './teamAccount.constants';
import { teamAccountState, useTeamAccountPage, sanitizeUsdThreshold } from './useTeamAccountPage';
import rechargeQr from './recharge-qr.svg';
import styles from './TeamAccountOverlays.module.css';

const { ui, locale } = useAppI18n();
const page = useTeamAccountPage();
const rechargeNoteMinSingleLine = computed(() => isChineseLocale(locale.value));

function applyAlertThreshold(raw: string, input?: HTMLInputElement) {
  const sanitized = sanitizeUsdThreshold(raw);
  page.setDraftThreshold(sanitized);
  if (input && input.value !== sanitized) {
    input.value = sanitized;
  }
}

function onAlertThresholdBeforeInput(event: Event) {
  const native = event as InputEvent;
  const input = native.target;
  if (!(input instanceof HTMLInputElement) || native.inputType !== 'insertText' || native.data == null) {
    return;
  }
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const next = `${input.value.slice(0, start)}${native.data}${input.value.slice(end)}`;
  const sanitized = sanitizeUsdThreshold(next);
  if (sanitized === next) return;
  native.preventDefault();
  applyAlertThreshold(sanitized, input);
}

function onAlertThresholdInput(value: string) {
  const input = document.querySelector('.eds-dialog input.eds-input-control');
  applyAlertThreshold(value, input instanceof HTMLInputElement ? input : undefined);
}

const tzMenuItems = computed(() =>
  page.tzItems.map((item) => ({
    ...item,
    focused: item.label === page.draftTz.value,
  })),
);
const langMenuItems = computed(() =>
  page.langItems.map((item) => ({
    ...item,
    focused: item.label === page.draftLang.value,
  })),
);

const alertShell = usePopupShellLifecycle({
  open: () => teamAccountState.alertOpen,
  onClosed: () => {
    teamAccountState.alertOpen = false;
  },
});
const rechargeShell = usePopupShellLifecycle({
  open: () => teamAccountState.rechargeOpen,
  onClosed: () => {
    teamAccountState.rechargeOpen = false;
  },
});
const txDetailShell = usePopupShellLifecycle({
  open: () => teamAccountState.txDetailOpen,
  onClosed: () => {
    teamAccountState.txDetailOpen = false;
  },
});
const billSettingConfirmOpen = ref(false);
const billSettingShell = usePopupShellLifecycle({
  open: () => teamAccountState.billSettingOpen,
  onClosed: () => {
    teamAccountState.billSettingOpen = false;
    billSettingConfirmOpen.value = false;
  },
});
const billSettingConfirmShell = usePopupShellLifecycle({
  open: () => billSettingConfirmOpen.value,
  onClosed: () => {
    billSettingConfirmOpen.value = false;
  },
});
const sendShell = usePopupShellLifecycle({
  open: () => teamAccountState.sendOpen,
  onClosed: () => {
    teamAccountState.sendOpen = false;
  },
});
const statementShell = usePopupShellLifecycle({
  open: () => teamAccountState.statementOpen,
  onClosed: () => {
    teamAccountState.statementOpen = false;
  },
});

const statementScrollRef = ref<HTMLElement | null>(null);
const statementContentRef = ref<HTMLElement | null>(null);
const {
  topScrim: statementTopScrim,
  bottomScrim: statementBottomScrim,
  update: updateStatementScrim,
} = useScrollChromeScrim(statementScrollRef, { contentRef: statementContentRef });

watch(
  () => [statementShell.popupOpen.value, statementShell.popupMounted.value] as const,
  () => {
    updateStatementScrim();
  },
);

const sendSecondary = computed(() => {
  const bill = page.activeBill.value;
  const month = bill ? page.billListTitle(bill) : ui('Month');
  return ui(
    "Statements will be sent to team members' emails as PDF attachments (Statement for {month} · {tz}).",
  )
    .replace('{month}', month)
    .replace('{tz}', teamAccountState.statementTz);
});

const selectedRechargeNetwork = ref<(typeof RECHARGE_NETWORKS)[number]>(RECHARGE_NETWORKS[0]);
const rechargeNetworkMenuItems = computed(() =>
  RECHARGE_NETWORKS.map((label) => ({
    label,
    boxType: 'text' as const,
    showTag: false,
    focused: label === selectedRechargeNetwork.value,
  })),
);
const rechargeNoteMin = computed(() =>
  ui('Each single deposit must be no less than 0.01 {network}; otherwise, it will not be credited.').replace(
    '{network}',
    selectedRechargeNetwork.value,
  ),
);
const rechargeNoteRate = computed(() =>
  ui('USDT deposits will be credited as USD at a 1:1 ratio (1 USDT = 1 USD).'),
);

function onAlertConfirm() {
  page.saveAlert();
  alertShell.popupOpen.value = false;
}

function onBillSettingConfirm() {
  billSettingConfirmOpen.value = true;
}

function onViewTransferRecordsClick() {
  // Close detail (logical), then route shell to WaaS → Bulk Transfer Record.
  teamAccountState.txDetailOpen = false;
  navigateAppShell({
    moduleTitle: 'WaaS',
    menuItem: 'Bulk Transfer Record',
    navLabel: 'WaaS',
  });
}

function onBillSettingEditConfirm() {
  billSettingConfirmShell.popupOpen.value = false;
  page.saveBillSetting();
  billSettingShell.popupOpen.value = false;
}

function chooseRechargeNetwork(label: string) {
  if ((RECHARGE_NETWORKS as readonly string[]).includes(label)) {
    selectedRechargeNetwork.value = label as (typeof RECHARGE_NETWORKS)[number];
  }
}

function onSendConfirm() {
  page.confirmSend();
  sendShell.popupOpen.value = false;
}

const memberSelectScrollable = computed(() => ALERT_MEMBERS.length > ALERT_NOTIFY_VISIBLE_COUNT);

function onNotifyMemberToggle(id: string, on: boolean) {
  page.draftNotify[id] = on;
}

function onNotifyMemberClick(id: string) {
  const member = ALERT_MEMBERS.find((item) => item.id === id);
  if (member?.disabled) return;
  page.draftNotify[id] = !page.draftNotify[id];
}

function onSendMemberToggle(id: string, on: boolean) {
  page.sendSelected[id] = on;
}

function onSendMemberClick(id: string) {
  const member = ALERT_MEMBERS.find((item) => item.id === id);
  if (member?.disabled) return;
  page.sendSelected[id] = !page.sendSelected[id];
}

</script>

<template>
  <EgPopup
    v-if="alertShell.popupMounted.value"
    v-model:open="alertShell.popupOpen.value"
    uses="dialog"
    dialog-type="standard"
    alert-vertical-align="center"
    @close="alertShell.onPopupClosed"
  >
    <EgDialog
      type="standard"
      :title="ui('Balance Alert Settings')"
      :confirm-label="ui('Save')"
      :cancel-label="ui('Cancel')"
      :show-secondary-text="false"
      toolbar-tone="decor"
      toolbar-divider-pinned
      @confirm="onAlertConfirm"
      @cancel="alertShell.popupOpen.value = false"
    >
      <div :class="styles.formBody">
        <div :class="styles.switchRow">
          <div>
            <p :class="styles.switchLabel">{{ ui('Enable Balance Alert') }}</p>
            <p :class="styles.switchHint">
              {{ ui('Designated members will be notified when the balance falls below the threshold.') }}
            </p>
          </div>
          <EgSwitch v-model="teamAccountState.alertEnabled" />
        </div>
        <label :class="styles.field" @beforeinput="onAlertThresholdBeforeInput">
          <span :class="styles.fieldLabel">{{ ui('Alert Threshold (USD)') }}</span>
          <EgInput
            :model-value="page.draftThreshold.value"
            type="amount"
            :placeholder="ui('Please enter')"
            width-mode="full"
            @update:model-value="onAlertThresholdInput"
          />
        </label>
        <div :class="styles.field">
          <span :class="styles.fieldLabel">{{ ui('Notify To') }}</span>
          <div :class="styles.selectBox">
            <div
              :class="[styles.selectList, memberSelectScrollable && styles.selectListScroll]"
              :style="
                memberSelectScrollable
                  ? { '--notify-visible-count': String(ALERT_NOTIFY_VISIBLE_COUNT) }
                  : undefined
              "
            >
              <div
                v-for="member in ALERT_MEMBERS"
                :key="member.id"
                :class="[styles.selectRow, member.disabled && styles.selectRowDisabled]"
                @click="onNotifyMemberClick(member.id)"
              >
                <span :class="styles.selectCheck" @click.stop>
                  <EgCheckbox
                    :model-value="page.draftNotify[member.id]"
                    :disabled="member.disabled"
                    @update:model-value="(on) => onNotifyMemberToggle(member.id, on)"
                  />
                </span>
                <span :class="styles.selectCopy">
                  <span :class="styles.selectText">{{ member.name }}</span>
                  <span :class="styles.selectNote">{{ member.email }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div :class="styles.field">
          <span :class="styles.fieldLabel">{{ ui('Notification Channels') }}</span>
          <p :class="styles.fieldHint">
            {{ ui('Supports in-app notifications, app push notifications, and email alerts.') }}
          </p>
        </div>
      </div>
    </EgDialog>
  </EgPopup>

  <EgPopup
    v-if="rechargeShell.popupMounted.value"
    v-model:open="rechargeShell.popupOpen.value"
    uses="dialog"
    dialog-type="standard"
    alert-vertical-align="offset-top"
    @close="rechargeShell.onPopupClosed"
  >
    <div
      class="eds-dialog eds-popup-inner-backdrop"
      :class="styles.recharge"
      role="dialog"
      aria-modal="true"
    >
      <div :class="styles.rechargeCopy">
        <p :class="styles.rechargeTitle">{{ ui('Recharge') }}</p>
        <div :class="styles.rechargeNetwork">
          <EgFlotation
            trigger="click"
            width-mode="trigger"
            :show-add="false"
            :show-menu-divider="false"
            :items="rechargeNetworkMenuItems"
            boundary-selector=".app-preview"
            flip
            close-on-scroll
            @item-click="(item) => chooseRechargeNetwork(item.label)"
          >
            <template #trigger="{ expanded }">
              <EgFlotationTrigger
                trigger-style="outline"
                size="md"
                width-mode="adaptive"
                :label="selectedRechargeNetwork"
                :expanded="expanded"
              />
            </template>
          </EgFlotation>
        </div>
        <div :class="styles.rechargeBody">
          <div :class="styles.rechargeQrFrame">
            <span :class="[styles.rechargeQrCorner, styles.rechargeQrCornerTl]" aria-hidden="true" />
            <span :class="[styles.rechargeQrCorner, styles.rechargeQrCornerTr]" aria-hidden="true" />
            <span :class="[styles.rechargeQrCorner, styles.rechargeQrCornerBl]" aria-hidden="true" />
            <span :class="[styles.rechargeQrCorner, styles.rechargeQrCornerBr]" aria-hidden="true" />
            <div :class="styles.rechargeQr">
              <img :src="rechargeQr" alt="" />
            </div>
          </div>
          <p :class="styles.rechargeAddr">{{ RECHARGE_ADDR }}</p>
          <p
            :class="[
              styles.rechargeNote,
              styles.rechargeNoteMin,
              rechargeNoteMinSingleLine && styles.rechargeNoteMinSingleLine,
            ]"
          >
            {{ rechargeNoteMin }}
          </p>
          <p :class="styles.rechargeNote">{{ rechargeNoteRate }}</p>
        </div>
      </div>
      <EgComboActionPopupWindow
        tone="decor"
        :confirm-label="ui('Copy Address')"
        :cancel-label="ui('Cancel')"
        @confirm="rechargeShell.popupOpen.value = false"
        @cancel="rechargeShell.popupOpen.value = false"
      />
    </div>
  </EgPopup>

  <EgPopup
    v-if="txDetailShell.popupMounted.value"
    v-model:open="txDetailShell.popupOpen.value"
    uses="detail"
    @close="txDetailShell.onPopupClosed"
  >
    <EgDetail
      v-if="page.activeTx.value"
      :eyebrow="ui(txDisplayTitleKey(page.activeTx.value.type))"
      :headline="page.activeTx.value.amount"
      :show-status-tag="false"
      :sections="page.txSections.value"
      :show-toolbar="false"
      @close="txDetailShell.popupOpen.value = false"
    >
      <template #item-value-batch-transfer-id="{ item }">
        <span :class="styles.txDetailBatchId">{{ item.value }}</span>
        <EgButton
          variant="outline"
          size="sm"
          @click="onViewTransferRecordsClick"
        >
          {{ ui('View Transfer Records') }}
        </EgButton>
      </template>
    </EgDetail>
  </EgPopup>

  <EgPopup
    v-if="billSettingShell.popupMounted.value"
    v-model:open="billSettingShell.popupOpen.value"
    uses="dialog"
    dialog-type="compose"
    @close="billSettingShell.onPopupClosed"
  >
    <EgDialog
      type="compose"
      :title="ui('Team Monthly Statements Settings')"
      :secondary-text="ui('Team monthly statements will be generated at the beginning of each month based on this time zone and language. Underlying system records remain unaffected.')"
      :confirm-label="ui('Save')"
      :cancel-label="ui('Cancel')"
      toolbar-tone="decor"
      toolbar-divider-pinned
      @confirm="onBillSettingConfirm"
      @cancel="billSettingShell.popupOpen.value = false"
    >
      <div :class="styles.billSettingBody">
        <EgComboInputItem :label="ui('Financial Time Zone')">
          <EgFlotation
            trigger="click"
            width-mode="trigger"
            :show-add="false"
            :show-menu-divider="false"
            :items="tzMenuItems"
            boundary-selector=".app-preview"
            flip
            close-on-scroll
            @item-click="(item) => (page.draftTz.value = item.label)"
          >
            <template #trigger="{ expanded }">
              <EgFlotationTrigger
                trigger-style="outline"
                size="md"
                width-mode="adaptive"
                :label="page.draftTz.value"
                :expanded="expanded"
              />
            </template>
          </EgFlotation>
        </EgComboInputItem>
        <EgComboInputItem :label="ui('Statement Language')">
          <EgFlotation
            trigger="click"
            width-mode="trigger"
            :show-add="false"
            :show-menu-divider="false"
            :items="langMenuItems"
            boundary-selector=".app-preview"
            flip
            close-on-scroll
            @item-click="(item) => (page.draftLang.value = item.label as StatementLang)"
          >
            <template #trigger="{ expanded }">
              <EgFlotationTrigger
                trigger-style="outline"
                size="md"
                width-mode="adaptive"
                :label="page.draftLang.value"
                :expanded="expanded"
              />
            </template>
          </EgFlotation>
        </EgComboInputItem>
        <EgComboInputItem :label="ui('Invoice Header')">
          <div :class="styles.invoiceBox">
            <label :class="styles.invoiceRow">
              <EgRadio
                :model-value="page.draftHeader.value === 'team'"
                name="invoice-header"
                value="team"
                @update:model-value="(on) => { if (on) page.draftHeader.value = 'team' }"
              />
              <span :class="styles.invoiceCopy">
                <span :class="styles.invoiceText">{{ ui('Use Team Name') }}</span>
                <span :class="styles.invoiceNote">(Acme Technology Co.)</span>
              </span>
            </label>
            <label :class="styles.invoiceRow">
              <EgRadio
                :model-value="page.draftHeader.value === 'kyb'"
                name="invoice-header"
                value="kyb"
                @update:model-value="(on) => { if (on) page.draftHeader.value = 'kyb' }"
              />
              <span :class="styles.invoiceCopy">
                <span :class="styles.invoiceText">{{ ui('Use KYB Name') }}</span>
                <span :class="styles.invoiceNote">(Acme Technology Co., Ltd.)</span>
              </span>
            </label>
          </div>
        </EgComboInputItem>
      </div>
    </EgDialog>
  </EgPopup>

  <EgPopup
    v-if="billSettingConfirmShell.popupMounted.value"
    v-model:open="billSettingConfirmShell.popupOpen.value"
    uses="dialog"
    dialog-type="symbol"
    @close="billSettingConfirmShell.onPopupClosed"
  >
    <EgDialog
      type="symbol"
      :title="ui('Confirm Statement Settings Change')"
      :secondary-text="ui('After the change, the system will automatically regenerate statements for the most recent 12 months based on the new settings. Earlier statements will be generated in real time when you view them. Are you sure you want to proceed?')"
      :confirm-label="ui('Confirm')"
      :cancel-label="ui('Cancel')"
      toolbar-tone="decor"
      @confirm="onBillSettingEditConfirm"
      @cancel="billSettingConfirmShell.popupOpen.value = false"
    />
  </EgPopup>

  <EgPopup
    v-if="sendShell.popupMounted.value"
    v-model:open="sendShell.popupOpen.value"
    uses="dialog"
    dialog-type="standard"
    @close="sendShell.onPopupClosed"
  >
    <EgDialog
      type="standard"
      :title="ui('Send Statements')"
      :secondary-text="sendSecondary"
      :confirm-label="ui('Send Now')"
      :cancel-label="ui('Cancel')"
      toolbar-tone="decor"
      toolbar-divider-pinned
      @confirm="onSendConfirm"
      @cancel="sendShell.popupOpen.value = false"
    >
      <div :class="styles.formBody">
        <div :class="styles.field">
          <span :class="styles.fieldLabel">{{ ui('Select Recipients') }}</span>
          <div :class="styles.selectBox">
            <div
              :class="[styles.selectList, memberSelectScrollable && styles.selectListScroll]"
              :style="
                memberSelectScrollable
                  ? { '--notify-visible-count': String(ALERT_NOTIFY_VISIBLE_COUNT) }
                  : undefined
              "
            >
              <div
                v-for="member in ALERT_MEMBERS"
                :key="member.id"
                :class="[styles.selectRow, member.disabled && styles.selectRowDisabled]"
                @click="onSendMemberClick(member.id)"
              >
                <span :class="styles.selectCheck" @click.stop>
                  <EgCheckbox
                    :model-value="page.sendSelected[member.id]"
                    :disabled="member.disabled"
                    @update:model-value="(on) => onSendMemberToggle(member.id, on)"
                  />
                </span>
                <span :class="styles.selectCopy">
                  <span :class="styles.selectText">{{ page.memberShortName(member.name) }}</span>
                  <span :class="styles.selectNote">{{ member.email }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <p :class="styles.fieldHint">
          {{ ui('Note: Statements will be regenerated and sent based on the currently selected financial time zone.') }}
        </p>
      </div>
      <template #actions>
        <EgComboActionFlotation
          tone="decor"
          divider
          :confirm-label="ui('Send Now')"
          :cancel-label="ui('Cancel')"
          @confirm="onSendConfirm"
          @cancel="sendShell.popupOpen.value = false"
        />
      </template>
    </EgDialog>
  </EgPopup>

  <EgPopup
    v-if="statementShell.popupMounted.value"
    v-model:open="statementShell.popupOpen.value"
    uses="custom"
    :box-width="POPUP_CUSTOM_BOX_LG_WIDTH"
    :box-height="POPUP_CUSTOM_BOX_LG_HEIGHT"
    @close="statementShell.onPopupClosed"
  >
    <div
      v-if="page.activeBill.value"
      :class="styles.stmtHost"
      :lang="page.previewLang.value === 'English' ? 'en' : page.previewLang.value === '简体中文' ? 'zh-CN' : 'zh-TW'"
    >
      <div ref="statementScrollRef" :class="styles.stmtScroll">
        <div
          :class="[
            styles.stmtBar,
            chromeScrimStyles.root,
            statementTopScrim && chromeScrimStyles.active,
            !statementTopScrim && styles.stmtBarSolid,
          ]"
        >
          <p :class="[styles.stmtBarTitle, chromeScrimStyles.content]">
            {{ page.copy.value.docTitle }} · {{ page.doc.value.period }}
          </p>
        </div>
        <div ref="statementContentRef" :class="styles.stmtPrint">
          <article :class="styles.stmtPage">
            <p :class="styles.stmtRun">Cregis - {{ page.doc.value.period }}</p>
            <header :class="styles.stmtHead">
              <div :class="styles.stmtLogo">
                <span :class="styles.stmtLogoMark" aria-hidden="true" />
                <span :class="styles.stmtLogoWord">CREGIS</span>
              </div>
              <div :class="styles.stmtHeadTitle">
                <h1 :class="styles.stmtDocTitle">{{ page.copy.value.docTitle }}</h1>
                <p :class="styles.stmtKicker">{{ page.copy.value.docKicker }}</p>
              </div>
            </header>
            <div :class="styles.stmtRule" />
            <div :class="styles.stmtInfo">
              <section :class="styles.stmtCard">
                <h2 :class="styles.stmtCardTitle">{{ page.copy.value.client }}</h2>
                <p :class="styles.stmtKv"><span>{{ page.copy.value.teamName }}</span><strong>{{ page.doc.value.teamName }}</strong></p>
                <p :class="styles.stmtKv"><span>{{ page.copy.value.teamId }}</span><strong>{{ page.doc.value.teamId }}</strong></p>
                <p :class="styles.stmtKv"><span>{{ page.copy.value.period }}</span><strong>{{ page.doc.value.period }}</strong></p>
              </section>
              <section :class="styles.stmtCard">
                <h2 :class="styles.stmtCardTitle">{{ page.copy.value.billInfo }}</h2>
                <p :class="styles.stmtKv"><span>{{ page.copy.value.generated }}</span><strong>{{ page.doc.value.generated }}</strong></p>
                <p :class="styles.stmtKv"><span>{{ page.copy.value.timezone }}</span><strong>{{ page.doc.value.tz }}</strong></p>
                <p :class="styles.stmtKv"><span>{{ page.copy.value.currency }}</span><strong>USD</strong></p>
              </section>
            </div>
            <div :class="styles.stmtStats">
              <div :class="[styles.stmtStat, styles.stmtStatIn]">
                <span>{{ page.copy.value.topup }}</span>
                <strong :class="styles.stmtIn">{{ stmtMoney(page.doc.value.recharge, true) }}</strong>
              </div>
              <div :class="styles.stmtStat">
                <span>{{ page.copy.value.spend }}</span>
                <strong>{{ stmtMoney(-page.doc.value.spend, true) }}</strong>
              </div>
              <div :class="styles.stmtStat">
                <span>{{ page.copy.value.ending }}</span>
                <strong>{{ stmtMoney(page.doc.value.ending) }}</strong>
              </div>
            </div>
            <section>
              <h2 :class="styles.stmtSection">
                <i :class="styles.stmtSectionMark" />
                {{ page.copy.value.details }}
              </h2>
              <div :class="styles.stmtTableWrap">
                <p :class="styles.stmtWatermark">CREGIS</p>
                <table :class="styles.stmtTable">
                  <thead>
                    <tr>
                      <th>{{ page.copy.value.colDate }}</th>
                      <th>{{ page.copy.value.colType }}</th>
                      <th :class="styles.stmtNum">{{ page.copy.value.colIn }}</th>
                      <th :class="styles.stmtNum">{{ page.copy.value.colOut }}</th>
                      <th :class="styles.stmtNum">{{ page.copy.value.colBal }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in page.doc.value.rows" :key="row.time">
                      <td>{{ row.time }}</td>
                      <td>
                        <span
                          v-if="!stmtTypeLabel(row.type, page.previewLang.value)"
                          :class="styles.stmtDash"
                        >—</span>
                        <span
                          v-else
                          :class="[
                            styles.stmtBadge,
                            stmtTypeLabel(row.type, page.previewLang.value)?.kind === 'in'
                              ? styles.stmtBadgeIn
                              : '',
                          ]"
                        >
                          {{ stmtTypeLabel(row.type, page.previewLang.value)?.label }}
                        </span>
                      </td>
                      <td :class="styles.stmtNum">
                        <span :class="page.moneyCell(row.inn, true, styles.stmtIn).cls">
                          {{ page.moneyCell(row.inn, true, styles.stmtIn).text }}
                        </span>
                      </td>
                      <td :class="styles.stmtNum">
                        <span :class="page.moneyCell(row.out != null ? -row.out : null, true, styles.stmtOut).cls">
                          {{ page.moneyCell(row.out != null ? -row.out : null, true, styles.stmtOut).text }}
                        </span>
                      </td>
                      <td :class="styles.stmtNum">{{ stmtMoney(row.bal) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2">{{ page.copy.value.total }}</td>
                      <td :class="[styles.stmtNum, styles.stmtIn]">{{ stmtMoney(page.doc.value.recharge, true) }}</td>
                      <td :class="styles.stmtNum">{{ stmtMoney(-page.doc.value.spend, true) }}</td>
                      <td :class="styles.stmtNum">{{ stmtMoney(page.doc.value.ending) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
            <section :class="styles.stmtDisc">
              <h2 :class="styles.stmtDiscTitle">{{ page.copy.value.disclaimer }}</h2>
              <p
                v-for="(note, index) in page.copy.value.notes"
                :key="`disc-${index}`"
                :class="styles.stmtDiscItem"
              >
                {{ note.body }}
              </p>
            </section>
            <footer :class="styles.stmtPageFoot">
              <span>Cregis © {{ page.doc.value.year }}. {{ page.copy.value.rights }}</span>
              <span>{{ page.doc.value.teamId }} · {{ page.doc.value.period }} · {{ page.doc.value.tz }}</span>
              <span>{{ page.pageLabel(1) }}</span>
            </footer>
          </article>
        </div>
        <footer
          :class="[
            styles.stmtToolbar,
            chromeScrimStyles.root,
            statementBottomScrim && chromeScrimStyles.active,
            !statementBottomScrim && styles.stmtToolbarSolid,
          ]"
        >
          <div :class="chromeScrimStyles.content">
            <EgComboActionFlotation
              tone="decor"
              divider
              :confirm-label="page.copy.value.download"
              :cancel-label="page.copy.value.close"
              @confirm="page.printStatement"
              @cancel="statementShell.popupOpen.value = false"
            />
          </div>
        </footer>
      </div>
    </div>
  </EgPopup>
</template>
