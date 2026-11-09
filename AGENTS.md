# work-cregis-desktop — Agent 须知

> 规范在 `.cursor/rules/*.mdc`（Cursor `alwaysApply` 自动加载）。本文件仅作入口跳转；分工以 `work.mdc` §0.1 为准。

| 文件 | 用途 |
|------|------|
| [`.cursor/rules/work.mdc`](.cursor/rules/work.mdc) | **Agent 入口 + 边界真源** — 规则分工、硬约束速查、EDS 边界、工程 / 推送、挂载、组件选型、i18n、全局机制、模块定稿、校验 |
| [`.cursor/rules/general.mdc`](.cursor/rules/general.mdc) | **通用页面真源** — 页面 chrome、创建 / 编辑页、数据列表页、详情、EgSkid、EgDialog、数据展示、DataList mock；持续补充 |
| [`.cursor/rules/motion.mdc`](.cursor/rules/motion.mdc) | **动效真源** — 页面切换 motion-page、Tab 内容 crossfade、浮层 motion-flotation、排查；持续补充 |
| [`../eds-desktop/.cursor/rules/work.mdc`](../eds-desktop/.cursor/rules/work.mdc) | EDS 完整约定 |

改代码：**先扫 `work.mdc` §0.2 硬约束 → 按「真源」列跳到对应文件 §**。新建 / 改造页面先在 `general.mdc` §0 选模板；涉及切换或进出场动效查 `motion.mdc` §0。
