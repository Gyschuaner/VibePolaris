# VBP-113 阅读工具栏取消上滑自动出现

关联 VBP-113，任务 ed78639c-0525-4824-a84e-74fa42fafa35。用户希望向上阅读时工具栏继续隐藏，沿用本轮验证后上线授权。

## 实现

仅调整 `useReadingToolbar`：滚动只负责收起，向上滚动和回到正文顶部均不主动展开。移至顶边、顶部小按钮、键盘焦点仍可唤回；编辑和既有交互锁定行为继续有效。正文容器高度不随显隐变化。没有新增依赖或数据格式变更。

## 验证与集成

- dev 和 main 发布候选独立执行 `npm run build`，均通过（1186 页面）；`git diff --check` 通过。
- 功能提交 `1865a1f8cc2ecef6638891cafb9be03a8d4ed0be` 经 [PR553](https://github.com/Gyschuaner/VibePolaris/pull/553) 合入 dev `be23220c53ad731c60029f637ee14664d771510f`。
- 项目未配置远端 dev。本机3106运行与合并后 dev 同树的优化构建，独立数据库及合成账号。真实浏览器确认下滚576px收起，上滚至360px及0px均保持隐藏；正文高度保持720px；按 Enter 操作顶部按钮可恢复，并聚焦返回按钮；进入编辑时工具栏可见且正文存在。控制台无 error。
- [dev 浏览器证据](VBP-113-toolbar-explicit-reveal/dev-browser.json)。本轮只验收受影响的滚动、主动唤回和编辑入口，未扩展为全站回归，未再次调用模型。
- 指定 Obsidian `D:/Obsidian/gysnote` 在本机不存在，跳过；记录保存在 DP 与本文件。

## 发布

从 main 选择性应用本轮改动，发布候选 `e91cd97102eee9da62009c033a9fb60d472a7b34` 经 [PR554](https://github.com/Gyschuaner/VibePolaris/pull/554) 合入 main `d674f208c9c41e183dfc72216234da5079a2d568`。已确认合并提交与构建候选 Git tree 一致。


- 北京时间2026-10-22 11:03上线，运行build `TQSnwdo0foe518qvH-0ou`，镜像 `sha256:5c9eb4ffd2f21ed601363b817272703826b28411a53a5cb5e6e5c6b0c379245d`。发布目录 `/opt/vibepolaris/releases/20261022T025942Z-d674f208`。
- 发布包与逐文件SHA校验通过；无网络、无生产数据卷的独立容器启动通过；正式容器healthy。首页/画布/设置/session返回200，匿名账号画布401；继续使用原数据卷，补全扣费关闭。
- 在线SQLite备份 `/opt/vibepolaris/backups/20261022T025942Z-from-174c8ab1`，quick_check=ok。完整发布事实及备份SHA见 [production-release.json](VBP-113-toolbar-explicit-reveal/production-release.json)。
- 回滚：`sudo /opt/vibepolaris/releases/20261022T025942Z-d674f208/rollback.sh`。切回174c8ab1并继续使用当前数据卷，不回写旧数据库。
- 生产合成账号真实浏览器：文章全文下滚491.5px收起，上滚至275.5px与0px保持隐藏，正文高度720px不变；Enter唤回且焦点到返回按钮；编辑文章入口与正文正常，控制台无error。测试账号已退出，临时标签关闭。原游客画布未改动。
- [生产浏览器证据](VBP-113-toolbar-explicit-reveal/production-browser.json)、[上滚后的页面截图](VBP-113-toolbar-explicit-reveal/production-up-scroll.png)。
- DP状态：VBP-113 `released`，任务 `done`；dev计划 `0bb99d6f-55e0-461a-8a0b-1263ad319cb8`、生产计划 `28531c8c-fdf8-490f-b2df-67f4604a7288` 均completed，每个1条用例通过。部署记录分别为 `42237553-58ff-43e3-9c4c-9d1a89d49aeb`、`f16ea39a-0a3d-49dd-b77a-8e67523d3856`。
