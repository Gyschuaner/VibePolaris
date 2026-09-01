# VibePolaris 千词术语底库调研与内容分级

- DP 需求：VBP-001
- 第一轮任务：`27d3f339-3145-443e-bfb6-61b000ded1d0`
- 千词扩展任务：`6f5d4aca-c1f4-44e0-be70-54192b0810d4`
- 调研日期：2026-08-30
- 本次范围：候选收集、术语归一、全局去重、分类分级、首页领域映射与首批样稿；不直接批量写入正式词表

## 结论

候选底库已从第一轮的 568 条扩充到 **1,192 个不重复词条**：其中现有正式词条 39 个、新候选 1,153 个，覆盖 **13 个研究分类、229 个子类和 48 组官方或一手来源**。

本次新增文件先整理出 667 条候选，经与上一版逐项比对，剔除 43 条同名、同英文名或同 slug 的碰撞，最终净新增 **624 条**。完整底库中 slug、中文主名和英文主名均无重复。

数量达到千条后，产品重点不应继续追求数字，而应转向“哪些值得写、先写什么、怎样互相连接”。因此这 1,192 条被当作编辑底库，而不是上线清单；原有 72 条 VibePolaris 风格样稿继续作为首批审稿对象。

## 分类总览

研究侧使用 13 类，首页仍保持技术领域入口，不因底库扩大而堆出 13 个导航项。

| 研究分类 | 数量 | 首页领域建议 | 说明 |
| --- | ---: | --- | --- |
| 前端与 Web 平台 | 70 | 前端 | 浏览器、HTML/CSS、框架和页面运行机制 |
| 后端与 API | 57 | 后端 | 服务端、接口、认证和请求处理 |
| 数据与存储 | 52 | 后端 | 数据库、缓存、索引和存储模型 |
| AI·Agent | 158 | AI·Agent | 模型、提示词、上下文、工具、MCP、评测和安全 |
| 语言、技术栈与工程化 | 55 | 技术栈 | 语言、依赖、构建与本地开发 |
| 编程基础与计算机概念 | 84 | 技术栈 | 程序构成、数据结构、算法、运行时和异步基础 |
| Git、协作与交付 | 48 | Git | 版本控制、协作、CI/CD 和发布流程 |
| 架构、云原生与运维 | 153 | 技术栈 | 分布式系统、Kubernetes、韧性、可观测性和 SRE |
| 网络与协议 | 86 | 后端 | TCP/UDP/QUIC、HTTP、URI、DNS、代理和加密 |
| 移动端与跨平台 | 62 | 前端 / 技术栈 | 应用形态、设备适配、手势、生命周期和发布 |
| 数据工程与分析 | 74 | 后端 | 管道、流处理、数仓建模、格式和产品分析 |
| 测试、质量与安全 | 132 | 技术栈 | 测试方法、自动化、缺陷、安全控制和 Web 风险 |
| 产品、设计与体验 | 161 | 产品与设计 | UI 模式、交互状态、流程、设计原则和无障碍 |

首页领域只是浏览入口；研究分类用于编辑和关系建模。一个词可以在详情页通过关系连接到其他领域，不需要为了跨领域而复制一条同名记录。

## 本次净新增

| 新增方向 | 净新增 | 重点覆盖 |
| --- | ---: | --- |
| 编程基础与计算机概念 | 84 | 函数、作用域、对象模型、数据结构、算法、异步与运行时 |
| 网络与协议 | 86 | IP、TCP/UDP/QUIC、HTTP 版本、URI、DNS、代理与证书 |
| 移动端与跨平台 | 62 | 原生/混合/WebView、适配、手势、生命周期、权限和发布 |
| 数据工程与分析 | 74 | 数据管道、Kafka 事件流、Spark 流处理、数仓和指标分析 |
| AI·Agent | 81 | 生成控制、上下文工程、工具执行、智能体架构、MCP 与评测 |
| 架构、云原生与运维 | 78 | 分布式模式、Kubernetes 工作负载、遥测和 SRE |
| 测试、质量与安全 | 74 | ASVS 安全控制、常见攻击、扫描、测试设计和缺陷管理 |
| 产品、设计与体验 | 85 | WAI-ARIA 模式、移动组件、表单体验、设计原则与无障碍 |
| **合计** | **624** | 已排除 43 条与上一版碰撞的候选 |

## 分级规则

| 优先级 | 数量 | 编辑含义 |
| --- | ---: | --- |
| P0 | 532 | 高频出现，能直接帮助描述需求、看懂报错或作出选择 |
| P1 | 522 | 用于补足边界、建立关联，适合在基础词之后阅读 |
| P2 | 138 | 偏底层、专项或进阶实践，保留为深水区储备 |

P0 不是“一次全部上线”。建议继续按每轮 20～30 条审稿和发布，避免页面噪声、浅定义和术语间关系缺失。

## 推荐的内容建设顺序

1. **生活化高频词**：请求、响应、状态码、变量、函数、JSON、SQL、组件、按钮、表单、Token、上下文。
2. **选型与排错词**：CSR/SSR/SSG、缓存、索引、会话/JWT、重试、限流、日志、追踪、测试与常见安全风险。
3. **Agent 工作词**：结构化输出、工具架构、工具审批、上下文工程、评测数据集、评分规则、MCP 客户端/服务器。
4. **系统性词族**：网络协议、数据工程、云原生、移动端发布、无障碍与产品分析。

每一轮应跨 3～5 个首页领域选词，让星图持续变密但不让某一张图突然拥挤。

## 术语整理原则

- **收概念，不收目录。** 不把所有 HTML 标签、CSS 属性、HTTP 状态码或 Kubernetes 对象机械搬进来。
- **收通用语义，不追版本名。** 具体模型、框架小版本和短期 API 名称只在确实形成通用语境时保留。
- **一词一个主身份。** 中文主名、英文主名和 slug 全局唯一；同义说法留给 aliases，不复制页面。
- **研究分类与首页分类分离。** 内容侧可以细分，导航侧继续保持极简。
- **先回答它解决什么。** 详情页先用大白话解释场景，再补边界、易混淆词、例子和 Prompt。
- **高风险词必须复核。** 安全、AI 能力、移动端发布和协议演进内容在正式发布前重新核对官方文档。

## 编辑字段建议

当前候选 CSV 已能支持选题，但正式内容流程建议增加以下编辑字段：

| 字段 | 用途 |
| --- | --- |
| `homepage_category` | 映射到前端、后端、AI·Agent、技术栈、Git、产品与设计 |
| `aliases` | 保存搜索别名、中文口语和常见缩写 |
| `related_slugs` | 连接星图关系，避免只靠分类形成孤岛 |
| `confused_with` | 明确容易混淆的概念，例如 URL/URI、认证/授权 |
| `review_risk` | 标注安全、时效、框架特有或容易过时的内容 |
| `source_url` | 发布时记录最终核对的一手来源，而不是只保留来源族 key |

## 需要二次人工审校的区域

- AI 模型能力、参数和 API 名称更新快，正式发布前按具体提供商再次核对。
- Web 与框架特有词容易被误写成通用概念，需要说明适用范围。
- 安全词不能写成“照着做就安全”，详情页需补威胁边界和风险提示。
- 移动端签名、权限和发布词在 Android/iOS 上含义不同，不能合并成模糊定义。
- P2 架构词如果没有具体场景会像面试题；没有大白话例子时暂缓上线。
- 产品设计词必须落回页面、交互或验收行为，避免抽象管理话术。

## 交付文件

- `docs/research/VBP-001-glossary-candidates-2026-08-30.csv`：1,192 条完整候选底库。
- `docs/research/VBP-001-glossary-expansion-2026-08-30.csv`：本次通过去重后的 624 条净新增，便于单独评审。
- `docs/research/VBP-001-glossary-shortlist-2026-08-30.json`：72 条未入库的 VibePolaris 风格首批样稿，字段与当前词表兼容。
- `docs/research/VBP-001-glossary-research-2026-08-30.md`：分类、分级、来源和后续内容策略。

## 主要来源

来源用于建立词族和术语边界，不代表把原文批量改写后直接发布。

| key | 一手来源 |
| --- | --- |
| WHATWG | [HTML Living Standard](https://html.spec.whatwg.org/) |
| MDN | [MDN Web Glossary](https://developer.mozilla.org/en-US/docs/Glossary) |
| ECMASCRIPT | [ECMAScript Language Specification](https://tc39.es/ecma262/) |
| REACT | [React Learn](https://react.dev/learn) 与 [React Hooks](https://react.dev/reference/react/hooks) |
| TS | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) |
| NEXT | [Next.js App Router Glossary](https://nextjs.org/docs/app/glossary) |
| NODE | [Node.js API Index](https://nodejs.org/api/) |
| NPM | [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) |
| RFC_HTTP | [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) 与 [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) |
| RFC_URI | [RFC 3986: URI Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986.html) |
| RFC_TRANSPORT | [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html)、[RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000.html) 与 [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114.html) |
| OAS | [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) |
| GRAPHQL | [GraphQL Learn](https://graphql.org/learn/) |
| GRPC | [gRPC Core Concepts](https://grpc.io/docs/what-is-grpc/core-concepts/) |
| OIDC | [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0-18.html) |
| POSTGRES | [PostgreSQL Documentation](https://www.postgresql.org/docs/current/) |
| REDIS | [Redis Data Types](https://redis.io/docs/latest/develop/data-types/) 与 [Redis Use Cases](https://redis.io/docs/latest/develop/use-cases/) |
| KAFKA | [Apache Kafka Documentation](https://kafka.apache.org/documentation/) |
| SPARK | [Spark SQL and DataFrames](https://spark.apache.org/docs/latest/sql-programming-guide) 与 [Structured Streaming](https://spark.apache.org/docs/latest/streaming/) |
| OPENAI | [OpenAI API Documentation](https://developers.openai.com/api/docs/) |
| ANTHROPIC | [Claude Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) |
| GEMINI | [Gemini Structured Output](https://ai.google.dev/gemini-api/docs/structured-output) 与 [Context Caching](https://ai.google.dev/gemini-api/docs/caching) |
| MCP | [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/) |
| PYTHON | [Python Glossary](https://docs.python.org/3/glossary.html) |
| ANDROID | [Android Application Fundamentals](https://developer.android.com/guide/components/fundamentals) 与 [App Architecture](https://developer.android.com/topic/architecture) |
| APPLE_HIG | [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) |
| FLUTTER | [Flutter Documentation](https://docs.flutter.dev/) |
| GIT | [Git Reference](https://git-scm.com/docs) |
| GITHUB | [GitHub Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) |
| GHA | [GitHub Actions Workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows) |
| DOCKER | [Docker: What is an Image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/) |
| K8S | [Kubernetes Glossary](https://kubernetes.io/docs/reference/glossary/) 与 [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) |
| CNCF | [CNCF Cloud Native Glossary](https://glossary.cncf.io/) |
| TERRAFORM | [Terraform Glossary](https://developer.hashicorp.com/terraform/docs/glossary) |
| AWS_WAF | [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) |
| AWS_LAMBDA | [AWS Lambda Execution Environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) |
| VERCEL | [Vercel Documentation](https://vercel.com/docs) |
| OTEL | [OpenTelemetry Concepts](https://opentelemetry.io/docs/concepts/) |
| PLAYWRIGHT | [Playwright Documentation](https://playwright.dev/docs/intro) |
| VITEST | [Vitest Guide](https://vitest.dev/guide/) |
| OWASP | [OWASP Top 10:2025](https://owasp.org/Top10/) |
| OWASP_ASVS | [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) |
| W3C_WAI | [WAI-ARIA Overview](https://www.w3.org/WAI/standards-guidelines/aria/) |
| WAI_APG | [WAI-ARIA Authoring Practices Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) |
| WEBDEV | [Web Vitals](https://web.dev/articles/vitals) |
| FIGMA | [Figma Variables](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)、[Variants](https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants) 与 [Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) |
| MATERIAL | [Material Design](https://m3.material.io/) |
| PRODUCT | VibePolaris 当前 PRD 与既有产品口径；发布前按具体方法来源复核 |

## 正式词库进展（2026-08-31，第一版已退回重构）

本轮从候选池中整理出 260 条 P0 / P1 核心概念，与已有 40 条合并为 300 条正式词库。新增内容按三个文件维护：

- `frontend-product.json`：87 条，覆盖前端、移动端、Git 和产品设计。
- `backend-data.json`：87 条，覆盖后端、数据、网络、测试和安全。
- `ai-stack.json`：86 条，覆盖 AI、Agent、编程基础、工程化和云原生。

每条新增内容已经具备问题、定义、边界、三步演示、知识检查、项目检查和 2～4 条关联概念，但这套批量结构在评审中被退回：300 条词被压进八种可复用模型，画面只替换文字，不能表现各概念自己的机制。

字段、分类、slug、中文名和关联引用检查仍然有效；内容深度、动画差异化和逐页视觉验收不算完成。当前重构改为“一词一研究卡、一词一分镜、一词一验收”，旧三步演示只作为迁移基线，不再作为完成标准。

第一张标杆页是 `Component`：用一份 `UserCard` 定义、三组 props、三个实例和一次同步修改构成四段专属分镜。它的动画签名、边界说明与权威来源记录在 `content/zh/term-research/base.json` 和 `docs/design/term-component-storyboard.md`。

## 下一步建议

1. 后续新增词条继续从 1,192 条候选池筛选，每批先做关系校验和内容审校，再进入正式词库。
2. 为核心词条补充权威学习资源和深度教程，优先处理前端基础、后端请求链路与 Agent 安全。
3. 结合真实搜索词调整别名，避免只按技术人员常用叫法维护索引。
4. 定期抽查动画是否解释了概念变化；如果三步内容只能复述定义，应改成静态图或重新设计过程。
