# VBP-097 生成式 AI：研究与演示设计

## 研究结论

生成式 AI 根据输入条件与模型参数生成新的合成内容。文字生成不是从一个固定答案柜里取回整句，而是不断为下一 token 形成候选，再选择并接回序列；提示、模型和生成设置共同影响结果。生成结果的“新”不等于“真”，需要按任务安排检索、工具或人工核验。

| 来源 | 用途 | 页面段落 |
| --- | --- | --- |
| [NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1) | 生成式 AI 定义、可靠性和风险范围 | `gen-definition`, `gen-risk` |
| [OpenAI Text generation](https://platform.openai.com/docs/guides/text?api-mode=responses) | 提示、模型、生成请求与输出 | `gen-prompt`, `gen-output` |
| [Google Gemini text generation](https://ai.google.dev/gemini-api/docs/text-generation) | 文本生成请求和配置 | `gen-output` |
| [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) | 提示/示例影响任务表现的边界 | `gen-prompt`, `gen-generalization` |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 序列中注意力处理位置关系 | `gen-sequence` |

五个来源与现有 research/experience 台账及页面 helper 保持同序；实现前检查来源入口可访问。

## 演示设计

旧首图把“条件→候选→结果”写成抽象流程。本轮改成“种子花园”：左侧是一粒固定提示种子，右侧先空着，再长出三个候选 token，随后一条句子带被点亮，最后并排留下三种措辞；清空种子时，右侧只留下“没有任务条件”的警示。画面变化对应输入、候选、采样、完成和失败五个可观察状态，未展示模型私有思维过程。

正文实验只在浏览器本地轮换预先写好的三条候选句，不调用模型或网络。保留提示时可以再抽一条，清空提示时结果收窄为停止；读者能看到同一提示的不同措辞，却不会把模拟概率误当成真实模型输出。

## 验收

- 首图为有限五帧，有暂停、逐帧、重播，离开视口/切后台/减少动态时停止。
- 三个候选、三条句子和空提示状态在同一画面内有明显但克制的对象变化。
- 本地实验的“保留提示 / 清空提示 / 再抽一条”都能改变结果，且明确不发网络请求。
- 每个事实段落有 citation id，来源无孤立或未映射段落；移动端种子卡和结果卡单列，无横向溢出。
