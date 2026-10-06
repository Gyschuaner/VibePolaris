# VBP-086 AI stack 机制差异表

这一批十条词条都保留自己的读者问题、可操作变量和可观察结果。共用的是阅读控件，不共用同一张流程图。

| 词条 | 读者要回答的问题 | 演示起点 → 操作 → 证据 | 特色机制 | 资料入口 |
| --- | --- | --- | --- | --- |
| 模型评分器 | 模型给高分，为什么还要人工校准？ | 两份匿名回答 → 逐项量尺、切换是否露出名称 → 分数与人工参考出现偏差；证据不足停在 `unscored` | 盲评信封 + 量尺 + 校准环 | OpenAI Graders；G-Eval；MT-Bench |
| 回归评测 | 总分变高，为什么还可能不能发布？ | 同一题集的基线与候选 → 翻开逐项账本、换成另一套题集 → 关键回退钉住发布闸门；换题时明确不可比 | 差异账本 + 关键失败红钉 | OpenAI Evals；Anthropic evals；NIST AI RMF |
| 上下文溢出 | 为什么“还能塞字”不等于请求能执行？ | 指令、历史、工具结果和输出预算逐件进入有限托盘 → 越过容量线 → 拒收；压缩后标出保留事实再继续 | 有界托盘 + 溢出拒收 + 保留清单 | Anthropic Context Windows；Context Engineering；Lost in the Middle |
| Transformer | 一层计算到底改写了什么？ | 一排 token 与位置 → 叠上注意力、前馈、残差三张透明片 → 同一位置的表示逐层改变 | 透明醋酸片叠层，而非箭头流程图 | Transformer 原论文；D2L；PyTorch TransformerEncoder |
| 注意力机制 | Query、Key、Value 各自负责什么？ | 一条查询与三张键值卡 → 磁场改变命中权重、遮掉一张卡 → 取回内容随可见范围变化 | 磁力取数台 + 可撤出的证据卡 | D2L QKV/Multi-head；Transformer 原论文；PyTorch/TensorFlow |
| 推理 | 首 token 和后续 token 为什么是两种等待？ | 请求纸带 → prefill 读完整段、decode 逐格打印、停止条件落下 → 看到输入、输出和权重更新次数 | 预填充引擎 + 输出纸带 + 停止闸 | Hugging Face Pipelines；PyTorch inference_mode；NVIDIA Dynamo |
| 预训练 | 模型怎样从一段数据得到更新信号？ | 数据织带遮住一个目标 → 交卷、显示 loss、沿梯度挪动参数 → 目标揭开后比较误差 | 数据织机 + 隐藏目标 + 参数刻度 | Hugging Face Causal LM；PyTorch CrossEntropyLoss；BERT；GPT-3 |
| KV Cache | 保存的到底是什么，为什么能少算？ | 已读前缀的 K/V 方块 → 新 query 只取书签；切换前缀使旧块变红 → 缓存必须失效或重建 | 有位置的书签架 + 失效块 | Hugging Face Cache；vLLM Paged Attention；NVIDIA Dynamo |
| 智能体工作流 | 灵活的模型调用怎样留下可验收出口？ | 任务护照 → 守门条件、节点和验收出口逐格盖章；缺条件时停在 guard | 任务护照 + 守门盖章 + 副作用出口 | Anthropic Building effective agents；OpenAI Agents SDK/Guardrails/Handoffs |
| 背压 | 下游接不住时，谁来让上游慢下来？ | 生产者持续投递 → 有界水箱到警戒线 → 需求信号倒流，上游暂停/降速；不靠无限队列掩盖问题 | 有界蓄水罐 + 反向容量信号 | Reactive Streams；Ray Data；Google Cloud/AWS overload |

## 共享验收

- 每个演示至少有一次手动推进、一次关键条件切换和一次重置；结果状态不沿用上一次场景。
- 各演示的对象、空间关系和文中解释相互对应；去掉标签后仍能看出十种不同机制。
- 在正文宽度内工作，窄列和小视口不出现横向溢出；`prefers-reduced-motion` 下仍能读到完整状态。
- 来源映射继续落在正文段落的 citation id 上；这张表只记录设计依据，不替代页面引用。
