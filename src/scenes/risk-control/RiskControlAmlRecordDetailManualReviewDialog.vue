<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import {
  EgButton,
  EgDialog,
  EgDialogPopup,
  EgDivider,
  EgTextarea,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import styles from './RiskControlAmlRecordDetailManualReviewDialog.module.css';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  submit: [];
  cancel: [];
}>();

const { ui } = useAppI18n();
const remark = ref('');
const riskLevel = ref<'danger' | 'safe' | null>(null);

const REMARK_MAX = 1000;

const remarkCountLabel = computed(() => `${remark.value.length}/${REMARK_MAX}`);

const canSubmit = computed(() => riskLevel.value != null);

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    remark.value = '';
    riskLevel.value = null;
  },
);

function onSubmit() {
  if (!canSubmit.value) return;
  emit('submit');
  popupOpen.value = false;
}

function onCancel() {
  emit('cancel');
  popupOpen.value = false;
}

function selectLevel(level: 'danger' | 'safe') {
  riskLevel.value = level;
}
</script>

<template>
  <EgDialogPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    dialog-type="standard"
    @close="onPopupClosed"
  >
    <EgDialog
      type="standard"
      :title="ui('AML manual review dialog title')"
      :show-secondary-text="false"
    >
      <div :class="styles.body">
        <div :class="styles.fieldBlock">
          <span :class="['typography-body-small-strong', styles.fieldLabel]">
            {{ ui('AML manual review level label') }}
          </span>
          <div :class="styles.levelRow">
            <EgButton
              :variant="riskLevel === 'danger' ? 'solid' : 'outline'"
              tone="danger"
              size="md"
              @click="selectLevel('danger')"
            >
              {{ ui('Danger') }}
            </EgButton>
            <EgButton
              :variant="riskLevel === 'safe' ? 'solid' : 'outline'"
              tone="decor"
              size="md"
              @click="selectLevel('safe')"
            >
              {{ ui('Safe') }}
            </EgButton>
          </div>
        </div>

        <div :class="styles.fieldBlock">
          <span :class="['typography-body-small-strong', styles.fieldLabel]">
            {{ ui('Remark') }}
          </span>
          <EgTextarea
            v-model="remark"
            width-mode="full"
            :maxlength="REMARK_MAX"
            :placeholder="ui('Please Enter')"
            :paste-label="ui('Paste')"
            :clear-label="ui('Clear')"
          />
          <span :class="['typography-body-small', styles.remarkCount]">
            {{ remarkCountLabel }}
          </span>
        </div>
      </div>

      <template #actions>
        <div :class="comboActionStyles.flotationRoot">
          <EgDivider
            :class="[
              comboActionStyles.divider,
              comboActionStyles.dividerAnimated,
              comboActionStyles.dividerAnimatedHidden,
            ]"
            type="module"
            direction="horizontal"
            hide
          />
          <div
            :class="[
              comboActionStyles.flotationBar,
              comboActionStyles.flotationBarEnd,
              comboActionStyles.flotationBarInset5,
            ]"
          >
            <div :class="comboActionStyles.flotationActions">
              <EgButton tone="subtle" variant="text" size="md" @click="onCancel">
                {{ ui('Cancel') }}
              </EgButton>
              <EgButton
                tone="decor"
                variant="solid"
                size="md"
                :disabled="!canSubmit"
                @click="onSubmit"
              >
                {{ ui('Confirm') }}
              </EgButton>
            </div>
          </div>
        </div>
      </template>
    </EgDialog>
  </EgDialogPopup>
</template>
