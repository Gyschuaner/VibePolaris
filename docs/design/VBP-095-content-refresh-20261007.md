# VBP-095 词条更新与生产发布记录 · 2026-10-07

本批完成十条已有词条的逐条内容和首图机制更新：sitemap、design-token、visual-hierarchy、feedback、loading-state、microinteraction、reduced-motion、relational-database、nosql、row。每条保留原有阅读结构和段落锚点，重新核对资料，把演示改为该概念能被观察的条件变化；流程式占位动画没有继续复用。

## 交付范围

- 产品设计四条：站点地图把导航入口和搜索发现拆开；设计令牌展示语义引用链和主题变化；视觉层级展示注意力顺序和窄屏重排；反馈展示保存的进行中、成功和失败边界。
- 交互状态三条：加载状态区分占位、增量和失败；微交互只改变局部对象并保持可逆；减少动态效果保留状态含义而关闭位移。
- 数据机制三条：关系型数据库用客户与订单的真实连接条件得出匹配行；NoSQL 用不同形状文档与字段查询展示结构边界；行用四帧快照展示提交前后读者看到的版本。

## 提交流程与验证

- `2e081146`：完成十条独立机制实现。
- `f543e397`：按 review 修正关系连接数据、row 四帧、feedback 控件语义、visual hierarchy 窄屏条件和 reduced-motion 覆盖。
- `/root/ai_stack_review`：最终 `PASS`。
- PR #411：合入 `dev`，`c83f477720b07ed1c32a850dce433959a1eb793b`。
- PR #412：合入 `main`，`465ebd1df35831946dd54ad9225d2ea680b5131d`。
- 本地检查：`npm run typecheck`、`npm run audit:terms`、`npm run build`、`git diff --check` 均通过；构建产出 1064 个页面。
- 浏览器检查：桌面和 390px 视口逐条推进到末步；十条页面无横向溢出，console error/warning 为空；关系型数据库、row、feedback、视觉层级按修正项做了针对性复验。

## 生产发布

- 镜像：`vibepolaris:465ebd1df35831946dd54ad9225d2ea680b5131d`，amd64，镜像 ID `sha256:4c496da3a84c9d4b5d2b2a326b5508ed5ea4bd57b656492a4794d681fd7b4a6f`。
- 发布目录：`/opt/vibepolaris/releases/20261006T231925Z-465ebd1d`。
- 生产容器：`vibepolaris-web-1`，状态 `running healthy`。
- 冒烟：服务器内部根页、Xiaobei 激活页和十条词条路由均为 HTTP 200；公网根页、Xiaobei 激活页、`sitemap`、`row` 均为 HTTP 200。
- 回滚：旧指针 `/opt/vibepolaris/releases/20261006T223657Z-44169351`，旧镜像 `vibepolaris:44169351bb0a91a39c02df8438d7f036e13ee12e`，完整备份位于 `/opt/vibepolaris/backups/20261006T231925Z-from-44169351bb0a91a39c02df8438d7f036e13ee12e`；切换方式见 `docs/development/VBP-047-production.md`。

## 记录限制

DP CLI 在本轮查询仍因 TLS EOF 失败，未伪造需求、研发任务或部署记录；Obsidian 库目录在当前 macOS 环境不存在。
