# VBP-105 小北当前页面上下文

## 实现

固定 system prompt 保存角色、回答范围、工具规则及页面指代规则；每轮提问继续沿用已有的当前 URL 传递方式，服务端解析为页面用途、可用操作和必要模式，不抓取整页 DOM。

- `page-context.ts` 独立维护页面说明及路由解析，`knowledge.ts` 只提供已发布词条、新闻和分类目录。星图与词条正文保留各自身份，星图选择概念、搜索词和已知分类单独提供；搜索词限200字符。
- 画布区分总览、文档阅读、文档编辑，文档模式使用明确的中文标题、摘要和操作说明。只识别请求的视图，不读取私人正文或证明节点存在、登录、保存及同步成功；节点和画布ID不进入模型上下文。
- 设置、新闻星历、已发布新闻、HTML/CSS/JavaScript教程、关于和激活页具有对应说明。未知、失效、额外子路径或外站地址标记为未识别，不兜底猜成星图。
- 意图分类与问答共用本轮上下文。涉及“这里/这页”的问题以本轮页面为准；明确提到其他主题或承接先前对话时保留用户意图。引用具体词条和新闻仍先用现有只读工具读取。
- 平台说明区分本地阅读笔记与账号画布，同步账号历史及设置现状。欢迎语和非词条页建议问题支持询问当前页面。没有新增模型工具、依赖或数据迁移，独立短补全链路不变。

## 验证

- `npm run build` 通过，最终本地功能构建ID为 `N148lQqsi1cy2qNSGjHaM`。首次使用指向工作区外的 node_modules 链接被 Turbopack 拒绝；改用锁文件一致的 APFS 克隆目录后通过。
- `node --experimental-strip-types --test tests/xiaobei-page-context.test.mjs`：3组通过，覆盖页面身份、模式、公开目录验证、查询字段裁剪和无效地址。
- 本机独立优化构建 `http://127.0.0.1:3105`，数据库和邀请码均为本次验收专用。真实模型已正确说明画布用途、新建节点与连线；编辑页正确说明文档编辑模式、加粗及短补全快捷键。
- 初次模式答疑暴露内部英文模式名并误称模式未知，记录为 `BUG-B7CEAD43`。将模式改成中文页面标题与摘要，移除上下文中混杂的未知状态提醒，并规定本轮页面覆盖历史误判；同一历史会话回归后直接回答“文档编辑模式”，不再否认已知模式。
- 合成笔记正文包含专用检查标记；已检查本地持久化模型消息，标记及私人正文未进入模型上下文。

- 同一会话从画布切到 Harness 词条后，正确识别当前概念并用 `read_term` 取得正文；明确要求改讲 CSS 时直接回答 CSS，没有强行联系当前页。天气问题被范围门控拒绝，没有调用工具。
- [编辑模式截图](VBP-105-xiaobei-page-context/editor-answer.png)、[本地实际消息与计量证据](VBP-105-xiaobei-page-context/local-evidence.json)。证据只保存公开页面上下文、合成提问、最终回答和工具名，不保存模型思考或凭据。

测试计划 `19e2cb97-0c0c-40a0-bd0e-13f6f6f5a25f`，用例 `5456e2c0-25ff-413f-a616-5378ef47059f`。本地、dev 集成和以下生产验收均已实际执行。

## dev 集成与生产发布

用户已授权生产上线。本次功能提交为 `eafdd8d862b7e1d8bb7e37ede5179007c08e136b`，经 [PR #521](https://github.com/Gyschuaner/VibePolaris/pull/521) 合入 dev，集成提交 `e3a9e7360885f16615a6f8d4ece533034917791e`。该版本构建通过，构建 ID `zIWTICWpOF6oV7qyOj__p`；在本机 dev 集成部署中用真实浏览器验证同一会话切换至设置页，回答正确涉及头像及当前浏览器的自动同步。本机服务在验收后停止，不代表远端 dev 环境部署。

仅将上述 dev 已验证的 VBP-105 改动带到最新 main，经 [PR #522](https://github.com/Gyschuaner/VibePolaris/pull/522) 合入，未整批发布 dev 的其他差异。生产运行提交为 `f72504080085d613e1d5af50c4acf638e73d5045`，候选构建 ID `rhgtN733DJs8AeG-w0_4-`。候选与 main 合并结果的文件树一致；之后的发布记录提交仅修改文档和验收证据，不另行构建或部署。

生产于北京时间 **2026-10-20 17:42:32** 切换成功：

- 站点：<https://vibe.chuansgu.top>，镜像 `vibepolaris:f72504080085d613e1d5af50c4acf638e73d5045`，容器 `vibepolaris-web-1` 为 `healthy`。
- 发布目录：`/opt/vibepolaris/releases/20261020T093816Z-f7250408`。沿用原持久卷 `vibepolaris_xiaobei_data` 和共享环境文件，没有数据迁移；短补全计费开关仍为关闭。
- 备份：`/opt/vibepolaris/backups/20261020T093816Z-from-e2852a53`，包含 SQLite 在线备份、原 Compose 和私有环境备份；SQLite `quick_check=ok`。未在仓库保存数据库或凭据。
- 部署前检查构建产物哈希、基础镜像与锁文件，隔离容器启动通过后切换服务；运行镜像、构建 ID、持久卷均与预期一致。首页、画布、设置、账号 session 返回 200，匿名账号画布接口返回 401。
- 生产真实浏览器使用专用临时邀请，确认新欢迎语、设置页功能答疑，以及同一会话切到关于页后的“现在这页呢”。均正确关联当前页面；未读取用户私人画布或笔记。测试邀请在验收后停用。
- [部署事实](VBP-105-xiaobei-page-context/production-evidence.json)、[生产对话记录](VBP-105-xiaobei-page-context/production-browser.json)、[设置页截图](VBP-105-xiaobei-page-context/production-settings.png)、[跨页截图](VBP-105-xiaobei-page-context/production-about.png)。

回滚在生产主机执行 `sudo /opt/vibepolaris/releases/20261020T093816Z-f7250408/rollback.sh`，恢复旧镜像 `e2852a53be9fc9fd0aac111e17beefd2928d141b` 和原发布链接，继续使用当前数据卷，等待容器健康。本次没有执行回滚；数据库备份留作数据恢复依据，不在普通代码回滚时覆盖上线后的新数据。

## 记录限制

DP Agent 的专用登录过期，已按 developer-platform-cli 的降级流程直接使用 DP CLI 维护需求、任务和验收记录。当前机器没有 lark-cli，未创建飞书文档；与代码紧密相关的技术与部署记录保存在 Git，并关联 DP。指定的 `D:/Obsidian/gysnote` 不存在，跳过该库记录。
