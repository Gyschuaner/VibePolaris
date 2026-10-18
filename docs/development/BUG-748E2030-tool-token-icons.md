# BUG-748E2030 工具调用与 Token 图标

2026-10-18，关联 VBP-064；分支 `fix/BUG-748E2030-term-icon-semantics`，基于 dev `9d15db4d`。用户明确点名工具调用、Token 两枚图标不贴切。

## 调整

- 工具调用：移除原来交叠的工具线条，改成清楚的开口扳手轮廓，并用进入工具的箭头表达调用。
- Token：移除容易联想到代币的六边形，改成 `[T]`，以边界括定一块文本。
- 直接修改共享 `TermIcon` 的两项 glyph，词条标题和小北引用同步使用；名称、slug 映射、链接与尺寸均沿用原实现。

## 验证

- 新闻内容校验通过；Next.js production build 通过（1184 页）；TypeScript `tsc --noEmit` 通过。
- `audit-term-icons`：373/373，缺少、多余、重复映射均为 0。
- 首次构建被上次临时预览留下的 `.next/dev/types` 引用阻断；将该生成缓存移到 `/tmp/vbp-dev-types-BUG-748E2030` 后重建通过，无产品代码修复或额外依赖。
- 真实浏览器在共享组件预览中核对旧/新两枚图标及 44px/16px；390px 文档和滚动宽度均 390px，内联图标均为 16×16px。预览脚本位于 `/tmp`，不进入应用构建。
- dev 集成后更新本机 `127.0.0.1:3238`，核对实际 `/terms/tools` 与 `/terms/token` 标题。最终 PR、提交号和执行结果以 DP Bug 记录为准。
- 本次未调用模型或验证真实后端历史；小北引用复用同一 `TermIcon`。无新增自动化测试或整站回归。

截图：[图标对比](icon-semantics-evidence/tools-token-comparison.jpg)、[390px 预览](icon-semantics-evidence/tools-token-mobile.jpg)。

## 集成与回滚

仅通过功能分支 PR 集成 dev、本机预览；无远端 dev 或生产部署。回滚可撤销本 Bug 的两项 glyph 修改并重新构建，无数据迁移。保留原有 `VBP-047-production.md` 修改。指定 Obsidian 库 `D:/Obsidian/gysnote` 在本机不存在，跳过同步。
