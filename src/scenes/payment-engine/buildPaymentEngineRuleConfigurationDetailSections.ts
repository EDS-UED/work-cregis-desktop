import {
  createDetailApplyItemRow,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { createPaymentEngineTransferCreationTimeRow } from './paymentEngineDetailApplyItemRows';
import { resolvePaymentRuleConfigurationRecordDetail } from './paymentEngineRuleConfigurationDetailData';

export const RULE_CONFIGURATION_CREATOR_ITEM_KEY = 'rule-configuration-creator';

export function buildPaymentEngineRuleConfigurationDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  const detail = resolvePaymentRuleConfigurationRecordDetail(row);
  const amountRangeLabel = detail.collectionAmountRangeKey === 'Unlimited'
    ? translate('Unlimited')
    : detail.collectionAmountRangeKey;
  const networkTag = detail.collectionNetworkLabel.trim();

  return [{
    key: 'rule-configuration-detail',
    items: [
      createDetailApplyItemRow('brand-number', {
        key: 'rule-configuration-number',
        title: translate('Rule Number'),
        value: detail.ruleNumber,
      }),
      createDetailApplyItemRow('crypto', {
        key: 'rule-configuration-collection-currency',
        title: translate('Collection Currency'),
        value: detail.collectionSymbol,
        valueSymbolCrypto: detail.collectionCryptoName,
        valueIcon: detail.collectionCryptoName,
        tag: networkTag,
      }),
      createDetailApplyItemRow('text', {
        key: 'rule-configuration-amount-range',
        title: translate('Collection Amount Range'),
        value: amountRangeLabel,
      }),
      createDetailApplyItemRow('receiver', {
        key: 'rule-configuration-receiving-address',
        title: translate('Arrival Address'),
        value: detail.receivingAddress,
        tag: '',
      }),
      {
        ...createDetailApplyItemRow('initiated-by', {
          key: RULE_CONFIGURATION_CREATOR_ITEM_KEY,
          title: translate('Creator'),
          value: detail.creatorName,
          valueSymbolAvatarName: detail.creatorAvatarName,
          valueSecondary: detail.creatorEmailMasked,
          valueDeviceInfo: detail.creatorDeviceInfo,
        }),
        titleIcon: 'eds-user-pointer',
      },
      createPaymentEngineTransferCreationTimeRow({
        key: 'rule-configuration-created-at',
        title: translate('Creation Time'),
        value: detail.createdAt,
      }),
    ],
  }];
}
