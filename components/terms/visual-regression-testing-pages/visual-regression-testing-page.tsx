import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { visualRegressionTestingSources } from "@/lib/visual-regression-testing-sources";
import { VisualRegressionTestingHero } from "./visual-regression-testing-hero";
import { VisualRegressionTestingLesson } from "./visual-regression-testing";

const sections: [string, string][] = [
  ["vrt-definition-section", "先把画面变成可重复的输入"],
  ["vrt-threshold-section", "diff 是线索，不是结论"],
  ["vrt-environment-section", "渲染环境也是测试数据"],
  ["vrt-review-section", "基线更新要经过意图审查"],
];

export function VisualRegressionTestingTermPage() {
  return <Article slug="visual-regression-testing" title="视觉回归测试" subtitle="Visual Regression Testing · 用截图差异守住界面变化" sources={visualRegressionTestingSources} sections={sections} hero={<VisualRegressionTestingHero />} intro={<>视觉回归测试把同一条页面路径在受控环境中渲染成截图，再与已确认的 baseline 比较。<strong>它擅长发现“画面变了”，但不会自动判断变化是 bug 还是有意设计；最后的决定仍需要把差异放回任务、无障碍和响应式边界里。</strong></>}>
    <ArticleSection id="vrt-definition-section" title="先把画面变成可重复的输入">
      <p id="vrt-definition" className="vp-citation-target">视觉比较通常需要一张参照截图和一次候选截图，再按像素或区域计算差异。Playwright、Storybook 和 WebdriverIO 都把截图比较作为测试流程的一部分，但具体 API、阈值和基线管理方式由工具决定。<Cite id="vrt-definition" sources={visualRegressionTestingSources} /></p>
      <p id="vrt-workflow" className="vp-citation-target">一条可用的流程应固定页面数据、视口、字体、动画和等待条件，生成候选后把差异交给 review；确认有意变化后才更新参照。<Cite id="vrt-workflow" sources={visualRegressionTestingSources} /></p>
      <p>首图把 baseline、candidate 和 diff 摆在同一条线上：测试不是“截图越多越好”，而是让每张图对应一条能稳定复现的用户路径。</p>
      <VisualRegressionTestingLesson />
    </ArticleSection>

    <ArticleSection id="vrt-threshold-section" title="diff 是线索，不是结论">
      <p id="vrt-threshold" className="vp-citation-target">截图比较通常允许像素差异阈值或比例，以减少抗锯齿和微小渲染噪声造成的误报；阈值应结合页面风险设定，不能用一个宽松数字掩盖布局错位。<Cite id="vrt-threshold" sources={visualRegressionTestingSources} /></p>
      <p id="vrt-review" className="vp-citation-target">差异审查要判断变化意图：文案、颜色、间距、字体、断点和错误状态都可能是设计变更，也可能是回归。自动门禁负责把未知变化留给人看，不负责替人批准。<Cite id="vrt-review" sources={visualRegressionTestingSources} /></p>
      <p><strong>读 diff 时先找形状：</strong>整块位移、文字换行、按钮消失、遮挡和焦点不可见，比一两个抗锯齿像素更值得优先调查。</p>
    </ArticleSection>

    <ArticleSection id="vrt-environment-section" title="渲染环境也是测试数据">
      <p id="vrt-environment" className="vp-citation-target">devicePixelRatio 会影响 CSS 像素如何映射到设备像素，也会改变截图的尺寸和细节；浏览器版本、字体加载、颜色方案、动画时序和 viewport 同样可能改变结果。<Cite id="vrt-environment" sources={visualRegressionTestingSources} /></p>
      <p>把环境写进测试记录：浏览器与版本、操作系统、DPR、字体、时间、随机种子、网络数据和 reduced-motion 偏好。环境没锁住时，失败截图先回答的是“这次机器不同”，不是“产品真的回归”。</p>
      <p>桌面 baseline 也不能覆盖窄屏。关键断点、键盘焦点、错误和空状态应该拥有自己的参照，不要把一张 1280px 截图拉伸成全站质量证明。</p>
    </ArticleSection>

    <ArticleSection id="vrt-review-section" title="基线更新要经过意图审查">
      <p>更新 baseline 是一次产品判断：如果按钮颜色、文案或布局确实按需求改变，提交说明和 review 应能解释它；如果只是因为字体没加载或数据不稳定，更新基线只会把噪声保存下来。</p>
      <p><strong>最后做一次回放：</strong>让同一条路径连续跑两次，确认环境稳定；制造一个明确的布局变化，确认 diff 能挡住；再制造一个已批准的设计变化，确认 review 能留下理由；最后在窄屏和 reduced motion 下重跑。</p>
    </ArticleSection>
  </Article>;
}
