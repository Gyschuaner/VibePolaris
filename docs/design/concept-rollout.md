# 全站词条覆盖索引 · VBP-012

本文件记录代码覆盖与 review 证据，需求状态以 DP 为准。基线为 2026-09-21 的 301 个既有词条，不能用“存在路由”代替内容验收。每批 3 页；完成当前批的研究、实现、Skill review、浏览器验收和 dev 集成后，再推进下一批。旧版测验或通用五帧演示不计为新设计完成。

## 批次与阅读入口

| 批次 | 词条 | DP / 证据 |
| --- | --- | --- |
| 原有设计 | Harness、工具调用、上下文、智能体循环 | 用户确认的设计基准；全站结束前复核受后续公共改动影响的部分 |
| 原有扩展 | 记忆、上下文窗口、提示词、MCP、执行沙箱 | VBP-011 · [五页记录](VBP-011-concept-pages.md) · PR #38 |
| 001 | 大模型、Token、智能体 | VBP-013 · [本批研究与 review](VBP-013-foundation-concepts.md) |
| 002 | 组件、Props、状态 | VBP-014 · [本批研究与 review](VBP-014-ui-concepts.md) |

下一批建议更新 `event`、`event-bubbling`、`hook`，继续梳理前端交互与组件能力；仍需先检查各页现状和一手资料。当前新流程已完成 6 页，另有 9 页历史基准；其余 286 页待处理，新增候选不计入完成数。

## 补充候选

候选尚未成为已发布词条。新增前检索重复概念，阅读原始资料并确认边界；不为凑数量拆分同义词。按以下缺口补齐可达到 313 条；若研究发现重复则调整，以有用内容为准。

| 拟新增 slug | 名称 | 当前缺口 / 连接 |
| --- | --- | --- |
| transformer | Transformer | LLM 结构与 attention 的关系 |
| attention | 注意力机制 | 上下文怎样影响表示，与检索区分 |
| inference | 模型推理 | 训练后一次调用，与 reasoning-model 区分 |
| pretraining | 预训练 | LLM、fine-tuning 的前置过程 |
| kv-cache | KV 缓存 | 推理重复计算，与 prompt-caching 区分 |
| agent-workflow | 智能体工作流 | agent 与固定代码路径的分工 |
| backpressure | 背压 | queue、stream-processing 的负载控制 |
| dead-letter-queue | 死信队列 | 重试耗尽的消息去向 |
| eventual-consistency | 最终一致性 | replication、distributed-system 的读写结果 |
| feature-flag | 功能开关 | deploy、rollback 之外的功能开放控制 |
| debounce | 防抖 | event、request 中连续输入怎样合并 |
| optimistic-update | 乐观更新 | state、response、失败回退的界面反馈 |

## 既有词条逐项覆盖

“基准”表示已有独立设计及历史证据，并非本次已重新验收。“待处理”需要完整升级。批次编号对应各批记录，是否完成看记录中的实际阶段。后续每批改动此表相应 3 行，保留真实证据，不批量修改为通过。

| slug | 名称 | 分类 | 覆盖 / review |
| --- | --- | --- | --- |
| agent-harness | 智能体运行框架 | AI·Agent | 基准 · 待最终复核 |
| component | 组件 | 前端 | 002 · 本地验收及 review 通过 |
| state | 状态 | 前端 | 002 · 本地验收及 review 通过 |
| responsive | 响应式布局 | 前端 | 待处理 |
| css | CSS | 前端 | 待处理 |
| form | 表单 | 前端 | 待处理 |
| html | HTML | 前端 | 待处理 |
| javascript | JavaScript | 前端 | 待处理 |
| dom | DOM | 前端 | 待处理 |
| api | API 接口 | 后端 | 待处理 |
| database | 数据库 | 后端 | 待处理 |
| auth | 认证 | 后端 | 待处理 |
| cache | 缓存 | 后端 | 待处理 |
| queue | 队列 | 后端 | 待处理 |
| rest | REST | 后端 | 待处理 |
| webhook | Webhook | 后端 | 待处理 |
| llm | 大模型 | AI·Agent | 001 · 本地验收及 review 通过 |
| prompt | 提示词 | AI·Agent | 基准 · 待最终复核 |
| context | 上下文 | AI·Agent | 基准 · 待最终复核 |
| token | Token | AI·Agent | 001 · 本地验收及 review 通过 |
| agent | 智能体 | AI·Agent | 001 · 本地验收及 review 通过 |
| tools | 工具调用 | AI·Agent | 基准 · 待最终复核 |
| memory | 记忆 | AI·Agent | 基准 · 待最终复核 |
| rag | RAG | AI·Agent | 待处理 |
| mcp | MCP | AI·Agent | 基准 · 待最终复核 |
| framework | 框架与库 | 技术栈 | 待处理 |
| ssg-ssr | 静态站点与服务器渲染 | 技术栈 | 待处理 |
| deploy | 部署与托管 | 技术栈 | 待处理 |
| library | 库 | 技术栈 | 待处理 |
| runtime | 运行时 | 技术栈 | 待处理 |
| package | 包管理 | 技术栈 | 待处理 |
| typescript | TypeScript | 技术栈 | 待处理 |
| repo-commit | 仓库与提交 | Git | 待处理 |
| branch | 分支 | Git | 待处理 |
| mvp | MVP | 产品与设计 | 待处理 |
| user-flow | 用户流程 | 产品与设计 | 待处理 |
| wireframe | 线框图 | 产品与设计 | 待处理 |
| ia | 信息架构 | 产品与设计 | 待处理 |
| prototype | 原型 | 产品与设计 | 待处理 |
| design-system | 设计系统 | 产品与设计 | 待处理 |
| a11y | 无障碍 | 产品与设计 | 待处理 |
| semantic-html | 语义化 HTML | 前端 | 待处理 |
| deep-link | 深度链接 | 前端 | 待处理 |
| app-manifest | 应用清单 | 前端 | 待处理 |
| emulator | 仿真器 | 前端 | 待处理 |
| code-signing | 代码签名 | 前端 | 待处理 |
| gesture | 手势 | 前端 | 待处理 |
| haptic-feedback | 触觉反馈 | 前端 | 待处理 |
| touch-target | 触控目标 | 前端 | 待处理 |
| offline-first | 离线优先 | 前端 | 待处理 |
| adaptive-layout | 自适应布局 | 前端 | 待处理 |
| safe-area | 安全区域 | 前端 | 待处理 |
| app-lifecycle | 应用生命周期 | 前端 | 待处理 |
| app-permission | 应用权限 | 前端 | 待处理 |
| push-notification | 推送通知 | 前端 | 待处理 |
| cross-platform-development | 跨平台开发 | 前端 | 待处理 |
| webview | WebView | 前端 | 待处理 |
| css-selector | CSS 选择器 | 前端 | 待处理 |
| box-model | 盒模型 | 前端 | 待处理 |
| cascade | 层叠 | 前端 | 待处理 |
| specificity | CSS 优先级 | 前端 | 待处理 |
| flexbox | 弹性布局 | 前端 | 待处理 |
| css-grid | 网格布局 | 前端 | 待处理 |
| positioning | 定位 | 前端 | 待处理 |
| breakpoint | 断点 | 前端 | 待处理 |
| media-query | 媒体查询 | 前端 | 待处理 |
| event | 事件 | 前端 | 待处理 |
| event-bubbling | 事件冒泡 | 前端 | 待处理 |
| props | 属性参数 | 前端 | 002 · 本地验收及 review 通过 |
| hook | Hook | 前端 | 待处理 |
| effect | 副作用 | 前端 | 待处理 |
| browser-api | 浏览器 API | 前端 | 待处理 |
| fetch-api | Fetch API | 前端 | 待处理 |
| promise | Promise | 前端 | 待处理 |
| async-await | 异步等待 | 前端 | 待处理 |
| module | 模块 | 前端 | 待处理 |
| code-splitting | 代码分割 | 前端 | 待处理 |
| lazy-loading | 懒加载 | 前端 | 待处理 |
| hydration | 水合 | 前端 | 待处理 |
| csr | 客户端渲染 | 前端 | 待处理 |
| ssr | 服务端渲染 | 前端 | 待处理 |
| ssg | 静态站点生成 | 前端 | 待处理 |
| routing | 路由 | 前端 | 待处理 |
| cookie | Cookie | 前端 | 待处理 |
| local-storage | 本地存储 | 前端 | 待处理 |
| websocket | WebSocket | 前端 | 待处理 |
| cors | 跨源资源共享 | 前端 | 待处理 |
| focus-management | 焦点管理 | 前端 | 待处理 |
| working-tree | 工作区 | Git | 待处理 |
| staging-area | 暂存区 | Git | 待处理 |
| diff | 差异 | Git | 待处理 |
| checkout-switch | 切换分支 | Git | 待处理 |
| remote | 远程仓库 | Git | 待处理 |
| clone | 克隆 | Git | 待处理 |
| pull | 拉取 | Git | 待处理 |
| fetch | 获取 | Git | 待处理 |
| push | 推送 | Git | 待处理 |
| merge | 合并 | Git | 待处理 |
| rebase | 变基 | Git | 待处理 |
| merge-conflict | 合并冲突 | Git | 待处理 |
| revert | 反向提交 | Git | 待处理 |
| stash | 暂存改动 | Git | 待处理 |
| pull-request | 拉取请求 | Git | 待处理 |
| code-review | 代码评审 | Git | 待处理 |
| ci | 持续集成 | Git | 待处理 |
| cd | 持续交付 | Git | 待处理 |
| preview-deployment | 预览部署 | Git | 待处理 |
| rollback | 回滚 | Git | 待处理 |
| user-story | 用户故事 | 产品与设计 | 待处理 |
| problem-statement | 问题陈述 | 产品与设计 | 待处理 |
| target-user | 目标用户 | 产品与设计 | 待处理 |
| use-case | 使用场景 | 产品与设计 | 待处理 |
| acceptance-criteria | 验收标准 | 产品与设计 | 待处理 |
| scope | 范围 | 产品与设计 | 待处理 |
| roadmap | 路线图 | 产品与设计 | 待处理 |
| priority | 优先级 | 产品与设计 | 待处理 |
| iteration | 迭代 | 产品与设计 | 待处理 |
| conversion-rate | 转化率 | 产品与设计 | 待处理 |
| funnel | 漏斗 | 产品与设计 | 待处理 |
| usability-testing | 可用性测试 | 产品与设计 | 待处理 |
| mockup | 视觉稿 | 产品与设计 | 待处理 |
| sitemap | 站点地图 | 产品与设计 | 待处理 |
| design-token | 设计令牌 | 产品与设计 | 待处理 |
| visual-hierarchy | 视觉层级 | 产品与设计 | 待处理 |
| feedback | 反馈 | 产品与设计 | 待处理 |
| loading-state | 加载状态 | 产品与设计 | 待处理 |
| microinteraction | 微交互 | 产品与设计 | 待处理 |
| reduced-motion | 减少动态效果 | 产品与设计 | 待处理 |
| server | 服务器 | 后端 | 待处理 |
| request | 请求 | 后端 | 待处理 |
| response | 响应 | 后端 | 待处理 |
| http-method | HTTP 方法 | 后端 | 待处理 |
| status-code | 状态码 | 后端 | 待处理 |
| http-header | 请求头 | 后端 | 待处理 |
| query-parameter | 查询参数 | 后端 | 待处理 |
| path-parameter | 路径参数 | 后端 | 待处理 |
| request-body | 请求体 | 后端 | 待处理 |
| json | JSON | 后端 | 待处理 |
| endpoint | 端点 | 后端 | 待处理 |
| api-gateway | API 网关 | 后端 | 待处理 |
| reverse-proxy | 反向代理 | 后端 | 待处理 |
| load-balancer | 负载均衡 | 后端 | 待处理 |
| session | 会话 | 后端 | 待处理 |
| jwt | JWT | 后端 | 待处理 |
| oauth | OAuth | 后端 | 待处理 |
| authorization | 授权 | 后端 | 待处理 |
| rbac | 基于角色的访问控制 | 后端 | 待处理 |
| api-key | API 密钥 | 后端 | 待处理 |
| rate-limiting | 限流 | 后端 | 待处理 |
| idempotency | 幂等性 | 后端 | 待处理 |
| pagination | 分页 | 后端 | 待处理 |
| retry | 重试 | 后端 | 待处理 |
| timeout | 超时 | 后端 | 待处理 |
| relational-database | 关系型数据库 | 后端 | 待处理 |
| sql | SQL | 后端 | 待处理 |
| nosql | NoSQL | 后端 | 待处理 |
| table | 表 | 后端 | 待处理 |
| row | 行 | 后端 | 待处理 |
| column | 列 | 后端 | 待处理 |
| database-schema | 数据库模式 | 后端 | 待处理 |
| primary-key | 主键 | 后端 | 待处理 |
| foreign-key | 外键 | 后端 | 待处理 |
| index | 索引 | 后端 | 待处理 |
| unique-constraint | 唯一约束 | 后端 | 待处理 |
| join | 连接查询 | 后端 | 待处理 |
| transaction | 事务 | 后端 | 待处理 |
| acid | ACID | 后端 | 待处理 |
| database-migration | 数据库迁移 | 后端 | 待处理 |
| orm | ORM | 后端 | 待处理 |
| connection-pool | 连接池 | 后端 | 待处理 |
| replication | 复制 | 后端 | 待处理 |
| sharding | 分片 | 后端 | 待处理 |
| backup | 备份 | 后端 | 待处理 |
| vector-database | 向量数据库 | 后端 | 待处理 |
| full-text-search | 全文搜索 | 后端 | 待处理 |
| tcp | TCP | 技术栈 | 待处理 |
| udp | UDP | 技术栈 | 待处理 |
| tls-handshake | TLS 握手 | 技术栈 | 待处理 |
| firewall | 防火墙 | 技术栈 | 待处理 |
| ip-address | IP 地址 | 技术栈 | 待处理 |
| network-port | 端口 | 技术栈 | 待处理 |
| packet | 数据包 | 技术栈 | 待处理 |
| url | URL | 技术栈 | 待处理 |
| hostname | 主机名 | 技术栈 | 待处理 |
| dns-record | DNS 记录 | 技术栈 | 待处理 |
| dns-resolver | DNS 解析器 | 技术栈 | 待处理 |
| cache-control | 缓存控制 | 技术栈 | 待处理 |
| mime-type | MIME 类型 | 技术栈 | 待处理 |
| response-body | 响应体 | 技术栈 | 待处理 |
| response-header | 响应头 | 技术栈 | 待处理 |
| dataframe | 数据帧 | 技术栈 | 待处理 |
| dataset-data | 数据集 | 技术栈 | 待处理 |
| batch-processing | 批处理 | 技术栈 | 待处理 |
| data-ingestion | 数据接入 | 技术栈 | 待处理 |
| data-pipeline | 数据管道 | 技术栈 | 待处理 |
| data-quality | 数据质量 | 技术栈 | 待处理 |
| data-transformation | 数据转换 | 技术栈 | 待处理 |
| data-validation | 数据验证 | 技术栈 | 待处理 |
| stream-processing | 流处理 | 技术栈 | 待处理 |
| data-lineage | 数据血缘 | 技术栈 | 待处理 |
| unit-test | 单元测试 | 技术栈 | 待处理 |
| integration-test | 集成测试 | 技术栈 | 待处理 |
| e2e-test | 端到端测试 | 技术栈 | 待处理 |
| smoke-test | 冒烟测试 | 技术栈 | 待处理 |
| regression-test | 回归测试 | 技术栈 | 待处理 |
| test-case | 测试用例 | 技术栈 | 待处理 |
| mock | 模拟对象 | 技术栈 | 待处理 |
| assertion | 断言 | 技术栈 | 待处理 |
| code-coverage | 测试覆盖率 | 技术栈 | 待处理 |
| api-testing | API 测试 | 技术栈 | 待处理 |
| least-privilege | 最小权限 | 技术栈 | 待处理 |
| hashing | 哈希 | 技术栈 | 待处理 |
| input-validation | 输入校验 | 技术栈 | 待处理 |
| encryption-at-rest | 静态加密 | 技术栈 | 待处理 |
| encryption-in-transit | 传输加密 | 技术栈 | 待处理 |
| generative-ai | 生成式 AI | AI·Agent | 待处理 |
| multimodal | 多模态 | AI·Agent | 待处理 |
| reasoning-model | 推理模型 | AI·Agent | 待处理 |
| system-prompt | 系统提示词 | AI·Agent | 待处理 |
| few-shot-prompting | 少样本提示 | AI·Agent | 待处理 |
| zero-shot-prompting | 零样本提示 | AI·Agent | 待处理 |
| temperature | 温度 | AI·Agent | 待处理 |
| context-window | 上下文窗口 | AI·Agent | 基准 · 待最终复核 |
| tokenization | 分词 | AI·Agent | 待处理 |
| hallucination | 幻觉 | AI·Agent | 待处理 |
| grounding | 基于证据回答 | AI·Agent | 待处理 |
| citation | 引用 | AI·Agent | 待处理 |
| structured-output | 结构化输出 | AI·Agent | 待处理 |
| json-schema | JSON Schema | AI·Agent | 待处理 |
| function-calling | 函数调用 | AI·Agent | 待处理 |
| tool-choice | 工具选择 | AI·Agent | 待处理 |
| tool-result | 工具结果 | AI·Agent | 待处理 |
| agent-loop | 智能体循环 | AI·Agent | 基准 · 待最终复核 |
| plan-and-execute | 规划与执行 | AI·Agent | 待处理 |
| agent-orchestration | 智能体编排 | AI·Agent | 待处理 |
| handoff | 交接 | AI·Agent | 待处理 |
| subagent | 子智能体 | AI·Agent | 待处理 |
| human-in-the-loop | 人在回路 | AI·Agent | 待处理 |
| guardrail | 护栏 | AI·Agent | 待处理 |
| moderation | 内容审核 | AI·Agent | 待处理 |
| eval | 评测 | AI·Agent | 待处理 |
| benchmark | 基准测试 | AI·Agent | 待处理 |
| grader | 评分器 | AI·Agent | 待处理 |
| fine-tuning | 微调 | AI·Agent | 待处理 |
| embedding | 嵌入 | AI·Agent | 待处理 |
| vector-store | 向量存储 | AI·Agent | 待处理 |
| retrieval | 检索 | AI·Agent | 待处理 |
| chunking | 分块 | AI·Agent | 待处理 |
| reranking | 重排序 | AI·Agent | 待处理 |
| semantic-search | 语义搜索 | AI·Agent | 待处理 |
| hybrid-search | 混合搜索 | AI·Agent | 待处理 |
| prompt-caching | 提示缓存 | AI·Agent | 待处理 |
| streaming-output | 流式输出 | AI·Agent | 待处理 |
| model-routing | 模型路由 | AI·Agent | 待处理 |
| model-fallback | 备用模型 | AI·Agent | 待处理 |
| agent-memory | 智能体记忆 | AI·Agent | 待处理 |
| working-memory | 工作记忆 | AI·Agent | 待处理 |
| prompt-injection | 提示词注入 | AI·Agent | 待处理 |
| execution-sandbox | 执行沙箱 | AI·Agent | 基准 · 待最终复核 |
| compiler | 编译器 | 技术栈 | 待处理 |
| interpreter | 解释器 | 技术栈 | 待处理 |
| transpiler | 转译器 | 技术栈 | 待处理 |
| build-tool | 构建工具 | 技术栈 | 待处理 |
| bundler | 打包器 | 技术栈 | 待处理 |
| dev-server | 开发服务器 | 技术栈 | 待处理 |
| hot-reload | 热重载 | 技术栈 | 待处理 |
| hmr | 热模块替换 | 技术栈 | 待处理 |
| dependency | 依赖 | 技术栈 | 待处理 |
| semantic-versioning | 语义化版本 | 技术栈 | 待处理 |
| lockfile | 锁文件 | 技术栈 | 待处理 |
| monorepo | 单体仓库 | 技术栈 | 待处理 |
| environment-variable | 环境变量 | 技术栈 | 待处理 |
| source-map | 源映射 | 技术栈 | 待处理 |
| linter | 代码检查器 | 技术栈 | 待处理 |
| formatter | 格式化器 | 技术栈 | 待处理 |
| expression | 表达式 | 技术栈 | 待处理 |
| function | 函数 | 技术栈 | 待处理 |
| parameter | 参数 | 技术栈 | 待处理 |
| return-value | 返回值 | 技术栈 | 待处理 |
| conditional-branch | 条件分支 | 技术栈 | 待处理 |
| loop | 循环 | 技术栈 | 待处理 |
| object | 对象 | 技术栈 | 待处理 |
| array | 数组 | 技术栈 | 待处理 |
| client-server | 客户端—服务器 | 技术栈 | 待处理 |
| monolith | 单体架构 | 技术栈 | 待处理 |
| microservices | 微服务 | 技术栈 | 待处理 |
| distributed-system | 分布式系统 | 技术栈 | 待处理 |
| event-driven-architecture | 事件驱动架构 | 技术栈 | 待处理 |
| serverless | 无服务器架构 | 技术栈 | 待处理 |
| container | 容器 | 技术栈 | 待处理 |
| container-image | 容器镜像 | 技术栈 | 待处理 |
| service-discovery | 服务发现 | 技术栈 | 待处理 |
| observability | 可观测性 | 技术栈 | 待处理 |
| sast | 静态应用安全测试 | 技术栈 | 待处理 |
| secret-scanning | 密钥扫描 | 技术栈 | 待处理 |
| dependency-scanning | 依赖扫描 | 技术栈 | 待处理 |
| threat-modeling | 威胁建模 | 技术栈 | 待处理 |
| tool-approval | 工具审批 | AI·Agent | 待处理 |
| evaluation-dataset | 评测数据集 | AI·Agent | 待处理 |
| permission-boundary | 权限边界 | AI·Agent | 待处理 |
| xss | 跨站脚本 | 技术栈 | 待处理 |
