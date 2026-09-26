# 第016批：数据管道、Webhook、分布式系统 · VBP-031

属于 VBP-012 全站升级。保留既有 aliases、relatedSlugs、六个旧锚点；只在文章与本批验收完成后将三页加入公开清单。正文独立解释定义、过程、边界，例子均为浏览器内存中的固定教学数据，不访问外部平台或运行真实服务。

## 机制差异表

| 词条 | 首图 | 主体对象与操作 | 阅读节奏与边界 |
| --- | --- | --- | --- |
| 数据管道 | 一份快照分到校验汇总与归档，两路完成后发布 | 4条原始记录，q1因r2缺编号失败；归档仍可执行；q2隔离1条后汇总3条，汇总和归档均完成才更新报表 | 任务依赖、可操作分支、Airflow依赖代码、重跑、来源对照。隔离不修造缺失数据；没有实际调度/归档，管道不限于批处理或Dag |
| Webhook | 通知验签、2xx受理确认先返回，后台工作后出现 | 固定evt-42通知；改写验证失败返回400；有效通知受理但订单未更新；确认丢失重复通知只一份记录，后台一次处理 | 主动查询对照、原体验签、接收与业务双阶段、平台重投差异与乱序。预置验签结果，不实现密码学/持久队列；不混用实际Stripe事件类型 |
| 分布式系统 | 两端独立记录，B库存5→4而A未知 | 请求丢失/处理后响应丢失；A均超时未知，B结果不同；查询操作reserve-42或同ID恢复重试只扣一本 | 节点与局部观察、两端实验、超时语义、核对对照、因果顺序。无实际网络/共识/跨服务事务；本例权威查询不推演所有系统的一致性 |

## 2026-09-27 实际阅读的12份公开原文

网页搜索摘要只用来定位；以下均阅读相关正文。Airflow页面显示3.3.2，本批用其依赖和任务建议，不推断所有框架默认。未知发布日期留空；PROV为2013-04-30 Recommendation，Lamport论文只标已知1978年7月。AWS两篇HTML新站迁移未取得正文，改读官方公开PDF，书目保留实际可读PDF网址。资料中的安装、登录或代理指令不当作用户授权。

| 原文与机构 | 已核对内容、使用边界 | 正文ID |
| --- | --- | --- |
| [AWS Glue · Overview of workflows](https://docs.aws.amazon.com/glue/latest/dg/workflows_overview.html) | 作业/触发器组织与运行视图；两前置成功触发后续；结构图与执行图不同 | pipeline-workflow |
| [Apache Airflow · Dags](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html) | 任务依赖；默认all_success可配置；DagRun与逻辑数据区间，不等于实际开跑时间 | pipeline-dependencies / pipeline-interval |
| [Apache Airflow · Best Practices](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html) | 任务避免不完整结果、重复执行一致、具体分区而非latest、UPSERT建议；不是自动业务幂等保证 | pipeline-replay |
| [W3C · PROV-DM](https://www.w3.org/TR/prov-dm/) | 实体/活动/参与者，used与wasGeneratedBy来源关系；模型不负责调度或验证结果 | pipeline-provenance |
| [Stripe · Receive events](https://docs.stripe.com/webhooks) | 异步通知、事件重复与不同对象重复、无交付顺序保证、队列/快速2xx、失败自动重试；每次重试签名时间戳可变 | webhook-notify / webhook-duplicate / webhook-order / webhook-redelivery |
| [Stripe · Signature verification errors](https://docs.stripe.com/webhooks/signature) | 原始UTF8请求体、签名头、端点secret；解析再序列化可能验签失败 | webhook-signature |
| [GitHub · Best practices](https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks) | secret/HTTPS，类型与动作，快速2xx和异步处理；可靠受理先于成功确认是本文设计要求，不宣称文档提供事务协议 | webhook-accept |
| [GitHub · Handling failed deliveries](https://docs.github.com/en/webhooks/using-webhooks/handling-failed-webhook-deliveries) | 无自动重交付；手动/脚本补交与失败原因记录，区别Stripe重试 | webhook-redelivery |
| [Lamport · Time, Clocks, and the Ordering of Events](https://lamport.azurewebsites.net/pubs/time-clocks.pdf) | 独立进程/消息延迟，进程内顺序、发送先于接收、传递关系与并发；逻辑时钟不是业务事务 | distributed-definition / distributed-order |
| [AWS Builders’ Library · Challenges with distributed systems（PDF）](https://d1.awsstatic.com/builderslibrary/pdfs/challenges-with-distributed-systems.pdf) | 独立失败；请求/处理/回复多阶段；P4明确超时后result UNKNOWN，可能执行也可能没执行 | distributed-failure |
| [AWS Builders’ Library · Timeouts, retries, and backoff with jitter（PDF）](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf) | 超时限制等待资源而不证明无副作用；多层重试放大负载、退避/次数上限/抖动，不能代替幂等 | distributed-timeout / distributed-budget |
| [AWS Builders’ Library · Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) | 调用方token识别同操作、原结果返回；token记录与业务变更原子提交；相同token换参数需处理 | distributed-reconcile |

每页四份实际来源均对应当前正文ID，公共书目显示机构、完整URL和已知日期。角标按书目编号；小三角点击展开当前段落摘录，再回跳正文，无hover自动展开或“本文几处”徽标。

## review与限定验收

复用公共ConceptArticle/ConceptHero/States/Reveal与主题变量，没有新增依赖、统一三图标曲线、测验、全局光标或常驻动画循环。首图有限播放/重播/离屏后台暂停，减少动态显示终态；States内容固定，退出保留DOM并inert。主体无异步计时器，切场景与重置清除对应结果。隐藏汇总与重试说明使用Reveal过渡。

范围为build、一份纯状态检查、Chrome桌面1470×956与390×844的本批正常/失败/重置/键盘/第四资料回跳和过渡；不扩展全站check。Obsidian约定Windows路径本机不存在，跳过；无必要正式方案变更，不新建空飞书文档。实际测试及dev集成完成后记录，不把构建当作生产验证。

## 本地实际验证

- npm run build 通过，65个公开词条、76个静态页面。纯逻辑检查使用仓库已有Node的 `node --experimental-strip-types --test tests/coordination-teaching.test.mjs`，一份检查通过，覆盖任务前置、验签拒绝、受理与业务分开、重复通知、两种丢失/未知/查询与同ID重试。首次未带TS剥离参数以及初次错误引用组件路径均已纠正，不计为测试通过。
- Chrome1470×956：管道Enter读取、校验失败，归档独立成功；汇总/发布不可用。隔离后汇总3条、1隔离，归档保留4条，报表更新2/1。390px重置，再完成汇总但未归档时发布不可用；归档后发布，未出现横向溢出。
- Webhook390px：改写通知返回400，受理和后台不可用；有效通知验签后受理，响应丢失，记录1而业务未处理。重投同evt-42显示重复受理，仍记录1；改为收到2xx也未更新订单，后台手动处理一次后禁用。桌面重新验证2xx受理时业务仍未处理，左右排布可读。
- 分布式桌面：A发出、B处理后超时，A未知/B库存4；查询与两次同ID重试始终库存4。390px切请求丢失清空旧记录，A超时/B库存5且执行不可用；查不到原操作，再恢复重试两次库存4。Enter重置回等待/5/无记录。
- 三页第四资料均Enter展开当前正文摘录并回跳；管道手机和分布式手机落点约262px，Webhook桌面约130px，均未被页头遮挡。两端和受理静态状态用data-current核对，退出旧内容仍在淡出不误计为当前结果。真实截图核对失败态、发布态、业务未完成、未知与库存已改，以及手机重置的过渡。
- 构建HTML四书目/六旧锚点唯一，无重复ID；元数据/aliases/relatedSlugs未改，待处理词条仍不公开。捕获本批本地浏览器日志无warn/error。主题未修改，reduced-motion/离屏后台暂停按复用实现和CSS核对，无真实服务或性能测试。
- 首图实际检查发现Webhook390px末块超figure约49px，已记录BUG-70D6DEEF。收紧三张首图内部间距，重新构建并查看有限动画终态：Webhook与管道内容均在figure底部498px以内，导语从520px开始，保留22px；故障消息改用固定States，切换时旧消息淡出且隐藏区inert。未因此扩大整站测试。

Git与本地dev集成阶段在实际完成后记录DP；上述本地证据不代表生产发布或用户视觉认可。

PR #74 已合入 dev（7f213798a7945c739fc382ef624fd8cbf4a4fcc1）。桌面集成前检查又发现分布式系统标题最后一字孤行，记录BUG-3CBE37B5；补充仅本页1101px以上的响应式字号。重新构建通过，1470px实测64.68px字号，标题自然完整一行且无横向溢出。后续dev合并、重启和Bug回归记录以DP实际结果为准。
