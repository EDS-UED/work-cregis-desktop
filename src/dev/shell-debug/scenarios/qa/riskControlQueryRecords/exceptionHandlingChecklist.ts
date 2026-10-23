/** QA 验收 · 查询记录「指定处理人」异常处置（AML-00003）。 */
export const RISK_CONTROL_QUERY_RECORDS_EXCEPTION_HANDLING_QA_CHECKLIST = [
  '在查询结果 Tab「处理方式」任选重新查询 / 放行 / 驳回，确认温馨提示（placement=top）后输入交易密码 111111，出现全局成功反馈。',
  '关闭详情回到列表：该条「风险评级」列更新为处置返回结果（重新查询→危险及分数；放行 / 驳回→已处理，不展示分数）。',
  '再次打开同条详情：重新查询、放行、驳回三按钮均为禁用态，不可再次发起确认。',
] as const;
