# Shell Debug Platform（壳外调试）

**仅 DEV 挂载**（`AppRoot.vue` + `import.meta.env.DEV`）。生产构建不包含。

## 硬边界

### 互不影响（双向隔离）

壳外工具与 `.app-preview` 内业务 **完全解耦**，任一方向的改动不得牵连另一方：

| 方向 | 规则 |
|------|------|
| 壳 → 业务 | **【禁止】** 为 Inspect / QA / Popover 去改业务布局、padding、挂载点、样式或组件 API（含 `src/views/**`、`src/scenes/**`、`global.css` 业务区）。Dev 面板间距、滚动、字号等 **只在** `src/dev/shell-debug/**` 内用 `:global(...)` 或 `teleport-to="body"` 解决。 |
| 业务 → 壳 | **【禁止】** 业务 import `src/dev/**`；业务内 `if (DEV)` 分支；为壳外工具改 EgLayout / 列表页结构。壳外只 **只读** DOM / `getComputedStyle`，或调用业务 **已 export** 的 store / 函数（Scenario 注入）。 |

**反例（已发生）**：在 `AppShellView.vue` 加 `.app-shell-body` padding 以对齐 Inspect Popover → 业务列表四周出现空白。**正确**：padding 写在 `ShellDebugLauncherAnchored.module.css` 的 `[class*='contentSlotPaddingTop']` 等 Dev 选择器内。

**Inspect 识别（全局 · 点谁是谁）**：对 **当前点击的 DOM 节点** 单独判定展示名。**内层 DS 组件优先**（自身 `eds-*` 根类、Vue 组件 DOM 根、Text / Icon / Button 等）；**无更内层身份时** 才用 HTML 标签名或 **外壳借名**。**【禁止】** DataListColumn 式误冒泡（列内 `div` / `span` 不得显示为 DataListColumn；仅 `td` 根为 DataListColumn）。

| 优先级 | 规则 |
|--------|------|
| 1 | Typography 文本叶子 → **Text**（**不含** `.eds-avatar` 子树 — initials 等仍归 **Avatar**） |
| 2 | 节点自身带 catalog `eds-*` 根类 → DS 名 + **该实例** props |
| 3 | **最内层 Vue catalog owner**（`findNearestVueCatalogOwner`：点组件内部子 DOM 亦命中 Textarea / ModuleMenuItem 等，不必是 DOM 根）→ 该组件 props |
| 4 | **Avatar 子树** → **Avatar** |
| 5 | 图形叶子 → **Icon** / **Crypto** |
| 6 | Detail **行 layout**（非内层 Icon/Tooltip/Text）→ **Apply_Item** |
| 7 | **外壳 chrome 借名**（全局唯一规则 `canBorrowShellSubtreeName`）：**仅**点击节点自身带 structural `eds-*`（`edsInspectStructuralDom` 白名单）。**禁止** CSS Module 类名片段。**大壳 layout 根**（Layout / Container / NavBar / BatchBar / **DataList** / **Tabs**）仅 DOM 根可 owner；内层 → **Div** + 该节点 layout。**ownerDomRootOnly**（DataListColumn td、FlotationMenu 浮层根等）同理 |
| 8 | Teleport 浮层可点选，按浮层内节点身份识别 |
| 9 | 其余 → **HTML 标签名** |

- **Props 与用法**：每层展示 **该层匹配 Vue 实例** 的 props（`resolveCandidateInstance` 按 catalog + scopeRoot）；外壳借名时 scope = 外壳 DOM 根，禁止把外层 NavBar/Detail props 套到内层 Button / ModuleMenuItem 上。
- **布局 / 样式代码（Figma Dev Mode 式）**：
  - **识别**：点谁是谁（见上表）；`componentChain` 沿 DOM 祖先，仅供内部。
  - **取值**：`inspectDeclaredStyles` 按 **特异性 + 文档顺序** 级联，读取规则内 **原始声明**（`var(--*)` 直出）；禁止 computed 反查误配。
  - **输出**：`buildDeclaredInspectCode` 对 **当前点击节点** 取 declared 样式（非外层 DS root）；**declared `var(--*)` 优先**
  - **合并**：`buildInspectCodeSections` — 所有 DS 组件 **统一** 先出布局 + 样式；Text 追加「字体排版」（declared 优先）；Icon / Crypto 等仅追加 SVG 等专用块。
- **壳层 Tooltip**：`.app-preview` 根 `panelKind=container` 与 EgPopup 外壳 Tooltip **跳过**（见 `resolveEdsComponentInspect.ts`）。

**Text 识别**：仅 **typography 叶子**（`span` / `p` / `label` 等，含 Bar 子像素宿主）→ **Text**；`td` / `div` / `button` 等容器或组件根 → DS 组件 catalog 或元素属性，**不**判为 Text。

**Token 展示原则**：布局 / 样式代码 **优先输出 stylesheet 原始 `var(--*)` 声明**；仅 Text 在无 declared 排版时回退 typography role 匹配。属性面板 token 仍经 `resolveDesignToken.ts`；**禁止**用 computed 色值反查冒充 DS 声明。

**Text 样式名**：按 **视觉有效字号**（含 Bar 11px 的 2×+`scale(0.5)` / `zoom(0.5)` 子像素处理）匹配 Figma Text Style（`typographyInspectMatch.ts`），属性「样式」与「字体排版」区块输出对应 role 的 `--eds-*` token，而非 DOM 上的 2× computed 值。

**动效（属性面板）**：属性面板 **始终** 含 **动效** 行；仅 **当前点击节点自身** 挂完整 motion semantic class 时值为 `.motion-ease.is-hover` 等，否则为 **无**。禁止继承祖先 motion；点组件内层容器若无自身 class 则显示 **无**。

| 允许 | 禁止 |
|------|------|
| `src/dev/shell-debug/**` | 改 `../eds-desktop/packages/**` |
| `AppRoot.vue` **仅** DEV 异步挂载 `ShellDebugPlatform` | 改 `src/views/**`、`src/scenes/**` 业务源码 |
| `main.ts` 壳启动链（若需） | 为 Dev/QA 改业务 EgLayout slot、ToolBar、列表容器 |
| import 业务 **已 export** 的 store / 函数 | 业务 import `src/dev/**` |
| 只读 DOM / computedStyle（开发者模式） | 业务内 `if (DEV)` 分支 |
| Dev Inspect 面板内复制（`data-dev-inspect-copy`） | 业务页 clipboard / 复制按钮 |

## 两种模式

1. **开发者（Inspect）** — 打开 Dev Popover 自动进入点选；悬停 Popover 预览属性，点击 Pin 到 Dev 面板并可复制；期间 **拦截 `.app-preview` 内所有业务点击/导航**（模块菜单、ToolBar 等）。仅 `src/dev/shell-debug/inspect/**` 实现，不碰业务组件。
2. **QA（Scenario）** — Popover 标题 = 当前模块菜单页名；**仅**展示当前页注册的测试项列表；点「执行」调用公开 API 注入状态。与 Dev Inspect **完全独立**。

## 启动器

- 位于 `.app-preview` 右侧；Popover `320×360–530` adaptive；`teleport-to="body"`。
- Dev / QA 各自独立 Popover；QA 不受 Dev Inspect 拦截影响（`data-shell-debug-ui` 排除）。
- **Dev 进入点选时保留业务浮层**：Dev 启动器使用 `EgAnchoredTooltip` + `openPanel()`（绕过 `EgAnchoredPopover` 的 `closeAllAnchoredTooltips`）；`installShellDebugFloatLayerGuard` 使点击壳层 UI 不触发业务 click Popover 的外部关闭。

**Catalog 覆盖**：`node scripts/verify-shell-debug-inspect-catalog.mjs` 对照 `../eds-desktop` 组件根 `eds-*` 与 `edsInspectCatalog.ts`；缺条目时补 catalog，勿再开 CSS Module 借名后门。

**DataList适配（Inspect）**：仅当 **点选节点在 `.eds-data-list` 子树内** 时，Dev 面板在 **属性** 与 **用法** 之间展示 **DataList适配** 组（Popup / Popover 内 Inspect **不展示**）。每可见列一行（`第1列` …），值为 `min-width: xxxpx`，参与 flex 均分则后缀 `（flex）`。

## 扩展

- Inspect：`inspect/buildElementInspectInfo.ts` · `inspect/developerInspectSession.ts`
- Scenario：`registry.ts` + `scenarios/*.ts`
