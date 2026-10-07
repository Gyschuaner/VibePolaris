# VBP-096 列资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 表定义为列指定类型、默认值和约束，列类型影响可接受的输入与操作 | [PostgreSQL · Table basics](https://www.postgresql.org/docs/current/ddl-basics.html)、[PostgreSQL · Data types](https://www.postgresql.org/docs/current/datatype.html) | PostgreSQL 规则用于页面的严格实验；不把 PostgreSQL 行为说成所有数据库共同实现 | `column-definition`, `column-write`, `column-type` |
| `TEXT` 与 `NUMERIC` 的比较和计算语义不同；不能只凭显示内容猜类型 | [PostgreSQL · Data types](https://www.postgresql.org/docs/current/datatype.html) | `10`、`2`、`9.5`、`abc` 是教学输入，页面用本地演示说明字符序、数值序和转换失败 | `column-type` |
| 查询的 select list 可以产生表达式结果列，结果列不等于持久化存储列 | [PostgreSQL · Select lists](https://www.postgresql.org/docs/current/queries-select-lists.html) | 用 `amount * 1.2 AS gross_amount` 说明当前查询结果，不展开生成列或视图的实现差异 | `column-expression` |
| 不同数据库的类型边界不同；SQLite 使用存储类和类型亲和性，声明类型不等于强制所有值同型 | [SQLite · Datatypes in SQLite](https://www.sqlite.org/datatype3.html) | 只用于边界提醒；迁移和导入仍需在目标数据库上重新验证 | `column-type`, `column-boundary` |

## 写作和验收记录

- 读者场景：订单表的 `amount` 列混入字符串，排序出现 `10、2、9.5`，需要看懂类型如何改变比较、求和和错误边界。
- 首图不用数据流箭头，做成一枚“类型镜片”覆盖同一列；TEXT 显示字符序，NUMERIC 显示数值序与求和，`abc` 在严格写入边界被挡下。
- 实验切换 TEXT/NUMERIC 与待写入值，分别观察字符语义、数值结果和非法输入；所有状态只在本地变化。
- 页面明确：示例实验模拟 PostgreSQL 风格的严格路径，SQLite 的类型亲和性单独作为边界，数值与结果只是教学数据。
