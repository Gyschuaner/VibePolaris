# VBP-097 · temperature 词条研究与演示记录

## 读者问题

读者会问：“同一句提示为什么会换词？”读完后应能分辨三件事：温度作用在下一 token 的采样分布；低温和高温改变的是候选机会而不是输入事实；接口范围、默认值和 top-p/top-k 组合必须按目标模型核对。

## 资料与论断

| 顺序 | 资料 | 用于正文 |
| --- | --- | --- |
| 1 | [OpenAI Text generation](https://developers.openai.com/api/docs/guides/text) | 生成结果受模型快照和生成配置影响 |
| 2 | [Google Prompt design strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) | temperature 参与采样；低值通常更确定，高值通常更多样；top-p/top-k 会共同影响候选 |
| 3 | [Google Models](https://ai.google.dev/api/models) | 模型目录分别给出默认 temperature、上限、top-p 与 top-k |
| 4 | [Hugging Face GenerationConfig](https://huggingface.co/docs/transformers/main/en/main_classes/text_generation) | temperature、do_sample、top-k 与 top-p 是不同的生成设置 |
| 5 | [Holtzman et al., The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751) | 相同模型仅改变解码策略也可能改变多样性、流畅度和重复程度 |

## 机制与演示

- 机制：同一提示和三块候选抽签面积 → 温度把面积收尖或铺开 → 同一落点可能落进另一块。
- 不复用旧滑块图：首图用环形抽签盘和一根落针呈现原分布、低温、高温与同一落点换词；不再用流程节点堆出步骤。
- 初始对象：固定的“出门记得___”和候选“带伞、慢走、看路”。
- 操作：逐帧改变温度并落下一根固定落针；正文实验可切换 0.5、1、2，再换落点。
- 可见证据：扇区面积、温度读数、落针位置和被选中的短语。
- 停止：抽签盘只改变生成路径；营业时间等事实不在盘面上，仍需要来源或工具。

## 语言与边界

正文使用“通常”“示意”“按模型接口核对”，不把低温写成准确率开关，也不把某组教学数字写成任意模型的真实概率。实验标注 `NO MODEL CALL`，本地只轮换预写候选。
