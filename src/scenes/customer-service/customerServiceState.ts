import { reactive } from 'vue';

export const customerServiceState = reactive({
  open: false,
  locationTitle: 'Wallet',
  locationItem: null as string | null,
});
