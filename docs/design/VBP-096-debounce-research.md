# VBP-096 防抖资料笔记

这次只记录已经打开并阅读、且实际用于正文的资料。示例中的计时数字是教学设定，不是这些库的默认值。

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 连续调用属于同一批，最后一次调用后的静默窗口结束才到 trailing edge | [MDN Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) | MDN 的示例用 10ms 说明批次与 trailing edge；本文把时间改成 300ms 只为便于观察 | `debounce-definition` |
| 等待时间从最近一次调用重新计算，并把最后一次参数交给回调 | [Lodash `_.debounce`](https://lodash.com/docs/4.17.15#debounce) | Lodash 4.18.1 文档页目前承载同一 API 说明；正文不把其选项当成所有实现共有 | `debounce-window` |
| 响应式流可以按时间窗口只发出最近值 | [RxJS `debounceTime`](https://rxjs.dev/api/operators/debounceTime) | RxJS 页面需要浏览器脚本渲染；只采用 API 名称和公开定义，不据此推导请求取消 | `debounce-stream` |
| leading/trailing 选择、最近参数以及取消/立即触发是实现选项 | [Underscore `_.debounce`](https://underscorejs.org/#debounce) | Underscore 文档明确说明 `immediate` 与 `.cancel()`；本文把它们限定为待处理回调的生命周期 | `debounce-leading`, `debounce-boundary` |

## 写作和验收记录

- 读者场景：搜索框输入仍在变化，读者要判断什么时候可以安全触发一次昂贵操作。
- 读者应能复述：防抖移动的是“允许触发的截止时间”；它不取消已经发出的请求，也不保证响应顺序。
- 动画初态是三笔事件尚未安静，操作会让同一条截止线逐次后移；终态只出现一个提交值。正文实验使用真实本地 `setTimeout`，输入变化会清理旧计时器。
- 迁移例子：按钮防连点可能需要 leading；滚动持续刷新更接近节流。两者不与搜索框的 trailing 例子混为一谈。
