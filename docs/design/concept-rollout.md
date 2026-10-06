# 全站词条覆盖索引 · VBP-012

本文件记录代码覆盖与 review 证据，需求状态以 DP 为准。基线为 2026-09-21 的 301 个既有词条，不能用“存在路由”代替内容验收。通常每批 3 页，有明确单批数量要求时按该要求执行；完成当前批的研究、实现、Skill review、浏览器验收和 dev 集成后，再推进下一批。旧版测验或通用五帧演示不计为新设计完成。

## 批次与阅读入口

| 批次 | 词条 | DP / 证据 |
| --- | --- | --- |
| 原有设计 | Harness、工具调用、上下文、智能体循环 | 用户确认的设计基准；全站结束前复核受后续公共改动影响的部分 |
| 原有扩展 | 记忆、上下文窗口、提示词、MCP、执行沙箱 | VBP-011 · [五页记录](VBP-011-concept-pages.md) · PR #38 |
| 001 | 大模型、Token、智能体 | VBP-013 · [本批研究与 review](VBP-013-foundation-concepts.md) |
| 002 | 组件、Props、状态 | VBP-014 · [本批研究与 review](VBP-014-ui-concepts.md) |
| 003 | 事件、事件冒泡、Hook、副作用、浏览器 API | VBP-015 · [本批研究与 review](VBP-015-events-hooks.md) |
| 004 | Fetch API、Promise、async/await、JSON、JSON Schema | VBP-016 · [本批研究与 review](VBP-016-async-concepts.md) |
| 005 | 请求、响应、HTTP 方法、状态码、请求头 | VBP-017 · [本批研究与 review](VBP-017-http-concepts.md) |
| 006 | 查询参数、路径参数、请求体 | VBP-018 · [本批研究与 review](VBP-018-request-inputs.md) |
| 007 | API 接口、端点、REST、分页、限流 | VBP-019 · [本批研究与 review](VBP-012-api-concepts-preparation.md) |
| 008 | 超时、重试、幂等 | VBP-023 · [本批研究与 review](VBP-012-reliability-concepts.md) |
| 009 | 数据库、索引、事务 | VBP-024 · [本批研究与 review](VBP-024-storage-concepts.md) |
| 010 | 表、主键、外键 | VBP-025 · [本批研究与 review](VBP-025-relational-concepts.md) |
| 011 | 数据库模式、连接查询、唯一约束 | VBP-026 · [本批研究与 review](VBP-026-structure-concepts.md) |
| 012 | SQL、数据库迁移、ORM | VBP-027 · [本批研究与 review](VBP-027-query-concepts.md) |
| 013 | 缓存、连接池、复制 | VBP-028 · [本批研究与 review](VBP-028-reuse-concepts.md) |
| 014 | 备份、分片、队列 | VBP-029 · [本批研究与 review](VBP-029-distribution-concepts.md) |
| 015 | 批处理、流处理、事件驱动架构 | VBP-030 · [本批研究与 review](VBP-030-processing-concepts.md) |
| 016 | 数据管道、Webhook、分布式系统 | VBP-031 · [本批研究与 review](VBP-031-coordination-concepts.md) |
| 017 | 数据接入、数据转换、数据验证 | VBP-032 · [本批研究与 review](VBP-032-dataflow-concepts.md) |
| 018 | 数据集、数据质量、数据血缘 | VBP-033 · [本批研究与 review](VBP-033-provenance-concepts.md) |
| 019 | 数据帧、全文搜索、向量数据库 | VBP-034 · [本批研究与 review](VBP-034-retrieval-concepts.md) |
| 020 | 嵌入、语义搜索、RAG | VBP-035 · [本批研究与 review](VBP-035-semantic-concepts.md) |
| 021 | 检索、分块、重排序 | VBP-036 · [本批研究与 review](VBP-036-selection-concepts.md) |
| 022 | 混合搜索、向量存储、引用 | VBP-037 · [本批研究与 review](VBP-037-evidence-concepts.md) |
| 023 | 基于证据回答、幻觉、评测 | VBP-038 · [初始设计](VBP-038-quality-concepts.md) · [099–108 文案更新与上线记录](VBP-038-040-content-refresh-099-108.md) |
| 024 | 基准测试、评分器、评测数据集 | VBP-039 · [初始设计](VBP-039-assessment-concepts.md) · [099–108 文案更新与上线记录](VBP-038-040-content-refresh-099-108.md) |
| 025 | 模型路由、备用模型、提示缓存 | VBP-040 · [初始设计](VBP-040-model-delivery-concepts.md) · [099–108 文案更新与上线记录](VBP-038-040-content-refresh-099-108.md) |
| 026 | 流式输出、结构化输出、函数调用 | VBP-041 · [初始设计](VBP-041-output-concepts.md) · [109–118 文案更新记录](VBP-041-045-content-refresh-109-118.md) |
| 027 | 服务器、API 网关、反向代理 | VBP-043 · [初始设计](VBP-043-edge-concepts.md) · [109–118 文案更新记录](VBP-041-045-content-refresh-109-118.md) |
| 028 | 负载均衡、认证、授权 | VBP-044 · [初始设计](VBP-044-access-concepts.md) · [109–118 文案更新记录](VBP-041-045-content-refresh-109-118.md) |
| 029 | 会话、JWT、OAuth 2.0 | VBP-045 · [初始设计](VBP-045-identity-concepts.md) · [109–118 文案更新记录](VBP-041-045-content-refresh-109-118.md) |
| 030 | 技能（Agent Skill，单页新增词条，不计入基线完成数） | VBP-046 · [本批研究与 review](VBP-046-skill-concepts.md) |
| 031 | 生成式 AI、多模态、推理模型、系统提示词、少样本提示、零样本提示、温度、分词、工具选择、工具结果 | VBP-050 · [119–128 文案更新与上线记录](VBP-050-content-refresh-119-128.md) |
| 032 | 规划与执行、智能体编排、交接、子智能体、人在回路、护栏、内容审核、微调、智能体记忆、工作记忆 | VBP-051 · [129–138 文案更新与上线记录](VBP-051-content-refresh-129-138.md) |
| 033 | 提示词注入、编译器、解释器、转译器、构建工具、打包器、开发服务器、热重载、热模块替换、依赖 | VBP-052 · [139–148 文案更新与上线记录](VBP-052-content-refresh-139-148.md) |
| 034 | 语义化版本、锁文件、单体仓库、环境变量、源映射、代码检查器、格式化器、表达式、函数、参数 | VBP-053 · [149–158 文案更新与上线记录](VBP-053-content-refresh-149-158.md) |
| 035 | 返回值、条件分支、循环、对象、数组、客户端—服务器、单体架构、微服务、无服务器架构、容器 | VBP-054 · [159–168 文案更新与上线记录](VBP-054-content-refresh-159-168.md) |
| 036 | 响应式布局、CSS、表单、HTML、JavaScript、DOM、框架与库、静态站点与服务端渲染、部署与托管、库 | VBP-055 · [169–178 文案更新与上线记录](VBP-055-content-refresh-169-178.md) |
| 040 | 容器镜像、服务发现、可观测性、SAST、密钥扫描、依赖扫描、威胁建模、工具审批、权限边界、XSS | VBP-059 · [209–218 文案更新与上线记录](VBP-059-content-refresh-209-218.md) |
| 041 | 工具选择、工具结果、规划与执行、智能体编排、交接、子智能体、人在回路、护栏、内容审核、微调 | VBP-060 · [219–228 文案更新与上线记录](VBP-060-content-refresh-219-228.md) · 十条统一发布，生产已上线 |
| 042 | 上下文窗口、智能体循环、智能体记忆、工作记忆、执行沙箱、嵌入、向量存储、检索、分块、重排序 | VBP-061 · [229–238 文案更新与生产发布记录](VBP-061-content-refresh-229-238.md) · 十条统一发布，生产已上线 |
| 043 | 生成式 AI、多模态、推理模型、系统提示词、少样本提示、零样本提示、温度、分词、工具审批、权限边界 | VBP-062 · [239–248 文案更新与生产发布记录](VBP-062-content-refresh-239-248.md) · 十条统一发布，生产已上线 |
| 044 | 仓库与提交、分支、工作区、暂存区、差异、切换分支、远程仓库、克隆、拉取、获取 | VBP-063 · [249–258 文案更新与生产发布记录](VBP-063-content-refresh-249-258.md) · 十条逐条验收、dev 集成及生产统一发布 |
| 045 | 推送、合并、变基、合并冲突、反向提交、暂存改动、拉取请求、代码评审、持续集成、持续交付 | VBP-065 · [259–268 文案更新与生产发布记录](VBP-065-content-refresh-259-268.md) · 十条逐条验收、dev 集成及生产统一发布 |
| 054 | 防火墙、IP 地址、网络端口、数据包、URL、主机名、DNS 记录、DNS 解析器、缓存控制、MIME 类型 | VBP-074 · [网络基础与 HTTP 边界词条更新及生产发布记录](VBP-074-content-refresh-20261004.md) · 十条逐条验收、dev 集成及生产统一发布 |
| 055 | TCP、UDP、TLS 握手、响应体、响应头、Cookie、CORS、WebSocket、API 密钥、基于角色的访问控制 | VBP-075 · [传输与 HTTP 应用边界词条更新及生产发布记录](VBP-075-content-refresh-20261004.md) · 十条逐条验收、dev 集成及生产统一发布 |
| 056 | Harness、提示词、上下文、工具调用、记忆、MCP、上下文窗口、智能体循环、智能体记忆、工作记忆 | VBP-076 · [AI Agent 核心词条一致性复核与补正记录](VBP-076-content-refresh-20261005.md) · 十条逐条复核、来源台账对齐、dev 集成及生产统一发布 |
| 057 | 数据接入、数据管道、数据转换、数据验证、数据血缘、流处理、单元测试、集成测试、端到端测试、冒烟测试 | VBP-087 · [数据流与测试边界机制矩阵](VBP-087-mechanism-matrix.md) · 十条逐条重做、review、dev 集成及生产统一发布 |
| 058 | 回归测试、测试用例、模拟对象、断言、测试覆盖率、API 测试、最小权限、哈希、输入校验、静态加密 | VBP-088 · [测试证据与安全边界机制矩阵](VBP-088-mechanism-matrix.md) · 十条逐条重做、review、dev 集成及生产统一发布 |
| 059 | 运行时、包管理、TypeScript、MVP、用户流程、线框图、信息架构、原型、设计系统、无障碍 | VBP-089 · [产品与技术基础词条机制差异表](VBP-089-mechanism-matrix.md) · 十条逐条重做、唯一 reviewer 已 PASS，生产已发布 |
| 060 | 语义化 HTML、深度链接、应用清单、仿真器、代码签名、手势、触觉反馈、触控目标、离线优先、自适应布局 | VBP-090 · [前端与交互机制差异表](VBP-090-mechanism-matrix.md) · 十条逐条重做、唯一 reviewer 已 PASS，生产已发布 |
| 061 | 安全区域、应用生命周期、应用权限、推送通知、跨平台开发、WebView、CSS 选择器、盒模型、层叠、CSS 优先级 | VBP-091 · [平台与 CSS 机制差异表](VBP-091-mechanism-matrix.md) · 十条逐条重做，唯一 reviewer 已 PASS，生产已发布 |
| 062 | 弹性布局、网格布局、定位、断点、媒体查询、模块、代码分割、懒加载、水合、客户端渲染 | VBP-092 · [渲染与布局机制差异表](VBP-092-mechanism-matrix.md) · 十条逐条重做特色演示，当前本地实现，待唯一 reviewer 与浏览器验收 |

后续按全站目标继续选择未处理词条，数量以用户当次明确要求为准，仍需先检查现状和一手资料。当前新流程已完成 175 页，另有 9 页历史基准；其余 117 页待处理，新增候选不计入完成数。

升级期间只公开下表中“基准”或“本地验收及 review 通过”的词条。公开清单维护在 `content/zh/published-terms.json`；待处理词条保留源码与研究底稿，但不进入星图、搜索、站点地图、词条导航或直接路由。每批完成并合入 dev 后同步更新本表和公开清单。

2026-09-27 起每词条至少四份已阅读且映射到正文的公开来源；009、010、011、012、013、014、015、016、017、018、019、020、021、022、023、024、025、026、027、028、029、031、032、033、034、035、040、041、042、043 批已满足。早期批次与历史基准在最终复核时按新标准补足，既有通过记录仅表示当时验收，不表示已完成新增来源标准。

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

“基准”表示已有独立设计及历史证据，并非本次已重新验收。“待处理”需要完整升级。批次编号对应各批记录，是否完成看记录中的实际阶段。后续每批只改动此表实际完成的对应行，保留真实证据，不批量修改为通过。

| slug | 名称 | 分类 | 覆盖 / review |
| --- | --- | --- | --- |
| agent-harness | 智能体运行框架 | AI·Agent | VBP-076 · 生产已发布 |
| component | 组件 | 前端 | 002 · 本地验收及 review 通过 |
| state | 状态 | 前端 | 002 · 本地验收及 review 通过 |
| responsive | 响应式布局 | 前端 | 036 · 生产已发布 |
| css | CSS | 前端 | 036 · 生产已发布 |
| form | 表单 | 前端 | 036 · 生产已发布 |
| html | HTML | 前端 | 036 · 生产已发布 |
| javascript | JavaScript | 前端 | 036 · 生产已发布 |
| dom | DOM | 前端 | 036 · 生产已发布 |
| api | API 接口 | 后端 | 007 · 本地验收及 review 通过 |
| database | 数据库 | 后端 | 009 · 本地验收及 review 通过 |
| auth | 认证 | 后端 | 028 · 本地验收及 review 通过 |
| cache | 缓存 | 后端 | 013 · 本地验收及 review 通过 |
| queue | 队列 | 后端 | 014 · 本地验收及 review 通过 |
| rest | REST | 后端 | 007 · 本地验收及 review 通过 |
| webhook | Webhook | 后端 | 016 · 本地验收及 review 通过 |
| llm | 大模型 | AI·Agent | 001 · 本地验收及 review 通过 |
| prompt | 提示词 | AI·Agent | VBP-076 · 生产已发布 |
| context | 上下文 | AI·Agent | VBP-076 · 生产已发布 |
| token | Token | AI·Agent | 001 · 本地验收及 review 通过 |
| agent | 智能体 | AI·Agent | 001 · 本地验收及 review 通过 |
| tools | 工具调用 | AI·Agent | VBP-076 · 生产已发布 |
| memory | 记忆 | AI·Agent | VBP-076 · 生产已发布 |
| rag | RAG | AI·Agent | 020 · 本地验收及 review 通过 |
| mcp | MCP | AI·Agent | VBP-076 · 生产已发布 |
| framework | 框架与库 | 技术栈 | 036 · 生产已发布 |
| ssg-ssr | 静态站点与服务端渲染 | 技术栈 | 036 · 生产已发布 |
| deploy | 部署与托管 | 技术栈 | 036 · 生产已发布 |
| library | 库 | 技术栈 | 036 · 生产已发布 |
| runtime | 运行时 | 技术栈 | VBP-089 · 生产已发布 |
| package | 包管理 | 技术栈 | VBP-089 · 生产已发布 |
| typescript | TypeScript | 技术栈 | VBP-089 · 生产已发布 |
| repo-commit | 仓库与提交 | Git | 044 · 生产已发布 |
| branch | 分支 | Git | 044 · 生产已发布 |
| mvp | MVP | 产品与设计 | VBP-089 · 生产已发布 |
| user-flow | 用户流程 | 产品与设计 | VBP-089 · 生产已发布 |
| wireframe | 线框图 | 产品与设计 | VBP-089 · 生产已发布 |
| ia | 信息架构 | 产品与设计 | VBP-089 · 生产已发布 |
| prototype | 原型 | 产品与设计 | VBP-089 · 生产已发布 |
| design-system | 设计系统 | 产品与设计 | VBP-089 · 生产已发布 |
| a11y | 无障碍 | 产品与设计 | VBP-089 · 生产已发布 |
| semantic-html | 语义化 HTML | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| deep-link | 深度链接 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| app-manifest | 应用清单 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| emulator | 仿真器 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| code-signing | 代码签名 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| gesture | 手势 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| haptic-feedback | 触觉反馈 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| touch-target | 触控目标 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| offline-first | 离线优先 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| adaptive-layout | 自适应布局 | 前端 | VBP-090 · 十条逐条 review 通过，生产已发布 |
| safe-area | 安全区域 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| app-lifecycle | 应用生命周期 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| app-permission | 应用权限 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| push-notification | 推送通知 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| cross-platform-development | 跨平台开发 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| webview | WebView | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| css-selector | CSS 选择器 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| box-model | 盒模型 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| cascade | 层叠 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| specificity | CSS 优先级 | 前端 | VBP-091 · 逐条实现、reviewer PASS，生产已发布 |
| flexbox | 弹性布局 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| css-grid | 网格布局 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| positioning | 定位 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| breakpoint | 断点 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| media-query | 媒体查询 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| event | 事件 | 前端 | 003 · 本地验收及 review 通过 |
| event-bubbling | 事件冒泡 | 前端 | 003 · 本地验收及 review 通过 |
| props | 属性参数 | 前端 | 002 · 本地验收及 review 通过 |
| hook | Hook | 前端 | 003 · 本地验收及 review 通过 |
| effect | 副作用 | 前端 | 003 · 本地验收及 review 通过 |
| browser-api | 浏览器 API | 前端 | 003 · 本地验收及 review 通过 |
| fetch-api | Fetch API | 前端 | 004 · 本地验收及 review 通过 |
| promise | Promise | 前端 | 004 · 本地验收及 review 通过 |
| async-await | 异步等待 | 前端 | 004 · 本地验收及 review 通过 |
| module | 模块 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| code-splitting | 代码分割 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| lazy-loading | 懒加载 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| hydration | 水合 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| csr | 客户端渲染 | 前端 | VBP-092 · 逐条实现、reviewer PASS，生产已发布 |
| ssr | 服务端渲染 | 前端 | 待处理 |
| ssg | 静态站点生成 | 前端 | 待处理 |
| routing | 路由 | 前端 | 待处理 |
| cookie | Cookie | 前端 | VBP-075 · 生产已发布 |
| local-storage | 本地存储 | 前端 | 待处理 |
| websocket | WebSocket | 前端 | VBP-075 · 生产已发布 |
| cors | 跨源资源共享 | 前端 | VBP-075 · 生产已发布 |
| focus-management | 焦点管理 | 前端 | 待处理 |
| working-tree | 工作区 | Git | 044 · 生产已发布 |
| staging-area | 暂存区 | Git | 044 · 生产已发布 |
| diff | 差异 | Git | 044 · 生产已发布 |
| checkout-switch | 切换分支 | Git | 044 · 生产已发布 |
| remote | 远程仓库 | Git | 044 · 生产已发布 |
| clone | 克隆 | Git | 044 · 生产已发布 |
| pull | 拉取 | Git | 044 · 生产已发布 |
| fetch | 获取 | Git | 044 · 生产已发布 |
| push | 推送 | Git | 045 · 生产已发布 |
| merge | 合并 | Git | 045 · 生产已发布 |
| rebase | 变基 | Git | 045 · 生产已发布 |
| merge-conflict | 合并冲突 | Git | 045 · 生产已发布 |
| revert | 反向提交 | Git | 045 · 生产已发布 |
| stash | 暂存改动 | Git | 045 · 生产已发布 |
| pull-request | 拉取请求 | Git | 045 · 生产已发布 |
| code-review | 代码评审 | Git | 045 · 生产已发布 |
| ci | 持续集成 | Git | 045 · 生产已发布 |
| cd | 持续交付 | Git | 045 · 生产已发布 |
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
| server | 服务器 | 后端 | 027 · 本地验收及 review 通过 |
| request | 请求 | 后端 | 005 · 本地验收及 review 通过 |
| response | 响应 | 后端 | 005 · 本地验收及 review 通过 |
| http-method | HTTP 方法 | 后端 | 005 · 本地验收及 review 通过 |
| status-code | 状态码 | 后端 | 005 · 本地验收及 review 通过 |
| http-header | 请求头 | 后端 | 005 · 本地验收及 review 通过 |
| query-parameter | 查询参数 | 后端 | 006 · 本地验收及 review 通过 |
| path-parameter | 路径参数 | 后端 | 006 · 本地验收及 review 通过 |
| request-body | 请求体 | 后端 | 006 · 本地验收及 review 通过 |
| json | JSON | 后端 | 004 · 本地验收及 review 通过 |
| endpoint | 端点 | 后端 | 007 · 本地验收及 review 通过 |
| api-gateway | API 网关 | 后端 | 027 · 本地验收及 review 通过 |
| reverse-proxy | 反向代理 | 后端 | 027 · 本地验收及 review 通过 |
| load-balancer | 负载均衡 | 后端 | 028 · 本地验收及 review 通过 |
| session | 会话 | 后端 | 029 · 本地验收及 review 通过 |
| jwt | JWT | 后端 | 029 · 本地验收及 review 通过 |
| oauth | OAuth | 后端 | 029 · 本地验收及 review 通过 |
| authorization | 授权 | 后端 | 028 · 本地验收及 review 通过 |
| rbac | 基于角色的访问控制 | 后端 | VBP-075 · 生产已发布 |
| api-key | API 密钥 | 后端 | VBP-075 · 生产已发布 |
| rate-limiting | 限流 | 后端 | 007 · 本地验收及 review 通过 |
| idempotency | 幂等性 | 后端 | 008 · 本地验收及 review 通过 |
| pagination | 分页 | 后端 | 007 · 本地验收及 review 通过 |
| retry | 重试 | 后端 | 008 · 本地验收及 review 通过 |
| timeout | 超时 | 后端 | 008 · 本地验收及 review 通过 |
| relational-database | 关系型数据库 | 后端 | 待处理 |
| sql | SQL | 后端 | 012 · 本地验收及 review 通过 |
| nosql | NoSQL | 后端 | 待处理 |
| table | 表 | 后端 | 010 · 本地验收及 review 通过 |
| row | 行 | 后端 | 待处理 |
| column | 列 | 后端 | 待处理 |
| database-schema | 数据库模式 | 后端 | 本地验收及 review 通过 · VBP-026 |
| primary-key | 主键 | 后端 | 010 · 本地验收及 review 通过 |
| foreign-key | 外键 | 后端 | 010 · 本地验收及 review 通过 |
| index | 索引 | 后端 | 009 · 本地验收及 review 通过 |
| unique-constraint | 唯一约束 | 后端 | 本地验收及 review 通过 · VBP-026 |
| join | 连接查询 | 后端 | 本地验收及 review 通过 · VBP-026 |
| transaction | 事务 | 后端 | 009 · 本地验收及 review 通过 |
| acid | ACID | 后端 | 待处理 |
| database-migration | 数据库迁移 | 后端 | 012 · 本地验收及 review 通过 |
| orm | ORM | 后端 | 012 · 本地验收及 review 通过 |
| connection-pool | 连接池 | 后端 | 013 · 本地验收及 review 通过 |
| replication | 复制 | 后端 | 013 · 本地验收及 review 通过 |
| sharding | 分片 | 后端 | 014 · 本地验收及 review 通过 |
| backup | 备份 | 后端 | 014 · 本地验收及 review 通过 |
| vector-database | 向量数据库 | 后端 | 019 · 本地验收及 review 通过 |
| full-text-search | 全文搜索 | 后端 | 019 · 本地验收及 review 通过 |
| tcp | TCP | 技术栈 | VBP-075 · 生产已发布 |
| udp | UDP | 技术栈 | VBP-075 · 生产已发布 |
| tls-handshake | TLS 握手 | 技术栈 | VBP-075 · 生产已发布 |
| firewall | 防火墙 | 技术栈 | VBP-074 · 生产已发布 |
| ip-address | IP 地址 | 技术栈 | VBP-074 · 生产已发布 |
| network-port | 端口 | 技术栈 | VBP-074 · 生产已发布 |
| packet | 数据包 | 技术栈 | VBP-074 · 生产已发布 |
| url | URL | 技术栈 | VBP-074 · 生产已发布 |
| hostname | 主机名 | 技术栈 | VBP-074 · 生产已发布 |
| dns-record | DNS 记录 | 技术栈 | VBP-074 · 生产已发布 |
| dns-resolver | DNS 解析器 | 技术栈 | VBP-074 · 生产已发布 |
| cache-control | 缓存控制 | 技术栈 | VBP-074 · 生产已发布 |
| mime-type | MIME 类型 | 技术栈 | VBP-074 · 生产已发布 |
| response-body | 响应体 | 技术栈 | VBP-075 · 生产已发布 |
| response-header | 响应头 | 技术栈 | VBP-075 · 生产已发布 |
| dataframe | 数据帧 | 技术栈 | 019 · 本地验收及 review 通过 |
| dataset-data | 数据集 | 技术栈 | 018 · 本地验收及 review 通过 |
| batch-processing | 批处理 | 技术栈 | 015 · 本地验收及 review 通过 |
| data-ingestion | 数据接入 | 技术栈 | VBP-087 · 生产已发布 |
| data-pipeline | 数据管道 | 技术栈 | VBP-087 · 生产已发布 |
| data-quality | 数据质量 | 技术栈 | 018 · 本地验收及 review 通过 |
| data-transformation | 数据转换 | 技术栈 | VBP-087 · 生产已发布 |
| data-validation | 数据验证 | 技术栈 | VBP-087 · 生产已发布 |
| stream-processing | 流处理 | 技术栈 | VBP-087 · 生产已发布 |
| data-lineage | 数据血缘 | 技术栈 | VBP-087 · 生产已发布 |
| unit-test | 单元测试 | 技术栈 | VBP-087 · 生产已发布 |
| integration-test | 集成测试 | 技术栈 | VBP-087 · 生产已发布 |
| e2e-test | 端到端测试 | 技术栈 | VBP-087 · 生产已发布 |
| smoke-test | 冒烟测试 | 技术栈 | VBP-087 · 生产已发布 |
| regression-test | 回归测试 | 技术栈 | VBP-088 · 生产已发布 |
| test-case | 测试用例 | 技术栈 | VBP-088 · 生产已发布 |
| mock | 模拟对象 | 技术栈 | VBP-088 · 生产已发布 |
| assertion | 断言 | 技术栈 | VBP-088 · 生产已发布 |
| code-coverage | 测试覆盖率 | 技术栈 | VBP-088 · 生产已发布 |
| api-testing | API 测试 | 技术栈 | VBP-088 · 生产已发布 |
| least-privilege | 最小权限 | 技术栈 | VBP-088 · 生产已发布 |
| hashing | 哈希 | 技术栈 | VBP-088 · 生产已发布 |
| input-validation | 输入校验 | 技术栈 | VBP-088 · 生产已发布 |
| encryption-at-rest | 静态加密 | 技术栈 | VBP-088 · 生产已发布 |
| encryption-in-transit | 传输加密 | 技术栈 | 待处理 |
| generative-ai | 生成式 AI | AI·Agent | 043 · 生产已发布 |
| multimodal | 多模态 | AI·Agent | 043 · 生产已发布 |
| reasoning-model | 推理模型 | AI·Agent | 043 · 生产已发布 |
| system-prompt | 系统提示词 | AI·Agent | 043 · 生产已发布 |
| few-shot-prompting | 少样本提示 | AI·Agent | 043 · 生产已发布 |
| zero-shot-prompting | 零样本提示 | AI·Agent | 043 · 生产已发布 |
| temperature | 温度 | AI·Agent | 043 · 生产已发布 |
| context-window | 上下文窗口 | AI·Agent | VBP-076 · 生产已发布 |
| tokenization | 分词 | AI·Agent | 043 · 生产已发布 |
| hallucination | 幻觉 | AI·Agent | 023 · 本地验收及 review 通过 |
| grounding | 基于证据回答 | AI·Agent | 023 · 本地验收及 review 通过 |
| citation | 引用 | AI·Agent | 022 · 本地验收及 review 通过 |
| structured-output | 结构化输出 | AI·Agent | 026 · 本地验收及 review 通过 |
| json-schema | JSON Schema | AI·Agent | 004 · 本地验收及 review 通过 |
| function-calling | 函数调用 | AI·Agent | 026 · 本地验收及 review 通过 |
| tool-choice | 工具选择 | AI·Agent | 041 · 生产已发布 |
| tool-result | 工具结果 | AI·Agent | 041 · 生产已发布 |
| agent-loop | 智能体循环 | AI·Agent | VBP-076 · 生产已发布 |
| plan-and-execute | 规划与执行 | AI·Agent | 041 · 生产已发布 |
| agent-orchestration | 智能体编排 | AI·Agent | 041 · 生产已发布 |
| handoff | 交接 | AI·Agent | 041 · 生产已发布 |
| subagent | 子智能体 | AI·Agent | 041 · 生产已发布 |
| human-in-the-loop | 人在回路 | AI·Agent | 041 · 生产已发布 |
| guardrail | 护栏 | AI·Agent | 041 · 生产已发布 |
| moderation | 内容审核 | AI·Agent | 041 · 生产已发布 |
| eval | 评测 | AI·Agent | 023 · 本地验收及 review 通过 |
| benchmark | 基准测试 | AI·Agent | 024 · 本地验收及 review 通过 |
| grader | 评分器 | AI·Agent | 024 · 本地验收及 review 通过 |
| fine-tuning | 微调 | AI·Agent | 041 · 生产已发布 |
| embedding | 嵌入 | AI·Agent | 020 · 本地验收及 review 通过 |
| vector-store | 向量存储 | AI·Agent | 022 · 本地验收及 review 通过 |
| retrieval | 检索 | AI·Agent | 021 · 本地验收及 review 通过 |
| chunking | 分块 | AI·Agent | 021 · 本地验收及 review 通过 |
| reranking | 重排序 | AI·Agent | 021 · 本地验收及 review 通过 |
| semantic-search | 语义搜索 | AI·Agent | 020 · 本地验收及 review 通过 |
| hybrid-search | 混合搜索 | AI·Agent | 022 · 本地验收及 review 通过 |
| prompt-caching | 提示缓存 | AI·Agent | 025 · 本地验收及 review 通过 |
| streaming-output | 流式输出 | AI·Agent | 026 · 本地验收及 review 通过 |
| model-routing | 模型路由 | AI·Agent | 025 · 本地验收及 review 通过 |
| model-fallback | 备用模型 | AI·Agent | 025 · 本地验收及 review 通过 |
| agent-memory | 智能体记忆 | AI·Agent | VBP-076 · 生产已发布 |
| working-memory | 工作记忆 | AI·Agent | VBP-076 · 生产已发布 |
| prompt-injection | 提示词注入 | AI·Agent | 033 · 本地验收及 review 通过 |
| execution-sandbox | 执行沙箱 | AI·Agent | 基准 · 待最终复核 |
| compiler | 编译器 | 技术栈 | 033 · 本地验收及 review 通过 |
| interpreter | 解释器 | 技术栈 | 033 · 本地验收及 review 通过 |
| transpiler | 转译器 | 技术栈 | 033 · 本地验收及 review 通过 |
| build-tool | 构建工具 | 技术栈 | 033 · 本地验收及 review 通过 |
| bundler | 打包器 | 技术栈 | 033 · 本地验收及 review 通过 |
| dev-server | 开发服务器 | 技术栈 | 033 · 本地验收及 review 通过 |
| hot-reload | 热重载 | 技术栈 | 033 · 本地验收及 review 通过 |
| hmr | 热模块替换 | 技术栈 | 033 · 本地验收及 review 通过 |
| dependency | 依赖 | 技术栈 | 033 · 本地验收及 review 通过 |
| semantic-versioning | 语义化版本 | 技术栈 | 034 · 本地验收及 review 通过 |
| lockfile | 锁文件 | 技术栈 | 034 · 本地验收及 review 通过 |
| monorepo | 单体仓库 | 技术栈 | 034 · 本地验收及 review 通过 |
| environment-variable | 环境变量 | 技术栈 | 034 · 本地验收及 review 通过 |
| source-map | 源映射 | 技术栈 | 034 · 本地验收及 review 通过 |
| linter | 代码检查器 | 技术栈 | 034 · 本地验收及 review 通过 |
| formatter | 格式化器 | 技术栈 | 034 · 本地验收及 review 通过 |
| expression | 表达式 | 技术栈 | 034 · 本地验收及 review 通过 |
| function | 函数 | 技术栈 | 034 · 本地验收及 review 通过 |
| parameter | 参数 | 技术栈 | 034 · 本地验收及 review 通过 |
| return-value | 返回值 | 技术栈 | 035 · 本地验收及 review 通过 |
| conditional-branch | 条件分支 | 技术栈 | 035 · 本地验收及 review 通过 |
| loop | 循环 | 技术栈 | 035 · 本地验收及 review 通过 |
| object | 对象 | 技术栈 | 035 · 本地验收及 review 通过 |
| array | 数组 | 技术栈 | 035 · 本地验收及 review 通过 |
| client-server | 客户端—服务器 | 技术栈 | 035 · 本地验收及 review 通过 |
| monolith | 单体架构 | 技术栈 | 035 · 本地验收及 review 通过 |
| microservices | 微服务 | 技术栈 | 035 · 本地验收及 review 通过 |
| distributed-system | 分布式系统 | 技术栈 | 016 · 本地验收及 review 通过 |
| event-driven-architecture | 事件驱动架构 | 技术栈 | 015 · 本地验收及 review 通过 |
| serverless | 无服务器架构 | 技术栈 | 035 · 本地验收及 review 通过 |
| container | 容器 | 技术栈 | 035 · 本地验收及 review 通过 |
| container-image | 容器镜像 | 技术栈 | 040 · 生产已发布 |
| service-discovery | 服务发现 | 技术栈 | 040 · 生产已发布 |
| observability | 可观测性 | 技术栈 | 040 · 生产已发布 |
| sast | 静态应用安全测试 | 技术栈 | 040 · 生产已发布 |
| secret-scanning | 密钥扫描 | 技术栈 | 040 · 生产已发布 |
| dependency-scanning | 依赖扫描 | 技术栈 | 040 · 生产已发布 |
| threat-modeling | 威胁建模 | 技术栈 | 040 · 生产已发布 |
| tool-approval | 工具审批 | AI·Agent | 043 · 生产已发布 |
| skill | 技能 | AI·Agent | 030 · 本地验收及 review 通过（新增词条） |
| evaluation-dataset | 评测数据集 | AI·Agent | 024 · 本地验收及 review 通过 |
| permission-boundary | 权限边界 | AI·Agent | 043 · 生产已发布 |
| xss | 跨站脚本 | 技术栈 | 040 · 生产已发布 |
