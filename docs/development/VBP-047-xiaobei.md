# VBP-047 小北内部词条 Agent

实现分支从 `main` 切出：`feat/VBP-047-xiaobei-agent`。仅内部邀请码开放，没有公开激活入口、账号、反馈或监控后台。

## 本地运行

需要 Node.js 22.13+（原生 `node:sqlite`）。复制根目录 `.env.example` 为 `.env.local`，填写百炼控制台的 `DASHSCOPE_API_KEY` 与 OpenAI 兼容 `DASHSCOPE_BASE_URL`。模型默认 `deepseek-v4.1-flash`，通过 `enable_thinking: true` 开启思考，推理强度 `high`。地域与工作空间必须和 Key 匹配，URL 不带 `/chat/completions` 后缀。模型配置缺失时返回明确提示，不调用外部模型。

`npm run dev` 启动；非 3000 端口需同步设置 `XIAOBEI_CONTENT_ORIGIN`。正文读取仅允许本机地址，不能使用模型提供的 URL。生产优先读取构建生成的词条 HTML，开发读取本机当前渲染内容，包括独立概念文章。

邀请码管理使用和应用相同的 `XIAOBEI_DB_PATH`，默认 `.xiaobei/xiaobei.sqlite`。CLI 不自动加载 `.env.local`，使用自定义路径时须为 CLI 单独设置同一环境变量。

```sh
npm run xiaobei:invites -- create --label 内部成员 --output /私有目录/xiaobei-invite.txt
npm run xiaobei:invites -- create --label 临时成员 --expires 2026-12-31T16:00:00Z --output /私有目录/xiaobei-temporary.txt
npm run xiaobei:invites -- list
npm run xiaobei:invites -- disable 邀请码ID
```

创建命令只输出 ID 和文件路径；随机邀请码写入权限 600 的新文件，数据库只存哈希。内部用户访问 `/xiaobei/activate`，在表单输入邀请码；地址不包含邀请码，不加入站内导航或 sitemap，页面 noindex。授权 Cookie 为 HttpOnly、SameSite=Strict，HTTPS 时 Secure，有效期最长 30 天且不超过邀请码到期时间。停用后现有会话也不能继续调用。

## 运行与积分

- 每码北京时间每天 00:00 恢复 100 积分，不结转。同码会话共享余额、分别保存对话，每码同时处理一个问题。
- 整数百万分之一积分记账：`(input-cached)*10 + cached*2 + output*30`。输出总量已含思考，不另叠加 reasoning_tokens。示例 10,000 输入、8,000 缓存、2,000 输出扣 0.096 积分。
- 每次模型请求（含意图检测）先按保守输入上界和可用输出额度预留，再按 usage 结算。输出容量取 256K 剩余空间及积分能承担的范围，不另设固定输出额度或模型调用/工具轮数上限。
- HTTP 4xx 拒绝不收费；已发起但未取得 usage 的断流、停止或 5xx 保留预留，本日余额显示扣除该预留，次日正常重置。没有后台自动对账接口，首版不将未知消耗当作零。有效 usage 即使随后断流也结算。请求幂等与每码运行租约存入 SQLite。
- 每个新问题先由同一模型做相关/不明确/无关分类；失败不放行。答疑仅用 `search_terms`、`read_term`，保留思考字段与工具消息配对，流式输出只显示答案。
- 完整会话上下文保留在单个 Node 进程内，以授权会话加随机对话 ID 隔离，24 小时未使用后回收；站内切页及关闭面板不清空。刷新或服务重启不保证恢复。不存在的延续会话返回明确错误，画面记录仍保留。
- 上下文优先用 usage 校准后估算新增内容，界面标识“约”；缓存仍占上下文。175,000 token 出现非阻断提醒，256,000 为产品窗口。真正放不下时保留会话并提示，既不自动压缩也不静默裁剪。意图分类仅取近期语境，答疑使用完整会话。
- 上游 90 秒无数据视为连接失败，没有整题时长限制。用户停止、授权失效或连接取消后不再发起后续模型调用。邀请码激活目前全站共用每 10 分钟 20 次尝试门槛，适合内部小规模使用。

## 部署与回滚

维持单 Node 进程、单副本。不要多副本分流内存会话，不使用短生命周期 Edge/Serverless。Docker Compose 已挂载 `xiaobei_data` 持久卷，传入百炼变量，`XIAOBEI_SITE_ORIGIN` 设置为真实公网 origin（反向代理下用于同源校验与 Secure Cookie）。不要打印完整 Compose 环境配置或将 `.env`/数据库放进镜像；`.dockerignore` 已排除。

容器内执行邀请码 CLI 时使用 `docker compose exec web npm run xiaobei:invites -- ...`。输出文件放入私有持久目录，取出后单独发给受邀者。升级保留数据卷；备份需使用 SQLite 在线 backup 或停止服务后整体备份 `.xiaobei`（含 WAL/SHM），不能运行中只复制主文件。回滚旧镜像不删除数据卷；恢复本功能时仍使用原账本和邀请码。

## 验证范围

`npm run build`；`node --experimental-strip-types --test tests/xiaobei.test.mjs`。

2026-09-29：功能提交 `a127741` 经 [PR #145](https://github.com/Gyschuaner/VibePolaris/pull/145) 合入 dev，合并提交 `d3656f099a5f194ea6814ee314ca7cf1c956e226`。功能分支和 dev 合并版本的生产构建通过，专项测试 2/2 通过。独立 worktree 在本机 `http://127.0.0.1:3047` 运行 dev 预览，未发布生产。

本地模拟百炼 SSE 验证过隐藏激活、同源/权限、9 次工具调用后继续、真实词条正文读取、跨页会话、175K 提醒、停止、390px 手机全屏、同码会话隔离。测试中发现的本地 Host/Origin 误判 `BUG-63A843B9` 已修复并回归关闭。

随后使用真实百炼 `https://dashscope.aliyuncs.com/compatible-mode/v1` 验证 4 个问题：Harness 与 Agent 关系（读取两篇正文）、承接图书馆比喻、拒绝天气问题、混合问题只解释 API/工具调用并不写生日贺词。共 9 次模型调用，全部返回有效 usage 并结算，总消耗 0.29685 积分，包含真实缓存命中，没有待结算记录。Key 仅保存在本机未跟踪的权限 600 环境文件；无配置或密钥入库。

DP 需求 `VBP-047`、研发任务、3 项验收用例和计划已关联；本地 dev 部署批次为 `vbp047-dev-d3656f0-20260929`。程序回滚可停止本次 3047 进程，运行此前 dev 提交 `f9bcbcf`，保留 SQLite 账本。飞书 CLI 未配置，正式云文档索引待同步；配置的 Windows Obsidian 路径在本机不存在，未写入知识库。

参考：[百炼 DeepSeek API](https://help.aliyun.com/zh/model-studio/deepseek-api)、[百炼缓存 usage](https://help.aliyun.com/zh/model-studio/context-cache)。Harness 参考 DeepTrace 知识问答与 Developer Platform 的权限、意图门控、预算和工具配对设计，只保留本次必要功能。
