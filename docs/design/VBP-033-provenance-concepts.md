# 第018批：数据集、数据质量与数据血缘 · VBP-033

本批接在数据接入、转换与验证之后。资料阅读日期2026-09-27；DP父需求VBP-012，研发与限定验收由顾毅盛负责。文章与纯机制在本地实现，不代表已合入dev、生产发布或用户视觉确认。

## 机制差异

| 词条 | 阅读目标 | 首图与主体 | 可观察证据 |
| --- | --- | --- | --- |
| 数据集 | 区分当前来源、选择范围与具体版本 | 错位版本纸页；左来源、右草稿、下方版本档案 | s1九月1—2日ABC三条；新增D与扩大范围不改v1；v2四条，E仍排除 |
| 数据质量 | 质量结论要对应指标、用途与门槛 | 同一时效面对两种要求；十个记录对象与逐项测量 | 书目9/10、不同ID9/10；3h月报通过、实时拒绝；12s只修时效，额外缺失8/10仍失败 |
| 数据血缘 | 用登记证据追查一次结果，并限定影响范围 | 数字、运行档案与源字段层级；逐层展开、字段反向依赖 | s1两行，run42/v1金额2000，run43/v2减优惠1800；discount影响旧规则0、新规则2输出 |

数据集、质量与血缘的正文分别采用概念对照/说明档案、维度分解/用途判断、两次结果对照/历史边界。沿用主题、字体、品牌星星与语义图标，不采用同一种三图标曲线。数量来自明确的教学输入或已登记依赖；没有随机虚构指标、后台服务、真实费用或密码学。

## 已读来源与论断位置

每页四份资料都读过正文；不以搜索摘要算完成。日期未知留空；论文日期对应实际打开的v8文稿，而非误写初次提交日期。

| 页面 / 来源 | 已读位置与采用范围 | 正文引用ID |
| --- | --- | --- |
| 数据集 / [W3C DCAT3](https://www.w3.org/TR/vocab-dcat-3/) | 引言、词汇概览dataset/distribution、版本属性说明；抽象集合与可获取表示、版本标识；没有宣称规范保存实际数据 | dataset-definition、dataset-version |
| 数据集 / [Gebru等，Datasheets for Datasets](https://arxiv.org/pdf/1803.09010) | p1–6动机/问题/范围，p9–11维护与挑战；ML数据说明、场景适配、未知信息、限制 | dataset-scope、dataset-limits |
| 数据集 / [HF Dataset Cards](https://huggingface.co/docs/hub/datasets-cards) | What are Dataset Cards、metadata；README内容背景与license/language/size，不宣称自动认证 | dataset-card |
| 数据集 / [DVC .dvc Files](https://doc.dvc.org/user-guide/project-structure/dvc-files) | Specification、Output/Dependency entries；路径、hash/checksum、size与cloud version_id；教学只复制数据，不运行DVC或哈希 | dataset-identity |
| 质量 / [W3C DQV](https://www.w3.org/TR/vocab-dqv/) | 引言、QualityDimension/Metric/Measurement/Policy；工作组Note与用途相关，非统一质量标准 | quality-purpose、quality-record |
| 质量 / [UK Government框架](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) | 六维度及取舍、完整不等于准确；不是强制统一清单 | quality-dimensions、quality-fact |
| 质量 / [AWS Labs Deequ](https://github.com/awslabs/deequ) | README checks、Spark计算与VerificationResult；约束及失败检查。不同ID占比未冒充Deequ uniqueness实现 | quality-automation |
| 质量 / [AWS Glue Data Quality](https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html) | How it works、DQDL/Deequ、规则通过比例分数；不把分数当准确记录比例 | quality-score |
| 血缘 / [W3C PROV-DM](https://www.w3.org/TR/prov-dm/) | entity/activity/usage/generation/derivation；使用某输入不必然代表派生，区分身份与过程 | lineage-relations |
| 血缘 / [OpenLineage Object Model](https://openlineage.io/docs/spec/object-model/) | runtime/design events、Job/Run/Dataset与facets；不把设计期关系当一次真实运行 | lineage-run |
| 血缘 / [OpenLineage列级facet](https://openlineage.io/docs/spec/facets/dataset-facets/column_lineage_facet/) | 列依赖说明及输入字段/转换方式示例；未复制示例图，本文是两行自有数据与手工登记 | lineage-columns |
| 血缘 / [DataHub Lineage](https://docs.datahub.com/docs/features/feature-guides/lineage) | Viewing/Column Level/Adding Lineage；最新图时间过滤非历史还原，自动采集与人工登记的覆盖限制 | lineage-impact、lineage-history |

## Skill review与实现选择

- 常驻正文独立说明定义、机制与边界；具体产品文档明确限于其实现，不把Note说成Recommendation、不把文档或关系图说成事实担保。
- Preserve原aliases/relatedSlugs，以及question/definition/scene-heading/quiz-heading/prompt-heading/learning-heading六旧锚点；不改变原元数据文件。公开清单仅增加本批3页，累计71；其余230既有词条不公开。
- 复用ConceptArticle/ConceptHero/Reveal/States与现有依赖。长血缘页按当前输出包Reveal，避免隐藏展开档案撑高空白；快照对象复制保存，切换范围不改旧记录。
- 有限CSS首图继承可见/后台暂停及重播，减弱动态显示终态。展开、收起与切换保留DOM双向过渡，非当前区inert；质量八种组合用固定States，快照重置保留退出DOM直到重新保存。
- 本页阈值90%/24h/30s专为教学，不能用作真实库存规则。不同ID占比有明确分子分母；刷新时效不补字段。血缘显示预登记两次教学运行，不自动解析SQL；潜在影响不是已改数值。

验收限本批：build与一份模型检查，Chrome1470×956/390×844的机制正常/失败、版本切换、重置/Enter、第四引用回跳与首图/过渡。无需全站回归或新增依赖。约定Windows Obsidian库不在本机，跳过；无必要正式方案变更，不创建空飞书文档。

## 本地证据

一份Node TS剥离检查通过，覆盖不可变快照、范围过滤、用途门槛、刷新仍缺失、整数金额与字段依赖。npm run build通过，71公开词条/82静态页。真实浏览器与dev集成结果在实际完成后补充。

初次浏览器验收：1470×956与390×844数据集Enter保存v1三条，新增D并扩范围后旧v1仍s1/09-01—09-02/ABC；v2为s2/09-01—09-03/ABCD四条，E排除，键盘重置。质量十条计算9/10与9/10，实时3h拒绝、12s通过、额外缺失8/10再拒绝，Enter重置月报3h。血缘桌面逐层展开run42金额2000、run43减优惠1800，两行原值保持，discount依赖0/2、重置输出v1。第四引用回跳已确认数据集130px/262px、质量130px/262px并自动打开所属details，血缘桌面第四来源两段摘录可见；其手机验收与最终调整后结果待补。

通读复核补充明确两条e9书目不同，当前比例没有检查内容冲突；不把指标门槛通过暗示为一致性通过。最后局部CSS把按钮图标与文字同行，并随展开旋转，不改机制。

最终构建82静态页/71公开词条通过。血缘390px逐层展开run42与run43，原始1200/800及优惠200/0不变；discount旧版0、新版2个下游，键盘重置；截图确认旧档案高度0，新档案字段可见、展开/收起过渡与同行旋转图标。三页390px首图内容最大bottom分别638.9/631.8/628.8，小于figure666.3；导语688.3之后，无首图侵入。桌面数据集/血缘figure425.4，内容393.1/384.4，导语453.4之后。

血缘第四引用移动端回跳lineage-history约262px（桌面130px），两段摘录来自当前正文。各页面静态HTML四书目与六旧锚点唯一、无重复ID。浏览器日志与最终dev核心流程在集成阶段核对；本地通过不代表用户认可视觉或生产上线。

最终质量桌面首图内容386.4px在figure425.4px内，导语453.4px；新增e9冲突说明已在构建页面确认。捕获本批localhost浏览器日志无warn/error。没有新增全站回归；本次两次build第二次仅因正文及按钮CSS调整。

## 已完成 dev 集成

PR #77 已合入 dev，合并提交 `8de498dd61600e57c1f5aa0c1c51946ce44f36ea`。重启 localhost:3001 并核对三页核心流程；VBP-033 为 ready_for_release，任务完成，计划三条实际执行通过。DP 部署记录 `local-dev-20260927-vbp033-8de498d` 仅为本地 dev；备份提交 `69067a01c9f61fe4564d8b66b395c0e9ddaeaf42`，回滚经功能分支撤销 PR #77、合 dev、重建并重启。未涉及 main、远端部署或生产。
