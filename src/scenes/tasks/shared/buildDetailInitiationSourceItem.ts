import {
  createDetailApplyItemRow,
  type DetailItemData,
} from '@eds/desktop-components';
import { buildGeneralStructureRowValues } from '../list-field/tasksListFieldGeneralStructureRowData';
import {
  resolveInitiationSourceForRow,
} from './resolveInitiationSourceForRow';
import { resolveSwapAppEntryForRow } from './swapAppEntries';
import { resolveWaasProjectNameForRow } from './waasProjectNames';

const MEMBER_INITIATOR_DEVICE_INFO = {
  deviceType: 'MacOS(v3.6.0)',
  deviceId: 'AXSMJSAXJQ',
  ip: '192.168.2.1',
};

function buildInitiationSourcePlainTextRow(
  title: string,
  value: string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('text', {
      key: 'initiation-source',
      title,
      value,
    }),
    titleIcon: 'eds-arrow-launch-circle',
  };
}

function parseInitiatorListPrimaryValue(value: string): { name: string; email?: string } {
  const match = value.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1]!.trim(), email: match[2]!.trim() };
  }
  return { name: value.trim() };
}

export function buildDetailInitiationSourceItem(
  rowIndex: number,
  translate: (key: string) => string,
): DetailItemData {
  const source = resolveInitiationSourceForRow(rowIndex);
  const title = translate('Initiation Source');

  if (source.kind === 'application') {
    return buildInitiationSourcePlainTextRow(
      title,
      resolveSwapAppEntryForRow(rowIndex).label,
    );
  }

  if (source.kind === 'waas-project') {
    return buildInitiationSourcePlainTextRow(
      title,
      resolveWaasProjectNameForRow(rowIndex),
    );
  }

  const { name, email } = parseInitiatorListPrimaryValue(
    buildGeneralStructureRowValues(rowIndex).value,
  );

  return {
    ...createDetailApplyItemRow('initiated-by', {
      key: 'initiation-source',
      title,
      value: name,
      ...(email ? { valueSecondary: email } : {}),
    }),
    valueType: 'user',
    valueSymbolAvatarName: name,
    showValueSymbol: true,
    valueSymbolKind: 'avatar',
    valueDeviceInfo: { ...MEMBER_INITIATOR_DEVICE_INFO },
  };
}
