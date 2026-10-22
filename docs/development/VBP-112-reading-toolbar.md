# VBP-112 全文工具栏收纳

关联 VBP-112，研发任务 fb2de2a7-0519-4e29-abd4-59cb1430a5a4。用户反馈全文页两条顶栏长期占据阅读空间，沿用本轮画布工作已授权的验证后上线流程。

## 实现

- 返回、文件名、草稿/文章切换、编辑和更多合成56px单行。小北整理、扩展、来源选择、设置、候选入口和文章采用收进原生popover，生成/待采用/待选择状态在入口简短显示。节点简述卡片继续使用原来的操作布局。
- 阅读向下滚动收起，向上滚动、移至顶边、顶部小按钮或键盘焦点恢复。16px阈值过滤滚动抖动；菜单、键盘操作和生成时保持入口可达。编辑时常驻。
- 工具栏浮于阅读区，显隐不改变正文容器高度；初始正文留出间距。窄屏目录随工具栏收起，目录跳转遵循阅读区scroll-padding-top。词条页仍使用原来的滚动路径。
- 复用现有小北和文章保存逻辑，无依赖、持久化格式、数据库或扣费改动。减少动态偏好的CSS关闭工具栏过渡。

## 验证

- npm run build通过（1186页面）；受影响TSX/Hook定向ESLint无错误，仅原有img建议；git diff --check通过。
- 本机3106优化构建，独立数据库、合成账号与隔离SSE模型。真实浏览器通过断言确认56px单行、下滚收起、上滚恢复、720px正文容器高度不变、键盘恢复返回按钮、菜单打开不收起及Escape关闭。
- 草稿/文章切换、文章编辑并回读、生成进度、停止生成、采用新文章、返回查看候选与全文接受节点通过。控制台无error。
- 390×844窄屏无工具栏溢出，正文起点132px，收起后容器高度仍844px；小北弹出面板内操作可达。减少动态CSS已检查，未改变系统偏好进行动画实测。
- 未扩大至全站回归或真实模型质量评估。指定Obsidian D:/Obsidian/gysnote在当前Mac不存在，跳过，记录保存在DP及本文件。

## 集成与发布

- 功能提交 `984c63d89806ccc0cc8d36a1371a3aeed7de080b`，经 [PR549](https://github.com/Gyschuaner/VibePolaris/pull/549) 合入dev `a4681cfe0fe6d6b0cb35010877d87df7ec90dce3`。本机优化构建与dev同树，合并后重新打开的真实浏览器检查通过；项目未配置远端dev。
- 从main选择性发布本轮提交，经 [PR550](https://github.com/Gyschuaner/VibePolaris/pull/550) 合并，main独立构建1186页面通过。正式运行提交 `174c8ab1f4fd02c4bd0e3bb3078dbbeaa4a3d0ad`，build `retfBXXO-vwLMfWdQMbyU`。
- 北京时间2026-10-22 10:40上线，目录 `/opt/vibepolaris/releases/20261022T022717Z-174c8ab1`，镜像 `sha256:17bc925cd796a942c96bd8388cb3f69b4b7bae2f084199bcc4f21360da2c4c2e`。归档及文件清单SHA校验通过，独立容器无网络、无生产卷、无凭据启动通过；正式容器healthy，首页/画布/设置/session 200，匿名私有画布401。原数据卷保留，补全扣费仍为false。
- 在线备份 `/opt/vibepolaris/backups/20261022T022717Z-from-f7e15e33`，SQLite quick_check=ok。备份SHA及完整发布事实见 [production-release.json](VBP-112-reading-toolbar/production-release.json)。
- 回滚：`sudo /opt/vibepolaris/releases/20261022T022717Z-174c8ab1/rollback.sh`。恢复上一稳定版本f7e15e33，继续使用当前数据卷；无格式变更，不回写旧数据库。
- 生产独立合成账号真实浏览器确认56px单栏、下滚收起、上滚恢复，正文容器高度保持720px；小北菜单、草稿/文章切换、编辑源文逐字一致及返回阅读通过。控制台无error。生产未调用真实模型；仅本地隔离夹具验证生成进度/停止/采用。
- [dev浏览器证据](VBP-112-reading-toolbar/dev-browser.json)、[生产浏览器证据](VBP-112-reading-toolbar/production-browser.json)、[上线截图](VBP-112-reading-toolbar/production-toolbar.png)。测试账号已退出并重新打开页面确认显示登录入口，临时标签关闭；原游客画布未改动。
- 首轮上传前SSH握手出现超时，期间网页与session接口仍200；重连后完成上传和发布，未改SSH服务配置，未进一步定位网络抖动原因。发布后磁盘可用7.3GiB，容器仍healthy。

- DP verified: VBP-112 `released`; task `done`; dev plan `12bd1079-e110-4ec9-b42a-58f2e44e059f` and production plan `19a2008b-5755-4de2-a22e-c3f6cb3181b9` are completed (1/1 passed each). Deployment IDs: dev `f5f4e68d-e15a-4fbf-9098-463726347ccf`, production `9899242b-b314-45bf-8387-f168415b0abb`. Document index `19b1c419-1836-4794-a1b3-f7007e9a930b`.
