import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { conversionRateSources, focusManagementSources, funnelSources, iterationSources } from "@/lib/product-design-sources";
import { ConversionRateLesson, FocusManagementLesson, FunnelLesson, IterationLesson } from "./ProductDesignLessons";
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

const conversionRateSections: [string, string][] = [
  ["conversion-rate-definition", "先把起点和完成事件说清楚"],
  ["conversion-rate-formula", "同一批用户，分子换了，结果就换了"],
  ["conversion-rate-boundary", "百分比离不开时间窗和去重"],
];

function ConversionRateHero() {
  return <figure className={styles.miniHero} aria-label="转化率由完成用户除以起点用户得到"><div className={styles.miniTop}><span>同一个起点，不同完成事件</span><strong>RATE · 03</strong></div><div className={styles.conversionMini}><div className={styles.conversionMiniCard}><small>起点</small><strong>1000</strong><span>users</span></div><div className={styles.conversionMiniArrow} aria-hidden="true">÷</div><div className={styles.conversionMiniCard}><small>完成</small><strong>120</strong><span>24h · 12%</span></div></div><p className={styles.miniCaption}>数字前先写口径：谁进入、谁完成、何时完成。</p></figure>;
}

export function ConversionRateTermPage() {
  return <Article slug="conversion-rate" title="转化率" subtitle="Conversion Rate · 先固定口径，再读百分比" sources={conversionRateSources} sections={conversionRateSections} hero={<ConversionRateHero />} intro={<>“1000 人进来，120 人完成”看起来只需要做一道除法。<strong>真正决定转化率的是分母、完成事件、去重方式和时间窗</strong>；其中任何一项变化，百分比就不再是同一个指标。</>}>
    <ArticleSection id="conversion-rate-definition" title="先把起点和完成事件说清楚">
      <p id="conversion-event" className="vp-citation-target">分析工具把用户行为记录成事件，并用事件参数补充页面、按钮或结果等上下文。<Cite id="conversion-event" sources={conversionRateSources} />“看到注册页”“提交表单”和“验证邮箱”是三个不同事件，不能只用一个含糊的“注册”替代。</p>
      <p id="conversion-params" className="vp-citation-target">开始计算前，要把起点和完成事件写成可以被记录的条件。<Cite id="conversion-params" sources={conversionRateSources} />本例把首次到达注册页作为起点，把验证邮箱作为完成；只提交表单的人仍然在途中。</p>
    </ArticleSection>
    <ArticleSection id="conversion-rate-formula" title="同一批用户，分子换了，结果就换了">
      <p id="conversion-formula" className="vp-citation-target">用户级转化率可以写成“在规定窗口内完成全部步骤的独立用户 ÷ 进入第一步的独立用户”。<Cite id="conversion-formula" sources={conversionRateSources} />用提交表单做完成事件，180 ÷ 1000 得到 18%；换成验证邮箱，120 ÷ 1000 就变成 12%。</p>
      <ConversionRateLesson />
      <p id="conversion-steps" className="vp-citation-target">漏斗报告会按有序步骤筛选用户，分母和每一步的完成人数都依赖这些步骤定义。<Cite id="conversion-steps" sources={conversionRateSources} />所以“注册按钮点击量 ÷ 页面访问量”只有在两者单位、用户集合和窗口都对齐时，才可以称为一项可比的转化率。</p>
    </ArticleSection>
    <ArticleSection id="conversion-rate-boundary" title="百分比离不开时间窗和去重">
      <p id="conversion-users" className="vp-citation-target">“用户”是去重后的主体，“事件次数”是行为发生的次数，两者不是同一个分子。<Cite id="conversion-users" sources={conversionRateSources} />同一用户重复提交三次，按用户统计仍可能只算一个完成者；按事件统计则会得到三次。</p>
      <p id="conversion-dedup" className="vp-citation-target">时间窗也会改变结果。<Cite id="conversion-dedup" sources={conversionRateSources} />24 小时内验证的 120 人和一小时内验证的 90 人，分别得到 12% 与 9%，不能把后者当成页面突然变差的证据。</p>
      <p id="conversion-window" className="vp-citation-target">排查数字时，先保存起点事件、完成事件、去重单位和窗口，再谈增长或下降。<Cite id="conversion-window" sources={conversionRateSources} />窗口越长，等待完成的人越可能被计入；这不是单纯的“好”或“坏”，而是另一套测量问题。</p>
      <ArticleAside title="百分比没有上下文就无法比较"><p>两个团队都说“转化率 12%”，还不能说明表现相同。要先问他们从哪里开始计数、按用户还是事件去重、等待多久、是否允许跳过中间步骤。</p></ArticleAside>
    </ArticleSection>
  </Article>;
}

const funnelSections: [string, string][] = [
  ["funnel-definition", "先把已经知道的路径写成步骤"],
  ["funnel-count", "人数变化只定位位置，不解释原因"],
  ["funnel-boundary", "开放性、顺序和时间窗都会改口径"],
];

function FunnelHero() {
  return <figure className={styles.miniHero} aria-label="漏斗按顺序筛掉用户并显示每一步人数"><div className={styles.miniTop}><span>同一批用户，经过三道闸门</span><strong>FUNNEL · 04</strong></div><div className={styles.funnelMini}><div className={styles.funnelMiniRow}><span>到达</span><div className={styles.funnelMiniTrack}><div className={styles.funnelMiniBar} style={{ width: "100%" }} /></div><strong>1000</strong></div><div className={styles.funnelMiniRow}><span>填写</span><div className={styles.funnelMiniTrack}><div className={styles.funnelMiniBar} style={{ width: "42%" }} /></div><strong>420</strong></div><div className={styles.funnelMiniRow}><span>验证</span><div className={styles.funnelMiniTrack}><div className={styles.funnelMiniBar} style={{ width: "12%" }} /></div><strong>120</strong></div></div><p className={styles.funnelMiniNote}>它能标出哪一关掉人，不能替你猜出为什么。</p></figure>;
}

export function FunnelTermPage() {
  return <Article slug="funnel" title="漏斗" subtitle="Funnel · 按顺序看用户在哪一步离开" sources={funnelSources} sections={funnelSections} hero={<FunnelHero />} intro={<>漏斗把一条已经知道的用户路径拆成有顺序的事件，观察同一批人从第一步走到后面还剩多少。<strong>它负责定位流失发生在哪一关，不负责替你解释用户为什么离开</strong>；后一个问题要靠日志、研究或实验继续查。</>}>
    <ArticleSection id="funnel-definition" title="先把已经知道的路径写成步骤">
      <p id="funnel-route" className="vp-citation-target">只有当你已经知道要观察哪条路径，漏斗才有用：例如“到达注册页 → 填写表单 → 验证邮箱”。<Cite id="funnel-route" sources={funnelSources} />每一步都要对应一个能被记录的事件，顺序和进入第一步的用户集合也要写清楚。</p>
      <p id="funnel-steps" className="vp-citation-target">分析工具通常把漏斗步骤写成事件或字段过滤条件，并按这些条件生成每一步的用户数。<Cite id="funnel-steps" sources={funnelSources} />本例把 1000 个到达注册页的人作为起点，再看其中多少人填写、验证。</p>
      <FunnelLesson />
    </ArticleSection>
    <ArticleSection id="funnel-count" title="人数变化只定位位置，不解释原因">
      <p id="funnel-dropoff" className="vp-citation-target">每一栏都可以读成“走到这一步的用户”和“从上一步掉下去的用户”。<Cite id="funnel-dropoff" sources={funnelSources} />1000 人到 420 人说明第一段掉得多，但它没有告诉你是验证码、表单长度还是网络问题。</p>
      <p id="funnel-scope" className="vp-citation-target">漏斗适合回答“哪一关流失最多”“完整路径完成了多少”，不适合在未知路径时探索用户所有可能的路线。<Cite id="funnel-scope" sources={funnelSources} />如果你还不知道用户会怎么走，应先用路径分析、访谈或录屏找到候选路径。</p>
    </ArticleSection>
    <ArticleSection id="funnel-boundary" title="开放性、顺序和时间窗都会改口径">
      <p id="funnel-order" className="vp-citation-target">封闭漏斗要求用户先进入第一步，再按定义的顺序完成后续步骤；开放漏斗可以允许用户从中间步骤进入。<Cite id="funnel-order" sources={funnelSources} />两种模式回答的不是同一个问题，切换后应重新标记结果。</p>
      <p id="funnel-window" className="vp-citation-target">完成窗口规定用户从进入漏斗到完成全部步骤最长可以等多久。<Cite id="funnel-window" sources={funnelSources} />把 30 分钟改成 10 分钟，会让等待更久的人暂时落在漏斗外，人数下降不必然表示体验变差。</p>
      <p id="funnel-open" className="vp-citation-target">发现某一步掉得多之后，下一步是补证据：看失败日志、观察真实任务，或针对一个具体改动做实验。<Cite id="funnel-open" sources={funnelSources} />直接删除步骤或把掉落归因于颜色，都是把定位结果误当成原因。</p>
      <ArticleAside title="先保留口径，再比较版本"><p>比较两个版本时，起点用户、步骤顺序、开放/封闭模式、去重单位和完成窗口都要一致。只要规则换了，图表上的“上升”或“下降”就可能只是测量方式变了。</p></ArticleAside>
    </ArticleSection>
  </Article>;
}
