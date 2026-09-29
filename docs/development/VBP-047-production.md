# 小北腾讯云发布

目标为 `ubuntu@124.156.103.213`，域名 `https://vibe.chuansgu.top`。沿用 `/opt/vibepolaris/releases`、`current` 链接及 `chuansgu_edge` 上的 Caddy；不要为 Agent 额外开放端口。

2026-09-29 用户授权仅上线 VBP-047 与 VBP-048。以生产 `4eaa4b5` 为基线，选择已进入 dev 的小北提交建立 `release/VBP-047-xiaobei-production`，不发布 dev 中其余词条改版。生产前将发布分支经 PR 合入 main，镜像以最终 main 完整提交号标记。

服务器构建空间有限，在本机 Docker 构建 `linux/amd64` 镜像，完成构建后去除开发依赖，再传输运行镜像；不删除当前生产镜像或其他服务数据。Compose 使用 `deploy/docker-compose.yml`，密钥置于 `/opt/vibepolaris/shared/xiaobei.env`，权限 600，并通过 `--env-file` 加载，不写进 Git、镜像或发布日志。

`XIAOBEI_SITE_ORIGIN=https://vibe.chuansgu.top`，百炼 Key/Base URL 沿用本次已验证的工作空间。数据库使用 Compose 的 `vibepolaris_xiaobei_data` 持久卷，生产初始化独立邀请码与账本，不导入本地测试对话。通过容器内邀请码 CLI 生成初始邀请码，仅将私有文件交付给使用者；激活入口 `/xiaobei/activate` 不出现在站内导航。

切换前记录 `current`、当前镜像、Compose 配置并备份；后续升级账本使用 SQLite 在线 backup，不能直接复制运行中的主数据库。切换后验证 HTTPS、容器健康、未授权拒绝、隐藏激活、真实答疑与积分、刷新历史恢复。具体版本、路径和执行结果记录在 DP 部署批次。

回滚时使用备份的旧 Compose 与旧镜像恢复同名 web 服务，再将 `current` 指向原发布目录；保留新数据库持久卷，不能覆盖上线后新增的对话或积分记录。本次发布前生产版本为 `4eaa4b5a0300bc0490a9a34747e52fc2e2180d7f`，目录 `/opt/vibepolaris/releases/20260928-4eaa4b5a0300`。
