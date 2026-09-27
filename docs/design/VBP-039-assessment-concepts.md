# 第024批：基准测试、评分器与评测数据集 · VBP-039

VBP-012 的三个既有词条。顾毅盛负责研究、设计、实现、review 与本地 dev 集成。保留别名、分类、关系和六个旧锚点；不含 main 或生产。

## 资料与正文对应

每篇四份实际阅读的公开原始资料。阅读范围是支持论点的章节，不声称通读全部长论文。正文自行解释，厂商实现、研究条件与虚构教学规则明确区分。网址、作者/机构与日期（已核实者）保留在书目中，摘录来自当前正文。

| 页面 / 已读来源 | 实际阅读范围 | 稳定段落与用途 |
| --- | --- | --- |
| 基准 · [GLUE](https://arxiv.org/pdf/1804.07461) | PDF0–160：摘要、九类任务、不同指标与诊断集；当前ICLR2019稿 | bench-definition：组织好的任务与比较约定，非全部能力 |
| 基准 · [MLPerf Inference Submission Guide](https://docs.mlcommons.org/inference/submission/) | 正文117–210：SUT、场景、accuracy与open/closed差异 | bench-protocol：比较对象决定固定哪些条件，硬件可作为比较变量 |
| 基准 · [HELM](https://arxiv.org/pdf/2211.09110) | 上批已实际读PDF0–125，本文复用场景/指标/条件；2023稿 | bench-metrics：多维评价，不把领先一项当业务全面适用 |
| 基准 · [Dynabench](https://arxiv.org/pdf/2104.14337) | PDF0–54及48–105：静态测试局限、人和模型动态收集挑战 | bench-transfer：熟悉基准高分与新场景之间的边界 |
| 评分器 · [Inspect Scoring](https://inspect.aisi.org.uk/scoring.html) | 正文141–154：output到Score、标准/自定义评分、失败与unscored策略 | grader-definition / grader-unscored：评价与汇总、设施不可读不制造任务成败 |
| 评分器 · [Anthropic agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | 上批已实际读30–118、172–288：轨迹与outcome、评分类型与核查 | grader-outcome：回复声称完成与环境结果不同 |
| 评分器 · [G-Eval](https://arxiv.org/pdf/2303.16634) | PDF0–114：任务、criteria、evaluation steps与人类相关性研究 | grader-rubric：明确维度；任务内相关性非任意判断保证 |
| 评分器 · [MT-Bench / Chatbot Arena](https://arxiv.org/pdf/2306.05685) | PDF0–114、206–252、277–286：位置/长度/自我偏好与交换顺序 | grader-bias：模型裁判也需校验，不保证交换顺序消除所有偏差 |
| 数据集 · [Anthropic agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | 同上，清晰任务/输入/成功标准及孤立环境 | evaldata-definition：案例需要足够背景和可检查目标 |
| 数据集 · [Datasheets for Datasets](https://arxiv.org/pdf/1803.09010) | PDF0–49、115–180、319–331：动机/组成/关系/划分/维护；2021稿 | evaldata-document：范围、关系、版本与维护；不机械填写无关项 |
| 数据集 · [Google Dividing datasets](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets) | 正文70–145：用途分开、测试集磨损、重复与现实覆盖 | evaldata-holdout：反复据测试调试会失去未见检验意义；提示开发是本文类比 |
| 数据集 · [scikit-learn Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html) | 正文412–429：分组/同人多条记录、GroupKFold不跨两侧 | evaldata-groups：按推广对象定义组；工单例子是明确教学应用 |

行号是工具本次读取记录，不作为永久来源定位。13个正文目标对应12条书目（Inspect支持两段）；不是把12份来源都机械地塞给三页。

## 机制差异与状态合同

| 页面 | 首图 | 主体操作与证据 | 文章节奏 |
| --- | --- | --- | --- |
| 基准测试 | 两条成绩带先对齐到同一版本 | 先核对题集/版本/题数/判据/工具，再比较十格成绩带和延迟；换题集排名反转，不同版本或缺记录不排名 | 定义与比较对象 → 条件表与成绩 → 两种取舍 → 业务边界 |
| 评分器 | 回复在上、实际缺文件检查在下 | 更换尝试与判据；关键词可能误判两方向；实际检查文件存在且amount=120，环境不可读保留未评分 | 判据定义 → 回复/文件检查 → 开放回答量规 → 裁判偏差 |
| 评测数据集 | 同工单两条问题作为整体移向开发区 | 选择关联工单，逐行交替或按工单拆分，样本进入两篮；显示工单重叠与留出类别缺口；空或单组不制造独立检验 | 完整样本 → 分组拆分 → 留出用途与覆盖 → 来源/版本说明 |

A/B成绩、延迟、四次文件记录、三工单六条问题均为虚构教学输入。没有调用模型、真实测速、训练或读取用户文件。逐行交替是特意暴露关联泄漏的固定策略，不冒称随机拆分。按组固定最后工单留出，不推荐通用样本比例；目标为新工单，其他推广目标需重新选组。

输入改变关闭结果，退出期间保留旧报告；执行后才写入新报告。复用Reveal的grid/opacity双向过渡、aria-hidden/inert，States用于切换文件记录与提示。有限首图复用共享离屏/后台暂停与重播，reduced-motion提供稳定可读终态。无新增依赖或全局动画循环。

## Review 与验证

常驻正文说明定义、操作依据和边界；重点加粗用于比较条件、任务结果和独立性。正文与四来源逐段对应。元数据未改、关联保持原样；六锚点保留。首图/主体/文章编排与上批以及本批三页均有机制差异。

一份组合模型检查已通过：两题集A/B排名、条件错位与缺记录；两类评分的误判、错误金额与未评分；逐行重叠/按组分离、覆盖缺口、单工单与空集合。`npm run build`通过，100个静态页面、89个公开词条。临时内容检查最初把13个段落目标误写成12而断言失败，改正检查计数后通过；不是产品故障，不创建产品Bug。

真实浏览器与后续集成按实际结果补充。早期/历史页仍需最终四来源复核，不能把累计公开数当成全体通过新标准。


## 真实浏览器验收

| 实际操作 | 观察结果 |
| --- | --- |
| 基准条件与记录 | 一般任务A8/B9，业务A8/B7，排名反转；v2/12题显示条件不同，不排名；B无记录显示无法比较，不计零分。重置恢复一般/同条件，Enter可执行 |
| 评分器各分支 | 缺文件关键词通过、结果检查两项不满足；文件正确但“已保存”关键词未通过、实际结果通过；999存在但金额未满足；环境不可读为未评分。重置与Enter恢复默认 |
| 数据分组与空状态 | 逐行两侧分别A1/B1/C1与A2/B2/C2，三工单重叠；按组开发A/B四例、留出C两例无重叠，但缺普通/边界。单A留出空且提示无法检验新工单；全空禁用；重置Enter恢复三工单/逐行 |
| 退出与输入失效 | 更换条件先关闭旧报告；评分器退出opacity约0.87且inert，旧关键词检查快照保留；数据集退出约0.84且inert，旧两侧样本保留，重新执行才换新归属。没有条件卸载造成闪现 |
| 桌面1470×762 / 手机390×844 | 三页实际截图已看：成绩带十格在手机可读；文件检查行与未评分结果正常；数据两篮手机改为上下读，不缩成小图。手机document390px、lab342px，无横向溢出 |
| 四份书目与第四引用 | 实际三角展开摘录并回跳#bench-transfer / #grader-bias / #evaldata-groups；窄屏最终top约262px，固定页头下可见。摘录来自当前正文，六旧锚点存在 |
| 首图与日志 | 三图重播，实际DOM所有动画iteration=1。基准与评分器终态opacity1、真实截图可读；数据集终态opacity1、translate=-45% 20px，两条问题一起停在开发侧，截图已看。共用离屏/后台暂停与reduced-motion已review，不改变用户OS设置。localhost:3001 warn/error日志为空 |

真实浏览器发现BUG-82611EA1：覆盖完整时仍显示“未覆盖”开头。已修正完整/缺类两分支，并将单工单提示改为证据不足，重建通过；回归完整、缺类、单组、全空、重置与390px后关闭。未新增无关测试；其余检查通过后停止扩大范围。

累计80页新流程加9页历史基准，共89公开、212待处理。早期与历史页仍需最终四来源复核。Obsidian规定Windows库在本机不存在，跳过；未创建空飞书文档。最终Git/DP集成以实际结果补记。


## 集成入口

实现提交 `5c51a780f568588979f6da951e8ae149f8076142`；PR [#83](https://github.com/Gyschuaner/VibePolaris/pull/83) 目标dev，已关联当前任务。此处记录本地验收完成；最终合并、DP状态、重启后核心复查及本地部署记录以实时对象为准。部署仅为localhost:3001，不含远端dev与生产。回滚入口是PR #83 revert，再构建并重启；集成前dev为 `4659a7cd6a6ffe56e0edd526ee52afecc40902dc`。


## 集成最终结果（第025批核实补记）

PR #83 已于2026-09-27合入dev，合并提交 `8711b38e996167300546e71ee04eb1e780f7ab1e`。实现与docs-only跟进树匹配，复用已验证构建，localhost:3001重启Ready并真实复查三页核心默认结果。VBP-039 ready_for_release version6，任务done3、计划completed3/3通过；BUG-82611EA1 closed5。LOCAL ONLY部署 `local-dev-20260927-vbp039-8711b38`，记录UUID `af0cc9db-dc71-4ec1-b6be-964ce6101fcc`；无远端dev/生产部署。回滚PR83 revert后构建重启，备份dev `4659a7cd6a6ffe56e0edd526ee52afecc40902dc`。
