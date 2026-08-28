# VibePolaris v0.1 原型生图 Prompt

> 用途：AI 生图（gpt-image / nanobanana / midjourney / 即梦等）产出高保真原型参考图。
> 约定：中文 UI 文案生图大概率会乱码，**乱码不影响，我们看版式、密度、配色和层级**；出图后逐屏调整。
> 尺寸建议：桌面屏 16:9 或 3:2；手机端另用 9:16 出 1~2 张。

## 0. 全局风格前缀（每条 prompt 前面拼上它）

```
High-fidelity website UI design mockup of a modern Chinese tech knowledge site called "VibePolaris Vibe指北" (theme: north star / night-navigation guide for vibe coders). Flat, clean, editorial layout like Linear/Vercel docs; generous whitespace; rounded-2xl cards with hairline borders; indigo blue #4338ca as primary accent on warm off-white background; a small glowing 8-point north-star logo motif; crisp sans-serif typography with clear hierarchy; dense-but-breathable information design; Figma-quality, pixel-perfect, 4k.
```

负面提示（支持 negative prompt 的模型用）：

```
no photo realism, no 3D glassmorphism overload, no gradient blobs, no cluttered stock photos, no watermark
```

## 1. 首页（亮色）— 最重要的一张

```
[全局前缀] +

Desktop homepage layout, top to bottom:
1) Slim sticky navbar: small north-star logo + "VibePolaris Vibe指北", nav links "术语 选型指南 工具 关于", a search icon "⌘K" and a sun/moon theme toggle at right.
2) Hero section, centered: large headline "把大白话，翻译成 AI 听得懂的术语", one-line subhead below, then a big prominent search bar with placeholder text 「试试说：点一下会弹出来的小框…」, and a small stats line "281 术语 · 6 分类 · 更新于本周".
3) Category row: six equal rounded cards labeled 前端 / 后端 / AI·Agent / 技术栈 / Git / 产品与设计, each with a tiny icon, entry count badge, one short description line.
4) Featured guide banner card, slightly darker indigo tint, star-chart decorative pattern: title 《AI 模型 / 编程工具怎么选》, subtitle "场景 → 对比 → 结论 → 向 AI 怎么说", a "开始指北 →" button.
5) "最近上新" strip: four term cards in a row; each card shows Chinese+English term name (e.g. 组件 Component) and a chat-style quote bubble containing a colloquial sentence.
6) Minimal footer with links and copyright.
Overall: airy hero, information-dense mid page, magazine-like rhythm, light theme.
```

## 2. 术语浏览页（亮色）

```
[全局前缀] +

Desktop "terms browser" page:
1) Same navbar. Below it a full-width search input "搜术语：用你的大白话就行…".
2) Left sidebar (240px): vertical category tree — six main categories (前端/后端/AI·Agent/技术栈/Git/产品与设计) with counts, one category expanded showing sub-groups like 网页基础 / 表单 / 内容展示.
3) Main area: responsive grid of ~12 term cards (3 columns). Card anatomy: term name "按钮 Button" in bold, a soft indigo chat bubble with a colloquial Chinese sentence inside, bottom row with category tag chip + small stage badge (起步/进阶/熟练) + a star favorite icon.
4) First card is in hover state with subtle lift shadow and indigo border.
5) Top-right of grid: sort/filter dropdown "全部阶段 ▾".
Overall: wiki-like density but modern, light theme, sidebar sticky.
```

## 3. 术语详情页（亮色）

```
[全局前缀] +

Desktop term detail page, single column (max 760px) centered:
1) Breadcrumb "术语 / 前端 / 组件 Component".
2) H1 "组件 Component" + category chip 前端 + stage badge "起步 · Stage 1".
3) "大白话" section: a realistic chat UI mock — user message bubble on right containing colloquial Chinese sentence "把这个重复出现的商品区做成组件，改一个地方就能同步更新。", AI reply bubble on left.
4) "它是什么" section: short definition paragraph, generous line height.
5) "向 AI 这样说" section: dark code-block style prompt template card with monospace text and a "复制" button at top-right corner.
6) "相关术语" section: 4 rounded chip links with tiny star icons.
7) Bottom: horizontal mini roadmap progress (起步→进阶→熟练) with current stage highlighted by a north-star pin.
8) Right side of hero: faint constellation line-art decoration.
Overall: docs-like readability, generous spacing, light theme.
```

## 4. 首页（暗色 · 品牌旗舰图）

```
High-fidelity dark-mode website UI mockup of the same Chinese knowledge site "VibePolaris Vibe指北". Deep navy #0b1020 starry background with a very subtle starfield and one constellation shaped like a compass pointing north near the hero; primary accent glowing indigo #818cf8; cards in slightly lighter navy #151b30 with 1px #2a3154 borders; same layout as the light homepage (navbar, hero with big search bar, six category cards, featured guide banner, term cards row); headline in near-white, secondary text in slate #94a3b8; north-star logo glows softly. Editorial, calm, premium night-sky atmosphere, Figma-quality, 4k.
```

## 5.（可选）移动端首页

```
[全局前缀] +

Mobile phone homepage mockup (375px width, portrait): compact navbar with hamburger, hero headline two lines, full-width search pill, horizontally scrolling category chips with counts, one featured guide card, stacked term cards with quote bubbles. Show the phone floating on a plain neutral background, light theme.
```

## 使用建议

1. 先出 **图1（首页亮色）**，定下密度和配色基调，其他屏再对齐它。
2. 出图后把图发我，我按 PRD 逐屏标注调整点（版式/层级/文案位）。
3. 选型指南页（guides）详情页 v0.1 复用术语详情范式 + 一张对比表格，可暂不出图。

---

## 5.5 R2 定稿（首页 · 最终基线；取代 §6 首页亮色 prompt 的 hero 与 banner 描述）

R2 相对 R1 的两处结构变化（评审通过，冻结为最终版）：
1. **hero 改为超大品牌 wordmark「VibePolaris」**，取代中文大标题。
2. **删除「精选指北」大 banner 卡**，「最近上新」直接衔接分类区。

开发时代码侧补齐（不再出图验证）：
- wordmark 正下方加一行小灰字 tagline：`面向 Vibe Coder 的术语词典与选型指北`。
- 「最近上新」下方加一行文字链：`精选指北 · 《AI 模型 / 编程工具怎么选》→`。
- R1 的 7 条微调继续有效（月亮图标、数字动态化、双语去重、灰字 AA、hover 仅下划线、搜索焦点态唯一）。
- 图内 `281/56 条`、`© 2025`、`数据库索引` 等均为生图模型文案，以 `content/` 构建产物为准。

暗色版按 R2 结构出图（wordmark hero、无 banner、末尾一行精选指北文字链），prompt 已按此修订。术语浏览页与详情页定稿 prompt 不受影响，继续有效。

---

## 6. R1 设计基线（已定稿）

R1 首页亮色图（1536×1024，极简风）经评审定为 **v0.1 全站设计基线**。设计语言：暖白 `#FAFAF8`、发丝分隔线 `#E7E5E4`、单一靛蓝强调 `#4F46E5`、零装饰噪声、杂志式纵向节奏。

**并入的微调（7 条）**：
1. 主题切换图标语义：亮色模式显示 🌙（表意"可切暗色"），暗色反之。
2. 一切内容数字（术语数、分类条数、更新日期、© 年份）构建时从 `content/` 动态生成，禁止写死；v0.1 实为 `20 术语 · 6 分类`。
3. 双语命名规则：英文与中文名重叠时只显示一次（`API 接口`，不写「API 接口 API」）。
4. 品牌色规则统一：「Vibe指北」副名导航与页脚同色（靛蓝）。
5. 灰字对比度 ≥ WCAG AA（正文灰 ≥ `#6B7280`）。
6. 最近上新零装饰：整块可点，hover 仅标题靛蓝下划线，无阴影无底色。
7. 焦点态全站唯一给搜索框：2px 靛蓝描边。

**撤回项**（与极简风冲突，不做）：最近上新的对话气泡、搜索框下引导 chip。

**零内置 AI 硬约束（VBP-001 验收第 9 条）对原型的约束**：全站不得出现"站方 AI"暗示——无对话助手入口；术语详情页的对话 mock 必须加 eyebrow 标注「示例对话 · 发给 AI 的原话」，语义为引用用户与外部 AI 的对话，非本站功能。

### 定稿 Prompt · 首页亮色（基线）

```
High-fidelity website UI design mockup of a modern Chinese tech knowledge site called "VibePolaris Vibe指北", minimalist editorial style like Linear or Vercel docs, warm off-white background #FAFAF8, hairline #E7E5E4 dividers, single indigo accent #4F46E5 used sparingly, small glowing 8-point indigo north-star logo, crisp sans-serif typography, zero decorative noise, generous whitespace, Figma-quality pixel-perfect 4k. Desktop homepage top to bottom: slim sticky navbar with north-star logo, "VibePolaris" in black plus "Vibe指北" in indigo, nav links 术语 / 选型指南 / 工具 / 关于, a thin pill search button with magnifier and ⌘K, and a small moon icon at far right; centered hero with large headline 把大白话，翻译成 AI 听得懂的术语, gray subhead 面向 Vibe Coder 的术语词典与选型指北，让你和 AI 沟通更准确，交付更高效。, a large clean search bar with hairline border and placeholder 试试说：点一下会弹出来的小框…, shown focused with a 2px indigo border; stats line 20 术语 · 6 分类 · 更新于本周 with the numbers in indigo; one row of six categories separated only by thin vertical hairlines with no borders or backgrounds, each column with a tiny thin-line icon, bold label 前端 后端 AI·Agent 技术栈 Git 产品与设计, small count 4 条 / 3 条 / 5 条 / 3 条 / 2 条 / 3 条, and a two-line medium-gray description; a very light indigo tinted rounded banner with small indigo eyebrow 精选指北, title 《AI 模型 / 编程工具怎么选》, subtitle 场景 → 对比 → 结论 → 向 AI 怎么说, link 开始指北 →, and on the right a faint dotted elliptical orbit with one slightly larger glowing 8-point star; section title 最近上新 followed by four plain term columns separated by thin vertical hairlines, each showing a bold Chinese term with gray English counterpart only when different (组件 Component, API 接口, 提示词 Prompt, 智能体 Agent) above a two-line medium-gray colloquial sentence ending with 。, the first column hovered showing only an indigo underline under its title with no shadow or background change; minimal footer with small logo, name, tagline on the left and small mirrored nav links plus dynamic copyright on the right. Airy hero, magazine-like vertical rhythm, strict minimalism, light theme, no photo realism, no glassmorphism, no watermark.
```

### 定稿 Prompt · 首页暗色

```
High-fidelity website UI design mockup of a modern Chinese tech knowledge site called "VibePolaris Vibe指北", minimalist editorial style like Linear or Vercel docs, strict dark theme: deep navy background #0B1020 with an extremely subtle starfield gradient, banner and cards in #141A2E with hairline #262E4B borders, single indigo accent #818CF8 used sparingly, near-white headlines #E8ECF5, medium gray secondary text #8B94AD, small glowing 8-point indigo north-star logo, crisp sans-serif typography, zero decorative noise, generous whitespace, Figma-quality pixel-perfect 4k. Desktop homepage top to bottom: slim sticky dark navbar with glowing north-star logo, "VibePolaris" in white plus "Vibe指北" in indigo, nav links 术语 / 选型指南 / 工具 / 关于, a thin pill search button with magnifier and ⌘K, and a small sun icon at far right; centered hero with large near-white headline 把大白话，翻译成 AI 听得懂的术语, gray subhead 面向 Vibe Coder 的术语词典与选型指北，让你和 AI 沟通更准确，交付更高效。, a large clean search bar with hairline border and placeholder 试试说：点一下会弹出来的小框…, shown focused with a 2px indigo border and faint glow; stats line 20 术语 · 6 分类 · 更新于本周 with the numbers glowing indigo; one row of six categories separated only by thin vertical hairlines with no card backgrounds, each column with a tiny thin-line icon, bold white label 前端 后端 AI·Agent 技术栈 Git 产品与设计, small gray count 4 条 / 3 条 / 5 条 / 3 条 / 2 条 / 3 条, and a two-line gray description; a slightly lighter navy rounded banner card with small indigo eyebrow 精选指北, white title 《AI 模型 / 编程工具怎么选》, gray subtitle 场景 → 对比 → 结论 → 向 AI 怎么说, indigo link 开始指北 →, and on the right a faint dotted elliptical orbit with one larger glowing 8-point star as the page's single decorative element; section title 最近上新 followed by four plain term columns separated by thin vertical hairlines, each with a bold white Chinese term and gray English counterpart only when different (组件 Component, API 接口, 提示词 Prompt, 智能体 Agent) above a two-line gray colloquial sentence ending with 。, the first column hovered showing only an indigo underline under its title with no shadow; minimal dark footer with small logo, name and tagline on the left, small mirrored nav links and © 2026 on the right. Calm premium night-sky atmosphere, magazine-like vertical rhythm, strict minimalism, no photo realism, no glassmorphism, no watermark.
```

### 定稿 Prompt · 术语浏览页

```
High-fidelity website UI design mockup of a modern Chinese tech knowledge site called "VibePolaris Vibe指北", minimalist editorial style like Linear or Vercel docs, strict light theme: warm off-white background #FAFAF8, hairline dividers #E7E5E4, single indigo accent #4F46E5, small glowing 8-point indigo north-star logo, crisp sans-serif typography, zero decorative noise, Figma-quality pixel-perfect 4k. Desktop terms-browser page in the same design language: slim sticky navbar with north-star logo, "VibePolaris" black plus "Vibe指北" indigo, nav links 术语 / 选型指南 / 工具 / 关于, thin ⌘K search pill, moon icon at right; below the navbar a full-width hairline-outlined search bar with placeholder 搜术语：用你的大白话就行…, shown focused with a 2px indigo border; a sticky 240px left sidebar showing a vertical category tree of six Chinese categories 前端 后端 AI·Agent 技术栈 Git 产品与设计 each with a small count, the 前端 item active in indigo and expanded to gray sub-groups 网页基础 / 表单 / 内容展示, the sidebar separated from content by one thin vertical hairline and using no boxes or backgrounds; main area a dense but breathable three-column grid of twelve term entries separated only by hairline grid lines instead of cards, each entry showing a bold Chinese term with gray English counterpart only when different (组件 Component, 状态 State, 按钮 Button, 表单 Form, API 接口, 数据库 Database, 认证 Authentication, 提示词 Prompt, 上下文 Context, 智能体 Agent, 分支 Branch, 线框图 Wireframe), a one-line medium-gray colloquial sentence under it, and a tiny gray stage tag 起步 or 进阶 at its bottom-right, no shadow and no background tint anywhere; the first entry hovered showing only an indigo underline on its title; a small dropdown 全部阶段 ▾ above the grid on the right; wiki-like density kept airy by whitespace, strict minimalism, light theme, no photo realism, no glassmorphism, no watermark.
```

### 定稿 Prompt · 术语详情页

```
High-fidelity website UI design mockup of a modern Chinese tech knowledge site called "VibePolaris Vibe指北", minimalist editorial style like Linear or Vercel docs, strict light theme: warm off-white background #FAFAF8, hairline dividers #E7E5E4, single indigo accent #4F46E5, small glowing 8-point indigo north-star logo, crisp sans-serif typography with generous line height, zero decorative noise, Figma-quality pixel-perfect 4k. Desktop term-detail page, one centered reading column about 720px wide below the standard slim navbar: gray breadcrumb 术语 / 前端 / 组件 Component; H1 组件 Component with the English part in gray, one small outlined category chip 前端 and one small gray badge 起步 · Stage 1, one thin hairline under the header; section 大白话 with a small gray eyebrow label 示例对话 · 发给 AI 的原话, containing a right-aligned light-indigo quote block with the colloquial Chinese sentence 把这个重复出现的商品区做成组件，改一个地方就能同步更新。 and below it a left-aligned neutral-gray quote block of the coding assistant's reply lines, the two quotes stacked with generous spacing and hairline separators instead of chat bubbles, clearly reading as a quoted external conversation, not a site feature; section 它是什么 with a short definition in dark text, generous line height, one indigo inline link 状态 State; section 向 AI 这样说 rendered as the page's only dark element: a near-black rounded code card with monospace prompt-template text containing 「」 placeholders and a small 复制 button at its top-right; section 相关术语 with four plain indigo text links in one row separated by thin vertical hairlines; before the footer a full-width thin horizontal mini-roadmap with three labeled stops 起步 / 进阶 / 熟练, the first stop marked by a small glowing indigo 8-point star; minimal footer with small mirrored nav links and © 2026. Docs-like readability, calm magazine rhythm, strict minimalism, light theme, no photo realism, no glassmorphism, no watermark.
```
