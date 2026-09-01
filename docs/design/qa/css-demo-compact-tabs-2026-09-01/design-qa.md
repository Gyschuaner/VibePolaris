# CSS 演示切换器位置与尺寸 QA

- DP 任务：CSS 响应式演示切换器位置与尺寸收敛
- 页面：`/terms/css`
- 调整：将三步切换器移入固定舞台左上角，并缩小胶囊、字号、按钮高度和间距。

## 桌面

- 切换器相对舞台：顶部 12px、左侧 24px。
- 切换器尺寸：约 263 × 38px。
- 三个步骤切换后，舞台高度均为 432px，内部演示高度均为 352px。
- 无横向溢出；控制台无 warning/error。

## 手机

- 三步切换器保持单行，隐藏数字前缀以降低噪声。
- 按钮最小高度 30px，仍可完整点击。
- 390px 视口无横向溢出。

## 证据

- `01-compact-tabs-desktop.png`
- `02-compact-tabs-mobile.png`

final result: passed
