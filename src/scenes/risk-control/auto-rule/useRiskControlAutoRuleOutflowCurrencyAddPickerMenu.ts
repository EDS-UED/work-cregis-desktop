import { computed, nextTick, ref, watch, type ComputedRef } from 'vue';
import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import {
  FILTER_CURRENCY_CASCADE_PICKER_HEIGHT,
  type FilterCurrencyPreset,
} from '@eds/desktop-components/organisms/filter/filterCurrencyPresets';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import { buildAutoRuleOutflowCurrencyValueKey } from './riskControlAutoRuleOutflowCurrencyOptions';

type FilterSelectAllMode = 'none' | 'some' | 'all';
type FilterOptionSelectionState = 'none' | 'partial' | 'full';

export function useRiskControlAutoRuleOutflowCurrencyAddPickerMenu(options: {
  currencyOptions: ComputedRef<readonly EgFilterFieldCurrencyOption[]>;
  committedValueKeys: ComputedRef<readonly string[]>;
  translate: (key: string) => string;
}) {
  const searchQuery = ref('');
  const draftValues = ref<Set<string>>(new Set());
  const activeCascadeKey = ref<string | null>(null);
  const cascadeDraftSnapshot = ref<Set<string> | null>(null);
  const scrollRef = ref<HTMLElement | null>(null);
  const optionListRef = ref<HTMLElement | null>(null);
  const cascadeScrollRef = ref<HTMLElement | null>(null);
  const cascadeListRef = ref<HTMLElement | null>(null);

  const visibleCurrencyPresets = computed(
    (): FilterCurrencyPreset[] => options.currencyOptions.value as FilterCurrencyPreset[],
  );

  const filteredOptions = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    const presets = visibleCurrencyPresets.value;
    if (!query) return presets;
    return presets.filter((option) => option.label.toLowerCase().includes(query));
  });

  const showSearchEmpty = computed(
    () => Boolean(searchQuery.value.trim()) && filteredOptions.value.length === 0,
  );

  function buildValueKey(currencyId: string, networkKey?: string): string {
    return networkKey ? `${currencyId}:${networkKey}` : currencyId;
  }

  function cloneValueSet(values: Iterable<string>): Set<string> {
    return new Set(values);
  }

  const committedSet = computed(
    () =>
      new Set(options.committedValueKeys.value.map((key) => key.trim()).filter(Boolean)),
  );

  const valuesForDisplay = computed(() => {
    const merged = cloneValueSet(draftValues.value);
    committedSet.value.forEach((key) => merged.add(key));
    return merged;
  });

  const hasDraftSelection = computed(() => draftValues.value.size > 0);

  function isOptionFullyCommitted(option: FilterCurrencyPreset): boolean {
    if (!option.multiChain || !option.networks?.length) {
      return committedSet.value.has(option.id);
    }
    if (committedSet.value.has(option.id)) return true;
    return option.networks.every((network) =>
      committedSet.value.has(buildValueKey(option.id, network.key)),
    );
  }

  function isOptionRowDisabled(option: FilterCurrencyPreset): boolean {
    return isOptionFullyCommitted(option);
  }

  function isNetworkRowDisabled(option: FilterCurrencyPreset, networkKey: string): boolean {
    return (
      committedSet.value.has(option.id)
      || committedSet.value.has(buildAutoRuleOutflowCurrencyValueKey(option.id, networkKey))
    );
  }

  function selectableNetworks(option: FilterCurrencyPreset) {
    return (option.networks ?? []).filter(
      (network) => !isNetworkRowDisabled(option, network.key),
    );
  }

  const {
    canScroll: pickerCanScroll,
    topScrim: pickerTopScrim,
    bottomScrim: pickerBottomScrim,
    update: updatePickerScroll,
  } = useScrollChromeScrim(scrollRef, { contentRef: optionListRef });

  const {
    topScrim: cascadeTopScrim,
    update: updateCascadeScroll,
  } = useScrollChromeScrim(cascadeScrollRef, { contentRef: cascadeListRef });

  const cascadeSubmenuStyle = computed(() => ({
    '--filter-cascade-max-height': `${FILTER_CURRENCY_CASCADE_PICKER_HEIGHT}px`,
  }));

  watch(
    () => [filteredOptions.value.length, searchQuery.value, showSearchEmpty.value],
    () => {
      updatePickerScroll();
    },
  );

  watch(activeCascadeKey, () => {
    void nextTick(() => {
      updateCascadeScroll();
    });
  });

  function resetSearch() {
    searchQuery.value = '';
  }

  function clearActiveCascade() {
    activeCascadeKey.value = null;
    cascadeDraftSnapshot.value = null;
  }

  function resetDraft() {
    draftValues.value = new Set();
    resetSearch();
    clearActiveCascade();
  }

  function removeOptionKeys(values: Set<string>, option: FilterCurrencyPreset) {
    values.delete(option.id);
    option.networks?.forEach((network) => {
      values.delete(buildValueKey(option.id, network.key));
    });
  }

  function selectOptionFully(values: Set<string>, option: FilterCurrencyPreset) {
    removeOptionKeys(values, option);
    values.add(option.id);
  }

  function expandOptionIdToNetworkKeys(values: Set<string>, option: FilterCurrencyPreset) {
    if (!values.has(option.id)) return;
    values.delete(option.id);
    option.networks?.forEach((network) => {
      values.add(buildValueKey(option.id, network.key));
    });
  }

  function normalizeOptionSelection(values: Set<string>, option: FilterCurrencyPreset) {
    const networks = option.networks ?? [];
    if (!networks.length) return;

    const networkKeys = networks.map((network) => buildValueKey(option.id, network.key));
    const selectedCount = networkKeys.filter((valueKey) => values.has(valueKey)).length;
    if (values.has(option.id) || selectedCount === networkKeys.length) {
      selectOptionFully(values, option);
    }
  }

  function normalizeDraftMultiChainValues() {
    const next = cloneValueSet(draftValues.value);
    visibleCurrencyPresets.value.forEach((option) => {
      if (option.multiChain && option.networks?.length) {
        normalizeOptionSelection(next, option);
      }
    });
    draftValues.value = next;
  }

  function getOptionSelectionStateFromValues(
    option: FilterCurrencyPreset,
    values: Set<string>,
  ): FilterOptionSelectionState {
    if (option.multiChain && option.networks?.length) {
      if (values.has(option.id)) return 'full';

      const networkKeys = option.networks.map((network) => buildValueKey(option.id, network.key));
      const selectedCount = networkKeys.filter((valueKey) => values.has(valueKey)).length;
      if (selectedCount === 0) return 'none';
      if (selectedCount === networkKeys.length) return 'full';
      return 'partial';
    }

    return values.has(option.id) ? 'full' : 'none';
  }

  function getOptionSelectionState(option: FilterCurrencyPreset): FilterOptionSelectionState {
    return getOptionSelectionStateFromValues(option, valuesForDisplay.value);
  }

  function resolveOptionValueSetForParentRow(option: FilterCurrencyPreset): Set<string> {
    if (
      activeCascadeKey.value !== option.id
      || cascadeDraftSnapshot.value === null
    ) {
      return valuesForDisplay.value;
    }

    const merged = cloneValueSet(draftValues.value);
    removeOptionKeys(merged, option);
    cascadeDraftSnapshot.value.forEach((valueKey) => merged.add(valueKey));
    return merged;
  }

  function getOptionParentSelectionState(option: FilterCurrencyPreset): FilterOptionSelectionState {
    return getOptionSelectionStateFromValues(option, resolveOptionValueSetForParentRow(option));
  }

  function getOptionParentSelectedNetworkCount(option: FilterCurrencyPreset): number {
    const networks = option.networks ?? [];
    if (!networks.length) return 0;

    const values = resolveOptionValueSetForParentRow(option);
    if (values.has(option.id)) return networks.length;

    return networks.filter((network) =>
      values.has(buildValueKey(option.id, network.key)),
    ).length;
  }

  function getOptionParentNetworkTotalCount(option: FilterCurrencyPreset): number {
    const networks = option.networks ?? [];
    if (networks.length) return networks.length;
    const parsed = Number(option.messageText);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function showOptionParentMessage(option: FilterCurrencyPreset): boolean {
    if (!option.multiChain) return false;
    return getOptionParentNetworkTotalCount(option) > 0;
  }

  function getOptionParentMessageText(option: FilterCurrencyPreset): string {
    const selected = getOptionParentSelectedNetworkCount(option);
    if (selected > 0) return String(selected);
    return String(getOptionParentNetworkTotalCount(option));
  }

  function resolveOptionModeTag(option: FilterCurrencyPreset): string | undefined {
    if (option.chainTagLabel?.trim()) return option.chainTagLabel;
    if (option.multiChain && option.modeTag) return options.translate(option.modeTag);
    return undefined;
  }

  const selectAllMode = computed<FilterSelectAllMode>(() => {
    const list = filteredOptions.value.filter((option) => !isOptionFullyCommitted(option));
    if (!list.length) return 'none';

    const states = list.map((option) => getOptionSelectionState(option));
    const fullCount = states.filter((state) => state === 'full').length;
    if (fullCount === list.length) return 'all';
    if (states.some((state) => state !== 'none')) return 'some';
    return 'none';
  });

  const selectAllChecked = computed(() => selectAllMode.value === 'all');
  const selectAllIndeterminate = computed(() => selectAllMode.value === 'some');

  function getNetworkSelectAllMode(option: FilterCurrencyPreset): FilterSelectAllMode {
    const networks = selectableNetworks(option);
    if (!networks.length) return 'none';

    const values = valuesForDisplay.value;
    if (values.has(option.id)) return 'all';

    const networkKeys = networks.map((network) => buildValueKey(option.id, network.key));
    const selectedCount = networkKeys.filter((valueKey) => values.has(valueKey)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === networkKeys.length) return 'all';
    return 'some';
  }

  function isOptionParentCheckboxChecked(option: FilterCurrencyPreset): boolean {
    return getNetworkSelectAllMode(option) === 'all';
  }

  function hasOptionDraftSelection(option: FilterCurrencyPreset): boolean {
    if (draftValues.value.has(option.id)) return true;
    const prefix = `${option.id}:`;
    return [...draftValues.value].some((valueKey) => valueKey.startsWith(prefix));
  }

  function setMultiValue(valueKey: string, selected: boolean) {
    const next = cloneValueSet(draftValues.value);
    if (selected) next.add(valueKey);
    else next.delete(valueKey);
    draftValues.value = next;
  }

  function setNetworkMultiValue(
    option: FilterCurrencyPreset,
    networkKey: string,
    selected: boolean,
  ) {
    const next = cloneValueSet(draftValues.value);
    if (option.networks?.length && next.has(option.id)) {
      expandOptionIdToNetworkKeys(next, option);
    }
    const valueKey = buildValueKey(option.id, networkKey);
    if (selected) next.add(valueKey);
    else next.delete(valueKey);
    normalizeOptionSelection(next, option);
    draftValues.value = next;
  }

  function setMultiChainOptionSelected(option: FilterCurrencyPreset, selected: boolean) {
    const next = cloneValueSet(draftValues.value);
    if (selected) {
      selectOptionFully(next, option);
    } else {
      removeOptionKeys(next, option);
    }
    draftValues.value = next;
  }

  function onSelectAllToggle() {
    const next = cloneValueSet(draftValues.value);
    const shouldSelectAll = selectAllMode.value !== 'all';

    filteredOptions.value.forEach((option) => {
      if (isOptionFullyCommitted(option)) return;
      if (shouldSelectAll) {
        selectOptionFully(next, option);
      } else {
        removeOptionKeys(next, option);
      }
    });

    draftValues.value = next;
  }

  function onNetworkSelectAllToggle(option: FilterCurrencyPreset) {
    const networks = selectableNetworks(option);
    if (!networks.length) return;

    const next = cloneValueSet(draftValues.value);
    const mode = getNetworkSelectAllMode(option);
    next.delete(option.id);

    networks.forEach((network) => {
      const valueKey = buildValueKey(option.id, network.key);
      if (mode === 'all') next.delete(valueKey);
      else next.add(valueKey);
    });

    if (mode !== 'all') {
      normalizeOptionSelection(next, option);
    }

    draftValues.value = next;
  }

  function onCheckboxUpdate(option: FilterCurrencyPreset, checked: boolean) {
    if (isOptionRowDisabled(option)) return;
    if (option.multiChain && option.networks?.length) {
      setMultiChainOptionSelected(option, checked);
      return;
    }
    setMultiValue(option.id, checked);
  }

  function onNetworkCheckboxUpdate(
    option: FilterCurrencyPreset,
    networkKey: string,
    checked: boolean,
  ) {
    if (isNetworkRowDisabled(option, networkKey)) return;
    setNetworkMultiValue(option, networkKey, checked);
  }

  function onOptionClick(option: FilterCurrencyPreset) {
    if (isOptionRowDisabled(option)) return;
    if (option.multiChain && option.networks?.length) {
      setMultiChainOptionSelected(option, getOptionSelectionState(option) !== 'full');
    } else {
      setMultiValue(option.id, !valuesForDisplay.value.has(option.id));
    }
  }

  function onNetworkClick(option: FilterCurrencyPreset, networkKey: string) {
    if (isNetworkRowDisabled(option, networkKey)) return;
    const values = valuesForDisplay.value;
    const valueKey = buildValueKey(option.id, networkKey);
    const currentlySelected = values.has(option.id) || values.has(valueKey);
    setNetworkMultiValue(option, networkKey, !currentlySelected);
  }

  function isOptionSelected(option: FilterCurrencyPreset): boolean {
    if (option.multiChain && option.networks?.length) {
      return getOptionSelectionState(option) === 'full';
    }
    return valuesForDisplay.value.has(option.id);
  }

  function isNetworkSelected(option: FilterCurrencyPreset, networkKey: string): boolean {
    const values = valuesForDisplay.value;
    if (values.has(option.id)) return true;
    return values.has(buildValueKey(option.id, networkKey));
  }

  function setCascadeScrollRef(optionId: string, element: HTMLElement | null) {
    if (activeCascadeKey.value !== optionId) return;
    cascadeScrollRef.value = element;
  }

  function setCascadeListRef(optionId: string, element: HTMLElement | null) {
    if (activeCascadeKey.value !== optionId) return;
    cascadeListRef.value = element;
  }

  function onCascadeOpen(option: FilterCurrencyPreset) {
    activeCascadeKey.value = option.id;
    cascadeDraftSnapshot.value = cloneValueSet(
      [...draftValues.value].filter(
        (valueKey) => valueKey === option.id || valueKey.startsWith(`${option.id}:`),
      ),
    );
    void nextTick(() => {
      updateCascadeScroll();
    });
  }

  function onCascadeConfirm(closeNetwork: () => void) {
    const optionId = activeCascadeKey.value;
    if (optionId) {
      const option = filteredOptions.value.find((item) => item.id === optionId);
      if (option?.multiChain && option.networks?.length) {
        const next = cloneValueSet(draftValues.value);
        normalizeOptionSelection(next, option);
        draftValues.value = next;
      }
    }
    cascadeDraftSnapshot.value = null;
    closeNetwork();
  }

  function onCascadeCancel(option: FilterCurrencyPreset, closeNetwork: () => void) {
    if (cascadeDraftSnapshot.value) {
      const next = cloneValueSet(draftValues.value);
      removeOptionKeys(next, option);
      cascadeDraftSnapshot.value.forEach((valueKey) => next.add(valueKey));
      draftValues.value = next;
      cascadeDraftSnapshot.value = null;
    }
    closeNetwork();
  }

  function onCascadeClear(option: FilterCurrencyPreset) {
    const next = cloneValueSet(draftValues.value);
    removeOptionKeys(next, option);
    draftValues.value = next;
  }

  function onCascadeRowEnter(optionId: string) {
    activeCascadeKey.value = optionId;
  }

  function isCascadeFlotationDisabled(optionId: string): boolean {
    return activeCascadeKey.value !== null && activeCascadeKey.value !== optionId;
  }

  function onCascadeFlotationClose(optionId: string) {
    if (activeCascadeKey.value === optionId) {
      activeCascadeKey.value = null;
    }
  }

  function onPickerClear() {
    draftValues.value = new Set();
  }

  function buildConfirmValue(): string {
    normalizeDraftMultiChainValues();
    return [...draftValues.value].join(',');
  }

  function onPickerOpened() {
    resetDraft();
    void nextTick(() => {
      updatePickerScroll();
    });
  }

  function onPickerClosed() {
    resetSearch();
    clearActiveCascade();
  }

  return {
    searchQuery,
    scrollRef,
    optionListRef,
    filteredOptions,
    showSearchEmpty,
    pickerCanScroll,
    pickerTopScrim,
    pickerBottomScrim,
    cascadeSubmenuStyle,
    cascadeTopScrim,
    selectAllChecked,
    selectAllIndeterminate,
    hasDraftSelection,
    resolveOptionModeTag,
    showOptionParentMessage,
    getOptionParentMessageText,
    isOptionParentCheckboxChecked,
    isCascadeFlotationDisabled,
    getNetworkSelectAllMode,
    hasOptionDraftSelection,
    isOptionSelected,
    isNetworkSelected,
    setCascadeScrollRef,
    setCascadeListRef,
    onSelectAllToggle,
    onCheckboxUpdate,
    onNetworkCheckboxUpdate,
    onOptionClick,
    onNetworkClick,
    onNetworkSelectAllToggle,
    onCascadeOpen,
    onCascadeConfirm,
    onCascadeCancel,
    onCascadeClear,
    onCascadeRowEnter,
    onCascadeFlotationClose,
    onPickerClear,
    buildConfirmValue,
    onPickerOpened,
    onPickerClosed,
    resetDraft,
    clearActiveCascade,
    isOptionRowDisabled,
    isNetworkRowDisabled,
  };
}

export type RiskControlAutoRuleOutflowCurrencyAddPickerMenuApi = ReturnType<
  typeof useRiskControlAutoRuleOutflowCurrencyAddPickerMenu
>;
