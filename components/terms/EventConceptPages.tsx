import { BookmarkSimple, Coffee, Lightbulb, Power, Ticket } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleCitation, ArticleAside, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { EventLesson, BubblingLesson, HookLesson } from "./EventConceptLessons";
import { eventSources, bubblingSources, hookSources } from "@/lib/event-concept-sources";
import styles from "./EventConcepts.module.css";

function Anchors({ slug, names }: { slug: string; names: string[] }) {
  return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={styles.anchor} aria-hidden="true" />)}</>;
}

export function EventTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={eventSources} />;
  return <ConceptArticle slug="event" title="事件" sources={eventSources}
    sections={[["notification", "动作进入处理函数"], ["listener", "接上一个处理函数"], ["object", "事件携带的信息"], ["result", "默认行为与业务结果"]]}
    hero={<ConceptHero slug="event" label="第一次点击会被记录，同时点亮阅读灯；开灯监听断开后第二次点击仍被记录，灯保持原状"><div className={styles.eventHero}>
      <Lightbulb size={58} weight="light" /><div className={styles.heroBeam} /><span className={styles.heroSwitch}><Power size={22} /><i className={styles.heroClickPulse} /></span>
      <div className={styles.heroClick}><code>click</code><span><b>0</b><b>1</b><b>2</b></span></div>
      <div className={styles.heroListener}><code>开灯监听</code><span>连接</span><span>断开</span></div>
    </div></ConceptHero>}
    intro={<>事件让程序知道“发生了什么”。在网页中，点击、输入、提交和加载完成都能产生事件。<strong>事件发生，不等于事情已经处理好；代码要先为它登记处理函数。</strong></>}
    relatedIntro={<>处理事件的代码通常用 <ConceptTerm slug="javascript">JavaScript</ConceptTerm> 编写；它可以修改 <ConceptTerm slug="state">状态</ConceptTerm>。至于同一次点击怎样到达父元素，由事件传播规则决定。</>}>
    <ArticleSection id="notification" title="动作进入处理函数">
      <Anchors slug="event" names={["question", "definition"]} />
      <p>网页上画一个开关，还不会自动让阅读灯亮起来。你需要说明：收到这个开关的点击时，执行哪段代码。这段联系建立后，用户的一次操作才会改变界面里的灯。</p>
      <p id="event-notification" className="vp-citation-target">浏览器用事件通知代码发生了什么。<code>addEventListener</code> 可以把一个函数登记到按钮的 <code>click</code> 上；以后按钮收到点击事件，浏览器就调用这个函数。这段函数常叫监听器或处理函数。事件是这次发生的点击及其信息，不是函数本身。本文讨论浏览器中的 DOM 事件；服务器和其他系统也有事件机制，接口不一定相同。<Cite id="event-notification" /></p>
      <p>试着按一下下面的电源按钮。然后取消勾选“连接开灯监听器”，再按一次。这个演示还添加了另一个监听函数，专门记录点击次数；取消勾选只移除改变灯的函数，所以计数仍会增加。这是一盏网页里的灯，不会控制真实设备。</p>
      <Anchors slug="event" names={["scene-heading"]} /><EventLesson />
      <p>断开之后，灯保留上一次的亮灭状态。电源按钮并没有失效，click 也仍然发生，只是那个改变灯的函数不再运行。重新勾选后，再次按电源按钮，灯才继续变化。记录区的 <code>target: button</code> 表示这次点击发生在按钮上，后面会解释事件带来的信息。</p>
    </ArticleSection>
    <ArticleSection id="listener" title="接上一个处理函数" className={styles.offset}>
      <p>添加监听时需要选定接收事件的对象、事件类型和函数。下面的注册代码只建立联系，不会立刻调用 <code>toggleLight</code>；用户之后触发 click，浏览器才调用它。</p>
      <pre className={styles.code}>{'button.addEventListener("click", toggleLight);\n\n// 不再需要时移除同一个监听\nbutton.removeEventListener("click", toggleLight);'}</pre>
      <p id="event-cleanup" className="vp-citation-target">移除监听时，要用添加时相同的事件类型和同一个函数。即使重新写一个内容相同的函数，浏览器也会把它当成另一个函数，没法用它移除原来的监听。如果添加时还指定了 <code>capture: true</code>（在事件到达目标前接收），移除时也要指定相同的捕获设置。页面切换或弹窗关闭后，也要清理不再需要的监听。<Cite id="event-cleanup" /></p>
      <p>假如每次打开弹窗都添加一个新的监听，却从不移除，之后一次点击可能执行多次业务处理。排查这种问题时，要检查添加和移除监听的位置，而不只是让按钮忽略连续的重复点击。</p>
      <p id="event-keyboard" className="vp-citation-target">click 不只对应鼠标。原生按钮获得焦点后，按 Enter 或空格也能激活它并产生 click。使用正确的按钮元素，能保留浏览器已经提供的键盘行为；把普通 div 画成按钮，并不会自动得到这些能力。<Cite id="event-keyboard" /></p>
    </ArticleSection>
    <ArticleSection id="object" title="事件携带的信息">
      <p id="event-object" className="vp-citation-target">处理函数会收到事件对象。<code>type</code> 表示事件类型，<code>target</code> 指向事件发生在哪个元素上，比如本例被点击的电源按钮；键盘事件还可以提供按下的键。代码应该读取当前任务需要的信息，不必把整个事件对象保存成业务数据。<Cite id="event-object" /></p>
      <div className={styles.contrast}><div><h3>这次发生了什么</h3><p>本例的 type 是 click，目标是灯的开关按钮。</p></div><div><h3>现在界面是什么样</h3><p>灯是否亮着属于状态；它可以在这次事件结束后继续保留。</p></div></div>
      <p>这一区别对表单也有用：input 事件告诉你输入发生了变化，当前文字需要另行保存在输入控件或应用状态里。不要把“收到过输入事件”当成“已经保存用户内容”。</p>
    </ArticleSection>
    <ArticleSection id="result" title="默认行为与业务结果">
      <Anchors slug="event" names={["quiz-heading", "prompt-heading"]} />
      <p id="event-default" className="vp-citation-target">有些操作还有浏览器自带的默认行为，例如点击链接后的跳转、点击提交按钮后的表单提交。对于允许取消默认行为的事件（例如链接的 click），<code>preventDefault()</code> 可以阻止这个默认动作，但不会让事件停止向父元素传播。并非所有事件都允许取消；若监听器被设为 <code>passive</code>（承诺不阻止默认行为），也不能在其中用这个方法取消默认行为。<Cite id="event-default" /></p>
      <blockquote className={styles.callout}>收到点击，说明用户发起了操作。<br />操作是否成功，要看后续结果。</blockquote>
      <p>“提交订单”按钮的 click 只能启动处理。输入是否有效、请求是否到达服务器、订单是否真正创建，都需要独立检查。界面可以先显示“处理中”，得到确认后再显示成功；失败时保留用户已填的内容，方便修改或重试。</p>
      <ArticleAside title="框架里的事件写法"><p>在 React 中常见 <code>{"onClick={handleClick}"}</code>。这是框架提供的写法，最终对应的仍是浏览器的点击事件。本页直接添加原生监听，是为了让“接上与移除”可观察；实际 React 页面通常直接使用框架事件属性，不必为普通按钮手动添加和移除监听。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function BubblingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={bubblingSources} />;
  return <ConceptArticle slug="event-bubbling" title="事件冒泡" sources={bubblingSources}
    sections={[["path", "一次点击经过几层"], ["targets", "目标与当前处理位置"], ["stopping", "停止传播的边界"], ["delegation", "把处理放在父容器"]]}
    hero={<ConceptHero slug="event-bubbling" label="左侧一次点击从按钮依次到达卡片和列表；右侧点击在按钮处停止，外层不响应"><div className={styles.bubbleHero}>
      <div className={`${styles.bubbleScene} ${styles.bubblePass}`}><span className={styles.bubbleCaption}>继续冒泡</span><div className={styles.bubbleList}><span>列表</span><div className={styles.bubbleCard}><span>卡片</span><div className={styles.bubbleButton}><BookmarkSimple size={22} weight="fill" /></div></div></div><i className={styles.bubbleMarker} /></div>
      <div className={`${styles.bubbleScene} ${styles.bubbleStop}`}><span className={styles.bubbleCaption}>按钮处停止</span><div className={styles.bubbleList}><span>列表</span><div className={styles.bubbleCard}><span>卡片</span><div className={styles.bubbleButton}><BookmarkSimple size={22} weight="fill" /></div></div></div><i className={styles.bubbleMarker} /></div>
    </div></ConceptHero>}
    intro={<>点击卡片里的按钮时，卡片和列表上预先登记的处理函数也可能执行。网页元素可以一层包着一层；<strong>同一次点击到达按钮后，还能沿着外层元素继续传播</strong>，这个阶段叫冒泡。</>}
    relatedIntro={<>先用 <ConceptTerm slug="dom">DOM</ConceptTerm> 看清嵌套关系，再沿着 <ConceptTerm slug="event">事件</ConceptTerm> 的传播路径检查处理函数。页面上的视觉位置，不一定等于 DOM 中的父子关系。</>}>
    <ArticleSection id="path" title="一次点击经过几层">
      <Anchors slug="event-bubbling" names={["question", "definition"]} />
      <p>一个阅读列表里有文章卡片，卡片里又有收藏按钮。你想收藏文章，却发现外层卡片上登记的点击处理函数也运行了。要理解原因，先看这三个元素的嵌套关系。</p>
      <p id="bubble-order" className="vp-citation-target">默认只记录冒泡时，按钮、卡片、列表上的处理函数会依次执行。<strong>这是同一次点击到达了三个位置，外层元素没有重新制造点击。</strong>浏览器此前还会经过从外向内的捕获阶段；本例初始不显示那段记录，后面可以勾选显示。哪些函数真正运行，还取决于该位置是否添加了监听、事件是否被提前停止。<Cite id="bubble-order" /></p>
      <p>下面是三层 DOM（浏览器记录的网页元素层级）：按钮是 <code>button</code>，在卡片 <code>article</code> 里；卡片又在列表 <code>div</code> 里。收藏按钮每按一次会在“收藏”和“已收藏”之间切换。点击后，记录区会按浏览器实际执行处理函数的顺序留下记录；淡入只是慢放，真实执行不等动画。勾选“在按钮处停止传播”后再点一次，看按钮动作和外层记录各有什么变化。勾选状态会保留，除非再点勾选框取消，或按“重置传播演示”。</p>
      <Anchors slug="event-bubbling" names={["scene-heading"]} /><BubblingLesson />
      <p id="bubble-capture" className="vp-citation-target">勾选“记录捕获阶段”后，记录区会先显示列表和卡片的捕获记录：事件从外层向按钮靠近，随后才到按钮并向外冒泡。添加监听时指定 <code>capture: true</code>，就是选择在捕获阶段接收。即使没勾选，本次点击仍经过捕获路径，只是记录区不显示它。如果“在按钮处停止传播”仍勾着，捕获记录和按钮记录都会出现，之后的冒泡记录不会出现。<Cite id="bubble-capture" /></p>
    </ArticleSection>
    <ArticleSection id="targets" title="目标与当前处理位置" className={styles.offset}>
      <p id="bubble-targets" className="vp-citation-target">在本页这个普通 DOM 例子里，<code>target</code> 始终指向最初点击的按钮，<code>currentTarget</code> 则是当前监听器所在的元素。传播过程中变的是处理位置，不是最初点击的位置。<Cite id="bubble-targets" /></p>
      <table className={styles.targetTable}><thead><tr><th>执行中的监听器</th><th>target</th><th>currentTarget</th></tr></thead><tbody><tr><td>按钮</td><td><code>button</code></td><td><code>button</code></td></tr><tr><td>卡片</td><td><code>button</code></td><td><code>article</code></td></tr><tr><td>列表</td><td><code>button</code></td><td><code>div</code></td></tr></tbody></table>
      <p>例如列表需要判断“这次点了哪篇文章”，应从目标向外层找到所属文章；如果把 <code>currentTarget</code> 当成点击目标，就只会拿到整个列表。这个表只对应本页的普通嵌套结构；跨 Shadow DOM 等特殊边界时，对外看到的 <code>target</code> 可能改变，本页不展开。</p>
    </ArticleSection>
    <ArticleSection id="stopping" title="停止传播的边界">
      <p id="bubble-stop" className="vp-citation-target"><code>stopPropagation()</code> 阻止事件继续传播，但不会撤销按钮已经完成的收藏切换，也不会阻止当前元素上的其他监听器。本例在按钮处停止时，先前的捕获记录仍在，之后卡片和列表的冒泡记录消失。按钮从“已收藏”变回“收藏”，是因为你又按了一次，而非停止传播撤销了上次收藏。<Cite id="bubble-stop" /></p>
      <div className={styles.contrast}><div><h3>停止传播</h3><p>控制事件是否继续经过外层元素。</p></div><div><h3>取消默认行为</h3><p>控制浏览器是否执行链接跳转、表单提交等默认动作。</p></div></div>
      <p id="bubble-default" className="vp-citation-target">这两个动作互不替代。<code>preventDefault()</code> 不会自动停止传播；而仅仅停止一个链接点击的传播，也不会自动阻止链接跳转。先明确要阻止的是哪件事，再选择方法。<Cite id="bubble-default" /></p>
      <p>停止传播也可能影响外层需要观察点击的功能。若卡片只是不该把收藏当成“打开文章”，可以让卡片处理函数先排除收藏按钮；也可以只让文章标题链接负责打开文章，让收藏按钮负责收藏。不必把所有内层按钮一律设成“不许冒泡”。</p>
    </ArticleSection>
    <ArticleSection id="delegation" title="把处理放在父容器">
      <Anchors slug="event-bubbling" names={["quiz-heading", "prompt-heading"]} />
      <p id="bubble-delegation" className="vp-citation-target">冒泡还能让一批子元素共用外层列表上的监听器，这叫事件委托。列表收到点击后，查看最初点到了哪个元素，再找到它属于哪篇文章；后来增加的文章也能走这条路径，不必给每张卡片复制同一段处理代码。<Cite id="bubble-delegation" /></p>
      <pre className={styles.code}>{'list.addEventListener("click", (event) => {\n  if (!(event.target instanceof Element)) return;\n  const item = event.target.closest("[data-item]");\n  if (!item || !list.contains(item)) return;\n  // 按 item 对应的数据处理\n});'}</pre>
      <p>代码里的 <code>list</code> 是外层列表，<code>data-item</code> 是文章卡片上的标记；<code>closest</code> 从实际点到的元素向外找标记，所以点在按钮图标上也能找到所属文章。还要过滤无关区域，并确认找到的卡片确实在这个列表中。比如待办列表的删除按钮若不该触发“选中任务”，列表处理函数就要先识别这个按钮并跳过选中；“只写一个监听器”本身不保证处理正确。</p>
      <ArticleAside title="不是每一种事件都会冒泡"><p id="bubble-scope" className="vp-citation-target">事件对象的 <code>bubbles</code> 表示它是否会在冒泡阶段向祖先传播。不要因为 click 可以委托，就假定任意事件都一样；设计某个交互时，应先核对具体事件的文档。<Cite id="bubble-scope" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function HookTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={hookSources} />;
  return <ConceptArticle slug="hook" title="Hook" subtitle="React 中的可复用逻辑" sources={hookSources}
    sections={[["reuse", "把重复的逻辑提取出来"], ["independent", "同一段逻辑，两份状态"], ["rules", "调用位置有规则"], ["effects", "订阅也要负责清理"]]}
    hero={<ConceptHero slug="hook" label="咖啡和门票分别调用 useCounter；咖啡沿相同计数规则从 2 走到 3，门票停在 0"><div className={styles.hookHero}>
      <code>useCounter()</code>
      <div className={styles.hookTracks}>
        <div className={`${styles.hookTrack} ${styles.hookCoffee}`}><span><Coffee size={18} />咖啡</span><div className={styles.hookTrackBody}><div className={styles.hookTicks}><i /><i /><i /><i /><b className={styles.hookSlider} /></div><strong><b>2</b><b>3</b></strong></div></div>
        <div className={`${styles.hookTrack} ${styles.hookTicket}`}><span><Ticket size={18} />门票</span><div className={styles.hookTrackBody}><div className={styles.hookTicks}><i /><i /><i /><i /><b className={styles.hookSlider} /></div><strong>0</strong></div></div>
      </div>
    </div></ConceptHero>}
    intro={<>React 用组件组成界面；函数组件就是用函数写出的界面部分。咖啡数量这类值会变化，界面更新后还要保留下来。这种值叫状态。本文的 Hook 指 React Hook：它是一类供函数组件使用的特殊函数。React 提供 <code>useState</code> 等内置 Hook，我们也可以写自定义 Hook，<strong>让不同组件复用处理状态的逻辑。</strong></>}
    relatedIntro={<>Hook 在 <ConceptTerm slug="component">组件</ConceptTerm> 中使用；<ConceptTerm slug="state">状态</ConceptTerm> 记住会变化的数据，<ConceptTerm slug="effect">Effect</ConceptTerm> 负责与浏览器等外部系统同步。组件还可以通过 <ConceptTerm slug="props">Props</ConceptTerm> 接收外层传来的数据。</>}>
    <ArticleSection id="reuse" title="把重复的逻辑提取出来">
      <Anchors slug="hook" names={["question", "definition"]} />
      <p>活动页面要统计咖啡和门票。两处都需要当前数量、增加、减少和重置。如果分别写两遍，后来要调整“最少为零”的规则，就容易只改其中一处。</p>
      <p id="hook-reuse" className="vp-citation-target">可以把这组操作提取成 <code>useCounter</code>。它内部调用 React 提供的 <code>useState</code>，让组件记住当前数量，并取得修改数量的函数；<code>useCounter</code> 再把数量和加、减、重置的方法交给组件。组件决定怎样显示数量，例如把 <code>add</code> 交给自己的加号按钮，点击按钮时就执行 <code>add</code>。<Cite id="hook-reuse" /></p>
      <p>分别操作下面两个计数器，再改变每次增减的步长。它们实际调用同一份 Hook；当前数值各自保存在自己的组件中。演示里的数值只保存在当前页面，刷新后回到初值。</p>
      <Anchors slug="hook" names={["scene-heading"]} /><HookLesson />
      <p>咖啡从 2 开始，门票从 0 开始。步长改成 5 后，下一次增加会多出 5，但已有数值不会被清空。减少到不足一个步长时，这个演示会停在 0，不出现负数。</p>
    </ArticleSection>
    <ArticleSection id="independent" title="同一段逻辑，两份状态">
      <p id="hook-independent" className="vp-citation-target"><strong>自定义 Hook 复用状态相关的逻辑，不会自动共享同一份状态。</strong>提取前，咖啡和门票组件可以各写一次 <code>useState</code>；提取后，它们各调用一次 <code>useCounter</code>，也就各有自己的数量。给咖啡加一不会改变门票，重置门票也不会重置咖啡。如果页头角标和购物车页面必须显示同一个数量，就应让两处读取同一份状态，而不是各自再调用一次计数 Hook。<Cite id="hook-independent" /></p>
      <pre className={styles.code}>{'function useCounter(initial, step) {\n  const [count, setCount] = useState(initial);\n  return {\n    count,\n    add: () => setCount(n => n + step),\n    subtract: () => setCount(n => Math.max(0, n - step)),\n    reset: () => setCount(initial),\n  };\n}'}</pre>
      <p id="hook-update" className="vp-citation-target">代码里的 <code>n =&gt; n + step</code> 是更新函数：第一次计算时，React 把当前数量作为 <code>n</code> 交给它；如果一次操作接连加好几次，下一次收到的就是上一次算出的结果，因此能逐次增加，不会反复拿同一个旧数相加。减少时同理，再用 <code>Math.max</code> 保证结果不低于 0。<Cite id="hook-update" /></p>
      <p id="hook-initial" className="vp-citation-target"><code>useState(initial)</code> 只在组件第一次显示时采用初值。数量改变后，React 会重新执行组件函数来更新画面，<code>useCounter</code> 也会跟着执行；但它里面的 <code>useState(initial)</code> 此时取的是已经保存的数量，不会再把 <code>initial</code> 当成新值。本例点击重置会明确调用 <code>setCount(initial)</code>，才回到 2 或 0。<Cite id="hook-initial" /></p>
    </ArticleSection>
    <ArticleSection id="rules" title="调用位置有规则" className={styles.offset}>
      <p id="hook-rules" className="vp-citation-target"><code>useState</code>、<code>useEffect</code> 和本例的 <code>useCounter</code> 应固定写在函数组件或自定义 Hook 的顶层，不能放进条件分支、循环或按钮点击函数。如果函数会在某种情况下提早结束，也要把 Hook 放在这个出口之前。如果这次执行了某个 Hook，下次却因为条件变化跳过它，React 就无法稳定地把之前保存的状态对应回原来的调用位置。<Cite id="hook-rules" /></p>
      <blockquote className={styles.callout}>组件计算画面时调用 <code>useCounter</code>，得到数量和 <code>add</code>；<br />点击加号时执行的是 <code>add</code>。</blockquote>
      <p>比如点击加号时执行 add，而不是在点击后才调用 useCounter。如果某一块界面只在特定条件出现，可以把它做成独立组件，在那个组件的顶层使用 Hook；条件控制组件是否出现，不控制同一组件里的 Hook 调用顺序。</p>
      <p id="hook-naming" className="vp-citation-target">自定义 Hook 的名字以 <code>use</code> 开头，后面单词的首字母大写，例如 <code>useCounter</code>。这样读代码的人和检查工具能认出：它里面可能调用 <code>useState</code> 等 React Hook。只做排序或格式化的普通函数不必加上 <code>use</code>；函数名前缀本身也不会产生状态。<Cite id="hook-naming" /></p>
    </ArticleSection>
    <ArticleSection id="effects" title="订阅也要负责清理">
      <Anchors slug="hook" names={["quiz-heading", "prompt-heading"]} />
      <p>计数器只需要保存数量，不需要 Effect。另一个自定义 Hook 的例子是记录窗口宽度：组件先保存宽度，再监听浏览器的 <code>resize</code> 事件，窗口变化时更新数值。提取这种逻辑时，除了开始监听，还要写好停止监听的动作。</p>
      <p id="hook-cleanup" className="vp-citation-target"><code>useEffect</code> 可以负责这类与浏览器的同步：在里面开始监听，并返回一个取消监听的函数。如果监听的对象或其他条件变了，React 会先执行旧的清理，再开始新的监听；组件从页面移除时也会清理。启用 Strict Mode（React 开发时的检查模式）后，React 还会额外执行一轮开始与清理，帮助发现只开始、不取消的问题。<Cite id="hook-cleanup" /></p>
      <p>判断一段代码是否值得提成 Hook，可以问：它封装了什么能力，输入和返回值是否清楚，调用者是否还需要了解里面每一个细节。只把几行代码搬到名字以 <code>use</code> 开头的文件里，却让调用方承担所有清理工作，并没有让职责划分变得清楚。</p>
      <ArticleAside title="Hook 不是后台任务"><p>自定义 Hook 的函数体会随组件渲染执行，不是自动启动一个独立线程。耗时计算、请求取消、缓存和错误处理仍需要按实际任务设计；不能因为换成 Hook，就假定这些问题已经解决。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
