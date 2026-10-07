# VBP-096 数据契约资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| OpenAPI 让人和工具在没有读源码时理解 HTTP API；JSON Schema 用 properties、类型和 required 描述并验证对象形状 | [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)；[Understanding JSON Schema · object](https://json-schema.org/understanding-json-schema/reference/object) | OpenAPI 是接口描述规范，JSON Schema 是结构验证规则；不把结构验证扩展成业务正确性 | `data-contract-definition`, `data-contract-boundary` |
| 消费者驱动契约从真实交互期待出发，并可在提供者侧验证 | [Pact Introduction](https://docs.pact.io/) | Pact 的具体流程是契约测试；本文用它解释消费者依赖，不把 Pact 当作所有数据平台的唯一实现 | `data-contract-consumer`, `data-contract-migration`, `data-contract-boundary` |
| 兼容性检查必须对比旧基线；字段类型、删除定义等变化可能破坏生成代码或 wire 数据 | [Buf · Detecting breaking changes](https://buf.build/docs/breaking/) | Buf 针对 Protobuf，并区分 FILE、PACKAGE、WIRE_JSON、WIRE；正文明确其适用层级 | `data-contract-breaking`, `data-contract-migration` |

## 写作和验收记录

- 读者场景：订单事件的生产者想把 `email` 改成 `user_id`，下游却仍按旧字段读取。
- 首图用“消费者依赖卡 + 契约字段槽 + 变化卡”的锁定/增量/阻断/迁移四阶段，变化卡会在新增可选字段、直接改名和双写迁移之间切换，不复用横向流程图。
- 交互实验只在本地判断三种变更：新增可选字段放行；改名或改类型阻断；改名但保留旧字段时标成迁移通过。
- `email:string`、`locale?`、`user_id` 和检查结果是教学样例，不代表任何真实服务 schema；页面明确了类型相同仍可能语义不同。
