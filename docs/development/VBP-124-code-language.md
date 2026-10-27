# VBP-124：代码块语言标签

用户希望代码块右上角显示语言名称，例如 CSS、Python。关联既有 VBP-103，研发、验收与 dev 集成负责人顾毅盛；任务 `e9f29b72-6763-4720-8302-e1d4ff6a4eab`。

画布共享 MarkdownDocument 读取围栏已有的 language 类，统一常见别名与大小写；未知语言显示原名称，未标注不猜测。标签位于代码 pre 之外，禁止选中且单独定位，代码保留横向滚动。CSS 为标签预留顶部空间。Mermaid 仍走原图表渲染，行内代码不受影响；没有新增依赖、检测语言或改写正文。语言类允许字符补充加号、井号与点，兼容 C++、C# 等常用围栏名称，其余清理规则不变。

`npm run build` 通过，BUILD_ID `pdcTjOPPKEJK4IYmuuSmm`。没有为这项低影响展示变更新增单元测试或执行全站检查。

真实 Chrome 操作独立 QA 账号和合成笔记：编辑预览、草稿阅读、文章阅读均有 CSS、Python、JavaScript、C++、C# 与未知语言标签；无语言围栏没有标签，行内代码及 Mermaid 图表正常。标签底部均在代码首行之上；长行横向滚动从 0 到 2940 px，标签横坐标保持 844.68 px。三种视图的全部代码 DOM 文本一致。导出 Markdown 去除既有节点元数据头后与 1,051 字符原稿完全相同。点击复制提示“已复制 Markdown”，工具自动读取剪贴板为空，未把该结果当作复制内容证据，内容保护依据为代码文本及实际导出比对。

[预览截图](VBP-124-code-language/preview.png) · [阅读截图](VBP-124-code-language/read.png) · [浏览器结果](VBP-124-code-language/browser.json)

验收用例 `0cc59bc2-ecad-479f-b14a-abb0ade62e85`，dev-local 计划 `8d3ab069-7c94-4a81-a6fb-3d4ce7aafa45`。仅操作隔离合成笔记，未修改个人生产画布。生产发布需本项明确授权。

[PR614](https://github.com/Gyschuaner/VibePolaris/pull/614) 已合入 dev `ee3ff10a3df4876c5ca628683ef22cd6f4bebd0e`，与实测构建全部非 docs 路径一致。dev-local 部署 `vbp-124-code-language-dev-20261027` 已记录；合并后真实浏览器刷新确认 9 个代码块、8 个标签与 Mermaid 图表，控制台无警告和错误。上述计划 completed，1/1 passed；任务 done，VBP-124 ready_for_release。

生产候选 `feat/VBP-124-production` 从当前 main 选择性应用本项变更，不包含 dev 的其他内容。候选源码 `0b3f3508c33809a8bc63eccadc33f11c985b5626` 再次构建通过，BUILD_ID `USqoCOBdt5nrcMS2X44Jp`，本机启动后预览标签一致，控制台无警告错误。尚未合并 main 或部署生产。

当前机器不存在规则指定的 D:/Obsidian/gysnote，跳过该库写入；没有新建正式飞书文档。
