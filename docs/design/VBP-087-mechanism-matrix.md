# VBP-087 机制差异表：数据流与测试边界

本批十页共用阅读壳、引用和播放控制；首图只复用“有限步骤、可暂停、可重播”的生命周期，不复用同一张流程图。每页先改变一个关键条件，再让对象留下可判断的证据。

| 词条 | 读者遇到的原话 | 首图的对象与变化 | 失败/边界证据 | 资料组 |
| --- | --- | --- | --- | --- |
| `data-ingestion` | 写入成功后为什么重启还会重读？ | 来源日志、暂存篮、原始层与 checkpoint；先写入再确认，断开后从旧 checkpoint 重放 | 重复 ID 被去重；checkpoint 不提前，坏记录留在隔离区 | AWS、Debezium、Airbyte、AWS DMS |
| `data-pipeline` | 日报出错怎样知道卡在哪一步？ | 一次 run 的 DAG 依赖与分区；让 validate 失败，再只重跑受影响路径 | 下游保持 blocked；修复后 publish 版本只增加一次 | AWS Glue、Airflow、PROV-DM |
| `data-transformation` | 不同日期和金额怎样统一？ | 原始金额卡、单位标签、规则版本与输出格；切换时区/汇率后重算 | 单位未知或精度超界进入待处理，不静默舍入 | dbt、Python Decimal、PostgreSQL numeric、aggregate |
| `data-validation` | 负数年龄和未知城市何时被拦？ | 记录逐层通过 schema、范围、关系和集合筛网；编辑一条记录再复跑 | 每条记录停在具体规则并保留原因；未启用规则不算通过 | JSON Schema、OWASP、SHACL、Great Expectations |
| `data-lineage` | 报表金额异常怎样追到原始字段？ | 报表单元格、列映射、规则版本与 run 节点；从一个数值向上展开 | 只展示实际参与的列；缺 run 证据时停止在不可追溯 | PROV-DM、OpenLineage object/facet、DataHub |
| `stream-processing` | 晚到事件为什么会改写窗口？ | 乱序事件、事件时间尺、水位线和窗口账本；拖动晚到事件并改变容忍 | 窗口关闭后进入旁路或 revision；不是“每条到达就最终输出” | Kafka Streams、Flink time/windows、Beam watermarks |
| `unit-test` | 小改动怎样快速知道边界坏没坏？ | 一张小实验桌上的输入、受控时钟、单元和行为断言；切换私有断言 | 固定依赖后可重复；内部重构不应破坏行为契约 | Fowler、Microsoft、Jest |
| `integration-test` | 单测全绿，连数据库为什么仍会摔？ | 真实 HTTP、服务、数据库和受控支付故障；把请求与 rows/outbox 并置 | 响应 502 且数据库 0 行才证明回滚；只看状态码证据不足 | Fowler、Microsoft、Playwright、Google Testing |
| `e2e-test` | 页面显示成功，为什么还查数据库和邮件？ | 浏览器入口、API/DB、回调与邮件沙箱的跨层不变量；切换邮件丢失 | UI 绿但 mail=0 停在首个不变量破坏处 | Playwright、Fowler、Google Testing |
| `smoke-test` | 为什么先跑少量检查再跑完整回归？ | 候选构建、四盏关键灯和锁住的回归队列；选择失败灯 | 任一关键灯失败即 STOP，后续套件保持未启动；全绿才解锁 | Microsoft、GitLab、Fowler |

资料均已从现有研究台账核对；本批只在确实改变正文论断时补来源，不用链接数量代替阅读。正文沿用现有稳定锚点，首图实现放在 `DataTestSignatureHeroes.tsx` 与同名 CSS 中，主体 Lesson 保留各页已有的交互和失败分支。

## 实施与验收记录

- 十条首图按词条逐条提交，最终批次提交为 `c222153b`；数据管道额外修正了严格 q1 与 q2 的终态语义。
- 唯一 reviewer `/root/ai_stack_review` 已复审 PASS；q1 保持阻断，q2 才进入汇总和发布。
- DP 测试计划 `9f617203-1782-4e4c-9caf-e94ceddbf1db` 的三项必需用例全部通过：机制审查、桌面/390px 浏览器验收、typecheck/build/audit/diff 检查。
