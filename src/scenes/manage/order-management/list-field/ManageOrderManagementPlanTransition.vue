<script setup lang="ts">
import { EgIcon, EgListFieldOverflowText } from '@eds/desktop-components';
import styles from './ManageOrderManagementPlanTransition.module.css';

defineProps<{
  planFrom: string;
  planTo: string;
}>();
</script>

<template>
  <div :class="styles.planLine">
    <EgListFieldOverflowText
      :class="styles.planSegment"
      :text="planFrom"
      variant="secondary"
      tabular
    />
    <span :class="styles.planArrow" aria-hidden="true">
      <EgIcon name="eds-arrow-right" fit />
    </span>
    <EgListFieldOverflowText
      :class="styles.planSegment"
      :text="planTo"
      variant="secondary"
      tabular
    />
  </div>
</template>
