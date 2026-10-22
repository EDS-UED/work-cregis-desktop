<script setup lang="ts">
import { toRef } from 'vue';
import {
  EgButton,
  EgDialog,
  EgDialogPopup,
  EgDivider,
} from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';

const props = defineProps<{
  open: boolean;
  titleKey: string;
  messageKey: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { ui } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

function onConfirm() {
  popupOpen.value = false;
}
</script>

<template>
  <EgDialogPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    dialog-type="standard"
    alert-vertical-align="offset-top"
    @close="onPopupClosed"
  >
    <EgDialog type="standard" :title="ui(titleKey)" @close="onConfirm">
      <p class="typography-body-medium">{{ ui(messageKey) }}</p>
      <template #footer>
        <EgDivider />
        <div :class="comboActionStyles.root">
          <EgButton variant="solid" size="md" tone="decor" @click="onConfirm">
            {{ ui('Confirm') }}
          </EgButton>
        </div>
      </template>
    </EgDialog>
  </EgDialogPopup>
</template>
