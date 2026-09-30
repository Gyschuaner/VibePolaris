import { ArrowElbowDownRight, Code, CursorClick, FileText, PaperPlaneTilt, SlidersHorizontal, Stack, UserCircle } from "@phosphor-icons/react/dist/ssr";
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
    sections={[["definition", "一份定义，多处使用"], ["instances", "每个实例的状态"], ["composition", "组件也能组合"], ["boundary", "按职责划分组件"]]}
    hero={<ConceptHero slug="component" label="头像、姓名与关注按钮合成一份 MemberCard 结构，成员列表按这份结构显示三张不同成员的卡片"><div className={styles.componentHero}>
      <div className={styles.componentBlueprint}><code>MemberCard</code><div className={styles.componentFrame}><UserCircle size={27} weight="light" /><span className={styles.componentNameLines}><i /><i /></span><span className={styles.componentFollow}>＋</span></div></div>
      <div className={styles.componentList}><code>MemberList</code>{["阿青", "林墨", "陈屿"].map(name => <div className={styles.componentInstance} key={name}><UserCircle size={23} weight="light" /><span>{name}</span><b>＋</b></div>)}</div>
    </div></ConceptHero>}
    intro={<>组件把一块界面的结构和行为组织在一起。<strong>定义写一份，使用时传入不同数据，页面就能得到多个遵循相同规则的实例。</strong></>}
    relatedIntro={<>用 <ConceptTerm slug="props">Props</ConceptTerm> 配置每次使用的输入，用 <ConceptTerm slug="state">状态</ConceptTerm> 记录交互中的变化。</>}>
    <ArticleSection id="definition" title="一份定义，多处使用">
      <Anchors ids={["component-question-heading", "component-definition-heading", "component-question", "component-definition"]} />
      <p>成员列表里有阿青、林墨和陈屿。三张卡片都显示头像、姓名和关注按钮，只是内容不同。如果每张都复制一份代码，后来要加入角色信息，就容易出现两张改了、一张漏掉的情况。</p>
      <p id="component-definition-source" className="vp-citation-target">可以先把成员卡片写成一个组件，再在列表里使用三次。在本文采用的 React 写法里，这份定义是一个 JavaScript 函数：它接收姓名等数据，返回用 JSX 写出的界面描述。JSX 是在代码里写界面标签的一种语法。<strong>复用的是界面规则，不是把三个成员变成同一个人。</strong><Cite id="component-definition-source" /></p>
      <p>下面的开关模拟在公共定义里加入或移除角色行。示意代码中的 <code>&lt;article&gt;</code> 是容纳整张卡片的网页标签，Avatar 和 FollowButton 分别代表头像和关注按钮。观察三张卡片怎样一起变化，再分别点击关注。所有操作都只发生在这个演示里，不会访问任何真实账号。</p>
      <Anchors ids={["component-workshop-heading", "component-scene-heading"]} /><ComponentLesson />
      <p>加入角色后，前端开发、产品设计和后端开发各自出现在对应姓名下面。共同结构来自 MemberCard，具体内容来自每次使用时传入的数据。以后修改同一份定义，列表里的三张卡片都会按新结构显示。</p>
    </ArticleSection>
    <ArticleSection id="instances" title="每个实例的状态">
      <p id="component-instances" className="vp-citation-target">点“关注阿青”，林墨不会同时被关注。这是因为本例让每张卡自己记住是否已关注，这份数据叫作它的 <ConceptTerm slug="state">状态（state）</ConceptTerm>。<strong>同一组件出现多次，并不意味着它们共享同一份局部状态。</strong>React 会分别保存这些实例的状态。<Cite id="component-instances" /></p>
      <div className={styles.comparison}><div><Code size={26} /><h3>修改公共定义</h3><p>改变每张卡片的共同规则，例如增加角色这一行。</p></div><div><CursorClick size={26} /><h3>操作一个实例</h3><p>改变当前卡片的关注标记，其他卡片仍保持原状。</p></div></div>
      <p>这两种变化看起来都发生在界面上，原因却不同。所有卡片一起变时，要看是公共定义变了，还是列表给每张卡传来了同一个新值；只变一张时，再看它自己记住的状态。</p>
      <p>实际产品的关注关系通常还要保存到服务器。本页只演示局部状态，因此刷新页面会恢复初始值；组件也不会替你处理账号权限。</p>
    </ArticleSection>
    <ArticleSection id="composition" title="组件也能组合" className={styles.offset}>
      <p id="component-composition" className="vp-citation-target">一个组件可以使用其他组件。在示意图里，MemberList 表示成员列表，它使用 MemberCard；卡片里的头像和关注按钮又可以分别写成 Avatar 与 FollowButton。React 文档中的页面、导航和正文也用这种方式组织。<Cite id="component-composition" /></p>
      <ul className={styles.structure} aria-label="成员列表的组件层次"><li><Stack size={21} />MemberList</li><li><ArrowElbowDownRight size={20} />MemberCard × 3</li><li><ArrowElbowDownRight size={20} />Avatar · FollowButton</li></ul>
      <p>外层列表负责拿到成员数据并排列卡片，卡片负责呈现一个人。如果把头像拆成 Avatar，以后改头像样式就从 Avatar 着手；要调整整个列表的排序，就从 MemberList 着手，不必把排序规则塞进每一张卡片。</p>
      <ArticleAside title="组件与 HTML 标签"><p>在 React 的 JSX 中，<code>&lt;article&gt;</code> 这样的内置标签描述浏览器元素，<code>&lt;MemberCard /&gt;</code> 则指向你定义的组件。组件最终仍要产生浏览器能展示的内容。组件不等于自定义一个新的 HTML 标准标签；其他框架的组件语法也可能不同。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="boundary" title="按职责划分组件">
      <Anchors ids={["component-quiz-heading", "component-prompt-heading"]} />
      <p id="component-boundary" className="vp-citation-target">React 的设计教程建议结合职责、视觉层次和数据结构拆分界面。如果某一块的职责清楚、内容又逐渐变复杂，就可以继续拆；简单且紧密相关的内容也可以先放在一起。这里没有“超过多少行必须拆”的统一标准。<Cite id="component-boundary" /></p>
      <p id="component-files" className="vp-citation-target">拆成组件，不等于每个组件都得单独建一个文件。React 的教程先把 Profile 和 Gallery 写在一起；需要从别处使用时，再把组件导出、在使用处导入。屏幕上出现三个 MemberCard，也不需要写三份定义。<Cite id="component-files" /></p>
      <blockquote className={styles.callout}>先说清这一块负责什么，<br />再决定它的边界。</blockquote>
      <p>成员卡片的输入可以列清：姓名、角色、头像。它的行为也可以列清：关注、打开资料。把职责不同的界面区域仅因配色相似而合成一张“万能卡片”，往往会引入大量难理解的开关。</p>
      <p>复用是一个理由，组织复杂界面也是一个理由；只出现一次的页面区域也可以成为组件。例如结账页的收货地址区域，可以单独负责地址输入和错误提示，让外层页面处理订单汇总；若只有一个简单输入框，先留在页面里也可以。检查组件边界时，看名称能否表达职责、输入是否容易理解，以及修改这一块是否牵动许多无关规则。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PropsTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={propsSources} />;
  return <ConceptArticle slug="props" title="Props" sources={propsSources}
    sections={[["input", "由调用者提供输入"], ["readonly", "只读不等于不变"], ["callback", "把操作交回父组件"], ["contract", "让参数容易理解"]]}
    hero={<ConceptHero slug="props" label="调用处先修改 label，再修改 tone；同一个 ActionButton 的文字和外观依次变化"><div className={styles.propsHero}>
      <div className={styles.propsCall}><code>调用处</code><div className={styles.propsInputs}><div><code>label</code><span className={styles.propsInputValue}><span>保存草稿</span><span>确认修改</span></span></div><div><code>tone</code><span className={styles.propsInputValue}><span>primary</span><span>quiet</span></span></div></div></div>
      <svg className={styles.propsThreads} viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"><path d="M75 0 C75 43 140 29 140 70" /><path d="M225 0 C225 43 160 29 160 70" /><path className={styles.propsLabelThread} d="M75 0 C75 43 140 29 140 70" /><path className={styles.propsToneThread} d="M225 0 C225 43 160 29 160 70" /></svg>
      <div className={styles.propsButtonBox}><code>ActionButton</code><div className={styles.propsButton}><span>保存草稿</span><span>确认修改</span><PaperPlaneTilt size={18} /></div></div>
    </div></ConceptHero>}
    intro={<>Props 是使用组件时，从外层传给它的输入。按钮文字、样式、能否点击等设置，连同“点击后该做什么”的函数（回调函数），都可以通过 Props 交给组件，<strong>让同一份实现按不同配置工作。</strong></>}
    relatedIntro={<>一个 <ConceptTerm slug="component">组件</ConceptTerm> 规定按钮怎样呈现和响应操作；Props 是外层传来的输入，<ConceptTerm slug="state">状态</ConceptTerm> 是组件或外层记住、会随操作变化的数据。</>}>
    <ArticleSection id="input" title="由调用者提供输入">
      <Anchors ids={["props-question", "props-definition"]} />
      <p>编辑器需要“保存草稿”，设置页需要“确认修改”。两个按钮的基本结构和点击方式可以一致，文字和用途却不同。把这些差异作为参数传入，就不用再复制一个几乎相同的按钮。</p>
      <p id="props-input" className="vp-citation-target">在 React 中，外层页面使用 ActionButton 时，外层页面是父组件，ActionButton 是子组件。父组件提供 Props，子组件读取这些值来生成界面。除了文字，Props 还可以是数字、开关值、对象、数组或函数。<Cite id="props-input" /></p>
      <p>下面左侧代表父组件。修改文字或样式，右侧的 ActionButton 就按新输入更新。点击按钮后，父组件提供的函数被调用一次，左侧计数加一。这里没有真正保存草稿；清空文字时，本例约定显示“按钮”。</p>
      <p>右侧示意代码里，<code>label="保存草稿"</code> 是文字，<code>disabled={'{false}'}</code> 是开关值，<code>onAction={'{handleAction}'}</code> 是点击后要调用的函数；花括号表示这里传入的不是普通文字。</p>
      <Anchors ids={["props-scene-heading"]} /><PropsLesson />
      <p id="props-disabled" className="vp-citation-target">把样式切到 quiet，按钮变轻；把 disabled 设为 true，按钮仍在，但用户点击不会调用操作。本例的子组件把 disabled 传给原生 button，浏览器按 HTML 标准阻止它派发用户点击事件。两个变化都沿用同一套按钮实现。<Cite id="props-disabled" /></p>
    </ArticleSection>
    <ArticleSection id="readonly" title="只读不等于不变">
      <p id="props-readonly" className="vp-citation-target"><strong>对接收它的组件来说，Props 是只读输入。</strong>父组件之后重新渲染（按数据生成界面）时可以传来新值，所以“只读”不表示第一次传入后永远固定。本例要改变按钮文字，由记录这段文字的父组件先更新，再把新值传下来；按钮不直接改写收到的 Props。<Cite id="props-readonly" /></p>
      <p>刚才输入“确认修改”时，父组件先更新自己记录的文字，随后把新的 label 传给 ActionButton。按钮读取新值，于是画面改变。输入来源与使用位置虽然不同，变化仍然可以沿着一条清楚的路径追踪。</p>
      <p>左侧记录的文字是父组件的状态；传到 ActionButton 后，同一个值就是按钮接收的 Props。在这个演示里，状态是父组件记住的当前值，Props 是子组件收到的输入。</p>
      <blockquote className={styles.callout}>外部传来的值可以更新；<br />接收方若想改变它，可以请父组件更新。</blockquote>
      <p>例如一张商品卡片收到 price，它不能为了显示折扣就直接把父级商品对象改掉。可以根据价格计算展示值，或在用户操作时调用父级提供的函数，由父级决定是否更新商品数据。</p>
    </ArticleSection>
    <ArticleSection id="callback" title="把操作交回父组件">
      <p id="props-callback" className="vp-citation-target">函数也能作为 Props。父组件把 handleAction 交给子按钮，子按钮在点击时调用它，父组件再更新计数。同一款按钮因此能用于不同页面，具体操作由外层页面决定。<Cite id="props-callback" /></p>
      <pre className={styles.code}>{'function ActionButton({ onAction, label }) {\n  return <button onClick={onAction}>{label}</button>;\n}'}</pre>
      <p>这段代码只画出文字和点击，省略了样式与禁用。onAction 是 ActionButton 自己约定的输入名称，内部再接到原生按钮的 onClick。写 <code>onClick={'{onAction}'}</code> 是把函数交给按钮，等点击时才执行；写成 <code>onClick={'{onAction()}'}</code> 则会在渲染界面时立即执行。按钮不需要知道父组件把计数放在哪里；父组件也不必知道按钮用了什么间距。</p>
      <p id="props-owner" className="vp-citation-target">如果两个组件要用同一份数据，还要求显示一致，常见做法是让它们最近的共同父组件持有这份状态，再把值和更新用的回调传下去。每份数据有明确的拥有者，不代表整个应用只能有一处状态。<Cite id="props-owner" /></p>
      <p>这也能帮助定位问题：按钮没变化，就核对父组件是否更新、子组件是否收到新值；点击没反应，则核对回调是否传入、是否被调用，以及按钮是否被禁用。</p>
    </ArticleSection>
    <ArticleSection id="contract" title="让参数容易理解" className={styles.offset}>
      <Anchors ids={["props-quiz-heading", "props-prompt-heading"]} />
      <p id="props-defaults" className="vp-citation-target">参数可以有默认值。例如头像组件可以把尺寸写成 <code>size = 100</code>：使用它的地方没传 size，或传入 undefined（表示没有值的特殊标记）时，才用 100。0 和 null 虽然可能不适合作为尺寸，却都是已经传入的值，不会触发这个默认。组件应说明这些值各自代表什么。<Cite id="props-defaults" /></p>
      <p>本页选择了 primary 和 quiet 两个明确的样式值。实际项目也应把允许的选项说清楚，避免 isPrimary、isQuiet、isDanger 这样的多个开关同时为真，让按钮不知道该用哪种样式。参数多到难以组合时，往往需要重新检查组件承担的职责。</p>
      <p id="props-children" className="vp-citation-target">若变化的是一整块内容，可以通过 children 传入嵌套的 JSX（React 用来描述界面的标签写法）。外层组件负责容器，调用者提供里面放什么。在某些场景里，这比为每种内容单独设一个参数更合适。<Cite id="props-children" /></p>
      <ArticleAside title="Props 不是自动安全校验"><p>名字写成 disabled 只是一个约定，组件仍要真正根据它改变行为。本页最终传给原生 button，浏览器才会禁用按钮。真实系统还要在处理请求的地方检查权限与输入，不能只靠页面上的灰色按钮。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function StateTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={stateSources} />;
  return <ConceptArticle slug="state" title="状态" sources={stateSources}
    sections={[["memory", "界面需要记住的数据"], ["saving", "一次保存的变化"], ["snapshot", "更新与本次渲染"], ["structure", "只保存必要的数据"]]}
    hero={<ConceptHero slug="state" label="笔记先记住输入，界面显示新文字；保存后状态变为等待，按钮显示保存中，不提前出现成功回执"><div className={styles.stateHero}><div className={styles.stateCard}>
      <div className={styles.stateCardTitle}><FileText size={18} /><span>会议笔记</span></div>
      <div className={styles.stateNote}><span className={styles.statePlaceholder}>写一条笔记…</span><span className={styles.stateWritten}>首页导航</span></div>
      <div className={styles.stateSave}><span>保存草稿</span><span>保存中</span></div>
      <div className={styles.stateMemory}><div><code>text</code><span className={styles.stateTextOld}>&quot;&quot;</span><span className={styles.stateTextNew}>&quot;首页导航&quot;</span></div><div><code>status</code><span className={styles.stateStatusOld}>idle</span><span className={styles.stateStatusNew}>pending</span></div></div>
    </div></div></ConceptHero>}
    intro={<>状态是界面需要记住、会影响下一步显示和操作的数据。笔记里输入了什么、现在是否正在保存、上次保存有没有失败，都可以是状态。<strong>处理输入、点击或响应的代码会更新状态，界面再按新值呈现。</strong></>}
    relatedIntro={<>一个 <ConceptTerm slug="event">事件</ConceptTerm> 可以触发状态更新，<ConceptTerm slug="component">组件</ConceptTerm> 负责呈现结果，而清楚的反馈让用户知道操作到了哪一步。</>}>
    <ArticleSection id="memory" title="界面需要记住的数据">
      <Anchors ids={["state-question", "state-definition"]} />
      <p>写一条会议笔记时，界面要记住正在编辑的文字。在真实编辑器里，点保存后还要记住这次请求正在等待，才能暂时阻止重复操作；收到失败结果，仍应保留输入并提供重试入口。</p>
      <p id="state-memory" className="vp-citation-target">在 React 中，负责这块界面的组件可以用 <code>useState</code> 记住数据。组件是页面里负责呈现一块内容的代码；每次渲染，就是 React 根据当前数据重新计算这块界面。<code>useState</code> 提供当前值和更新函数：调用更新函数会请求 React 再渲染。组件函数每次渲染时会重新执行，所以写在里面的普通变量会重新开始；改写它也不会通知 React 更新画面。本文用 React 演示，但其他界面框架和程序中也有状态。<Cite id="state-memory" /></p>
      <p>这里先记两项：正在编辑的文字 <code>text</code>，以及保存阶段 <code>status</code>。按钮显示“保存中”，是根据 <code>status</code> 算出来的，不需要再记一份按钮文字。若不使用 React 的状态接口，也能自己保存数据并逐处修改页面，但输入框、按钮和回执都得自己保持一致。</p>
    </ArticleSection>
    <ArticleSection id="saving" title="一次保存的变化">
      <p>首图的 <code>status</code> 停在 <code>pending</code>（等待结果），还没有成功回执。下面是另一个独立演示，从一条已有文字的示例笔记重新开始；它与首图不共享内容或进度。你可以改写后保存，再点击“模拟成功”或“模拟失败”给这次保存一个结果。这里不访问服务器，也不把笔记写入文件。先试一次失败，再重试成功。</p>
      <Anchors ids={["state-scene-heading"]} /><StateLesson />
      <p>等待期间，文字暂时不可编辑，保存按钮也不能再点。失败后，输入仍在；成功后，回执显示这次保存的内容。再次编辑时，按钮不再显示“已保存”，旧回执也会隐藏，因为新文字还没有完成新一轮保存。</p>
      <dl className={styles.stateRules}><dt>idle</dt><dd>可以编辑；内容不为空时可以发起保存。</dd><dt>pending</dt><dd>已经发起，仍在等待结果。</dd><dt>error</dt><dd>这次保存失败，保留输入以便重试。</dd><dt>success</dt><dd>这次内容已得到成功响应。</dd></dl>
      <p id="state-structure" className="vp-citation-target">本例的 <code>status</code> 一次只有一个当前值：<code>idle</code>、<code>pending</code>、<code>error</code> 或 <code>success</code>。React 文档建议避免相互矛盾的状态：若用多个独立开关表示“保存中”和“已保存”，忘记同步更新就可能让两者同时成立。<strong>用一个值表示当前阶段，能减少这种错误组合。</strong><Cite id="state-structure" /></p>
      <p>这个演示选择在等待时锁定编辑。真实编辑器也可以允许继续输入，但必须区分已发送的版本和正在编辑的版本：不能让较早那份文字的成功响应回来后，把正在编辑的新文字也标成已保存。禁用按钮只能阻止这个页面上的重复点击，不能保证别的入口不会再次发起同一请求。</p>
    </ArticleSection>
    <ArticleSection id="snapshot" title="更新与本次渲染" className={styles.offset}>
      <p id="state-snapshot" className="vp-citation-target">点“保存草稿”时，这次点击处理读到 <code>status</code> 是 <code>idle</code>，于是调用更新函数，请求把它改成 <code>pending</code>。但<strong>这段代码接着读到的仍是 <code>idle</code></strong>；React 下一次渲染才会拿到 <code>pending</code>，把按钮改成“保存中”。React 把每次渲染中拿到的值称为一份快照。<Cite id="state-snapshot" /></p>
      <pre className={styles.code}>{'// 点击时，这次渲染的 status 是 "idle"\nsetStatus("pending");\n// 这次点击处理里读到的 status 仍是 "idle"\n// 下一次渲染会使用 "pending"'}</pre>
      <p>在同一次点击处理里读到旧值，按钮仍会在下一次渲染时更新。判断这次操作的结果，应看更新后的界面，不必自己再记一份 <code>status</code>。</p>
      <ArticleAside title="重新渲染不等于刷新网页"><p id="state-render" className="vp-citation-target">React 会根据新的数据计算界面，再更新需要改变的部分。本例只改变输入框和回执中的内容，你仍留在同一篇文章、同一个滚动位置。重新渲染不需要重新下载整页，也不意味着页面上的每块内容都会被替换。<Cite id="state-render" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="structure" title="只保存必要的数据">
      <Anchors ids={["state-quiz-heading", "state-prompt-heading"]} />
      <p id="state-derived" className="vp-citation-target">如果一个值能从已有输入或状态计算出来，通常不必重复保存。比如“能否保存”可以由两件事推出：文字是否为空，以及当前 <code>status</code> 是否允许发起保存。若把它再存成另一个状态，每次编辑、失败、重试都要记得同步修改。<Cite id="state-derived" /></p>
      <p>本例在收到成功结果时，单独记下这次确认过的文字，用它显示回执。输入框里则是当前草稿，可能已经和回执不同；一旦继续输入，页面会隐藏旧回执，不能让新文字看起来像已经保存。两份文字若混在一起，就分不清确认过的是哪一版。</p>
      <div className={styles.comparison}><div><FileText size={26} /><h3>需要记住</h3><p>当前草稿、上次确认的文字，以及保存阶段。</p></div><div><SlidersHorizontal size={26} /><h3>可以计算</h3><p>按钮是否禁用、显示什么文字、是否出现成功回执。</p></div></div>
      <p id="state-owner" className="vp-citation-target">假如把笔记输入框和保存按钮拆成两个组件，它们都需要知道当前保存阶段，就可以让包住两者的外层组件记住 <code>status</code>，再把它作为 <ConceptTerm slug="props">Props</ConceptTerm> 分别传下去。外层组件是它们的共同父组件；它记住的数据是自己的状态，传到子组件后就是子组件收到的 Props。不必把所有数据集中到整个应用的最上层。<Cite id="state-owner" /></p>
      <p>最后还要区分“界面记住了”和“数据保存了”。本页的状态只在当前页面中存在，刷新就恢复初始内容。需要跨页面、跨设备或长期保留时，应另行设计存储和同步，不能把一次画面更新当成数据已经长期保存。</p>
    </ArticleSection>
  </ConceptArticle>;
}
