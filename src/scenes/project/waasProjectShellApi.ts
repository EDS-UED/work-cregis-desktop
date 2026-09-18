import { shallowRef } from 'vue';

export type WaasProjectShellApi = {
  setProjectsEmpty: (empty: boolean) => void;
  activateWaasModule: () => void;
  selectProjectById: (projectId: string) => void;
};

export const waasProjectShellApiRegistry = shallowRef<WaasProjectShellApi | null>(null);

export function registerWaasProjectShellApi(api: WaasProjectShellApi | null) {
  waasProjectShellApiRegistry.value = api;
}
