# VibePolaris 术语候选池调研与首批内容建议

- DP 需求：VBP-001
- DP 研发任务：`27d3f339-3145-443e-bfb6-61b000ded1d0`
- 调研日期：2026-08-30
- 本次范围：候选收集、去重、分类、分级与内容样稿；不直接批量写入正式词表

## 结论

本轮整理出 **568 个不重复词条**，其中现有词条 39 个、新候选 529 个，覆盖 9 个研究分类和 36 组官方或权威一手来源。另从新候选中挑出 **72 个首批内容样稿**，已按 VibePolaris 当前字段写好中英文名、slug、大白话解释和搜索别名，但暂未并入 `content/zh/terms.json`。

建议不要一次上线数百条。数量多可以解决选题焦虑，但会迅速制造同义词冲突、浅条目和页面噪声。更合适的节奏是：保留完整候选池，每轮从中选 20～30 条，先补用户最常遇到、最容易说不清的概念，再逐步补边界词和深水词。

## 分类方式

研究侧使用 9 类，是为了编辑、检索和规划；首页仍可保持当前 6 类，不需要因为候选池变大就增加 9 个入口。

| 研究分类 | 数量 | 适合映射到首页 |
| --- | ---: | --- |
| 前端与 Web 平台 | 70 | 前端 |
| 后端与 API | 57 | 后端 |
| 数据与存储 | 52 | 后端 |
| AI·Agent | 77 | AI·Agent |
| 语言、技术栈与工程化 | 55 | 技术栈 |
| Git、协作与交付 | 48 | Git |
| 架构、云原生与运维 | 75 | 技术栈 |
| 测试、质量与安全 | 58 | 技术栈；个别安全词也可归后端 |
| 产品、设计与体验 | 76 | 产品与设计 |

这样做的好处是：首页结构稳定，内容侧可以继续增删子类；将来若某一类增长明显，再决定是否升为首页一级分类。

## 分级规则

候选池中的优先级是编辑价值，不等于一次上线数量。

| 优先级 | 数量 | 判断标准 |
| --- | ---: | --- |
| P0 | 270 | Vibe Coder 高频遇到，能直接帮助描述需求、看懂报错或作出选择 |
| P1 | 225 | 能补足概念边界，但通常要在已有基础词之后阅读 |
| P2 | 73 | 准确且有价值，但较偏底层、架构或专项实践，先作为储备 |

真正建议首轮审稿的是单独的 72 条样稿，而不是把 270 条 P0 一次发布。72 条中：前端 12、后端与数据 18、AI·Agent 12、技术栈与质量 19、Git 6、产品与设计 5。

## 首批建议的内容结构

首批新增可拆成三轮，每轮 24 条：

1. **先补“每天会碰到的词”。** 例如 JavaScript、Flexbox、请求、响应、状态码、JSON、SQL、索引、上下文窗口、结构化输出、环境变量、Pull Request。
2. **再补“选型和排错词”。** 例如 CSR / SSR / SSG、会话 / JWT、数据库迁移、幻觉、评测、打包器、容器、CDN、回归测试。
3. **最后补“工作方法和产品表达”。** 例如人在回路、持续集成、基础设施即代码、视觉回归测试、用户故事、验收标准、设计令牌、空状态。

这一顺序有意把专业领域打散，让每轮都能同时扩充几张星图，而不是某一个技术分类突然变得很密。

## VibePolaris 写作口径

样稿遵循以下约束：

- 先回答“它帮我解决什么”，再解释实现方式。
- 一句话只讲一个边界，不堆优点、历史和术语。
- 中文名用于识别，英文名用于搜索和与 AI 沟通。
- 别名优先收用户真的会说的话，例如“代码打架”“接口返回”“手机适配”，不是再抄一遍定义。
- 不把品牌或具体产品大量混进术语词典；工具名更适合工具导航，只有形成通用技术语境的名称才进入候选池。
- 对容易混淆的概念拆开写，例如认证 / 授权、请求 / 响应、CSR / SSR / SSG、镜像 / 容器。
- 对过时或正在迁移的概念标记审校风险。例如 Kubernetes 官方已建议新项目优先了解 Gateway，而不是把 Ingress 当作持续演进的新入口。

## 需要二次人工审校的区域

以下内容不应直接自动上站：

- AI 模型参数、能力和 API 名称更新快，应在发布前按具体提供商再次核对。
- 框架特有词容易被写成通用概念，例如 Server Component、Hydration、ISR，需要明确适用范围。
- 安全词必须避免“照着做就安全”的错觉，详情页应给边界和风险提示。
- P2 架构词如果没有具体场景，会显得像面试题；没有可用的大白话例子时宁可暂缓。
- 产品设计词需要避免抽象管理话术，必须能落回页面、流程或验收行为。

## 交付文件

- `docs/research/VBP-001-glossary-candidates-2026-08-30.csv`：568 条完整候选池，可筛选分类、子类、优先级、状态和来源。
- `docs/research/VBP-001-glossary-shortlist-2026-08-30.json`：72 条未入库的 VibePolaris 风格样稿，字段与当前词表兼容。
- `docs/research/VBP-001-glossary-research-2026-08-30.md`：调研结论、分类策略、分批建议和来源说明。

## 主要来源

以下来源用于建立术语边界和词族，不是把原文直接改写后批量发布。

| key | 一手来源 |
| --- | --- |
| MDN | [MDN Web Glossary](https://developer.mozilla.org/en-US/docs/Glossary) |
| REACT | [React Learn](https://react.dev/learn) 与 [React Hooks](https://react.dev/reference/react/hooks) |
| TS | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) |
| NEXT | [Next.js App Router Glossary](https://nextjs.org/docs/app/glossary) |
| NODE | [Node.js API Index](https://nodejs.org/api/) |
| NPM | [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) |
| RFC_HTTP | [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) 与 [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) |
| OAS | [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) |
| GRAPHQL | [GraphQL Learn](https://graphql.org/learn/) |
| GRPC | [gRPC Core Concepts](https://grpc.io/docs/what-is-grpc/core-concepts/) |
| OIDC | [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0-18.html) |
| POSTGRES | [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) |
| REDIS | [Redis Data Types](https://redis.io/docs/latest/develop/data-types/) 与 [Redis Use Cases](https://redis.io/docs/latest/develop/use-cases/) |
| OPENAI | [OpenAI API Documentation](https://developers.openai.com/api/docs/) |
| ANTHROPIC | [Claude Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) |
| GEMINI | [Gemini Structured Output](https://ai.google.dev/gemini-api/docs/structured-output) 与 [Context Caching](https://ai.google.dev/gemini-api/docs/caching) |
| MCP | [Model Context Protocol Architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture) 与 [Server Primitives](https://modelcontextprotocol.io/specification/2025-06-18/server/index) |
| PYTHON | [Python Glossary](https://docs.python.org/3/glossary.html) |
| GIT | [Git Reference](https://git-scm.com/docs) |
| GITHUB | [GitHub Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) |
| GHA | [GitHub Actions Workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows) |
| DOCKER | [Docker: What is an Image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/) |
| K8S | [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) |
| TERRAFORM | [Terraform Glossary](https://developer.hashicorp.com/terraform/docs/glossary) |
| AWS_WAF | [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) |
| AWS_LAMBDA | [AWS Lambda Execution Environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) |
| VERCEL | [Vercel Documentation](https://vercel.com/docs) |
| OTEL | [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) |
| PLAYWRIGHT | [Playwright Locators](https://playwright.dev/docs/locators)、[Assertions](https://playwright.dev/docs/test-assertions) 与 [Fixtures](https://playwright.dev/docs/test-fixtures) |
| VITEST | [Vitest Features](https://vitest.dev/guide/features)、[Snapshots](https://vitest.dev/guide/snapshot.html) 与 [Coverage](https://vitest.dev/guide/coverage.html) |
| OWASP | [OWASP Top 10:2025](https://owasp.org/Top10/) |
| W3C_WAI | [WAI-ARIA Overview](https://www.w3.org/WAI/standards-guidelines/aria/) |
| WEBDEV | [Web Vitals](https://web.dev/articles/vitals) |
| FIGMA | [Figma Variables](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)、[Variants](https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants) 与 [Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) |
| MATERIAL | [Material Design Interaction States](https://m3.material.io/foundations/interaction/states/overview) |
| PRODUCT | VibePolaris 当前 PRD 与站点既有内容口径；发布前再按具体产品方法来源复核 |

## 后续建议

下一步不应继续无上限扩词，而应先评审 72 条样稿：删掉不符合产品定位的词、调整分类映射，并选出第一轮 24 条。确认后再把选中条目补齐准确定义、可复制 Prompt 和关联词，最后才写入正式词表。
