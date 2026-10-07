# VBP-097 多模态词条研究与实现记录

## 读者任务

读者在上传截图、票据或照片后问“图里是什么”。读完后应能判断：图片是否真的进入这次请求、文字问题怎样限定要看的区域、回答能否回到原图复核，以及缺少图片时为什么不能猜。

主线场景是一张登机牌。文字问题先说“读出日期”，但没有票面图片；加入图片后，取景框圈出 `DATE` 字段，回答显示 `2026 · 10 · 03`；移除图片后，回答变成缺少图像证据。这个变化只改变一个条件：请求里有没有票面。

## 已核对资料

| 来源 | 实际支持的论断 | 页面位置 |
| --- | --- | --- |
| OpenAI, Images and vision | 图片是请求内容块，可以用 URL、Base64 或文件 ID提交，图片会计入输入 | `multimodal-input` |
| Google, Image understanding | 视觉模型支持图像描述、分类、视觉问答等任务；图片可以通过 URL、内联数据或 File API 输入，并有安全与质量边界 | `multimodal-capability`, `multimodal-boundary` |
| Radford et al., CLIP | 图片与文字的匹配训练可以把自然语言用于指向视觉概念，但匹配能力不等于对任意细节的核验 | `multimodal-alignment` |
| Alayrac et al., Flamingo | 视觉模型与语言模型需要连接机制，并能处理交错的图片与文字序列 | `multimodal-bridge` |
| NIST, Generative AI Profile | 多模态生成会影响人和机器对图像、音视频证据的判断，需要保留风险与核验边界 | `multimodal-risk` |

## 演示契约

- 初态：文字条件存在，票面图片缺失，结果卡显示无法读取。
- 操作：推进到“票面进来”，再推进到“取景对准”；切换问题可把取景框移到 `DATE` 或 `GATE`；移除图片回到缺证据状态。
- 可见证据：票面字段的高亮框、输入块状态、回答是否能落回字段。
- 停止：没有图片时不显示日期或登机口的成功答案。
- 独立差异：首图使用“取景框/票面”而不是节点连线；正文实验让问题移动取景框，移除材料会让回答范围退回。

## 实现映射

- `components/terms/MultimodalConceptPage.tsx`：独立 Hero 与本地取景实验，演示不调用模型。
- `components/terms/MultimodalConceptPage.module.css`：票面、取景框、缺证据状态和窄屏排版。
- `lib/multimodal-sources.ts`：正文、书目与来源顺序的单一映射。
- `content/zh/term-research/ai-stack.json`：机制、误解、5 帧签名和来源 URL。
- `content/zh/term-experiences/ai-stack.json`：体验台账，5 帧与 Hero 同步。
- `content/zh/term-batches/ai-stack.json`：发布批次元数据，保留 schema 要求的 3 个 demo steps。
- `app/terms/[slug]/page.tsx`：`multimodal` 路由改接独立页面。

## 验收记录

- 来源 URL：OpenAI、Google、CLIP、Flamingo、NIST 均实际打开并读取；网页工具返回 200/可读正文。
- 待实现后检查：JSON 解析、`git diff --check`、`npm run typecheck`、`npm run build`；本地浏览器桌面与窄屏各检查一次，覆盖首图 5 帧、切换问题、移除图片和重播。
- 语言审读：删除“模型突然会看”等宣传式表述，保留输入条件、表示对齐和证据边界；不把演示数字写成实时模型测量。
