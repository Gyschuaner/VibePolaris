# VBP-096 乐观更新资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 临时状态只在 Action 进行时显示，完成后回到真实值 | [React `useOptimistic`](https://react.dev/reference/react/useOptimistic) | React 19.3 API 的行为说明；正文用收藏例子解释，不把它推广成所有框架的实现 | `optimistic-definition`, `optimistic-commit`, `optimistic-failure` |
| 失败时可用快照回滚，成功或失败后再重新取数 | [TanStack Query Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) | 具体 API 是 TanStack Query；本文只抽取“保存旧值—失败回滚—结束后同步”的机制 | `optimistic-rollback`, `optimistic-concurrency` |
| 乐观层与规范缓存分离，响应到达后合并或撤回 | [Apollo optimistic mutation results](https://www.apollographql.com/docs/react/performance/optimistic-ui) | Apollo 的 GraphQL 缓存流程；临时 ID 只在新增对象示例中使用 | `optimistic-layer`, `optimistic-identity`, `optimistic-commit` |
| cache patch 可以在失败时 `undo()`，等待服务端后再做悲观更新 | [Redux Toolkit Manual Cache Updates](https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates) | 页面已跳转到 redux.js.org 的 RTK Query 文档；正文只引用 patch 撤回与等待确认的差别 | `optimistic-rollback`, `optimistic-boundary` |

## 写作和验收记录

- 读者场景：点击收藏后，界面已经亮起，但网络请求还没回来；读者要知道这是不是成功。
- 首图用一张规范状态卡和一张临时贴片表现“覆盖—合并/撕回”，不画三段横向流程。
- 正文实验使用本地 520ms 定时器，成功与失败由读者选择；没有写真实账户，也不把演示数字当作网络测量。
- 边界专门区分请求进行中、服务端事实、失败回滚、并发覆盖与不可逆动作。
