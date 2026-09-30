<script setup lang="ts">
import { EgDataListCellOverflow } from '@eds/desktop-components';
import styles from './WaasListFieldTaskCount.module.css';

defineProps<{
  collectionId: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <EgDataListCellOverflow
      :content-class="styles.collectionIdText"
      :text="collectionId"
      context="cell"
    />
  </div>
</template>
