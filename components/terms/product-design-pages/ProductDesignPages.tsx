import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { focusManagementSources } from "@/lib/product-design-sources";
import { FocusManagementLesson } from "./ProductDesignLessons";
import styles from "./ProductDesignConcepts.module.css";

const focusSections: [string, string][] = [
  ["focus-management-definition", "先分清：谁正在接收键盘输入"],
  ["focus-management-dialog", "对话框打开后，焦点要有去处"],
  ["focus-management-order", "顺序和可见提示要一起成立"],
];

function FocusManagementHero() {
  return <figure className={styles.miniHero} aria-label="焦点从触发按钮移动到对话框，再回到原位置"><div className={styles.miniTop}><span>焦点跟着任务移动</span><strong>FOCUS · 01</strong></div><div className={styles.focusMini}><div className={styles.focusPane}><small>背景页面</small><span>打开设置</span><span className={styles.focusFakeButton}>触发</span></div><div className={styles.focusPane} data-dialog="true"><small>前景对话框</small><span>输入 → 保存</span><span className={styles.focusFakeButton}>返回原位</span></div></div><p className={styles.miniCaption}>打开时进入当前任务，关闭后回到触发点。</p></figure>;
}

export function FocusManagementTermPage() {
  return <Article slug="focus-management" title="焦点管理" subtitle="Focus Management · 键盘现在落在哪里" sources={focusManagementSources} sections={focusSections} hero={<FocusManagementHero />} intro={<>键盘用户按下 Tab 时，浏览器必须知道下一个控件是谁。<strong>焦点管理把“当前正在操作的地方”跟界面状态连起来</strong>：打开对话框就进入对话框，关闭后还能回到刚才发起操作的位置。</>}>
    <ArticleSection id="focus-management-definition" title="先分清：谁正在接收键盘输入">
      <p id="focus-sequence" className="vp-citation-target">焦点是键盘输入当前落到的元素。浏览器通常按照 DOM 中的可聚焦顺序移动它，所以按钮、链接和表单控件的排列，决定了用户按 Tab 时会经过什么。<Cite id="focus-sequence" sources={focusManagementSources} />如果视觉顺序和 DOM 顺序相反，读者会看着一处，却操作另一处。</p>
      <p id="focus-order" className="vp-citation-target">一个真实的入口是“打开设置”：点击后任务已经从背景页面切换到对话框，焦点也应同步进入。<Cite id="focus-order" sources={focusManagementSources} />只给容器画一圈 outline，不能让键盘用户知道下一次 Tab 会去哪。</p>
      <FocusManagementLesson />
    </ArticleSection>
    <ArticleSection id="focus-management-dialog" title="对话框打开后，焦点要有去处">
      <p id="focus-dialog" className="vp-citation-target">模态对话框打开时，初始焦点应落在对话框内合适的标题、说明或第一个可操作控件上。<Cite id="focus-dialog" sources={focusManagementSources} />接着按 Tab，焦点应在对话框的控件之间循环，背景内容暂时不能插入这段任务。</p>
      <p id="focus-return" className="vp-citation-target">按 Escape 或关闭按钮结束任务后，焦点通常回到打开对话框的触发控件。<Cite id="focus-return" sources={focusManagementSources} />如果触发点已经消失，才需要根据流程选择一个仍然合理的落点；不能把焦点随手丢到页面顶部。</p>
      <ArticleAside title="模态不等于“加一个 aria-modal”"><p><code>aria-modal</code> 只描述真正限制背景交互的模态对话框。若背景仍然可以操作，就不应只靠这个属性制造“焦点已经被锁住”的假象；焦点移动、背景可操作性和关闭后的返回点必须相互匹配。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="focus-management-order" title="顺序和可见提示要一起成立">
      <p id="focus-visible" className="vp-citation-target">读者需要看见当前焦点。<Cite id="focus-visible" sources={focusManagementSources} />清除浏览器默认轮廓后，应提供足够明显的替代样式；颜色不能是唯一线索，边框、底色或形状也要在主题切换后保持可辨认。</p>
      <p>排查焦点问题时，可以先用键盘走一遍：入口是否按预期出现？打开弹层后有没有跳到背景？连续 Tab 能否完成任务？关闭后是否回到原来的触发点？这些问题比“页面看起来有没有焦点圈”更接近真实使用。</p>
      <p>焦点管理不是给所有元素加 <code>tabindex</code>。优先使用原生按钮、链接和表单控件；只有需要脚本把焦点送到一个非交互容器时，才考虑 <code>tabindex=-1</code>，并为这次移动写清楚原因。</p>
    </ArticleSection>
  </Article>;
}
