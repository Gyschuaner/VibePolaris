# 第 003 批：事件、事件冒泡、Hook、Effect、浏览器 API · VBP-015

2026-09-21 从 dev `997d470476bf8248c9c5aae3c35227d7efd50374` 开始。旧页为通用场景与短定义，真实浏览器已观察五页；本批替换成独立文章，保留关系和旧锚点。

## 机制差异与场景契约

| 页面 | 首图 / 主体 | 操作与证据 | 正文组织 |
| --- | --- | --- | --- |
| event | 灯与开关；灯光、书页和原生监听器 | 连接监听后点击改变灯；移除监听仍发生 click，但灯不变；重连不重复注册；重置恢复 | 具体反馈、事件对象、简短注册代码、默认行为与业务结果 |
| event-bubbling | 嵌套区域向外扩散；真实三层 DOM 与回调记录 | 收藏按钮的事件经过卡片、列表；停止后祖先冒泡不执行；可记录之前的捕获阶段；新设置清空旧显示 | 嵌套空间、实际调用顺序、target 对照、委托与传播边界 |
| hook | 一份函数下分成两份读数；两个独立计数器 | 真实 useCounter，增减和单独重置不串联；步长改变不清空既有值；整体重置回初值 | 可复用逻辑、精简代码、实例结果、顶层规则与 Effect 清理 |

| effect | 调谐指针与接收器；本地消息频道 | 切换真实订阅；旧频道不再送达，关闭不接收，恢复只收新消息；记录实际 setup/cleanup | 订阅场景、代码旁注、依赖、计算/操作/同步对照 |
| browser-api | 区域伸缩与刻度尺；真实浏览器测量 | 滑块改变 DOM，ResizeObserver 返回宽度；停止冻结，恢复重测；小屏测量真实可用宽度 | 能力分层、宽度实验、代码与结果、权限和业务边界 |

本批根据用户最新“五个词条”要求，由原有三页扩展为五页。DP 的描述、验收和计划已同步，CLI 暂不支持改标题，原需求标题仍保留三个名称。

事件演示实际使用 addEventListener/removeEventListener，冒泡记录来自浏览器回调而非硬编码顺序。动画只用于回看实际记录，不声称浏览器事件以动画速度运行。Hook 演示限定 React 函数组件，不把所有框架的 hook 等同于 React Hook。无网络写入或账号操作。

## 已读来源与正文映射

| 官方来源 | 论断 / 锚点 |
| --- | --- |
| MDN Introduction to events | 通知、监听器与事件对象：event-notification、event-object |
| MDN Element: click event | 原生按钮的键盘激活：event-keyboard |
| MDN removeEventListener | 同一监听函数与捕获选项清理：event-cleanup |
| MDN preventDefault | 默认行为与传播区分：event-default、bubble-default |
| MDN Event bubbling | 冒泡、捕获、委托与目标：bubble-order、bubble-capture、bubble-targets、bubble-delegation |
| MDN stopPropagation | 停止后续传播但不阻止同节点监听或默认行为：bubble-stop |
| MDN Event.bubbles | 不是所有事件都会冒泡：bubble-scope |
| React Reusing Logic with Custom Hooks | 自定义 Hook、逻辑复用及独立状态：hook-reuse、hook-independent、hook-naming |
| React useState | 初始化、函数式更新：hook-initial、hook-update |
| React Rules of Hooks | 本例常规 Hook 的顶层调用：hook-rules |
| React useEffect | 订阅与清理范围：hook-cleanup |

| React Synchronizing with Effects / useEffect / You Might Not Need an Effect | effect-sync、effect-event、effect-cleanup、effect-dependencies、effect-strict、effect-derived |
| MDN Introduction to web APIs / ResizeObserver / Clipboard API | browser-host、browser-layers、browser-measure、browser-disconnect、browser-loop、browser-permission |

均实际阅读对应段落，不引用未读书籍；书目显示完整网址。未确认发布日期则不填写。

## 本批验收与 review

范围：无动画通读和事实映射；五个真实交互、重置、快速重复操作；桌面与 390px、必要键盘；引用开合与回链；旧锚点；构建与最终代码 review。原有公共功能不做全站回归。

2026-09-21 完成内容与代码 review：

- 无动画通读五篇，定义、因果过程和边界为常驻正文。React Hook / Effect 与通用术语区分；stopPropagation 不等于 preventDefault；接口存在不保证调用成功。来源逐项映射，没有补写未读书籍或发布日期。
- 五种主体分别为阅读灯、嵌套 DOM、独立计数器、频道接收器、尺寸测量台；首图与正文节奏随各自机制安排。语义图标承担职责，品牌星星仅由公共壳与星图使用。
- 检查监听器引用及清理、依赖数组、真实回调顺序、状态失效和零值边界。Effect 切换与关闭使用持久消息层淡出，避免立即卸载吞掉过渡；首图复用可见性暂停与重播，没有新增持续动画循环或依赖。
- 最终 `npm run build` 通过：TypeScript 和 312 个静态页面。生成 HTML 的五页内部锚点无缺失/重复，各自六个旧通用锚点保留。`git diff --check` 通过。

| 页面 | 真实浏览器操作与证据 |
| --- | --- |
| event | 连接时开关改变灯；断开后计数继续增加而灯不变；反复重连后 Enter / Space 每次只处理一次；重置回关灯与 0 次。390px 无溢出，灯光与文字正常。引用回到 event-cleanup 并聚焦。 |
| event-bubbling | 正常为按钮→卡片→列表；停止时只留下目标；捕获加停止时保留列表/卡片捕获，之后祖先冒泡消失；重复点击不累计旧回调。窄屏选项与顺序改成纵向，最终观察到完整五步。重置后两个选项关闭、收藏 false、记录 aria-hidden=true 且 inert。引用可展开 bubble-scope 并定位。 |
| hook | 咖啡与门票分别改变；步长改 5 后不清空当前值；最低为 0，减号禁用；单独重置不影响另一实例，整体重置回 2 / 0 / 步长 1。桌面与390px实际画面正常；引用能键盘展开/收起。 |
| effect | 音乐消息计数 1；换天气后再播音乐仍为 1，播天气变 2；关闭再播仍为 2；恢复不补发，双击只增加 2。记录顺序为订阅音乐→取消音乐→订阅天气→取消天气→订阅天气。重置恢复音乐和 0；桌面与390px可操作、无横向溢出。引用展开 effect-strict，hash 与 details 均正确。 |
| browser-api | 桌面 100% 实测 760px；停止观察后缩到45%，最后读数仍760；恢复为342。390px下100%读数346，与DOM真实宽度346一致，页面宽390无溢出。键盘 Home/End、重置、引用展开及 browser-loop 回链焦点正确。 |

实际查看了展开/变化中的画面及终态。Effect 在燕麦背景、苔绿主题下仍清楚可读，检查后恢复雾蓝/陶土；临时窄屏已恢复。

减少动态规则已代码检查，未切换系统偏好做实机验收；如需手动核对，开启系统“减少动态效果”，五页首图应直接可读，所有控件仍可操作。未模拟不支持 ResizeObserver 的浏览器，该分支经代码检查，预期说明不支持且禁用观察开关。没有扩大为全站回归或声称已完成用户视觉验收。

DP 计划 `e654b8ba-1daf-4386-ab4a-86528ff2b820` 覆盖五个实际流程。远端 dev 未配置，使用本地 3001；不发布生产。当前 Mac 不存在指定 Obsidian 路径，记录保存在仓库。
