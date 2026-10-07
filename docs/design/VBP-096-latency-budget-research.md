# VBP-096 延迟预算资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 端到端目标要从用户和业务结果出发，再拆成可观察的阶段份额 | [Google SRE · Handling overload](https://sre.google/sre-book/handling-overload/)、[Google Cloud · Performance optimization](https://cloud.google.com/architecture/framework/performance-optimization) | SRE 文档用于解释过载、排队与延迟；Google Cloud 文档用于解释目标、测量、优化循环，不把示例 800ms 写成通用 SLO | `latency-budget-definition`, `latency-budget-breakdown` |
| HTTP 请求可以按客户端、服务端和阶段测量，分布比单次平均值更能暴露尾部 | [OpenTelemetry · HTTP metrics](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/)、[Google SRE · Handling overload](https://sre.google/sre-book/handling-overload/) | OpenTelemetry 语义约定提供测量字段；本文只用它说明“分段测量”的方法，不声称所有链路自动得到同一口径 | `latency-budget-breakdown`, `latency-budget-tail` |
| 分层超时和重试会放大下游工作，退避与抖动用于避免同时重试造成额外冲击 | [AWS Builders’ Library · Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) | AWS 的客户端/服务架构经验；正文保留“需要按错误类型、层级和容量设计”的限定 | `latency-budget-retry`, `latency-budget-boundary` |
| 超预算后的优化、并行、降级或改变交付目标是明确取舍，不是用加载动画遮住等待 | [Google Cloud · Performance optimization](https://cloud.google.com/architecture/framework/performance-optimization)、[AWS Builders’ Library · Timeouts](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) | “先给首字”是页面教学选择；它改变感知目标，不会改变完整结果的真实总时长 | `latency-budget-tradeoff`, `latency-budget-boundary` |

## 写作和验收记录

- 读者场景：用户等待一次完整答案，团队只知道“慢”，需要把固定网络段和可变模型段放回同一张 800ms 时间账。
- 首图不用横向流程箭头，做成固定预算刻度和可伸缩的时间条；模型段从 280ms 变 560ms 时，红色超支越过 800ms 刻度，并出现取舍便签。
- 实验只改变模型时长和交付目标：快模型完整结果在预算内；慢模型完整结果超支；“先给首字”只改变感知目标，仍显示完整结果 850ms。
- 570ms、850ms、800ms 是教学数字，不代表任何真实服务的 SLA；页面要求用真实采样分布和尾延迟继续验证。
