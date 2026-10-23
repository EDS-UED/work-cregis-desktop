import {
  MANAGE_WEBHOOK_CONFIG_MENU_ITEM,
  MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM,
} from '@/scenes/manage/manageMenuData';

/** Shell Debug QA · 查询记录（风控 AML 列表）。 */
export const RISK_CONTROL_QUERY_RECORDS_PAGE_KEY = 'Risk Control:Query Records' as const;

/** Shell Debug QA · 自动规则。 */
export const RISK_CONTROL_AUTO_RULES_PAGE_KEY = 'Risk Control:Auto Rules' as const;

/** Shell Debug QA · Webhook 配置。 */
export const WEBHOOK_CONFIG_PAGE_KEY = `Manage:${MANAGE_WEBHOOK_CONFIG_MENU_ITEM}` as const;

/** Shell Debug QA · 推送记录。 */
export const WEBHOOK_PUSH_RECORDS_PAGE_KEY =
  `Manage:${MANAGE_WEBHOOK_PUSH_RECORDS_MENU_ITEM}` as const;
