# VBP-096 工具 Schema 资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 工具定义会带输入/输出 Schema；模型提出调用，应用或客户端负责执行并回传结果 | [OpenAI · Function calling](https://platform.openai.com/docs/guides/function-calling)、[MCP · Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)、[Anthropic · Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) | 三种实现的术语和消息格式不同；正文只抽取共同的职责边界，不把某一 SDK 写成通用协议 | `tool-schema-definition`, `tool-schema-output` |
| `type`、`required`、`enum` 把输入的类型、必填字段和值域变成可验证规则；strict 模式还有实现侧限制 | [JSON Schema · Validation](https://json-schema.org/draft/2020-12/json-schema-validation)、[OpenAI · Function calling](https://platform.openai.com/docs/guides/function-calling) | JSON Schema 语义与 OpenAI strict 支持范围分开描述；可选字段不能被误写成所有实现默认接受缺失 | `tool-schema-input` |
| 无效参数、未知工具、服务器错误和工具执行错误应在不同层处理；安全边界还包含输入校验、授权、限流和输出清理 | [MCP · Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) | “校验在副作用前”是页面演示的本地教学模型；真实服务仍需按自己的事务与权限设计 | `tool-schema-rejection`, `tool-schema-boundary` |
| 工具结果要和原始调用 id 对上，并区分结构化结果与错误结果 | [OpenAI · Function calling](https://platform.openai.com/docs/guides/function-calling)、[MCP · Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)、[Anthropic · Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) | 页面用 `call_17` 和 `isError` 示意归属与结果边界，不声称所有平台字段完全相同 | `tool-schema-output` |

## 写作和验收记录

- 读者场景：模型提出 `get_weather`，执行器要判断 `city` 是否存在且是字符串，再决定是否有权调用天气工具。
- 首图不用横向流程图，做成一枚“形状锁”：参数芯片插入锁槽，缺字段的芯片弹回并留下错误回执，合格芯片才让工具亮起。
- 实验分别切换有效参数、缺少字段、错误类型和授权开关；只改变本地状态，不请求真实天气服务。
- `24°C`、`call_17`、`city` 字段是教学示例；页面明确 Schema 通过不等于授权、结果正确或副作用安全。
