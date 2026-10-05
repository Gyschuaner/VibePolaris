import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { focusManagementSources, iterationSources } from "@/lib/product-design-sources";
import { FocusManagementLesson, IterationLesson } from "./ProductDesignLessons";
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

const iterationSections: [string, string][] = [
  ["iteration-definition", "先把目标切成可验证的一块"],
  ["iteration-evidence", "结果要回到下一轮"],
  ["iteration-boundary", "迭代也需要停止条件"],
];

function IterationHero() {
  return <figure className={styles.miniHero} aria-label="迭代把增量交付、证据和下一轮决定连起来"><div className={styles.miniTop}><span>交付一小块，读结果，再决定</span><strong>ITERATE · 02</strong></div><div className={styles.iterationMini}><div className={styles.iterationStep}><i /><strong>交付</strong><small>可运行增量</small></div><div className={styles.iterationStep}><i /><strong>观察</strong><small>真实任务证据</small></div><div className={styles.iterationStep}><i /><strong>调整</strong><small>下一轮范围</small></div></div><p className={styles.miniCaption}>每轮改变的是范围和决定，目标仍由证据校准。</p></figure>;
}

export function IterationTermPage() {
  return <Article slug="iteration" title="迭代" subtitle="Iteration · 用一轮结果决定下一轮" sources={iterationSources} sections={iterationSections} hero={<IterationHero />} intro={<>“等全部做完再看”会把错误藏到最后。<strong>迭代是在有限范围内交付可运行结果，再用真实使用、验收或数据决定下一步</strong>；它切的是风险和学习路径，不是把任务随意切成几段。</>}>
    <ArticleSection id="iteration-definition" title="先把目标切成可验证的一块">
      <p id="iteration-service" className="vp-citation-target">服务不会在第一次发布后就自动完成，早些交付一块能工作的范围，才能尽早看到真实用户卡在哪里。<Cite id="iteration-service" sources={iterationSources} />一轮开始前先写清本轮要解决的任务、包含哪些范围，以及什么结果算完成。</p>
      <p id="iteration-increment" className="vp-citation-target">Scrum 把每轮产生的可用结果叫作 Increment；它必须满足团队约定的完成标准，才能成为下一次检查的对象。<Cite id="iteration-increment" sources={iterationSources} />所以“把代码拆成三个分支”不等于完成三轮迭代，分支里还得有读者能验证的行为。</p>
    </ArticleSection>
    <ArticleSection id="iteration-evidence" title="结果要回到下一轮">
      <p id="iteration-research" className="vp-citation-target">研究也可以一轮一轮做：先用小范围任务确认问题，再根据观察到的停顿、失败或遗漏调整下一轮。<Cite id="iteration-research" sources={iterationSources} />这比项目末尾才安排一次“大而全”的验证更容易把问题留在可修改的范围里。</p>
      <IterationLesson />
      <p id="iteration-inspect" className="vp-citation-target">检查结果不是装饰性的复盘。<Cite id="iteration-inspect" sources={iterationSources} />如果用户能完成目标，就可以保留这一块；如果只在某个字段失败，就把下一轮收窄到这个缺口；如果证据不支持原假设，也应允许停止。</p>
    </ArticleSection>
    <ArticleSection id="iteration-boundary" title="迭代也需要停止条件">
      <p id="iteration-loop" className="vp-citation-target">迭代循环的终点不是“总有下一个版本”，而是本轮目标达到、风险已经可接受，或继续投入不再有新的证据。<Cite id="iteration-loop" sources={iterationSources} />每轮都把基本错误处理推给未来，只是在延期，不是在迭代。</p>
      <p id="iteration-success" className="vp-citation-target">先定义成功的观察方式，才能知道下一轮要改什么。<Cite id="iteration-success" sources={iterationSources} />例如“能导出”还不够，至少要说明哪些字段、失败如何提示、用户是否能在规定时间内完成。</p>
      <ArticleAside title="没有证据时，不要把忙碌当成迭代"><p>改了颜色、换了按钮文案、又开了一张任务卡，都可能只是活动。只有当范围、结果和下一步决定之间有可追溯的证据，读者才知道这一轮学到了什么。</p></ArticleAside>
    </ArticleSection>
  </Article>;
}
