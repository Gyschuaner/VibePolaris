# Design QA · VBP-022 概念卡方案3

2026-09-21。用户选定第三张图后，在现有 ConceptGraph 内完成；沿用站点字体、主题变量与 Phosphor 图标，无新增依赖。上一轮侧栏 QA 保留于 [历史记录](docs/design/qa/before-compact-concept-card.md)。

## Findings 与修正历史

- [P2，已修复] 第一轮卡片高316.29px，标题与正文间距偏松。对照证据 `before-spacing-fix.png`。缩小类别行高、标题上距及正文上下距，标题调整为23px，阅读按钮为126×40px。最终卡片310×303.64px；重新捕获的 `comparison.png` 与选定稿同框比较通过。
- [P2，已修复，BUG-8546DB24] 桌面 compact 样式覆盖手机 bottom，卡片停在画布顶端y129。证据 `before-mobile-position-fix.png`。手机断点恢复 top:auto、bottom:70px；构建后重测390×844，展开卡片位于x12、y362.36、宽366、高411.64，底边774，九项完整且页面无横向溢出。最终证据 `mobile-expanded.png`。
- 无剩余P0/P1/P2。系统字体的抗锯齿及生成稿的轻微表面纹理差别作为可接受渲染差异；实现使用现有纯色surface，未把设计稿做成背景图。

## 视觉依据与对照

- source visual truth: `docs/design/VBP-022-concept-card/selected-option.png`，1050×1498像素，用户确认的第3个展示结果。
- implementation screenshot: `docs/design/VBP-022-concept-card/desktop.png`，1280×720 CSS视口和像素，最终截图DPR1。
- 状态：首页 `/?term=agent-harness`，雾蓝背景、陶土主题、相关概念9默认收起。
- 全局组合见 `desktop.png`。重点区域 `comparison.png` 左侧为原稿(x55,y68,687×663)等比缩至330×318；右侧为实际截图(x936,y159,330×325)，主体卡片均约310px宽。两图在同一输入中核对，未单独缩放文字或拉伸卡片。
- 上述对照包含整个卡片，类别、关闭、标题、定义、阅读操作和折叠入口均清晰可读，无需更小的局部裁切。
- 手机证据 `mobile-collapsed.png`、`mobile-expanded.png` 为390×844；生成稿只提供桌面局部，手机延续已有底部定位，扩大最大高度以保证内容可达。

## 五项视觉核对

| 项目 | 结果 |
| --- | --- |
| 字体 | 复用系统中文无衬线，标题23px/600，英文和定义14px，类别12px，折叠入口13px。标题不截断，定义在桌面为两行。 |
| 布局 | 无描边、12px圆角、轻阴影；20px水平内距，紧凑实色阅读按钮左对齐，关联列表默认收起。展开时自然增加高度，在可用空间内滚动。 |
| 色彩 | surface、muted、accent、accent-ink沿用现有变量；类别改为安静的次级色，阅读按钮使用陶土主题色，白色文字。 |
| 图像与图标 | 无需新栅格资产。X、ArrowUpRight、CaretDown复用现有图标库；关联项重复星星移除，画布品牌星星保持。 |
| 文案 | 中英文名称、类别、定义保持真实词库内容；“阅读词条”“相关概念”与选定稿一致，数量由实际关联节点计算。 |

## 实际验收

- 最终 `npm run build` 通过，49静态页面。仅在两处具体修正后重建，未扩大为全套check。
- 鼠标展开9项；原生details支持Space收起、Enter展开。展开内容从0px至116.5px、卡片从303.64px至420.14px，CSS为350ms缓动；减少动态分支停用过渡（代码核对，未切换系统偏好）。
- 点击“工具调用”后标题和阅读链接更新，数量为5且恢复收起；关闭后aria-hidden与inert隔离；重新选择Harness后阅读按钮成功进入词条页。
- 正文局部星图维持横向紧凑入口760×55.5px，阅读链接透明背景，不渲染关联details；见 `inline.png`。
- 390×844展开9项，末项底边758px，完整落在卡片内；页面scrollWidth为390。临时视口覆盖已清除。
- 本地3002浏览器error/warn日志为空。DOM尺寸见 `measurements.json`。
- DP限定计划：`5b461339-a6c7-4191-8f2b-97419463bf8e`；实际执行、合并提交与3001集成结果以DP最终记录为准。

## 剩余范围

未进行跨浏览器、屏幕阅读器实机、全部主题组合或全站回归；主题映射和星图物理逻辑未变。旧浏览器不支持details动画时退回原生开合。

## Implementation Checklist

- [x] 使用用户选择的第3张图
- [x] 紧凑卡片、实色阅读按钮、关联概念渐进展开
- [x] 两轮具体问题修正并重新捕获视觉证据
- [x] 构建与限定桌面、手机核心交互通过

final result: passed
