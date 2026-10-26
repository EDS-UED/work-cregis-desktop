/** QA 验收 · 查询记录 · 人工审核后 Headline 与评分。 */
export const RISK_CONTROL_QUERY_RECORDS_MANUAL_REVIEW_QA_CHECKLIST = [
  '完成人工审核（交易密码 111111）后 Headline 风险评级展示所选等级，并附带半角括号后缀「(人工审核)」（后缀为 primary 100% 色）。',
  '风险评分 10 / 10（或原查询分数）不因人工审核而改变。',
] as const;
