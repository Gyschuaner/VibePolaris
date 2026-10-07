# VBP-096 ACID 资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 事务把多步变化组织成提交或回滚单元；原子性与恢复共同处理“半笔变化” | [PostgreSQL · Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)、[IBM Research · Recovery principles](https://research.ibm.com/publications/principles-of-transaction-oriented-database-recovery) | PostgreSQL 示例用于 BEGIN/COMMIT/ROLLBACK；IBM 论文提供恢复与事务原则背景，不把 ACID 写成单一产品开关 | `acid-definition`, `acid-atomicity` |
| 一致性依赖实际约束和正确事务，不能由原子性自动生成 | [PostgreSQL · Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html) | 页面用余额非负作为教学约束；跨账户风控仍属于业务边界 | `acid-consistency` |
| 隔离性控制并发读取与写入的可见性，锁和行版本是不同实现路径 | [Microsoft Learn · Transaction locking and row versioning guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide) | 用 READ COMMITTED 与“较弱隔离示意”说明可见性差异，不泛化为所有数据库同名同实现 | `acid-isolation` |
| WAL/恢复日志让已确认提交在故障后有机会被重放，但复制、备份与同步提交仍是不同边界 | [PostgreSQL · Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)、[IBM Research · Recovery principles](https://research.ibm.com/publications/principles-of-transaction-oriented-database-recovery) | 页面用 WAL 已落盘/未落盘做本地教学开关，不声称跨机房零丢失 | `acid-durability`, `acid-boundary` |

## 写作和验收记录

- 读者场景：检查一笔 A 扣款、B 入账的转账，分别观察第二笔失败、余额规则、并发读取和重启恢复。
- 首图不用事务流水线，做成一张转账单和四枚封条；当前封条被盖章时，右侧只出现它负责的证据。
- 实验按 A/C/I/D 切换：原子性模拟第二笔失败，一致性切换余额约束，隔离性切换已提交/较弱读取示意，持久性切换 WAL 是否落盘；所有状态只在本地变化。
- 账户余额、tx_42、WAL #884 是教学样本；页面明确 ACID 不覆盖外部副作用，也不替业务规则、隔离配置和恢复证据负责。
