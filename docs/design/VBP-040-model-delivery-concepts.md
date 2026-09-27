# 第025批：模型路由、备用模型与提示缓存 · VBP-040

VBP-012 的三个既有词条；顾毅盛负责研究、设计、实现、review 与本地 dev 集成。保留别名、分类、关系和六个旧锚点。不含 main、生产或远端 dev 部署。

## 资料、论点与范围

每篇四份实际阅读的公开原始资料。只声明读过与论点有关的章节，不声称通读长论文。搜索摘要不计入；打不开的 Portkey 旧文档和重定向后无正文的 AWS Builders Library 没有计入。替换为实际读到的官方归档 cookbook 与 AWS Prescriptive Guidance。日期未知留空。正文自己解释，来源网址、作者或机构和摘录回跳保留。

| 页面 / 已读来源 | 实际阅读范围 | 正文锚点 / 限定 |
| --- | --- | --- |
| 路由 · [RouteLLM](https://arxiv.org/pdf/2406.18665) | PDF0–170：偏好数据、强弱模型、成本质量、请求前选择、概率阈值；ICLR2025版本 | routing-definition：请求前学习选择是其中一种机制；本例分数门槛不冒称论文 win-probability 算法 |
| 路由 · [Bedrock Prompt Routing](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-routing.html) | 50–107：请求分析、质量预测、专门任务范围与质量基准 fallback 含义 | routing-estimate / routing-names：预测不是单题保证；不同文档名词需按具体定义理解 |
| 路由 · [FrugalGPT](https://arxiv.org/pdf/2305.05176) | PDF0–186、252–261、737–747：级联、回答评估、训练/测试分布条件；2023稿 | routing-cascade：依次生成与检查，不能把所有模型分配都限定在首次请求前；不套用论文最高节省比例 |
| 路由 · [LiteLLM Routing](https://docs.litellm.ai/docs/routing) | 500–550：least-busy依据未完成调用数，自定义策略 | routing-load：负载选择与任务质量选择不同 |
| 备用 · [LiteLLM Basic Reliability](https://docs.litellm.ai/docs/routing) | 895–999：部署优先级、同组/跨组接替、尝试上限 | fallback-definition：备用可以是同模型的另一部署，非总是弱模型 |
| 备用 · [RFC6585](https://www.rfc-editor.org/rfc/rfc6585#section-4) | 176–209：429限流及可选Retry-After | fallback-errors：收到429与没有收到响应不同，不制造固定等待秒数 |
| 备用 · [Portkey archived cookbook](https://github.com/Portkey-AI/portkey-cookbook/blob/main/ai-gateway/how-to-setup-fallback-from-openai-to-azure-openai.md) | 193–229、290–319：有序targets与on_status_codes；仓库归档状态已读 | fallback-policy：指定切换条件；历史配置机制，不当当前SDK指南或可靠性排序 |
| 备用 · [AWS Retry with backoff](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html) | 8–41：瞬态错误、限制次数、负载、非瞬态快速失败、幂等性 | fallback-bounds：调用预算及副作用；备用是本文对相同重复执行风险的应用 |
| 缓存 · [OpenAI Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) | 873–889：完整前缀、KV中间状态、继续处理新请求并生成新回复 | pcache-definition：复用输入计算，不返回旧答案；未写模型名/价格/TTL常数 |
| 缓存 · [vLLM Automatic Prefix Caching](https://docs.vllm.ai/en/latest/design/prefix_caching/) | 4046–4063：按块复用，自身tokens与此前前缀组成标识，完整块 | pcache-prefix：前部改动影响后继；教学逻辑段不是实际token块 |
| 缓存 · [Anthropic Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | 102–128、318–329、443–461：完整前缀/边界/一致匹配、隔离、有效期、稳定前缀编排 | pcache-conditions：条件属于厂商实现；不借缓存保留过时资料 |
| 缓存 · [SGLang / NeurIPS2024](https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf) | PDF0–37、204–228、338–348：RadixAttention、KV前缀树与LRU淘汰 | pcache-eviction：内存有限会淘汰；不把吞吐倍数当本站测量 |

读取行号是本次工具定位，不是永久引用定位。无外部模型调用、实时测速、用户文件访问或虚构真实性能。

## 机制差异与状态合同

| 页面 | 首图 | 核心操作 / 可见证据 | 编排 |
| --- | --- | --- | --- |
| 模型路由 | 一个请求分向两候选，合格后选择费用较低的A | 改任务/离线门槛/B可用性，候选显示排除原因与选中通道；无候选停止，选中仍未调用 | 定义 → 双候选筛选 → 错位的两类时序 → 实际服务与负载 |
| 备用模型 | 主调用429后才出现错位的第二张响应 | 手动执行主调用，检查错误策略/兼容/总预算，再允许备用；两份收据呈现次数，错误字段未完成 | 接替定义 → 调用收据 → 两类策略 → 预算/幂等与结果 |
| 提示缓存 | 两次输入两条带，共享前缀亮起、末尾问题不同 | 首次保存前三段；下一次前缀逐段连续比较，复用与重新计算分开；回答根据当前固定情境生成 | 计算与回答对照 → 前缀实验 → 实现条件 → 淘汰与测量 |

路由A/B为虚构模型，提取96/97、分析76/92、图片A不支持/B94，费用1/3单位。它们是离线教学摘要，不保证单题正确；98门槛没有候选。本例用90/95/98三种门槛，不把此规则说成任何厂商算法。

备用任务只生成amount=120的JSON，无付款等外部动作。本例401停止，429/超时允许核查备用；这不是所有网关的默认行为。总尝试1/2包含主调用；无备用/结构能力不足不调用。错误字段total=120虽有回复仍不通过。主收据与备用收据使用独立结果快照；输入改动关闭两层，不在退出期间把旧响应换成新输入的响应。

提示缓存固定首次三段与第四问题，逻辑段非token块。改末尾复用3，第二段复用1，首段/换模型/缓存失效复用0；不跨改动跳过复用。只展示首次缓存读取，本轮不自动写回新前缀，也不模拟厂商TTL或支持手动删除API；重置仅清除本地演示状态。

复用ConceptArticle/Citation/Aside、ConceptHero、Reveal/States及主题变量；首图有限一次、离屏/后台暂停、重播、减少动态稳定终态。无新依赖、帧循环、通用工厂。执行才更新报告，输入只关闭结果；隐藏层inert/aria-hidden，保留退出快照。正文独立解释定义、因果与边界，删除旧五帧测验而不删必要解释。

## Review 与验收记录

一份组合模型检查已通过，覆盖三候选条件与无候选、主成功/401/上限/无备用/不兼容停止、备用错误字段、连续前缀3/1/0及变化的新回答。npm run build通过，103静态页面、92公开词条。后续真实浏览器与dev集成按实际观察补记，不把构建等同运行时验收。

内容与交互review补充：将备用条件明确为支持所需结构化输出，避免误解为任何文本模型都不能写JSON；Bedrock质量基准fallback的补充段落也加同源角标。新执行主调用时创建新的收据容器，防止上一轮备用收据的退出动画混进新一轮主报告；改变输入时仍保留旧报告完整淡出。此处为实现review调整，不把未观察到的假设问题虚报成产品Bug。


## 真实浏览器验收

| 操作 | 实际观察 |
| --- | --- |
| 路由正常/停止 | 提取选A（96/97、费用1/3）；分析选B（76/92）；图片排除A选B（94）；B关闭则无候选；门槛98两者排除，不制造执行。重置Enter恢复默认选择 |
| 备用调用顺序 | 主429先只有第1次收据，备用层closed/inert；执行备用才出现amount=120及共2次，字段通过。主成功不切换；401禁用备用；上限1、不支持结构化输出、无备用均停在1次。超时没有HTTP状态码，备用total=120仍未完成 |
| 输入失效/快速执行 | 路由关闭时opacity1且inert、旧选择A快照仍完整。备用输入改变时两层opacity约0.77/0.73且inert；新执行主调用后旧备用层opacity0、不混入新轮。缓存关闭约0.76且inert、旧3段报告保留；重新执行才更新1/0段 |
| 缓存前置与分支 | 未保存时下一次按钮禁用；先保存后改问题复用3/重新算1，回答费用未知；改第二段复用1/重新算3，回答五日；改首段复用0/重新算4，英文回答三日。换模型、失效都复用0。重置清空保存且恢复默认，两个步骤Enter可执行 |
| 桌面1470×762 / 手机390×844 | 实际截图已看：路由双候选可读，备用错位两收据手机回到同宽，缓存计算四格手机两列。三页手机document390px/lab342px，无横向溢出；18个旧锚点DOM存在 |
| 参考资料 | 三页第四条三角真实展开当前正文摘录，再点击回到#routing-load（桌面top130）/#fallback-bounds/#pcache-eviction（手机top约262）；均在固定页头下。12条书目、13目标映射检查通过；新增Bedrock折叠段引用也实际回跳#routing-names，details自动打开、top130；来源机构/全文网址保留 |
| 首图/性能 | 路由/备用重播并观察全部有限动画iteration1且终态opacity1，真实首屏截图可读。缓存重播全部有限iteration1，终态opacity1；实际首屏截图显示共享三段与新问题并列可读。共享离屏/后台暂停及reduced-motion已review，未改变用户OS设置。localhost:3001 warn/error日志为空 |

内容与状态review修正后再次build通过，103静态页/92公开词条。模型组合检查通过一次；字符串措辞与UI快照更新未改变模型规则，不重复扩大测试。没有确认的产品Bug；不把瞬间仍在合法退出的DOM内容虚报为可见错误。没有全站回归或虚构远端集成通过。

累计83页新流程、9页历史基准，共92公开、209待处理；早期/历史页仍需最终四来源复核。Windows Obsidian库在本机不存在，跳过；无空飞书文档。dev集成、最终DP状态、本地部署和回滚以实际对象补记。


## 集成入口

实现提交 `74f26ff202b3e3743b290d1e30fe153d9df71c0f`。PR [#84](https://github.com/Gyschuaner/VibePolaris/pull/84) 目标dev，已关联当前任务；此处记录本地验收完成，最终合并、重启核心复查与DP状态按实际结果补记。集成前dev/备份为 `8711b38e996167300546e71ee04eb1e780f7ab1e`；回滚入口PR84 revert后构建重启。部署范围仅localhost:3001，无远端dev与生产。


## 已核实的 dev 集成闭环

PR84于2026-09-27T02:00:17Z合并dev，提交 `1dc5c83ff89545a65584e35fd24c53fe77b82bb3`，本地工作区干净。功能分支已删除；合并树与已验收功能树一致。重启本地生产预览Ready70ms后，三页默认核心流程再次实际通过。VBP-040已核实ready_for_release/version6，研发任务done/version3；计划aa6fab41-2d7c-43c5-ac28-fe8cf4cbbb6d已completed，3/3passed。

本地部署4c273c8c-02b7-471d-a194-2154186dff2c（local-dev-20260927-vbp040-1dc5c83）关联VBP-040与VBP-012，环境dev/状态released仅指localhost:3001预览。没有远端dev或生产部署。备份/回滚基线8711b38e996167300546e71ee04eb1e780f7ab1e；必要时PR84 revert再构建重启。此记录依据真实DP/Git结果，在下一功能分支附带更新，未用未发生阶段补写完成。
