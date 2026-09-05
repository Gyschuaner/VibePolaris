# VBP-004 桌面 Harness 初版设计 QA

日期：2026-09-05。范围为本地可交互初版，不代表 dev 集成或生产发布完成。此前根目录 QA 保存为 docs/design/VBP-004-desktop-r1/previous-design-qa.md。

## 视觉基线与证据

- 首页：docs/design/VBP-004-desktop-r1/existing-motion/01-idle.png、03-mcp-focused.png 及实际交互。保留原有星点位置、聚焦、分类聚散、Escape 及 RouteMeteorProvider。
- Harness：docs/design/VBP-004-desktop-r1/harness-annotated.png（1355×1161，左侧约1085px为页面，其余为批注）。按确认口径使用中性模型图标，不复制批注。
- 实现：docs/design/VBP-004-desktop-r1/implementation/08-harness-final-top.png（1425×1089）；CSS视口1440×1100，DPR约1。截图不含部分滚动条边缘。
- 同图整体对照：implementation/11-comparison-final.png。原型内容裁剪(65,118)-(1050,943)，实现裁剪(238,104)-(1178,990)，分别归一至850px宽，比较开放工具状态，排除导航和批注栏。
- 同图局部对照：implementation/12-demo-comparison-final.png，检查双轨、步骤、详情和控件。
- 1280×900：implementation/10-harness-1280.png、13-harness-1280-dark.png；首页避让后：14-home-focus-final.png；复制拒绝：15-clipboard-denied.png。
- 09-harness-final-full.png存在整页拼接伪影，未用于判定。

## 迭代与修复

首轮同图对照06-comparison-before.png发现P2：步骤详情12px及轨道标签11px偏小；轨道圆点与标签基线未对齐；定义末尾产生孤立短行。已调整为详情14px、步骤13px、说明12px，基线对齐，定义按语义分两行。整体与局部复查均已打开，未发现剩余P0/P1/P2。

首页Harness的完整词条入口曾与外围智能体文字重叠。仅将Harness入口沿摘要左侧对齐，保留其他入口和全部既有动效。最终1280×900 DOM矩形检查无重叠，14-home-focus-final.png可见文字分离。上述视觉问题关联BUG-C6FE793E。

词库检查发现Harness没有入站关联，已补上下文和智能体关联，并实际从上下文进入。关联BUG-4CFBC848。

## 五项视觉检查

- 字体：沿用原站系统字体栈；英文主标题44–60px、中文副标题19px，详情14px。标题主次和步骤可辨。系统中文回退字体差异作为后续细化项。
- 排版：沿用940px阅读宽度以保持跨页星轨落点；标题星标52×52，中心y约180，与现有估算落点y178相近。定义、复制、演示、边界、相关阅读顺序与稿子一致；更完整的解释允许纵向滚动。
- 颜色：使用现有暖米白、墨黑、苔藓绿及黄绿色星标Token。背景比生成图更暖是保留原站主题的有意选择；明暗状态均实际查看。
- 资产：复用原有品牌星标；Phosphor Brain、GitFork、Circle、CheckCircle及操作图标用于语义控件。未把生成图铺作页面背景；未添加装饰插画。
- 文案：保留Agent Harness/智能体运行框架标题层级，只有一块当前步骤详情。“只给模型”明确未提供文件正文或读取工具；3类/12条为本地教学示例。页面包含已核对的真实来源链接。

## 功能验证

npm run check：ESLint、TypeScript、38项测试、生产构建通过；313个静态页面生成完成。

浏览器实际验证：Harness星点聚焦、Escape复位、前端/AI切换、跨页进入、上下文往返、首页搜索；短表达和Markdown全文复制并读取剪贴板核对；四步、终点禁用单步、播放结束不循环、暂停、重来、两种模式、Enter/Space与可见焦点。

状态机单测覆盖暂停/重来/模式切换后的迟到tick不推进、终点边界、减少动态和剪贴板拒绝及重试。异常浏览器验证使用tests/fixtures/harness-browser-server.mjs：代理本地生产构建至3001，Permissions-Policy拒绝clipboard-write，并模拟matchMedia减少动态偏好；实际点击显示复制失败及手动复制说明，播放即时抵达终点。夹具不进入产品路由；未修改操作系统设置，OS级减少动态开关与CSS媒体查询的系统集成未实测。

1440×1100、1280×900无横向溢出，明暗可读；正常页面及异常夹具控制台无error/warn。本轮未做手机端专项、屏幕阅读器实机、dev集成或生产部署。保留基本窄屏回流规则不代表移动端验收完成。

## 后续

P3：根据实际阅读反馈再微调间距及中文字体。完整VBP-002手机端验收保持独立待完成。

final result: passed
