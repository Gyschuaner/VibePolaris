# 物性场景的逐篇选用约定

- `press`：同一张带 subject 与 items 的正文纸离开 source 外壳，穿过 actor 操作的压辊，进入 target；适用于取文、解析与材料交接，不能表示模型自行联网。
- `sieve`：items 从 source 落到 subject 筛面，再逐件穿过筛孔进入 target，actor 与 action 标明筛选机制；不能把没有证据的对象擅自判为通过或淘汰。
- `stencil`：actor 拉动刮板，source 经 subject 的开口印到 target，items 是实际印出的内容；适用于约束输出、共享格式与受控生成，不表示所有任意输入都会成功。
- `gate`：actor 先移开 subject 的闸门，再让带 items 的材料从 source 穿入 target；适用于明确接入、开放或状态边界，不能把申请送达画成已经获批。
- `seal`：actor 的印章在 subject 文书上留下 action 印记，items 是文书对象，target 是正式留下的材料；印记只写真实的发布、声明或签署动作，不默认写“通过”。
- `rewind`：带 items 的连续材料从 source 回卷进 target 卷轴，卷芯随收卷增厚，subject 是被回看或恢复的材料；适用于回溯、撤回或历史恢复，不代表过去错误已被消除。
- `receipt`：actor 处理 source 后，subject 纸条从打印槽连续吐出，items 在纸上逐行显露，target 接收纸条；适用于回执、调用结果与公开记录，不表示结算或交易已成功。
- `ledger`：subject 账页保留 source 的 items，actor 按 action 逐字写入 target 一侧并留下笔迹；适用于留痕、审计与持续记录，不把未验证项画成已核验。
- `quota`：actor 控制入口，subject 容器液位变化，items 标注实际资源或用途，target 是承载资源的范围；只有稿件提供同口径 values 才显示数字，无数字液位仅示意分配，不暗示性能成绩。
- `hourglass`：subject 双腔沙漏把 source 的材料逐渐转移到 target，items 随流动下移，actor 与 action 标明过程；不显示虚构倒计时，也不把等待结束当成审批或治疗完成。
- `fold`：一张包含 items 的 source 纸沿折痕合拢，保留 subject 封面，再成为 target 包件，actor 与 action 是实际整理者和操作；适用于压缩、封装与集中材料，不表示细节被无损保留。
- `licence`：subject 钥匙按 items 形成有限齿位，source 将其送到 actor 管理的 target 锁孔，action 只表示呈交与对齐；锁的边界保持完整，不用自动开门表达许可获批或全面授权。

各场景默认字高 16–18px；宽度低于 640px 时改为纵向传送、单页、竖卷轴或上下折页等构图，使用父组件的连续 progress，结果由父组件统一呈现。
