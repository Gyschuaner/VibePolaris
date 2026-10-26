# VBP-122 组件库分类卡片生产发布

2026-10-26 用户明确授权“把这版组件库上线到生产”。负责人顾毅盛，发布任务与实际部署批次记录在 DP。此授权承接 [分类卡片研发记录](VBP-122-category-motion-cards.md) 的已验收版本。

## 发布范围

从当前生产 main `3fb15282cf50144f93ee271b2dde9e9c95c2662a` 建立 `release/VBP-122-category-cards-production`，选择已在 dev 集成的 `dc50811a`、`79034441`、`eeaca5e2`。保留现有 VBP-123 文字与图片更新；组件库运行文件与 dev `f41cc6c0` 对照一致，没有发布 dev 中其余未上线改动。

本次包含 13 个同类动画卡片、大小预览 700ms 平移换位、右侧列表滚动、默认真实静帧和当前悬停项 0.6 倍速播放；移除卡片下方名称分类与播放提示，保留搜索、精简详情及原 6 个资源。300 张静帧和版本化缓存同时修复 BUG-6621DC80 的预览加载链路；恢复 9 项上游文字注解，修复 BUG-1690BA6A 的缺字与空白效果。

## 部署和回退

生产入口 <https://vibe.chuansgu.top/library?category=animation>，主机使用现有 `co-agent-tencent-direct`（150.109.241.213）。切换前实际生产为 `vibepolaris:3fb15282cf50144f93ee271b2dde9e9c95c2662a`，current 为 `/opt/vibepolaris/releases/20261026T031343Z-3fb15282`，容器 healthy。

沿用现有 Linux amd64 Node 运行环境及相同依赖，替换完整构建、组件库静态资源和新增缓存头所需的 next.config.mjs。以最终 main 提交标记镜像，校验构建文件清单，并在无生产数据和密钥的独立容器中启动检查。切换前对 SQLite 执行在线 backup 和 quick_check，备份旧 Compose 及环境文件；备份和密钥文件保持受限权限。

沿用 `vibepolaris_xiaobei_data` 持久卷，没有数据库迁移。切换失败自动恢复旧镜像；发布目录保存 rollback.sh，恢复旧 Compose、镜像及 current 链接，保留最新数据卷，不用旧数据库备份覆盖发布后新增数据。实际发布提交、目录、镜像、备份、构建和冒烟结果在部署完成后追加并关联 DP。

生产验证限于本次范围：HTTPS 与服务健康、13 卡片与 300 静帧、单项悬停/移出、大小换位及滚动、搜索和详情返回、390px 布局，以及缺字效果与静态资源缓存。没有逐项目视 300 个动画、发起模型付费请求或进行全站回归。指定 Obsidian 库 `D:/Obsidian/gysnote` 在本机不存在，跳过；发布事实保存在 Git 与 DP。

## 实际发布结果

2026-10-26 11:44:26（Asia/Shanghai）切换成功。生产 PR [#593](https://github.com/Gyschuaner/VibePolaris/pull/593) 已合入 main，提交 `21a7d7b1d0c8ae8a8974eb9a799bfad58e510df2`，镜像 `vibepolaris:21a7d7b1d0c8ae8a8974eb9a799bfad58e510df2`，镜像 ID `sha256:44ed02bf1a610417348044c09e914a7f59a42dd62707e7765d7c35439d444e7d`。Next 构建 ID 为 `MYN0Qe4sULYhRy4tjGKjj`。

`npm run build` 在候选提交 `40c387944a16c476e0a55f8a0ffe80b593500084` 通过（类型检查和 1494 个静态页面生成）。合并前 main 新增了 VBP-123 发布记录，最终 main 仅比候选多 5 个 `docs/development/VBP-123` 文档文件；所有非 docs 路径逐项对照相同，因此复用这份相同构建输入的产物，没有重复构建。12009 个文件的清单校验和 Linux amd64 独立启动检查均通过。记录见 [构建输出](VBP-122-category-motion-cards/production-build.txt) 和 [实际发布事实](VBP-122-category-motion-cards/production-release.json)。

发布目录 `/opt/vibepolaris/releases/20261026T034119Z-21a7d7b1`，备份 `/opt/vibepolaris/backups/20261026T034119Z-from-3fb15282`。SQLite 在线备份 SHA256 为 `2a4c2e324c305bb880ae5883eece1f0bb8d258ee29bdef0560416a091b1e5881`，`quick_check=ok`；旧 Compose 和环境文件备份完成，受限权限保持。服务 `vibepolaris-web-1` 为 healthy，持久卷仍为 `vibepolaris_xiaobei_data`，`completion_charge_enabled=false`。数据库没有迁移或覆盖。

回退命令：`sudo /opt/vibepolaris/releases/20261026T034119Z-21a7d7b1/rollback.sh`。回退到镜像 `vibepolaris:3fb15282cf50144f93ee271b2dde9e9c95c2662a` 和目录 `/opt/vibepolaris/releases/20261026T031343Z-3fb15282`，保留发布后的最新数据。此次检查通过，未执行回退。临时构建上下文和上传包已清理，回退镜像及备份保留；部署后磁盘约剩 3.2 GiB（使用率约 95%），没有扩大清理范围或删除其他版本。

## 生产冒烟证据

首页、动画分类、普通组件详情、三个动画来源的代表详情、CSS、许可证和素材均返回 200；会话接口 200，匿名画布接口按预期返回 401。静帧响应含 immutable 缓存头。无 JavaScript 的生产 HTML 包含 300 个预览，全部为 poster；浏览器初始为 13 分类、300 预览、0 live，没有原来的播放提示小字。

真实生产浏览器确认当前悬停仅 1 项播放，`--motion-scale=1.6666666666666667`（0.6 倍速），移出后为 0 live。右侧滚动到 `scrollTop=720` 后原位点击圆环 11：圆环 11 成为主预览，原主预览圆环 02 回到被点击的 slot 10，16 项无重复，滚动位置仍为 720；主预览距离卡片顶部保持 13px。搜索 circle 进入详情后仅显示当前 1 个动画，返回保留 `q=circle`。

文字加载 09 的预览可见 Loading，HTML + CSS 代码包含 Loading 和 MIT 许可，验证 BUG-1690BA6A 的生产回归。390×844 视口中页面宽度与 scrollWidth 均为 390；大小换位正常，右侧内部滚动后主预览仍保持顶部。该生产标签页控制台 warn/error 为空。浏览器证据见 [production-browser.json](VBP-122-category-motion-cards/production-browser.json)、[桌面截图](VBP-122-category-motion-cards/production-desktop.jpg) 和 [手机截图](VBP-122-category-motion-cards/production-mobile.jpg)。

DP 发布任务 `04a8d275-14e8-449b-9a47-d2b98eb3da07`；生产计划 `c722b2a0-05a1-4aab-a98b-5f56d642b642`，用例 `ca773bc0-18ce-477a-b493-8ecffc9c471b`。本次生产部署批次使用稳定 ID `vbp122-production-21a7d7b1`，关联 VBP-122、BUG-6621DC80 和 BUG-1690BA6A。发布状态以 DP 最终查询为准。
