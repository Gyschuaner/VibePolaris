# VBP-098 · 540ms 全文过渡

用户选定 A「卡片展开」，要求比 340ms 初稿增加 0.2 秒。正常打开与返回均采用 540ms 和原缓出曲线，正文在后半段淡入；预览的 A 与默认入口同步更新。

## 实现

通过浏览器 View Transition 从真实简述卡片边界展开到 Markdown 页面。纸面、标题、卡片内容、正文与工具栏分别捕获，防止摘要、按钮和日期随纸面拉伸。只对匹配且完整可见的单行 Markdown 标题使用共享标题，其他情况分别进入；不修改原始 Markdown 或元数据。现有存储格式、自动保存与路由参数保持不变。

路由提交后直接完成快照更新，不在暂停绘制的阶段等待 requestAnimationFrame。首版因此停留旧快照的本地问题记为 BUG-2EA5145F，修正后已捕获真实展开中间帧。中断、尺寸变化与卸载结束过渡；更新超时 1500ms 时跳过动画，避免界面锁死。系统减少动态或浏览器缺少接口时直接导航。

## 本地检查

- 执行 build 的预检查脚本和 Next 生产构建；当前机器未提供 npm 可执行文件，直接使用同一 Node 运行对应入口。TypeScript 与 1185 页构建通过。受影响文件 ESLint 无错误，保留原有原生 img 提示。
- IAB 1280×720：展开中间帧、全文结束、收回和重复打开；直接链接刷新；浏览器前后退。返回后焦点在打开入口，原有节点未修改。
- 独立临时笔记：编辑添加保存标记，分栏由 50 调为 55，刷新后正文保留；节点标题、摘要单独修改后正文标题和内容不变；正文滚动至标题离开视口后返回正常。
- 空正文打开、开始编辑、恢复内容和返回正常。
- 390×844：文档宽度和 scrollWidth 同为 390；卡片 x=58、宽 320，处于视口内；展开中改变尺寸后无残留快照，恢复默认窗口。
- 控制台 error/warn 为空。证据见 [动效目录](../design/VBP-098-canvas-motion/evidence/)，正式应用的截图使用 app- 前缀。

未在其他浏览器和真机触摸环境检查，也未切换操作系统减少动态设置；这两种回退路径由能力检测和媒体查询处理。本次未扩展整站回归。

## 集成和发布

[PR #486](https://github.com/Gyschuaner/VibePolaris/pull/486) 合入 dev `debf90f5468dbf86dd4bd2aed3351a544e1f1ec5`，源码树 `3bddb70f8cf80791c64d2b496f500a58201a1f86` 与已检查构建一致。重启本机实例完成真实浏览器打开、返回及保存内容验证，DP 批次 `local-dev-20261019-vbp098-debf90f5`。检查节点已清理，原有 6 节点、3 连线保持原样，没有部署远端 dev。

[PR #487](https://github.com/Gyschuaner/VibePolaris/pull/487) 将相同画布源码选入 main `99017d6e0fec9e4e0aa632beedc5f2beb8739db6`，源码树 `7104df5d6cb3d05f99bb31e370903f7aee8e50e6` 与生产构建一致；dev 中其他尚未发布的内容继续保留。

DP 正式接入用例 `e3d8be95-7a59-47a8-8757-353f405cba0f`、执行 `7ea74427-e12d-414c-92c3-540f1b261355` 已通过，计划 `69242bd7-679f-4057-87e6-83b20939d772` 完成；BUG-2EA5145F 已回归关闭。

## 生产结果

2026-10-19 16:30:26（北京时间）部署至 `150.109.241.213`，入口为 <https://vibe.chuansgu.top/canvas>。镜像与构建事实：

- main：`99017d6e0fec9e4e0aa632beedc5f2beb8739db6`；镜像 `vibepolaris:99017d6e0fec9e4e0aa632beedc5f2beb8739db6`，ID `sha256:f53550f30906ca6dc09b9bddfe9852040f5442ef8f23160b640a2fcf5c28f8b2`。
- BuildID：`uLJklA2c0fCCHCk4R6QZB`；9613 个文件逐项校验，SHA256 清单摘要 `3cd47282a54e92e6156e7035ed236ec7fad31c6787a7e301380e85c3fc58f8b5`。
- 发布目录：`/opt/vibepolaris/releases/20261019T082607Z-99017d6e`；基于当前已运行 Linux 镜像，依赖、锁文件与服务配置没有变化。部署包不含环境密钥或本地对话数据库。
- 独立无外部网络容器预检通过后备份、切换；最终健康状态 healthy，首页和 `/canvas` 均为 200，未登录 `/api/xiaobei/conversations` 保持 401。

真实生产 IAB：初始 0 节点、0 连线。导入本轮笔记后捕获展开中间帧；进入编辑，将分栏调为 55，修改正文并等待保存，刷新后与预期逐字一致。返回卡片修改独立标题、摘要，再打开全文仍为原正文标题和保存内容。返回和重复打开无锁死，控制台 error/warn 为空。只删除本轮检查笔记，刷新后恢复 0 节点、0 连线，无残留过渡状态。证据为 `production-expanding.png`、`production-reader.png`、`production-editor.png` 和 `production-checks.json`。

## 备份与回滚

备份位于 `/opt/vibepolaris/backups/20261019T082607Z-from-fa834947`，目录 700，文件 600，包含原 Compose、环境文件和 SQLite 在线备份；SQLite quick_check 为 ok，数据库 SHA256 为 `e15b41964ac07e9ec50b1e327220e02aa2684f7c1f23651100f9b86d56ea46dc`。现有 `vibepolaris_xiaobei_data` 数据卷持续复用。

回滚命令：

```sh
sudo /opt/vibepolaris/releases/20261019T082607Z-99017d6e/rollback.sh
```

此命令恢复之前健康的 `fa83494761a84fdeb2220248fb4d95afcac65170` 镜像和 current 指向，保留当前数据卷与浏览器画布内容。部署失败时脚本自动调用同一入口；本次健康检查通过，未实际触发回滚。

本机不存在指定的 D:/Obsidian/gysnote，研发记录保存在 Git 和 DP。未产生新的正式飞书文档。primary checkout 的既有未提交运维修改保持原样。
