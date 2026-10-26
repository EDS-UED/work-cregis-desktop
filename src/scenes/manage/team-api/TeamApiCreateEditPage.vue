<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgFormSubmission, EgInput, EgTextarea } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import LayoutChromeConfigFormPageChrome from '@/scenes/project/LayoutChromeConfigFormPageChrome.vue';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import type { TeamApiConfigRecord } from './teamApiMockData';
import {
  teamApiIpWhitelistIsValid,
  teamApiNameAllowsEditSave,
  teamApiNameHasInvalidCharacters,
  teamApiNameIsValid,
} from './teamApiFormValidation';
import styles from './TeamApiCreateEditPage.module.css';

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit';
    initial?: TeamApiConfigRecord | null;
    embeddedInPageStack?: boolean;
  }>(),
  {
    embeddedInPageStack: false,
  },
);

const emit = defineEmits<{
  cancel: [];
  submit: [draft: TeamApiConfigRecord];
}>();

const { ui } = useAppI18n();

const optionCardGroupedSurface = {
  surface: 'grouped' as const,
  groupedRowSpacing: 'compact' as const,
  groupedRowRounded: true,
};

const name = ref('');
const nameBlurred = ref(false);
const walletPermission = ref(true);
const ipWhitelist = ref('');
const ipBlurred = ref(false);

const contentRevision = ref('0');

function syncFromInitial(record: TeamApiConfigRecord | null | undefined) {
  name.value = record?.name ?? '';
  walletPermission.value = true;
  ipWhitelist.value = record?.ipWhitelist ?? '';
  nameBlurred.value = false;
  ipBlurred.value = false;
  contentRevision.value = String(Number(contentRevision.value) + 1);
}

if (props.initial) {
  syncFromInitial(props.initial);
}

const toolbarTitle = computed(() =>
  ui(props.mode === 'create' ? 'Create Team API' : 'Edit Team API'),
);

const confirmLabel = computed(() => ui(props.mode === 'create' ? 'Create' : 'Save'));

const nameSubmissionType = computed(() => {
  if (!nameBlurred.value) return 'notes';
  if (teamApiNameHasInvalidCharacters(name.value)) return 'danger';
  if (!teamApiNameIsValid(name.value)) return 'danger';
  return 'notes';
});

const nameSubmissionText = computed(() => {
  if (nameBlurred.value && teamApiNameHasInvalidCharacters(name.value)) {
    return ui('Please enter the correct API name.');
  }
  return ui('2-20 Characters');
});

const ipSubmissionType = computed(() => {
  if (!ipBlurred.value) return 'notes';
  return teamApiIpWhitelistIsValid(ipWhitelist.value) ? 'notes' : 'danger';
});

const ipSubmissionText = computed(() => {
  if (!ipBlurred.value || teamApiIpWhitelistIsValid(ipWhitelist.value)) return '';
  return ui('Team API IP whitelist invalid message');
});

const isEditFormDirty = computed(() => {
  if (props.mode !== 'edit' || !props.initial) return true;
  const initial = props.initial;
  return (
    name.value.trim() !== initial.name.trim()
    || ipWhitelist.value.trim() !== initial.ipWhitelist.trim()
  );
});

const canSubmit = computed(() => {
  const nameReady =
    props.mode === 'edit'
      ? teamApiNameAllowsEditSave(name.value)
      : teamApiNameIsValid(name.value);
  const formValid =
    nameReady && walletPermission.value && teamApiIpWhitelistIsValid(ipWhitelist.value);
  if (props.mode === 'edit') {
    return formValid && isEditFormDirty.value;
  }
  return formValid;
});

function onNameBlur() {
  nameBlurred.value = true;
}

function onIpBlur() {
  ipBlurred.value = true;
}

function onWalletPermissionSelect() {
  walletPermission.value = !walletPermission.value;
}

function buildDraft(): TeamApiConfigRecord {
  const base = props.initial;
  return {
    id: base?.id ?? '',
    name: name.value.trim(),
    authType: base?.authType ?? 'HMAC',
    apiKeyMasked: base?.apiKeyMasked ?? '',
    apiKeyFull: base?.apiKeyFull ?? '',
    secretKey: base?.secretKey ?? '',
    baseUrl: base?.baseUrl ?? 'https://api.cregis.com',
    permissionsKey: 'Wallet',
    ipWhitelist: ipWhitelist.value.trim(),
    creatorName: base?.creatorName ?? 'Alex Chen',
    creatorEmail: base?.creatorEmail ?? 'alex.chen@cregis.com',
    createdAt: base?.createdAt ?? new Date().toISOString().replace('T', ' ').slice(0, 19),
    enabled: base?.enabled ?? true,
  };
}

function onSubmit() {
  nameBlurred.value = true;
  ipBlurred.value = true;
  if (!canSubmit.value) return;
  if (!teamApiNameIsValid(name.value)) return;
  if (!teamApiIpWhitelistIsValid(ipWhitelist.value)) return;
  emit('submit', buildDraft());
}

defineExpose({
  canSubmit,
  contentRevision,
});
</script>

<template>
  <LayoutChromeConfigFormPageChrome
    v-if="embeddedInPageStack"
    :title="toolbarTitle"
    :confirm-label="confirmLabel"
    :can-submit="canSubmit"
    :content-revision="contentRevision"
    @back="emit('cancel')"
    @cancel="emit('cancel')"
    @confirm="onSubmit"
  >
    <div class="desktopTokens" :class="styles.formStack">
      <div :class="styles.fieldBlock">
        <span :class="styles.fieldLabel">{{ ui('API Name') }}</span>
        <EgInput
          v-model="name"
          width-mode="full"
          :placeholder="ui('Please Enter')"
          @blur="onNameBlur"
        />
        <EgFormSubmission
          :type="nameSubmissionType"
          :show-link="false"
          :text="nameSubmissionText"
        />
      </div>

      <section :class="styles.fieldBlock">
        <span :class="styles.fieldLabel">{{ ui('Permission') }}</span>
        <div :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]">
          <div :class="styles.optionCardGroup">
            <ProjectCreateModeCard
              v-bind="optionCardGroupedSurface"
              selection-control="checkbox"
              :title="ui('Wallet')"
              :description="ui('Team API wallet permission description')"
              :selected="walletPermission"
              @select="onWalletPermissionSelect"
            />
            <ProjectCreateModeCard
              v-bind="optionCardGroupedSurface"
              selection-control="checkbox"
              disabled
              :title="ui('Team API permission tasks label')"
              :description="ui('Coming Soon')"
              :selected="false"
            />
            <ProjectCreateModeCard
              v-bind="optionCardGroupedSurface"
              selection-control="checkbox"
              disabled
              :title="ui('Team API permission billing label')"
              :description="ui('Coming Soon')"
              :selected="false"
            />
            <ProjectCreateModeCard
              v-bind="optionCardGroupedSurface"
              selection-control="checkbox"
              disabled
              :title="ui('Team API permission team account label')"
              :description="ui('Coming Soon')"
              :selected="false"
            />
          </div>
        </div>
      </section>

      <section :class="styles.fieldBlock">
        <div :class="styles.fieldLabelGroup">
          <span :class="styles.fieldLabel">{{ ui('IP Whitelist') }}</span>
          <p :class="styles.fieldHint">
            {{ ui('Team API IP whitelist access hint') }}
          </p>
        </div>
        <EgTextarea
          v-model="ipWhitelist"
          width-mode="full"
          :placeholder="ui('Please Enter')"
          :paste-label="ui('Paste')"
          :clear-label="ui('Clear')"
          @blur="onIpBlur"
        />
        <EgFormSubmission
          v-if="ipSubmissionText"
          :type="ipSubmissionType"
          :show-link="false"
          :text="ipSubmissionText"
        />
        <EgFormSubmission
          v-else
          type="notes"
          :show-link="false"
          :text="ui('Supports IPv4/IPv6 addresses')"
        />
      </section>
    </div>
  </LayoutChromeConfigFormPageChrome>
</template>
