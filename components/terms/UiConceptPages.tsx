import { ArrowElbowDownRight, Check, Code, CursorClick, FileText, PaperPlaneTilt, SlidersHorizontal, Stack, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleCitation, ArticleAside, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { ComponentLesson, PropsLesson, StateLesson } from "./UiConceptLessons";
import { componentSources, propsSources, stateSources } from "@/lib/ui-concept-sources";
import styles from "./UiConcepts.module.css";

function Anchors({ ids }: { ids: string[] }) {
  return <>{ids.map(id => <span className={styles.anchor} id={id} key={id} aria-hidden="true" />)}</>;
}

export function ComponentTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={componentSources} />;
  return <ConceptArticle slug="component" title="组件" sources={componentSources}
    sections={[["definition", "一份定义，多处使用"], ["instances", "每个实例的状态"], ["composition", "组件也能组合"], ["boundary", "怎样划分组件"]]}
    hero={<ConceptHero slug="component" label="同一份 MemberCard 定义展开为三个成员卡片"><div className={styles.componentHero}><code>MemberCard</code>{[0, 1, 2].map(i => <div className={styles.miniMember} key={i}><UserCircle size={29} weight="light" /><span /></div>)}</div></ConceptHero>}
    intro={<>组件把一块界面的结构和行为组织在一起。<strong>定义写一份，使用时传入不同数据，页面就能得到多个遵循相同规则的实例。</strong></>}
    relatedIntro={<>用 <ConceptTerm slug="props">Props</ConceptTerm> 配置每次使用的输入，用 <ConceptTerm slug="state">状态</ConceptTerm> 记录交互中的变化。跨页面复用的规范，还可以整理进设计系统。</>}>
    <ArticleSection id="definition" title="一份定义，多处使用">
      <Anchors ids={["component-question-heading", "component-definition-heading", "component-question", "component-definition"]} />
      <p>成员列表里有阿青、林墨和陈屿。三张卡片都显示头像、姓名和关注按钮，只是内容不同。如果每张都复制一份代码，后来要加入角色信息，就容易出现两张改了、一张漏掉的情况。</p>
      <p id="component-definition-source" className="vp-citation-target">可以先定义一个成员卡片，再在列表里使用三次。React 官方把组件作为可组合、可复用的界面单元；在本文采用的函数组件写法中，一个 JavaScript 函数接收输入，返回描述界面的 JSX。<strong>复用的是界面规则，不是把三个成员变成同一个人。</strong><Cite id="component-definition-source" /></p>
      <p>下面的开关模拟在公共定义里加入或移除角色行。观察三张卡片怎样一起变化，再分别点击关注。所有操作都只发生在这个演示里，不会访问任何真实账号。</p>
      <Anchors ids={["component-workshop-heading", "component-scene-heading"]} /><ComponentLesson />
      <p>加入角色后，前端开发、产品设计和后端开发各自出现在对应姓名下面。共同结构来自 MemberCard，具体内容来自每次调用的输入。以后修改同一份定义，使用它的位置就会遵循新的结构。</p>
    </ArticleSection>
    <ArticleSection id="instances" title="每个实例的状态">
      <p id="component-instances" className="vp-citation-target">点“关注阿青”，林墨不会同时被关注。这是因为本例把关注标记放在每个卡片实例自己的 <ConceptTerm slug="state">state</ConceptTerm> 里。<strong>同一组件出现多次，并不意味着它们共享同一份局部状态。</strong>React 会分别保存这些实例的状态。<Cite id="component-instances" /></p>
      <div className={styles.comparison}><div><Code size={26} /><h3>修改公共定义</h3><p>改变每张卡片的共同规则，例如增加角色这一行。</p></div><div><CursorClick size={26} /><h3>操作一个实例</h3><p>改变当前卡片的关注标记，其他卡片仍保持原状。</p></div></div>
      <p>这两种变化看起来都发生在界面上，原因却不同。排查“为什么所有卡片一起变了”时，要先看改的是公共输入、组件定义，还是某个实例的内部数据。</p>
      <p>实际产品的关注关系通常还要保存到服务器。本页只演示局部状态，因此刷新页面会恢复初始值。组件帮助组织交互，但不会自动替你持久化数据或处理账号权限。</p>
    </ArticleSection>
    <ArticleSection id="composition" title="组件也能组合" className={styles.offset}>
      <p id="component-composition" className="vp-citation-target">一个组件可以使用其他组件。成员列表使用 MemberCard，卡片又可以使用 Avatar 和 FollowButton；父子关系描述的是它们在界面中的组合。React 文档中的页面、导航和正文也用这种方式组织。<Cite id="component-composition" /></p>
      <ul className={styles.structure} aria-label="成员列表的组件层次"><li><Stack size={21} />MemberList</li><li><ArrowElbowDownRight size={20} />MemberCard × 3</li><li><ArrowElbowDownRight size={20} />Avatar · FollowButton</li></ul>
      <p>外层列表负责拿到成员数据并排列卡片，卡片负责呈现一个人。这样修改头像的展示方式时，可以检查 Avatar；修改整个列表的排序时，则从列表着手，不必把职责塞进每一张卡片。</p>
      <ArticleAside title="组件与 HTML 标签"><p>在 React 的 JSX 中，<code>&lt;article&gt;</code> 这样的内置标签描述浏览器元素，<code>&lt;MemberCard /&gt;</code> 则指向你定义的组件。组件最终仍要产生浏览器能展示的内容。组件不等于自定义一个新的 HTML 标准标签；其他框架的组件语法也可能不同。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="boundary" title="怎样划分组件">
      <Anchors ids={["component-quiz-heading", "component-prompt-heading"]} />
      <p id="component-boundary" className="vp-citation-target">React 的设计教程建议结合职责、视觉层次和数据结构拆分界面。一个部分变复杂、拥有清晰职责时，可以继续拆；简单且紧密相关的内容也可以先放在一起。这里没有“超过多少行必须拆”的统一标准。<Cite id="component-boundary" /></p>
      <blockquote className={styles.callout}>先说清这一块负责什么，<br />再决定它的边界。</blockquote>
      <p>成员卡片的输入可以列清：姓名、角色、头像。它的行为也可以列清：关注、打开资料。相反，把三个毫不相关的页面只因颜色相似而合成一个“万能卡片”，往往会引入大量难理解的开关。</p>
      <p>复用是一个理由，组织复杂界面也是一个理由；只出现一次的页面区域也可以成为组件。真正要检查的是：名称是否表达职责，输入是否容易理解，修改这一块时是否需要同时猜测许多别处的规则。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PropsTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={propsSources} />;
  return <ConceptArticle slug="props" title="Props" sources={propsSources}
    sections={[["input", "由调用者提供输入"], ["readonly", "只读不等于不变"], ["callback", "把操作交回父组件"], ["contract", "让参数容易理解"]]}
    hero={<ConceptHero slug="props" label="文字和样式两项输入配置出一个保存按钮"><div className={styles.propsHero}><div><code>label=&quot;保存&quot;</code><code>primary</code></div><span>保存<PaperPlaneTilt size={20} /></span></div></ConceptHero>}
    intro={<>Props 是调用者传给组件的输入。文字、数据、样式选项和回调函数，都可以通过 Props 交给组件，<strong>让同一份实现按不同配置工作。</strong></>}
    relatedIntro={<>把结构交给 <ConceptTerm slug="component">组件</ConceptTerm>，通过 Props 提供输入，再由数据拥有者管理 <ConceptTerm slug="state">状态</ConceptTerm>。Hook 是 React 组件使用状态等能力的接口。</>}>
    <ArticleSection id="input" title="由调用者提供输入">
      <Anchors ids={["props-question", "props-definition"]} />
      <p>编辑器需要“保存草稿”，设置页需要“确认修改”。两个按钮的间距、焦点效果和点击方式可以一致，文字和用途却不同。把这些差异作为参数传入，就不用再复制一个几乎相同的按钮。</p>
      <p id="props-input" className="vp-citation-target">在 React 中，父组件使用子组件时提供 Props，子组件读取这些值来生成界面。它们可以是字符串、数字、布尔值，也可以是对象、数组或函数；并不只限于 HTML 中常见的文本属性。<Cite id="props-input" /></p>
      <p>下面左侧代表父组件。修改文字或样式，右侧的 ActionButton 就接收到新的输入。点击按钮后，父组件会记录一次回调。这里没有真正保存草稿；清空文字时，本例约定显示“按钮”。</p>
      <Anchors ids={["props-scene-heading"]} /><PropsLesson />
      <p>把样式切到 quiet，按钮变轻；把 disabled 设为 true，按钮仍然存在，但不能触发点击。两个变化都是子组件按照收到的参数执行已有规则，并没有生成另一套按钮实现。</p>
    </ArticleSection>
    <ArticleSection id="readonly" title="只读不等于不变">
      <p id="props-readonly" className="vp-citation-target"><strong>对接收它的组件来说，Props 是只读输入。</strong>父组件可以在后续渲染时传来新值，所以“只读”不表示第一次传入后永远固定。需要改变输入时，应让数据的拥有者更新，再把新值传下来，而不是直接改写收到的 Props 对象。<Cite id="props-readonly" /></p>
      <p>刚才输入“确认修改”时，父组件先更新自己记录的文字，随后把新的 label 传给 ActionButton。按钮读取新值，于是画面改变。输入来源与使用位置虽然不同，变化仍然可以沿着一条清楚的路径追踪。</p>
      <blockquote className={styles.callout}>外部传来的值可以更新；<br />接收方应通过约定请求变化。</blockquote>
      <p>例如一张商品卡片收到 price，它不能为了显示折扣就直接把父级商品对象改掉。可以根据价格计算展示值，或在用户操作时调用父级提供的函数，由父级决定是否更新商品数据。</p>
    </ArticleSection>
    <ArticleSection id="callback" title="把操作交回父组件">
      <p id="props-callback" className="vp-citation-target">函数也能作为 Props。父组件把 handleAction 交给子按钮，子按钮在点击时调用它，父组件再更新计数。<strong>传入函数本身，与在渲染时立刻调用函数，是两件事。</strong>React 的事件教程用这种方式让复用按钮触发不同的业务动作。<Cite id="props-callback" /></p>
      <pre className={styles.code}>{'function ActionButton({ onAction, label }) {\n  return <button onClick={onAction}>{label}</button>;\n}'}</pre>
      <p>这里的 onAction 是自定义组件的接口名称，内部再接到原生按钮的 onClick。按钮不需要知道父组件把计数放在哪里；父组件也不必知道按钮用了什么间距。两者通过明确的输入和回调合作。</p>
      <p id="props-owner" className="vp-citation-target">如果两个组件需要同步使用同一份数据，常见做法是让它们最近的共同父组件持有这份状态，再把值和更新用的回调传下去。每份数据有明确的拥有者，不代表整个应用只能有一处状态。<Cite id="props-owner" /></p>
      <p>这也能帮助定位问题：按钮没变化，就核对父级是否更新、子级是否收到新值；点击没反应，则核对回调是否传入、是否被调用，以及按钮是否被禁用。</p>
    </ArticleSection>
    <ArticleSection id="contract" title="让参数容易理解" className={styles.offset}>
      <Anchors ids={["props-quiz-heading", "props-prompt-heading"]} />
      <p id="props-defaults" className="vp-citation-target">参数可以有默认值。React 函数组件常用 <code>size = 100</code> 这样的解构写法；只有没有传入或值为 undefined 时，才使用这个默认值。传入 0 或 null 不会自动触发它，接口需要说明这些值各自代表什么。<Cite id="props-defaults" /></p>
      <p>本页选择了 primary 和 quiet 两个明确的样式值。实际项目也应把允许的选项说清楚，避免同时出现 isPrimary、isQuiet、isDanger 等互相冲突的开关。参数多到难以组合时，往往需要重新检查组件承担的职责。</p>
      <p id="props-children" className="vp-citation-target">若变化的是一整块内容，可以通过 children 传入嵌套的 JSX。外层组件负责容器，调用者提供里面放什么。这比为每一种内容增加一个专用参数更适合某些组合场景。<Cite id="props-children" /></p>
      <ArticleAside title="Props 不是自动安全校验"><p>名字写成 disabled 只是一个约定，组件仍需把它用于实际行为。本页最终传给原生 button，浏览器才会禁用按钮。真实系统还要在处理请求的地方检查权限与输入，不能只靠页面上的灰色按钮。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function StateTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={stateSources} />;
  return <ConceptArticle slug="state" title="状态" sources={stateSources}
    sections={[["memory", "界面需要记住的数据"], ["saving", "一次保存的变化"], ["snapshot", "更新与本次渲染"], ["structure", "只保存必要的数据"]]}
    hero={<ConceptHero slug="state" label="编辑中的笔记收到成功结果后，出现保存回执"><div className={styles.stateHero}><div className={styles.heroDraft}><FileText size={25} /><i /><i /><i /></div><div className={styles.heroReceipt}><Check size={24} /><span>已保存</span></div></div></ConceptHero>}
    intro={<>状态记录此刻影响界面和行为的数据。输入了什么、是否正在保存、请求有没有失败，都可以属于状态。<strong>事件改变数据，界面再按新值呈现。</strong></>}
    relatedIntro={<>一个 <ConceptTerm slug="event">事件</ConceptTerm> 可以触发状态更新，<ConceptTerm slug="component">组件</ConceptTerm> 负责呈现结果，而清楚的反馈让用户知道操作到了哪一步。</>}>
    <ArticleSection id="memory" title="界面需要记住的数据">
      <Anchors ids={["state-question", "state-definition"]} />
      <p>写一条会议笔记时，界面需要记住正在编辑的文字。点保存之后，它还要知道请求正在等待，才能暂时阻止重复操作；收到失败结果，又要保留输入并提供重试入口。</p>
      <p id="state-memory" className="vp-citation-target">在 React 中，组件可以用 useState 保存渲染之间需要记住的数据。它提供当前值和更新函数：更新函数请求下一次渲染，组件再用新的值计算界面。普通局部变量不会替你完成这件事。本文用 React 演示，状态这个概念也存在于其他界面框架和程序中。<Cite id="state-memory" /></p>
      <p>这里至少有两类数据：笔记内容 text，以及保存进度 status。按钮上的“保存中”不是程序额外记下的一句话，而是根据 status 推导出来的显示结果。</p>
    </ArticleSection>
    <ArticleSection id="saving" title="一次保存的变化">
      <p>试着改写笔记，再保存。为了让等待过程可观察，本例由你点击“返回成功”或“返回失败”来模拟响应，不访问服务器，也不把笔记写入文件。先试一次失败，再重试成功。</p>
      <Anchors ids={["state-scene-heading"]} /><StateLesson />
      <p>等待期间，文字暂时不可编辑，保存按钮也不能再点。失败后，输入仍在；成功后，回执显示这次保存的内容。再次编辑时，“已保存”会失效，因为新文字还没有完成新一轮保存。</p>
      <dl className={styles.stateRules}><dt>idle</dt><dd>可以编辑；内容不为空时可以发起保存。</dd><dt>pending</dt><dd>已经发起，仍在等待结果。</dd><dt>error</dt><dd>这次保存失败，保留输入以便重试。</dd><dt>success</dt><dd>这次内容已得到成功响应。</dd></dl>
      <p id="state-structure" className="vp-citation-target">本例让 status 在这些互斥值中取一个。React 文档建议避免相互矛盾的状态：若用多个独立布尔值表示“保存中”和“已保存”，忘记同步更新就可能让两者同时成立。<strong>状态的形状应尽量让无效组合难以出现。</strong><Cite id="state-structure" /></p>
      <p>这个演示选择在等待时锁定编辑。真实编辑器也可以允许继续输入，但必须区分已发送的版本和正在编辑的版本，不能让旧响应把新内容误标为已保存。按钮禁用只是界面措施，服务端仍需处理重复请求。</p>
    </ArticleSection>
    <ArticleSection id="snapshot" title="更新与本次渲染" className={styles.offset}>
      <p id="state-snapshot" className="vp-citation-target">React 把每次渲染中的状态看作一份快照。调用更新函数会请求新渲染，<strong>不会改写当前事件处理函数已经读到的那个值。</strong>下一次渲染才会得到更新后的状态并产生对应界面。<Cite id="state-snapshot" /></p>
      <pre className={styles.code}>{'// 点击时，这次渲染的 status 是 "idle"\nsetStatus("pending");\n// 当前函数中的 status 仍是 "idle"\n// 下一次渲染会使用 "pending"'}</pre>
      <p>所以排查“设置了新状态，为什么这行日志仍然是旧值”时，要先看日志属于哪次渲染。不要为了让日志看起来更新，就再维护一份同名变量；那容易让真实数据和显示逻辑分开。</p>
      <ArticleAside title="重新渲染不等于刷新网页"><p id="state-render" className="vp-citation-target">React 会根据新的数据计算界面，再更新需要改变的部分。本例只改变编辑器和回执中的内容，你仍留在同一篇文章、同一个滚动位置。重新渲染不要求重新下载整页，也不意味着每个 DOM 元素都会被替换。<Cite id="state-render" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="structure" title="只保存必要的数据">
      <Anchors ids={["state-quiz-heading", "state-prompt-heading"]} />
      <p id="state-derived" className="vp-citation-target">如果一个值能从已有输入或状态计算出来，通常不必重复保存。比如“能否保存”可以由文字是否为空、status 是否允许推导；若把它再存成另一个状态，每次编辑、失败、重试都要记得同步修改。<Cite id="state-derived" /></p>
      <p>成功回执保留的是上次确认的文字，编辑框里则是现在的草稿。它们可能是两个版本，所以需要分别记录；否则继续输入时，旧回执也会跟着改变，让新文字看起来像已经保存。</p>
      <div className={styles.comparison}><div><FileText size={26} /><h3>需要记住</h3><p>用户输入的笔记，以及当前请求的阶段。</p></div><div><SlidersHorizontal size={26} /><h3>可以计算</h3><p>按钮是否禁用、显示什么文字、是否出现成功回执。</p></div></div>
      <p id="state-owner" className="vp-citation-target">需要多个组件共同使用的数据，可以放到最近的共同父组件，再通过 <ConceptTerm slug="props">Props</ConceptTerm> 交给它们。判断状态放在哪里时，关键是哪些地方需要读取和改变它；不是所有数据都要集中到应用最上层。<Cite id="state-owner" /></p>
      <p>最后还要区分“界面记住了”和“数据保存了”。本页的状态只在当前页面中存在，刷新就恢复初始内容。需要跨页面、跨设备或长期保留时，应另行设计存储和同步，不能把一次画面更新当成持久化完成。</p>
    </ArticleSection>
  </ConceptArticle>;
}
