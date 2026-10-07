# VBP-097 分词研究与演示契约

## 读者任务

读者在模型设置、上下文窗口或计费说明里看到 token 时，最容易把它理解成“一个字”或“一个词”。读完本页，读者应能用自己的话说出：token 是某个具体 tokenizer 的片段单位；空格、语言、代码、词表和版本都可能改变切分；要估算请求长度，必须用目标模型对应的编码器实际计数。

## 资料核对

| 论断 | 采用的资料 | 页面位置 |
| --- | --- | --- |
| 模型通过编码器接收 token 序列，BPE 可编码、解码，并可按模型选择编码器 | OpenAI tiktoken README | `What is BPE anyway?`、`encoding_for_model` 示例 |
| 预算应交给对应编码器计数，而不是按字符猜 | OpenAI Cookbook · How to count tokens with tiktoken | 示例 notebook 的编码与计数步骤 |
| BPE、Unigram、WordPiece 属于子词方法；BPE 会从基础片段反复合并常见相邻片段 | Hugging Face Transformers · Tokenization algorithms | `Subword tokenization`、`Byte pair encoding` |
| SentencePiece 把分词设计成语言无关的子词切分与还原 | Kudo、Richardson · SentencePiece | 论文标题与摘要 |
| 子词单元可处理罕见词，减少必须把整词收进词表的压力 | Sennrich、Haddow、Birch · Neural Machine Translation of Rare Words with Subword Units | 论文摘要与方法动机 |

## 场景契约

- 初始对象：字符串 `CSS 很好用`，它仍保持人眼看到的顺序。
- 操作：把字符串放入“压板”，先露出空格边界，再按 BPE 示意合并常见片段，最后贴上教学编号；终局并排换成按词示意。
- 对象变化：字符串变成片段，片段合并成不同大小的 token，编号随着编码器重算。
- 可见证据：片段的数量、边界和编号实际换位；没有调用模型，也没有把示意 ID 说成生产词表。
- 停止条件：完成并排比较后停住，读者可以逐帧回看或在正文工作台切换字符串、编码器和编号显示。
- 重置：恢复 `CSS 很好用`、BPE 示意和显示编号，不保留上一次选择。

## 实现取舍

首图使用压板和 token 磁片，把“切分”和“编号”拆成两个可观察动作，避免复用上下文页的卡片堆叠或路线流程图。正文先解释片段是什么，再解释边界为什么由编码器决定，接着说明计数如何进入预算，最后给出实际检查步骤。工作台使用三组固定教学字符串和两种示意切法，所有编号均标注为教学数据，满足本地无模型调用和可重复验证。

