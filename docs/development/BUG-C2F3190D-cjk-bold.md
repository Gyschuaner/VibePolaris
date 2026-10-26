# BUG-C2F3190D 中文括号加粗

2026-10-26，关联 VBP-103。用户截图反馈 `**…**` 原样显示。开发和测试负责人顾毅盛，任务 `e2ed9e10-591f-4373-8a14-aa2d7c594de0`。

## 原因与改动

现有 mdast 解析器可稳定复现 `因为**p 是 paragraph（段落）**的缩写。`：闭合星号内侧为右括号、外侧为中文，按 CommonMark 强调边界规则被当作普通文本。普通无标点加粗正常。另有工具栏直接包裹首尾空格选区的问题，会生成 `** 内容 **`。用户未提供原始 Markdown，因此不根据截图断言原文是否含有额外空格。

- 在画布共享 MarkdownDocument 和小北 Transcript 接入 `remark-cjk-friendly@2.3.3` 的 parseOnly 入口。复用 remark 生态解析扩展处理中文标点、嵌套行内代码和链接，不自行用正则重写原稿。两处分别保留既有 HTML 清理和 skipHtml 策略。
- 加粗与斜体命令只包裹选区中的非边缘空白，原有首尾空白原位保留；纯空白选区不生成无效标记。取消格式、空光标插入和撤销沿用原逻辑。代码格式不裁剪空格。
- 解析只影响展示，不迁移或批量改写历史正文。原稿内已经写成 `** 内容 **` 的无效语法仍原样保留，不猜测作者意图；新工具栏操作避免生成这种写法。

依据：[CommonMark 强调规则](https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis)、[remark 官方插件列表](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)、[扩展用法](https://github.com/tats-u/markdown-cjk-friendly/tree/main/packages/remark-cjk-friendly)。

## 验证与交付

`npm run build` 成功，BUILD_ID `LgN53BuyL4JnQmwuAB92y`。限定格式命令、中文强调解析和安全渲染的 3 项检查通过，变更文件 ESLint 与 diff 检查通过。使用独立临时 SQLite 与 `http://vbp-bold.localhost:3133` 运行优化构建，真实浏览器仅操作合成草稿：编辑预览和全文阅读均有 5 处 strong，字重 700；括号、句号、链接、行内代码正确，转义与代码块原样。工具栏将空格留在标记外，撤销后正文恢复；复制与导入的 224 字符逐字节一致，刷新后 5 处加粗仍保留。

证据：[构建](BUG-C2F3190D-cjk-bold/build.txt)、[3项检查](BUG-C2F3190D-cjk-bold/focused-tests.txt)、[浏览器](BUG-C2F3190D-cjk-bold/browser.json)。DP 用例 `f49e2f43-94ec-41a9-af20-175e5800067c`，计划 `eb1536d2-ce1e-43ce-8108-1896347e89f6`。

![中文括号加粗正常](BUG-C2F3190D-cjk-bold/reader.png)

分支 `fix/BUG-C2F3190D-cjk-bold` 从 dev 的 `b46cda79f0be6bf903d212cbed54d1de1ade8ab7` 建立。PR、dev 最终提交与部署批次以 DP 为准；仅集成 dev，本次新 Bug 尚未发布生产。回退该 PR 并重建可恢复旧解析，无数据迁移。前一轮三项生产发布见 main 的 `docs/development/VBP-123-text-and-images.md`（PR #591 / #592），运行提交仍是 `3fb15282cf50144f93ee271b2dde9e9c95c2662a`。

没有调用真实模型重新生成此问题，没有执行全站或跨设备回归。当前 Mac 不存在指定 Obsidian `D:/Obsidian/gysnote`，跳过该库写入；没有新增正式飞书文档或索引。

## 2026-10-26 生产发布准备

用户随后明确要求“上线一下吧”，授权本修复发布生产。实现已通过 [PR #594](https://github.com/Gyschuaner/VibePolaris/pull/594) 合入 dev `1551776d1c7f3f34c5a55cd403a12b8eef149541`，最终 dev 构建及浏览器集成已通过（BUILD_ID `JMhv84HfpnoF451MGbckd`，5 处 strong 均为 700）。

当前生产已独立发布 VBP-122，运行 `21a7d7b1d0c8ae8a8974eb9a799bfad58e510df2`。发布分支 `release/BUG-C2F3190D-cjk-bold-production` 从当前 main 创建，选入 dev 的修复 `4828320b571772c541038d5f971064c2af747d22`，保留现有生产更新，未整批发布 dev 的其他改动。

按实际合并 main 的完整提交号制作镜像。沿用当前 Linux 生产基础镜像及已有依赖，只添加锁文件新增的五个纯 JavaScript 包和本次构建；现有依赖版本、public 与运行支持文件逐项核对。切换前进行 SQLite 在线备份并 quick_check，保留旧镜像、Compose 与回滚脚本；回滚保留新数据库持久卷。切换后执行 HTTPS 健康与未授权拒绝检查，并用合成草稿验收预览、阅读、工具栏、撤销、复制及刷新。实际版本与结果将在发布后补充。
