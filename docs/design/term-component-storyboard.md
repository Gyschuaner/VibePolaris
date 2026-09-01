# VBP-001 · Component 词条逐页设计卡

## 这页只讲什么

组件的核心不是“三步流程”，而是 **一份定义被多次调用**：调用者传入不同数据，页面得到多个独立实例；组件定义发生变化时，所有实例一起遵循新规则。

## 不讲什么

- 不把组件等同于 React 组件。
- 不展开虚拟 DOM、渲染性能或框架生命周期。
- 不用“代码超过多少行”判断是否拆组件。

## 动画分镜

1. 只出现 `UserCard` 定义，强调结构、样式、交互属于同一个可命名单元。
2. 三组不同 props 进入同一个定义，调用参数按顺序出现。
3. 三张同构、内容不同的用户卡片成为可见实例。
4. 定义中新增“查看资料”，三张实例同步出现按钮，画面直接显示“1 个改动 → 3 个实例更新”。

唯一签名：`component-definition-to-three-instances`。

## 内容边界

- `Props` 是本次调用的输入，不由子组件直接改写。
- 多个实例共享定义，但不等于共享每一份内部状态。
- 职责、输入和对外行为说不清时，拆出来只会制造跳转成本。

## 一手来源

- [React · Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React · Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [MDN · Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

