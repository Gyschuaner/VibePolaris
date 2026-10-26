# BUG-D8985782 首次文章与草稿切换

2026-10-26，关联 VBP-118。用户补充：电脑，主要第一次慢。顾毅盛负责排查、实现与定向验收，任务 `7091aaa8-ab99-4a5d-9860-c7dcd195c699`。

## 原因与改动

草稿和整理文章已在画布客户端状态中，但同一笔记的版本及编辑按钮调用 `router.replace`。首次状态切换会请求 `/canvas?...&_rsc=...`，等待页面响应；后续路由缓存掩盖了等待。图片压缩无法消除这段等待。

同一笔记的草稿/文章、编辑/阅读以及小北打开同一文章，改用 `window.history.replaceState`。Next 已将原生 History API 与 `useSearchParams` 集成，现有 URL 派生逻辑直接更新界面。打开另一笔记和返回画布仍沿用原有导航。保存、正文、图片和批注实现不变，没有依赖或数据迁移。

依据：[Next 原生 History API](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api)，并核对项目所安装 Next 16.3.3 的 App Router 实现。

## 验证

使用独立临时 SQLite、合成账号和优化构建。仅对画布 RSC 响应人为增加 1500ms，定位切换是否依赖服务器；这些耗时是受控实验，不能视为用户电脑或生产环境的速度承诺。

| 样例 | 旧版首次切换 | 修复版首次切换 |
| --- | --- | --- |
| 约 540KB、4 张内嵌图片的正文 | 1693ms，页面请求等待 1510ms | 123ms，同一笔记状态切换无页面请求 |
| 纯文字正文 | 未测旧版 | 81ms，无页面请求 |

`npm run build` 通过，BUILD_ID `umWtW13ocSg_C4LqnskrB`。真实浏览器确认：含图文章 4 张图片加载；两版批注隔离；编辑草稿后立即切到文章再切回，刷新后修改保留且文章未被覆盖；复制两版正文正确（导出保留既有节点元数据）；从画布打开文档后切换状态，浏览器后退返回画布，前进恢复最后文章 URL。代理记录在验收区间内没有带笔记参数的 RSC 请求。

DP 用例 `722aa8ee-03b2-495c-a565-2f28660a523f`，计划 `06d8fac0-f246-402d-8d44-522ada18d013`。证据：[构建](BUG-D8985782-document-switch/build.txt)、[浏览器](BUG-D8985782-document-switch/browser.json)、[网络](BUG-D8985782-document-switch/network.json)。

分支 `fix/BUG-D8985782-document-switch` 基于 dev `8c9c0949822c620eb7fb9b07a59651c8f22f8535`。集成、发布提交及实际部署结果随后补入本记录。回退该 PR 并重建即可恢复旧导航，无数据迁移。

只执行本次受影响流程的浏览器验收，未追加全站、移动端或真实模型回归。当前 Mac 不存在指定 Obsidian `D:/Obsidian/gysnote`，跳过该库写入；没有新增正式飞书文档或索引。
