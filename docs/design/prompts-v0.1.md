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
