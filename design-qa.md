# VBP-096 画布分栏与连线验收

本次依据用户在实际画布中的批注与明确修改要求。视觉继续沿用 VBP-095 第二版；编辑器改为左右分栏，文字与连线改为几何避让。

## 实际检查

- 桌面 865×737，使用用户原有的六个测试节点与三条连线。`docs/design/VBP-096-canvas-refinements/editor.png` 为真实双栏编辑页，`canvas.png` 为恢复原布局后的画布。
- 左侧 Markdown 源码、右侧同一内容的实时渲染；表格、粗体、代码和链接正常。拖动与键盘调整生效，两侧独立滚动；阅读切换和刷新保留修改。测试新增内容恢复为原文。
- 手机 390×844，上下两栏可调高度，页面宽度 390，无横向溢出，见 `mobile-editor.png`。未使用真实手机硬件。
- `drag-routing.png` 为将咖啡节点拖入原连线后的实际画面：关系线连续绕行，没有靠文字背景截断线段。节点文字恢复后原布局保留，节点选中收起简述时路径更新，连线可选；120%→100% 缩放的 surface scrollTop 保持 0。
- 配色、字体与图标沿用现有主题。预览采用 16px 正文、30px 一级标题；阅读模式保留原有 17px / 38px。分隔条使用 1px 主题线，悬停与聚焦有反馈，不增加常驻属性面板。
- 新闻预检查与 Next production build/TypeScript 通过，1185 页面；必要画布逻辑检查 5/5 通过。浏览器尺寸与操作记录见 `docs/design/VBP-096-canvas-refinements/browser-checks.json`。

## 范围与限制

未扩展整站回归、存储故障注入或跨设备同步。存储和原文导入导出未改动，继续使用 VBP-095 已验证实现。重叠的文字本身覆盖圆点时无法同时显示该端点，用户移开节点后恢复；程序不改写用户布局。

VBP-095 早期以文字底色遮盖连线的处理已由本次实际路径避让替换。历史 ImageGen 与原始画布证据保留在 `docs/design/VBP-095-free-canvas/`。

## 生产验收

main `598a2a4c` 已发布到 `https://vibe.chuansgu.top/canvas`，容器 healthy，公开页面 200、未授权接口 401。生产浏览器实际新建、分栏、拖动避让、阅读刷新、原文复制导出及追加导入通过，console 为空；验收样例已清理并刷新确认空白画布。证据为 `docs/design/VBP-096-canvas-refinements/production-*.png`、`production-browser.json` 及 `production-cleanup.json`，发布、备份与回滚见 `docs/development/VBP-096-canvas-production.md`。

final result: passed
