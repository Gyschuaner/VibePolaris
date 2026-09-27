# 第023批：基于证据回答、幻觉与评测 · VBP-038

范围：VBP-012 的三个既有词条，保持分类、别名、关系和六个旧锚点。顾毅盛负责研究、设计、实现、review 与本地 dev 集成。本批不涉及 main 或生产。

## 已阅读的资料与论断

每篇四份实际阅读的公开原始资料。阅读范围是支持本文论点的部分，不表示通读全部长论文；正文使用自己的解释，不复制来源全文。参考表保留完整 URL，角标与当前正文摘录自动对应。

| 页面 / 来源 | 实际阅读范围 | 本文位置与用途 |
| --- | --- | --- |
| Grounding · [Microsoft Support](https://support.microsoft.com/en-us/microsoft-365-copilot/what-information-does-copilot-use-to-answer-my-prompt) | 正文123–140：训练知识、工作/网页/附件与生成限制 | ground-definition：资料引入与训练知识不同，不保证正确 |
| Grounding · [Azure grounding data design](https://learn.microsoft.com/en-us/azure/well-architected/ai/grounding-data-design) | 正文31–128：相关性、更新、实时查询与访问过滤 | ground-data：源数据是否适用与当前 |
| Grounding · [Lewis 等 RAG 论文](https://arxiv.org/pdf/2005.11401) | PDF0–114：摘要、引言与检索/生成组合 | ground-retrieval：RAG 是一种实现路径，不等于所有资料补充 |
| Grounding · [Anthropic Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) | 正文37–100：不知道、原文、引用核对与不能完全消除的限制 | ground-insufficient：缺依据保留未知与复核 |
| 幻觉 · [Ji 等综述](https://arxiv.org/pdf/2202.03629) | PDF185–275，以及733–751：faithfulness/factuality、来源不支持与事实不真不同 | hall-definition / hall-axes：定义使用范围与两个核对标准 |
| 幻觉 · [Maynez 等摘要研究](https://arxiv.org/pdf/2005.00661) | PDF0–118：流畅摘要仍可能不忠于来源，任务范围 | hall-fluency：语言流畅不证明依据充分 |
| 幻觉 · [TruthfulQA](https://arxiv.org/pdf/2109.07958) | PDF0–108：模仿人类常见误解的研究目标 | hall-imitation：一种错误来源，非所有模型错误的单一解释 |
| 幻觉 · [Farquhar 等 semantic entropy](https://sebastianfarquhar.com/assets/papers/farquharDetecting2024.pdf) | 作者公开PDF0–121：语义差异、confabulation子集、系统性错误限制 | hall-detection：一致不保证真实。Nature原页打开失败，实际读作者公开论文副本 |
| 评测 · [Anthropic agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | 正文30–118、172–288：task/trial/grader/outcome、评分类型、重复运行、清楚案例与记录复核 | eval-task / eval-repeat / eval-graders：对象、运行次数和评分器边界 |
| 评测 · [HELM](https://arxiv.org/pdf/2211.09110) | PDF0–125：覆盖、多指标与统一比较条件；当前稿刊于2023 | eval-metrics：单个分数无法概括全部维度 |
| 评测 · [CheckList](https://arxiv.org/pdf/2005.04118) | PDF0–135：能力与行为测试、总体准确率之外的问题 | eval-coverage：普通、边界、关键行为与覆盖缺口 |
| 评测 · [NIST CAISI](https://www.nist.gov/caisi/cheating-ai-agent-evaluations) | 正文123–161：评测作弊、数据泄露、评分漏洞与轨迹复核 | eval-integrity：高分和能力可能存在缺口 |

网页行号只记录本次工具读取范围，不作为永久定位器；永久对应由源码中的稳定段落 ID 管理。来源均在真正支持的正文段落标号；既有研发规范或参考资料数量不替代内容阅读。

## 机制差异与状态合同

| 页面 | 首图 | 主体操作 / 证据 | 阅读编排 |
| --- | --- | --- | --- |
| Grounding | 条件和时效词块拼成受限定结论 | 选择资料与渠道，再组织两个字段；缺材料明确未知，线上费用不能套到门店 | 资料范围例子 → 三步正文流程 → 缺口处理 |
| 幻觉 | v1与v2错位叠置，三个/七个工作日区分 | 先查提供原文，再查当前规则；二维矩阵显示来源与事实分别判断，费用未知不入确定格 | 两个标准 → 可核对例子 → 错误来源对照 → 不确定性限制 |
| 评测 | 两列六个检查结果，总分相同而失败位置不同 | A对B/C，全部/普通/空集合；按明确短语判据算分，覆盖和关键失败独立；逐例记录显示回退 | 定义任务 → 版本对照 → 覆盖/指标/重复 → 评分漏洞 |

所有退款规则、当前事实与记录均是明确虚构的教学输入。不调用模型，不访问真实订单，不把六题及80%门槛当真实上线依据。短语匹配只判断这组记录，不判断任意句子的语义真实性。

输入改变先关闭结果，旧快照在退出动画中保持；幻觉来源报告和当前事实报告分别保存，评测概览与逐例记录分别保存，避免前一阶段重新执行时改掉仍在淡出的下一阶段内容。隐藏区域 aria-hidden / inert；首图复用有限播放、离屏/后台暂停、重播和 reduced-motion。公共组件与依赖未扩展。

## Review 与验收

代码 review：常驻正文可独立说明定义、过程、边界；重点加粗围绕依据关系与判断限制；十二份来源都有稳定ID。更新 Grounding 的过度承诺定义，幻觉不再把来源缺失一律等同虚假。保留 relatedSlugs / aliases 与六个旧锚点。重点检查双阶段/嵌套退出快照，不用条件卸载替代淡出。

模型检查：一份组合检查覆盖渠道/材料范围、未知、来源与事实的四种组合、B/C相同平均分与不同关键失败、C局部回退、缺覆盖和空集合，已通过。应用 `npm run build` 通过：97个静态页面，86个公开词条。真实浏览器实际结果如下。


| 实际操作 | 观察结果 |
| --- | --- |
| Grounding默认A/B、加入C、切门店、全空、重置Enter | 默认时效依据A且费用未知；C给线上0元；门店时效B但费用未知；全空两字段未知。重置恢复线上/A/B，Enter能执行。输入变更退出opacity约0.05且inert，保留旧回答快照 |
| 幻觉两阶段与未知 | 第二步初始禁用。v1+三天来源一致但当前错误；v1+七天来源冲突但当前正确；v2+七天两者一致；费用两维未知且没有矩阵激活格。输入变更两个报告退出opacity约0.97且inert；重新执行来源核对不替换退出中的事实快照。重置恢复初态，Enter有效 |
| 评测全部、普通、空与逐例记录 | A50%、B83.3%且关键失败1；C83.3%关键0，显示申请入口回退，逐例Check/X与短语判据一致。普通B100%但覆盖不足，空集合禁用评分。版本改变保留退出的B逐例快照，打开C详情后才换新记录；收起opacity约0.029且inert。重置Enter有效 |
| 桌面1470×956与手机390×844 | 三个主体、矩阵、分数和逐例记录实际截图可读；文档390px，演示342px，没有横向溢出。手机记录改为上下排列，没有缩小桌面整图 |
| 第四来源摘录与回跳 | 分别实际点击返回#ground-insufficient（top约130px）、#hall-detection / #eval-integrity（窄屏top约262px，接近页底仍可见）；每页四份书目，摘录来自当前正文，未被固定页头遮挡 |
| 有限首图、浏览器日志与基础review | 三图重播和终态截图已看：动画iteration=1；Grounding/Eval终态opacity1，幻觉旧规则0.55/当前1，均可读。共享离屏/后台暂停、reduced-motion已代码review，未改变用户OS设置。应用localhost:3001 warning/error日志为空；六锚点及来源ID保留 |

无新增产品Bug。检查完成后停止扩展测试。真实远端dev与生产未部署；下一阶段PR合dev与本地重启后的核心复查另行按真实结果补记。


## 本地交付记录

实现提交 `832d1f64bd7e7d62e1e4dc5fdd352cb996277f98`，PR [#82](https://github.com/Gyschuaner/VibePolaris/pull/82) 以 dev 为目标；已关联当前任务。DP任务 `1a43c3b0-bc1e-4b99-a9e4-624406b1c1cd` done；VBP-038 testing，实际计划 `d0ede003-93d6-47ff-96a3-be77ec6cd4c5` 三项 passed，执行记录分别 `9b3d0caf-6ccd-4a62-aa45-5e967e32ebd9`、`2168e65c-c94e-4535-b0ce-0d0cde785b4d`、`79f62f4d-9336-4d48-9d80-536d4d71d028`。最终集成状态以DP与PR实时记录为准。

当前累计77页新流程加9页历史基准，共86页公开，215页待处理；早期与历史页仍需最终四来源复核。未维护空飞书文档。规则指定的Windows Obsidian库在本机不存在，跳过该库记录。
