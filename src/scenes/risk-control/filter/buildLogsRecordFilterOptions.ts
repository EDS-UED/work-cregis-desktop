import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  LOGS_RECORD_LOG_EVENT_CATEGORY_KEYS,
  LOGS_RECORD_LOG_TYPE_KEYS,
} from './logsRecordFilterCatalog';
import {
  LOGS_RECORD_LOG_EVENT_NAMESPACE,
  LOGS_RECORD_LOG_TYPE_NAMESPACE,
} from './logsRecordFilterNamespaces';

export function buildLogsRecordLogTypeFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return LOGS_RECORD_LOG_TYPE_KEYS.map((typeKey) => ({
    id: resolveDataListFilterOptionId(LOGS_RECORD_LOG_TYPE_NAMESPACE, typeKey),
    label: translate(typeKey),
  }));
}

export function buildLogsRecordLogEventFilterOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return LOGS_RECORD_LOG_EVENT_CATEGORY_KEYS.map((eventKey) => ({
    id: resolveDataListFilterOptionId(LOGS_RECORD_LOG_EVENT_NAMESPACE, eventKey),
    label: translate(eventKey),
  }));
}
