# VBP-102：模型架构扩展十条的内容与演示重做

本批从当前 363 条公开词条继续扩展，按用户要求逐条研究、逐条实现、逐条由唯一 reviewer 审查，十条全部完成后一次性加入公开清单。十条均使用通用词条页的数据驱动体验，没有为相近概念套用同一张流程图。

## 机制差异表

| slug | 读者要看懂的关系 | 演示形态 | sceneKind | 连线 |
| --- | --- | --- | --- | --- |
| `logit` · Logit | 原始 logit、温度、mask、选择分布与事实核验 | 频谱对照台 | `spectrum` | 0 条 |
| `softmax` · Softmax | 稳定平移、候选集合、温度与归一化分布 | 双分布比较台 | `compare` | 0 条 |
| `activation-function` · 激活函数 | 线性输出经过 ReLU/GELU/Sigmoid 后的曲线与梯度 | 逐点曲线变换台 | `transform` | 0 条 |
| `layer-normalization` · 层归一化 | 每个 token 的统计轴、标准化、γ/β 与 batch 轴对照 | 分层测量台 | `layers` | 0 条 |
| `residual-connection` · 残差连接 | 原输入、子层增量、projection、逐元素相加与梯度分量 | 透明叠片台 | `overlay-film` | 0 条 |
| `feed-forward-network` · 前馈网络 | 逐 token 的 d_model→d_ff→d_model、激活和共享参数 | 矩阵工作台 | `matrix` | 0 条 |
| `positional-encoding` · 位置编码 | token 内容、位置标签、组合表示、词序重排与 mask 边界 | 时序贴签台 | `timeline` | 0 条 |
| `rotary-position-embedding` · 旋转位置嵌入 | Q/K 二维分量、位置角、旋转后内积与长上下文参数 | 旋转坐标对照台 | `compare` | 0 条 |
| `attention-head` · 注意力头 | 多头 Q/K/V 子空间、两张权重矩阵、mask、拼接与输出投影 | 双热力矩阵台 | `matrix` | 0 条 |
| `sequence-to-sequence` · 序列到序列 | 源序列、encoder 表示、目标前缀、交叉注意力、EOS 与 teacher forcing | 双语双带组装台 | `assembly` | 0 条 |

本批十条没有使用 `pipeline`、`route` 或 `loop`。有顺序的概念也用对象状态、矩阵、坐标、双带或叠片表达；`sequence-to-sequence` 的生成顺序由帧内前缀和 EOS 表达，画面没有流程箭头。批次完成后全站体验记录为 372 条，流程类占 44/372 = 11.8%；本批新增 0 条流程类。

## 逐条内容与审查结果

### 1. `logit` · Logit

- 一句话：在归一化之前，模型给每个候选片段的一把原始分数尺。
- 演示：先看原始分数，再看它怎样被解释（`spectrum`，5 帧，6 个对象，0 条连线）。
- 研究边界：logit 不是概率、事实可信度或跨模型公共量表；绝对值和不同位置之间的差异不能脱离归一化与词表直接解释。
- Reviewer：`/root/ai_stack_review` PASS。

### 2. `softmax` · Softmax

- 一句话：把一排原始分数压成总和为 1 的相对选择分布。
- 演示：两块分布玻璃：同一分数在不同温度下长什么样（`compare`，5 帧，6 个对象，0 条连线）。
- 研究边界：softmax 的数值不是跨任务固定的事实正确率；加入候选、改变温度或更换模型都会改变它。
- Reviewer：`/root/ai_stack_review` PASS。

### 3. `activation-function` · 激活函数

- 一句话：给线性层拐一个弯，让多层网络不再只是同一条直线的叠加。
- 演示：一条输入曲线的三种性格（`transform`，5 帧，6 个对象，0 条连线）。
- 研究边界：激活函数不是模型自动学习的规则本身，也不保证某一种函数总是更好；它与架构、初始化和任务共同决定训练结果。
- Reviewer：`/root/ai_stack_review` PASS。

### 4. `layer-normalization` · 层归一化

- 一句话：把每个 token 自己这一行的特征拉回可比较的尺度，再交还给网络继续变换。
- 演示：一行一行量自己的尺度（`layers`，5 帧，6 个对象，0 条连线）。
- 研究边界：LayerNorm 不是把整批样本混在一起，也不是单纯缩小数值；统计轴与放置位置决定行为。
- Reviewer：`/root/ai_stack_review` PASS。

### 5. `residual-connection` · 残差连接

- 一句话：给一层变换留一条原路，让网络只需学习“要补上的那一点”。
- 演示：透明叠片：旧表示和新修正怎样重合（`overlay-film`，5 帧，6 个对象，0 条连线）。
- 研究边界：残差连接不是把两个向量拼起来，也不是保证深层网络一定更准；它改善的是表示和梯度的可达路径。
- Reviewer：`/root/ai_stack_review` PASS。

### 6. `feed-forward-network` · 前馈网络

- 一句话：每个 token 独自进一间“两次线性变换”的小工坊，先扩宽，再压回原尺寸。
- 演示：宽一格，再窄回来：FFN 的 token 工作台（`matrix`，5 帧，6 个对象，0 条连线）。
- 研究边界：position-wise 不表示每个位置有独立参数，也不表示 FFN 负责跨 token 关系；那是另一个子层的职责。
- Reviewer：`/root/ai_stack_review` PASS。

### 7. `positional-encoding` · 位置编码

- 一句话：给内容贴上顺序标签，让模型分得出“猫追狗”和“狗追猫”。
- 演示：把位置贴在 token 旁边，而不是贴在词义上（`timeline`，5 帧，6 个对象，0 条连线）。
- 研究边界：位置编码不是额外词义、不是可见性 mask，也不自动保证训练长度之外的外推。
- Reviewer：`/root/ai_stack_review` PASS。

### 8. `rotary-position-embedding` · 旋转位置嵌入

- 一句话：把 Q 和 K 在二维小平面里按位置转过不同角度，让内积自然带上相对距离。
- 演示：两块旋转坐标纸：绝对角度如何留下相对距离（`compare`，5 帧，6 个对象，0 条连线）。
- 研究边界：RoPE 不是简单相加式绝对位置编码，也不是所有向量都旋转；它不会自动解决超长上下文。
- Reviewer：`/root/ai_stack_review` PASS。

### 9. `attention-head` · 注意力头

- 一句话：把一次注意力拆成几副不同的眼镜，各自在自己的子空间里找关系。
- 演示：两副眼镜、两张热力图、一次拼接（`matrix`，5 帧，6 个对象，0 条连线）。
- 研究边界：头不是硬编码的语法模块，热力图也不是稳定解释；头的数量、mask、投影和输入共同决定一次权重。
- Reviewer：`/root/ai_stack_review` PASS。

### 10. `sequence-to-sequence` · 序列到序列

- 一句话：把一串输入读成可用表示，再生成长度可以不同的另一串输出。
- 演示：两条长度不同的带子，在同一张翻译台上对齐（`assembly`，6 帧，6 个对象，0 条连线）。
- 研究边界：训练时的 teacher forcing 不等于推理行为，源目标也不需要一一对齐；停止、搜索和长度策略是独立边界。
- Reviewer：`/root/ai_stack_review` PASS。

## 资料与事实映射

每条保留 5 个已打开且 HTTP 200 的公开来源；`term-experiences` 与 `term-research` 使用同一 URL 顺序，教学段落通过 `sourceIndices` 指向对应资料。

**Logit（`logit`）**
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：输出分布与注意力架构中的线性投影、softmax。
- [PyTorch · torch.nn.functional.softmax](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.softmax.html)：softmax 沿指定维度把输入转成归一化值。
- [PyTorch · CrossEntropyLoss](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)：logits 与目标类别之间的交叉熵接口。
- [Hugging Face · Generation strategies](https://huggingface.co/docs/transformers/main/en/generation_strategies)：温度、采样和生成策略如何影响候选选择。
- [Dive into Deep Learning · Attention scoring functions](https://d2l.ai/chapter_attention-mechanisms-and-transformers/attention-scoring-functions.html)：分数、softmax 权重和加权汇总的计算边界。

**Softmax（`softmax`）**
- [PyTorch · softmax](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.softmax.html)：定义沿指定维度把输入转换为和为 1 的归一化值。
- [PyTorch · CrossEntropyLoss](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)：说明交叉熵接口如何接收未归一化 logits。
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：展示 Transformer 输出层和 softmax 的架构位置。
- [Hugging Face · Generation strategies](https://huggingface.co/docs/transformers/main/en/generation_strategies)：说明 temperature、sampling 等设置如何影响生成分布。
- [Dive into Deep Learning · Softmax regression](https://d2l.ai/chapter_linear-classification/softmax-regression.html)：从指数、归一化和交叉熵解释 softmax 回归。

**激活函数（`activation-function`）**
- [Hendrycks & Gimpel · GELUs](https://arxiv.org/abs/1802.09417)：提出 Gaussian Error Linear Units 及其平滑门控解释。
- [PyTorch · ReLU](https://pytorch.org/docs/stable/generated/torch.nn.ReLU.html)：定义逐元素 max(0, x) 的实现。
- [PyTorch · GELU](https://pytorch.org/docs/stable/generated/torch.nn.GELU.html)：给出 GELU 的精确与近似实现选项。
- [Dive into Deep Learning · MLP](https://d2l.ai/chapter_multilayer-perceptrons/mlp.html)：解释多层感知机为何需要非线性激活。
- [Goodfellow et al. · Deep Learning, MLP chapter](https://www.deeplearningbook.org/contents/mlp.html)：从通用近似与梯度角度讨论非线性单元。

**层归一化（`layer-normalization`）**
- [Ba et al. · Layer Normalization](https://arxiv.org/abs/1607.06450)：提出在单个训练样本内对层输入做归一化，并讨论其与 batch 统计的差异。
- [PyTorch · LayerNorm](https://pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html)：给出 normalized_shape、epsilon、elementwise_affine 与统计维度。
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：展示 Transformer 子层周围的残差与 layer normalization。
- [Xiong et al. · On Layer Normalization in the Transformer Architecture](https://arxiv.org/abs/2002.04745)：分析 pre-LN 与 post-LN 的梯度路径和训练稳定性。
- [Dive into Deep Learning · Batch normalization](https://d2l.ai/chapter_convolutional-modern/batch-norm.html)：用对照说明按 batch 统计的归一化与 LayerNorm 不同。

**残差连接（`residual-connection`）**
- [He et al. · Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)：提出深度残差学习与恒等捷径，并讨论优化更深网络。
- [Dive into Deep Learning · ResNet](https://d2l.ai/chapter_convolutional-modern/resnet.html)：用残差块、投影捷径和形状变化解释实现。
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：展示 Transformer 子层周围的残差连接与归一化。
- [Bai et al. · Deep Equilibrium Models](https://arxiv.org/abs/2003.04887)：从迭代与固定点角度讨论残差式更新的关系。
- [Huang et al. · Densely Connected Convolutional Networks](https://arxiv.org/abs/1608.06993)：对照残差相加与密集连接的不同信息组合方式。

**前馈网络（`feed-forward-network`）**
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：定义 Transformer 的 position-wise feed-forward network。
- [PyTorch · TransformerEncoderLayer](https://pytorch.org/docs/stable/generated/torch.nn.TransformerEncoderLayer.html)：展示 self-attention、feed-forward、dropout、norm 与维度配置。
- [Dive into Deep Learning · Transformer](https://d2l.ai/chapter_attention-mechanisms-and-transformers/transformer.html)：解释 Transformer block 中注意力、FFN 与残差的分工。
- [PyTorch · GELU](https://pytorch.org/docs/stable/generated/torch.nn.GELU.html)：给出 FFN 常用非线性激活的实现定义。
- [PyTorch · Linear](https://pytorch.org/docs/stable/generated/torch.nn.Linear.html)：说明线性层的输入输出维度与仿射变换。

**位置编码（`positional-encoding`）**
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：提出 Transformer 的正弦位置编码并说明其加入输入表示。
- [Dive into Deep Learning · Positional encoding](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html)：推导正弦/余弦位置编码与序列顺序的作用。
- [Devlin et al. · BERT](https://arxiv.org/abs/1810.04805)：说明可学习绝对位置嵌入在 Transformer 编码器中的使用。
- [Su et al. · RoFormer](https://arxiv.org/abs/2104.09864)：介绍把位置信息注入 Q/K 内积的旋转位置方法。
- [PyTorch · Transformer](https://pytorch.org/docs/stable/generated/torch.nn.Transformer.html)：展示 Transformer 的序列形状、mask 与位置信息需由模型/输入提供。

**旋转位置嵌入（`rotary-position-embedding`）**
- [Su et al. · RoFormer](https://arxiv.org/abs/2104.09864)：提出 Rotary Position Embedding，并分析相对位置内积。
- [Dive into Deep Learning · Self-attention and positional encoding](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html)：提供位置编码和注意力关系的数学背景。
- [Touvron et al. · Llama 2](https://arxiv.org/abs/2307.09288)：记录大语言模型中 RoPE 与上下文长度配置的实际使用。
- [Hugging Face · RoPE utilities](https://huggingface.co/docs/transformers/main/en/internal/rope_utils)：说明不同模型的 rope_type、参数和 scaling 配置。
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：提供 Q/K/V 注意力与位置机制的原始 Transformer 背景。

**注意力头（`attention-head`）**
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：提出 multi-head attention 的 Q/K/V 投影、拼接与输出投影。
- [Dive into Deep Learning · Multi-head attention](https://d2l.ai/chapter_attention-mechanisms-and-transformers/multihead-attention.html)：从张量形状解释多个头如何并行计算和合并。
- [PyTorch · MultiheadAttention](https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html)：说明 embed_dim、num_heads、mask 与 Q/K/V 输入。
- [Voita et al. · Analyzing Multi-Head Self-Attention](https://arxiv.org/abs/1806.05152)：分析不同头的功能与跨输入行为，提醒语义解释需要证据。
- [Michel et al. · Are Sixteen Heads Really Better than One?](https://arxiv.org/abs/1905.09418)：用消融研究多头冗余与剪枝影响。

**序列到序列（`sequence-to-sequence`）**
- [Sutskever et al. · Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)：提出经典 encoder-decoder Seq2Seq 架构。
- [Cho et al. · Learning Phrase Representations using RNN Encoder-Decoder](https://arxiv.org/abs/1409.0473)：介绍 RNN encoder-decoder 与变长序列映射。
- [Vaswani et al. · Attention Is All You Need](https://arxiv.org/abs/1706.03762)：用 Transformer 的 self-attention/cross-attention 实现序列到序列。
- [Hugging Face · Translation task](https://huggingface.co/docs/transformers/main/en/tasks/translation)：展示现代 Seq2Seq 翻译训练、生成与评估接口。
- [PyTorch · Seq2Seq translation tutorial](https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html)：以翻译任务演示 encoder、decoder、teacher forcing 与注意力。

## 逐条实现记录

每条都在前一条通过 review 后才进入下一条；这不是十条一起生成。

| 顺序 | slug | 内容提交 | 修正提交 | 审查 |
| --- | --- | --- | --- | --- |
| 01 | `logit` | `552aedd0` | `—` | PASS |
| 02 | `softmax` | `9118ebde` | `3750514c` | PASS |
| 03 | `activation-function` | `7f001cf1` | `—` | PASS |
| 04 | `layer-normalization` | `5989f75c` | `52013f45` | PASS |
| 05 | `residual-connection` | `08c8029c` | `1738f386` | PASS |
| 06 | `feed-forward-network` | `57287f6e` | `—` | PASS |
| 07 | `positional-encoding` | `66ae55ea` | `—` | PASS |
| 08 | `rotary-position-embedding` | `6803ba99` | `—` | PASS |
| 09 | `attention-head` | `8a9c941a` | `—` | PASS |
| 10 | `sequence-to-sequence` | `c44712f6` | `46e87faa` | PASS |

其中 `logit` 修正了 T=0.7 下的分布数值并移除多分类误导别名；`softmax` 修正了两档温度的数学结果并补充 T>0；`layer-normalization` 补了按特征列的 batch 对照；`residual-connection` 补了 3→4 projection 和完整梯度边界；`sequence-to-sequence` 改为明确的英语到中文翻译例。

## 发布前验收

- 十个 slug 在 `content/zh/published-terms.json` 本次一次性加入；在此之前均只存在于批次、体验和研究台账。
- 单条检查：`node --experimental-strip-types --test tests/term-library.test.mjs`、`npm run typecheck`、`git diff --check` 已在每条提交前通过。
- 来源 URL 批量检查：36 个唯一 URL 全部 HTTP 200。
- 整批检查：`npm run audit:terms` 通过（372 条唯一体验，流程类 44/372 = 11.8%，本批新增 0 条，重复场景 0）；`npm run build` 通过（静态页 1111/1111）；`node --experimental-strip-types --test tests/term-library.test.mjs` 8/8；`npm run typecheck` 通过；`git diff --check` 通过。
- 生产前真实浏览器检查：十个公开路由均能打开，标题、正文、来源和各自 sceneKind 均存在，无 404。

## 发布记录

- GitHub PR：[#454](https://github.com/Gyschuaner/VibePolaris/pull/454)，已合并到 `main`；合并提交 `2c2d6234d703bcb44a5bb4c71d6802ff3dfb67db`。
- 镜像：`vibepolaris:2c2d6234d703bcb44a5bb4c71d6802ff3dfb67db`。
- 生产 release：`/opt/vibepolaris/releases/20261007T221342Z-2c2d6234`；当前 symlink 已切换到该目录，容器 `vibepolaris-web-1` healthy。
- 备份：`/opt/vibepolaris/backups/20261007T221342Z-from-575e0b03bcebc7ad182c7f2f8fa08af633c2b151`，含旧 compose、旧镜像检查信息、容器检查信息和 SQLite 在线备份 `sqlite/xiaobei.sqlite`。
- 回滚：`/opt/vibepolaris/releases/20261007T221342Z-2c2d6234/rollback.sh`，恢复旧 release 和旧镜像，保留持久化数据卷。
- 服务器本机经 Caddy 检查十个新路由全部 HTTP 200；根路径返回既有 308 规范化跳转。操作机直接访问公网域名时出现 `SSL_ERROR_SYSCALL`，因此不把它当作公网成功证据。
- DP：已先查询 deployment 列表，再用幂等 ID `deploy-vbp102-model-architecture-prod-20261008` 按完整提交记录生产发布，并按规则原样重试一次；两次均因 `SSL: UNEXPECTED_EOF_WHILE_READING` 无法连接，未伪造 DP 记录。
- 当前机器不存在 `D:/Obsidian/gysnote`，本次跳过 Obsidian 记录。
