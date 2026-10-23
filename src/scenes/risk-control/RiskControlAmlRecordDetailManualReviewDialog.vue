<script setup lang="ts">
import { ref, toRef, watch } from 'vue';
import { EgDialog, EgDialogPopup } from '@eds/desktop-components';
import RiskControlAmlRecordDetailManualReviewForm from './RiskControlAmlRecordDetailManualReviewForm.vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  submit: [level: 'danger' | 'safe'];
}>();

const { ui } = useAppI18n();

const formSessionKey = ref(0);

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
    formSessionKey.value += 1;
  },
);

function onFormSubmit(level: 'danger' | 'safe') {
  emit('submit', level);
  popupOpen.value = false;
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
      <RiskControlAmlRecordDetailManualReviewForm
        v-if="formSessionKey > 0"
        :key="formSessionKey"
        @submit="onFormSubmit"
      />
    </EgDialog>
  </EgDialogPopup>
</template>
