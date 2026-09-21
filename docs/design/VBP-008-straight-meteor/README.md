# VBP-008 阅读跳转的直线流星尾

2026-09-21，用户要求把阅读词条跳转时的弯曲飘带改成笔直的流星拖尾。

仅修改app/globals.css的route-meteor-tail及其关键帧：删除弯曲蒙版和45度旋转，使用细长、收尖、尾端透明的直尾。以星体中心为固定端，随父元素的路径切线旋转，飞行中拉长，落地前收短淡出。桌面160×6px，手机112×5px。复用现有820ms飞行、真实落点、清理逻辑和主题颜色；品牌Logo素材不变，无新增依赖。

## 限定验收

- npm run build通过，49静态页面；未运行无关全套检查。
- 1280×720由首页Prompt概念卡点击阅读词条，截图desktop-flight.png可见笔直细尾；中段样式160×6px、mask-image:none、scaleX约0.97、opacity约0.74，父元素offset-rotate:auto。
- 390×844重复阅读跳转，截图mobile-flight.png可见缩短的直尾，中段112×5px、mask-image:none。
- 两次均进入/terms/prompt，结束后飞行层数量0，route-page恢复is-idle，目标星opacity为1；手机页面scrollWidth=390，无横向溢出。
- 浏览器error/warn为空，尺寸与状态证据见measurements.json。临时视口已清除。减少动态既有直接跳转逻辑保持，未切换系统偏好或扩大跨浏览器测试。

DP：VBP-008，实现任务04729333-a6cb-42e3-9769-ef70310d136b，用例888addb4-8607-49e5-8cce-1e2c26e1e8e1，计划24fae274-4d87-4564-94de-35e8015217eb。分支feat/VBP-008-straight-meteor-tail。实际测试执行、dev合并和本地3001部署提交以DP为准。需求原有其他待回归事项不在本轮范围。

回滚基线e11869a5d6e0d98c6241d43cc860ad4ffcb82d46：独立目录检出、构建并重启本地3001，不清除浏览器数据。远端dev未配置，未部署生产。指定Obsidian路径D:/Obsidian/gysnote在本机不存在，跳过；记录保存于Git和DP，未新建飞书文档。
