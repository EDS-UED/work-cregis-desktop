<script setup lang="ts">
import { useAppI18n } from '@/composables/useAppI18n';
import AppToolbarTimezonePickerField from '@/scenes/shared/AppToolbarTimezonePickerField.vue';
import { useTeamAccountTimezoneSelection } from '@/scenes/shared/teamAccountTimezoneSession';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import {
  OVERVIEW_TIMEZONE_FLOTATION_MAX_HEIGHT,
  OVERVIEW_TIMEZONE_FLOTATION_WIDTH,
} from './manageOverviewTimezone.constants';
import styles from './ManageOverviewToolbarTimezoneFlotationMenu.module.css';
import '@/styles/flotation-inner-backdrop.css';
import '@/scenes/tasks/signing/batch/batchSigning.networkPickerMenu.css';

const { ui } = useAppI18n();
const { selectedIndex } = useTeamAccountTimezoneSelection();

const pickerShellStyle = {
  width: `${OVERVIEW_TIMEZONE_FLOTATION_WIDTH}px`,
  minWidth: `${OVERVIEW_TIMEZONE_FLOTATION_WIDTH}px`,
  maxHeight: `${OVERVIEW_TIMEZONE_FLOTATION_MAX_HEIGHT}px`,
};
</script>

<template>
  <div
    class="networkPickerRoot desktopTokens effect-flotation-box motion-flotation eds-flotation-inner-backdrop"
    :style="pickerShellStyle"
  >
    <div class="networkPickerRows">
      <header class="networkPickerHeader">
        <div class="networkPickerHeaderContent">
          <p :class="batchStyles.batchSectionTitle">
            {{ ui('Overview Team Timezone Settings') }}
          </p>
        </div>
      </header>

      <div :class="styles.body">
        <p :class="['typography-body-small', styles.hint]">
          {{ ui('Fee Record Team Timezone Hint') }}
        </p>

        <AppToolbarTimezonePickerField v-model="selectedIndex" variant="md-full" />
      </div>
    </div>
  </div>
</template>
