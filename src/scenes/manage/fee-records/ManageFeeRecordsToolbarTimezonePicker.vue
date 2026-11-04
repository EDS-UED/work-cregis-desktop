<script setup lang="ts">
import { ref } from 'vue';
import { EgFlotation } from '@eds/desktop-components';
import { FEE_RECORD_TOOLBAR_TIMEZONE_ITEMS } from './feeRecordToolbarTimezoneItems';
import styles from './ManageFeeRecordsToolbarTimezonePicker.module.css';

const selectedTimezoneIndex = ref(0);
</script>

<template>
  <EgFlotation
    :class="styles.root"
    v-model:selected-index="selectedTimezoneIndex"
    :items="FEE_RECORD_TOOLBAR_TIMEZONE_ITEMS"
    trigger-label="UTC+08:00"
    trigger-size="xs"
    message-text="0"
    add-label="Add"
    placement="bottom"
    align="start"
    flip
    width-mode="trigger"
    height-mode="adaptive"
    list-scroll
    :max-height="320"
    :show-add="false"
    :show-menu-divider="false"
    boundary-selector=".app-preview"
    close-on-scroll
  />
</template>
