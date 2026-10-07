# VBP-096 熔断器资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 失败达到条件后暂时拒绝调用，避免持续等待与级联故障 | [Microsoft Learn · Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) | Azure 的模式说明；本文不把其 429、Cosmos DB 示例推广成通用阈值 | `breaker-definition`, `breaker-boundary` |
| Closed/Open/Half-Open 的状态转换与探针恢复 | [Martin Fowler · Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) | 作者的简化 Ruby 示例；用来解释状态含义，不作为某个框架默认配置 | `breaker-definition`, `breaker-half-open` |
| 滑动窗口、失败率阈值、最少调用数与并发边界 | [Resilience4j · CircuitBreaker](https://resilience4j.readme.io/docs/circuitbreaker) | Java 库的实现细节；特别保留“滑动窗口不等于并发限制”的限定 | `breaker-window`, `breaker-states`, `breaker-concurrency` |
| SamplingDuration、MinimumThroughput、FailureRatio 与 BreakDuration 分工 | [Polly · Circuit breaker resilience strategy](https://www.pollydocs.org/strategies/circuit-breaker.html) | .NET 策略文档；本文只采用参数职责和短路语义 | `breaker-window`, `breaker-half-open` |

## 写作和验收记录

- 读者场景：远程库存服务反复超时，调用方要判断什么时候继续请求、什么时候先保护自己。
- 首图是中央闸门、故障水位与被弹回的请求点；它表达“拒绝继续碰依赖”，不复用三节点流程图。
- 状态实验用本地状态机：故障下发送三次触发 OPEN；冷却进入 HALF-OPEN；健康探针成功才 CLOSED，失败继续 OPEN。
- 3 次失败、520ms 等时间仅为演示设定；正文明确真实阈值要按错误类型、流量和恢复时间配置。
