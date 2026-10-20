import { reactive } from 'vue';

export const customerServiceState = reactive({
  open: false,
  locationTitle: 'Wallet',
  locationItem: null as string | null,
  /** Increments when the user switches team workspace; CS panel listens for announcements. */
  teamSwitchSequence: 0,
  /** Bracketed team label for the latest switch (field value). */
  teamSwitchDisplayName: '',
});
