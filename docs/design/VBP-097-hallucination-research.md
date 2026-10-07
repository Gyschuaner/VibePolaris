# VBP-097 幻觉研究与演示契约

## 读者任务

读者看到一段语气确定的回答时，先追问“这句话在资料里的落点在哪里”，再判断它是否只是读错、算错或引用错。读完本页，读者应能区分：资料缺字段时的无依据生成、已有字段被错误读取或计算、以及引用没有真正支持主张；也应知道“资料不足”是合格结果，不是回答失败。

## 资料核对

| 论断 | 采用的资料 | 页面位置 |
| --- | --- | --- |
| confabulation / hallucination 可能自信地产生错误内容、偏离输入或制造解释与引用 | NIST AI RMF: Generative AI Profile | §2.2 Confabulation |
| 找不到支持信息时允许系统承认不确定、抽取原文、逐条核对 | Anthropic · Reduce hallucinations | Allow the model to say “I don't know”、Use direct quotes、Verify each claim |
| 引用需要指向支持主张的具体文档位置 | Anthropic · Citations | Citation reliability、source location |
| grounding 需要围绕真实查询处理数据、索引、清洗、新鲜度并持续迭代 | Microsoft Azure · Grounding Data Design | data preparation、retrieval、freshness |
| 幻觉是看似合理却非事实的内容，检测、评估和缓解需要分开处理 | A Survey on Hallucination in Large Language Models | taxonomy、detection、mitigation |

## 场景契约

- 初始对象：问题“利润是多少？”和只写“收入 120 万”的 Q3 财报资料表。
- 操作：让候选数字“利润 48 万？”出现，先经过证据闸门；再补入“利润 48 万 · 财报第 3 行”。
- 对象变化：候选从顺口的字符串变成被拒绝的主张，再变成带具体落点的回答；资料表的利润字段从空白变成新证据。
- 可见证据：闸门状态、资料字段、候选主张和回答引用同步变化；正文工作台只读本地固定数据，不发起模型调用。
- 停止条件：答案显示“利润 48 万 · 第 3 行”；正文工作台切到利润率时，利润字段缺失则停在“资料不足”，补入后按利润 ÷ 收入算出 40%，同时显示公式和两项输入的出处。
- 重置：恢复“问利润”、移除利润证据、候选被挡回和“资料不足”。

## 实现取舍

首图使用一张倾斜财报纸和一枚候选签：无依据的签飘到空白字段旁，被红色印章拒绝；补入字段后，签移到原文上并获得可核对的第 3 行标记。首图没有流程节点，只显示必要对象与当前结果。五帧依次是问题伸出资料表、顺口数字飘入、证据核对拒绝、补入缺失字段、带着落点回答。正文把 grounding、引用和幻觉风险拆开讲；本地实验只切换问题和利润字段，读者能重复观察“像答案”与“有证据”的差别。
