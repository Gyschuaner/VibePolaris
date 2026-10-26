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
