import { BookmarkSimple, Lightbulb, Power } from "@phosphor-icons/react/dist/ssr";
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
    sections={[["notification", "动作怎样到达代码"], ["listener", "接上一个处理函数"], ["object", "事件带来了什么"], ["result", "默认行为与业务结果"]]}
    hero={<ConceptHero slug="event" label="开关被按下后，阅读灯照亮下方区域"><div className={styles.eventHero}><Lightbulb size={58} weight="light" /><div className={styles.heroBeam} /><span className={styles.heroSwitch}><Power size={22} /></span></div></ConceptHero>}
    intro={<>事件是程序获知“发生了什么”的方式。在网页中，点击、输入、提交和加载完成都能产生事件。<strong>监听器把这些通知交给处理函数，由代码决定接下来做什么。</strong></>}
    relatedIntro={<>处理事件的代码通常用 <ConceptTerm slug="javascript">JavaScript</ConceptTerm> 编写；它可以修改 <ConceptTerm slug="state">状态</ConceptTerm>。同一次点击怎样到达父容器，则由事件传播规则决定。</>}>
    <ArticleSection id="notification" title="动作怎样到达代码">
      <Anchors slug="event" names={["question", "definition"]} />
      <p>网页上画一个开关，还不会自动让阅读灯亮起来。你需要说明：收到这个开关的点击时，执行哪段代码。这段联系建立后，用户的一次操作才会改变界面里的灯。</p>
      <p id="event-notification" className="vp-citation-target">浏览器用事件通知代码发生了某种变化；代码可以通过 <code>addEventListener</code> 注册处理函数。<strong>事件、监听器和处理函数是不同的角色：</strong>事件携带这次发生的事情，监听器建立接收关系，处理函数负责响应。本文讨论浏览器中的 DOM 事件；服务器和其他系统也有事件机制，接口不一定相同。<Cite id="event-notification" /></p>
      <p>试着按一下下面的电源按钮，再断开开灯监听器后继续按。记录区仍然观察 click 事件，但灯的变化只由那个可以断开的监听器处理。这是一盏网页里的灯，不会控制真实设备。</p>
      <Anchors slug="event" names={["scene-heading"]} /><EventLesson />
      <p>断开之后，灯保留上一次的亮灭状态。按钮并没有失效，click 也仍然发生，只是改变灯的处理函数不再运行。重新连接后，再次操作开关，灯才继续变化。</p>
    </ArticleSection>
    <ArticleSection id="listener" title="接上一个处理函数" className={styles.offset}>
      <p>注册时需要选定接收事件的对象、事件类型和函数。下面的代码只建立联系，不会因为运行到这一行就立刻调用 toggleLight。用户之后触发 click，浏览器才调用它。</p>
      <pre className={styles.code}>{'button.addEventListener("click", toggleLight);\n\n// 不再需要时解除同一个监听\nbutton.removeEventListener("click", toggleLight);'}</pre>
      <p id="event-cleanup" className="vp-citation-target">移除监听器时，要匹配事件类型、原先的函数引用和捕获选项。重新写一个看起来相同的匿名函数，仍然是另一个函数，不能用它移除原来的监听。组件离开页面后，也要清理自己不再需要的外部监听。<Cite id="event-cleanup" /></p>
      <p>假如每次打开弹窗都添加一个新的监听，却从不移除，之后一次点击可能执行多次业务处理。排查这种问题时，要检查注册和清理的位置，而不只是给按钮加一层防连点。</p>
      <p id="event-keyboard" className="vp-citation-target">click 不只对应鼠标。原生按钮获得焦点后，按 Enter 或空格也能激活它并产生 click。使用正确的按钮元素，能保留浏览器已经提供的键盘行为；把普通 div 画成按钮，并不会自动得到这些能力。<Cite id="event-keyboard" /></p>
    </ArticleSection>
    <ArticleSection id="object" title="事件带来了什么">
      <p id="event-object" className="vp-citation-target">处理函数会收到事件对象。<code>type</code> 表示事件类型，<code>target</code> 指向发生事件的目标；键盘事件还可以提供按下的键。代码应该读取当前任务需要的信息，不必把整个事件对象保存成业务数据。<Cite id="event-object" /></p>
      <div className={styles.contrast}><div><h3>这次发生了什么</h3><p>本例的 type 是 click，目标是灯的开关按钮。</p></div><div><h3>现在界面是什么样</h3><p>灯是否亮着属于状态；它可以在这次事件结束后继续保留。</p></div></div>
      <p>这一区别对表单也有用：input 事件告诉你输入发生了变化，当前文字需要另行保存在输入控件或应用状态里。不要把“收到过输入事件”当成“已经保存用户内容”。</p>
    </ArticleSection>
    <ArticleSection id="result" title="默认行为与业务结果">
      <Anchors slug="event" names={["quiz-heading", "prompt-heading"]} />
      <p id="event-default" className="vp-citation-target">有些操作还有浏览器提供的默认行为，例如点击链接导航、提交表单。对于允许取消的事件，<code>preventDefault()</code> 可以阻止默认行为；它不会自动停止事件传播。不可取消的事件不受它影响，passive 监听器也不能靠它取消默认行为。<Cite id="event-default" /></p>
      <blockquote className={styles.callout}>收到点击，说明用户发起了操作。<br />操作是否成功，要看后续结果。</blockquote>
      <p>“提交订单”按钮的 click 只能启动处理。输入是否有效、请求是否到达服务器、订单是否真正创建，都需要独立检查。界面可以先显示等待，只有得到确认后才显示成功；失败则保留必要输入，让用户继续处理。</p>
      <ArticleAside title="框架里的事件写法"><p>在 React 中常见 <code>{"onClick={handleClick}"}</code>。这是框架提供的声明方式，底层仍与浏览器交互。本页直接注册原生监听器，是为了让“接上与解除”可观察；实际 React 页面通常直接使用框架事件属性，不必为普通按钮手动订阅。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function BubblingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={bubblingSources} />;
  return <ConceptArticle slug="event-bubbling" title="事件冒泡" sources={bubblingSources}
    sections={[["path", "一次点击经过几层"], ["targets", "目标与当前处理位置"], ["stopping", "停止传播的边界"], ["delegation", "把处理放在父容器"]]}
    hero={<ConceptHero slug="event-bubbling" label="按钮位于卡片和列表内部，响应从内层扩散到外层"><div className={styles.bubbleHero}><div><code>列表</code><div><BookmarkSimple size={35} weight="light" /></div></div></div></ConceptHero>}
    intro={<>点击卡片里的按钮时，父容器的监听器也可能执行。因为<strong>同一个事件到达目标后，可以沿着 DOM 祖先继续向上传播</strong>，这个阶段叫冒泡。</>}
    relatedIntro={<>先用 <ConceptTerm slug="dom">DOM</ConceptTerm> 看清嵌套关系，再沿着 <ConceptTerm slug="event">事件</ConceptTerm> 的传播路径检查处理函数。页面上的视觉位置，不一定等于 DOM 中的父子关系。</>}>
    <ArticleSection id="path" title="一次点击经过几层">
      <Anchors slug="event-bubbling" names={["question", "definition"]} />
      <p>一个阅读列表里有文章卡片，卡片里又有收藏按钮。你想收藏文章，却发现外层卡片的点击处理也运行了。要理解原因，先看这三个元素的嵌套关系。</p>
      <p id="bubble-order" className="vp-citation-target">对于本例的 click，先执行按钮上的目标阶段处理，再经过卡片和列表上的冒泡处理。<strong>不是父元素重新制造了几次点击，而是同一次事件经过不同位置。</strong>监听器是否注册、事件是否继续传播，共同决定哪些函数会运行。<Cite id="bubble-order" /></p>
      <p>下面是真实的三层 DOM。点击收藏，右侧按浏览器实际回调顺序留下记录；淡入只是慢放展示，真实执行并不会等动画播完。打开“在按钮处停止传播”，再比较一次。</p>
      <Anchors slug="event-bubbling" names={["scene-heading"]} /><BubblingLesson />
      <p id="bubble-capture" className="vp-citation-target">记录捕获阶段后，列表和卡片的捕获监听会先于按钮执行：从外层向目标靠近，随后才是目标和向外冒泡。注册监听器时指定 <code>capture: true</code>，就是选择在捕获阶段接收。只记录冒泡时，看不到捕获日志，不代表事件没有经过这条路径。<Cite id="bubble-capture" /></p>
    </ArticleSection>
    <ArticleSection id="targets" title="目标与当前处理位置" className={styles.offset}>
      <p id="bubble-targets" className="vp-citation-target">在本页这个普通 DOM 例子里，<code>target</code> 始终指向最初点击的按钮，<code>currentTarget</code> 则是当前监听器所在的元素。传播过程中变的是处理位置，不是最初点击的位置。<Cite id="bubble-targets" /></p>
      <table className={styles.targetTable}><thead><tr><th>执行中的监听器</th><th>target</th><th>currentTarget</th></tr></thead><tbody><tr><td>按钮</td><td><code>button</code></td><td><code>button</code></td></tr><tr><td>卡片</td><td><code>button</code></td><td><code>article</code></td></tr><tr><td>列表</td><td><code>button</code></td><td><code>div</code></td></tr></tbody></table>
      <p>例如列表需要判断“这次点了哪篇文章”，应从目标向上找到所属文章；如果把 currentTarget 当成点击目标，就只会拿到整个列表。这个表只描述当前例子，不讨论跨 Shadow DOM 边界的目标重定向。</p>
    </ArticleSection>
    <ArticleSection id="stopping" title="停止传播的边界">
      <p id="bubble-stop" className="vp-citation-target"><code>stopPropagation()</code> 阻止事件继续传播，但不会撤销已经执行的监听器，也不会阻止当前元素上的其他监听器。于是本例在按钮处停止时，之前的捕获日志仍然存在，之后卡片和列表的冒泡日志消失。<Cite id="bubble-stop" /></p>
      <div className={styles.contrast}><div><h3>停止传播</h3><p>控制事件是否继续经过其他节点。</p></div><div><h3>取消默认行为</h3><p>控制浏览器是否执行导航、表单提交等默认动作。</p></div></div>
      <p id="bubble-default" className="vp-citation-target">这两个动作互不替代。<code>preventDefault()</code> 不会自动截断传播；而仅仅停止一个链接点击的传播，也不会自动阻止链接导航。先明确要阻止的是哪件事，再选择方法。<Cite id="bubble-default" /></p>
      <p>停止传播也可能影响外层需要观察点击的功能。若外层只是不该处理收藏按钮，可以在外层过滤目标，或重新划分交互区域；不必把所有内层按钮一律设成“不许冒泡”。</p>
    </ArticleSection>
    <ArticleSection id="delegation" title="把处理放在父容器">
      <Anchors slug="event-bubbling" names={["quiz-heading", "prompt-heading"]} />
      <p id="bubble-delegation" className="vp-citation-target">冒泡还能让一批子元素共用父容器上的监听器，这叫事件委托。父容器收到事件后，根据目标判断该处理哪一项；后来增加的子元素也能走这条路径，不必逐个复制相同监听逻辑。<Cite id="bubble-delegation" /></p>
      <pre className={styles.code}>{'list.addEventListener("click", (event) => {\n  if (!(event.target instanceof Element)) return;\n  const item = event.target.closest("[data-item]");\n  if (!item || !list.contains(item)) return;\n  // 按 item 对应的数据处理\n});'}</pre>
      <p>寻找最近的目标元素，可以应对用户点在按钮内部图标上的情况。仍要过滤无关区域，并检查这项操作是否真的属于当前容器；“只写一个监听器”本身不是正确性的保证。</p>
      <ArticleAside title="不是每一种事件都会冒泡"><p id="bubble-scope" className="vp-citation-target">事件对象的 <code>bubbles</code> 表示它是否会在冒泡阶段向祖先传播。不要因为 click 可以委托，就假定任意事件都一样；设计某个交互时，应先核对具体事件的文档。<Cite id="bubble-scope" /></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function HookTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={hookSources} />;
  return <ConceptArticle slug="hook" title="Hook" subtitle="React 中的可复用逻辑" sources={hookSources}
    sections={[["reuse", "把重复的逻辑提取出来"], ["independent", "同一段逻辑，两份状态"], ["rules", "调用位置有规则"], ["effects", "订阅也要负责清理"]]}
    hero={<ConceptHero slug="hook" label="同一个 useCounter 函数被调用两次，得到各自独立的数值"><div className={styles.hookHero}><code>useCounter()</code><div><span><strong>2</strong>咖啡</span><span><strong>0</strong>门票</span></div></div></ConceptHero>}
    intro={<>本文的 Hook 指 React Hook：函数组件借助它使用状态、同步外部系统等能力。自定义 Hook 可以组合这些能力，<strong>把一段有状态的逻辑交给不同组件复用。</strong></>}
    relatedIntro={<>Hook 在 <ConceptTerm slug="component">组件</ConceptTerm> 中使用，<ConceptTerm slug="state">状态</ConceptTerm> 保存变化，<ConceptTerm slug="effect">Effect</ConceptTerm> 同步外部系统；输入则可以通过 Props 传入。</>}>
    <ArticleSection id="reuse" title="把重复的逻辑提取出来">
      <Anchors slug="hook" names={["question", "definition"]} />
      <p>活动页面要统计咖啡和门票。两处都需要当前数量、增加、减少和重置。如果分别写两遍，后来要调整“最少为零”的规则，就容易只改其中一处。</p>
      <p id="hook-reuse" className="vp-citation-target">可以把这组操作提取成 useCounter。它内部调用 useState，再把当前数量和操作函数返回给调用方。React 的自定义 Hook 用来复用这种逻辑；组件仍然负责决定这些值画成什么样，并把操作函数接到哪个按钮。<Cite id="hook-reuse" /></p>
      <p>分别操作下面两个计数器，再改变每次增减的步长。它们实际调用同一份 Hook；当前数值各自保存在自己的组件中。演示只保存在当前页面，刷新后恢复初值。</p>
      <Anchors slug="hook" names={["scene-heading"]} /><HookLesson />
      <p>咖啡从 2 开始，门票从 0 开始。步长改成 5 后，下一次增加会多出 5，但已有数值不会被清空。减少到不足一个步长时，本例约定停在 0，而不出现负数。</p>
    </ArticleSection>
    <ArticleSection id="independent" title="同一段逻辑，两份状态">
      <p id="hook-independent" className="vp-citation-target"><strong>自定义 Hook 复用状态相关的逻辑，不会自动共享同一份状态。</strong>本例中，给咖啡加一不会改变门票，重置门票也不会重置咖啡。两次 useCounter 调用各自使用自己的状态。需要同步一份数据时，应另外确定共同的数据拥有者。<Cite id="hook-independent" /></p>
      <pre className={styles.code}>{'function useCounter(initial, step) {\n  const [count, setCount] = useState(initial);\n  return {\n    count,\n    add: () => setCount(n => n + step),\n    subtract: () => setCount(n => Math.max(0, n - step)),\n    reset: () => setCount(initial),\n  };\n}'}</pre>
      <p id="hook-update" className="vp-citation-target">增加和减少使用函数式更新：把上一份数值交给计算函数，返回新的数值。这样代码明确表达“基于之前的数量更新”，而不是误把闭包里读到的旧值当成每次更新的起点。<Cite id="hook-update" /></p>
      <p id="hook-initial" className="vp-citation-target"><code>useState(initial)</code> 只在初始化时使用这个初值。之后组件重新渲染、Hook 再次执行，React 会取回已保存的状态。本例的重置会明确调用 setCount；它不是靠再执行一次 Hook 就把状态清空。<Cite id="hook-initial" /></p>
    </ArticleSection>
    <ArticleSection id="rules" title="调用位置有规则" className={styles.offset}>
      <p id="hook-rules" className="vp-citation-target">useState、useEffect 和本例的 useCounter 应在函数组件或自定义 Hook 的顶层调用，放在提前返回之前；不要塞进条件分支、循环或点击处理函数。条件改变而导致调用顺序不同，会让 React 无法按原先的顺序对应这些状态。<Cite id="hook-rules" /></p>
      <blockquote className={styles.callout}>渲染时调用 Hook 取得能力，<br />操作时调用它返回的函数。</blockquote>
      <p>比如点击加号时执行 add，而不是在点击后才调用 useCounter。如果某一块界面只在特定条件出现，可以把它做成独立组件，在那个组件的顶层使用 Hook；条件控制组件是否出现，不控制同一组件里的 Hook 调用顺序。</p>
      <p id="hook-naming" className="vp-citation-target">自定义 Hook 用 use 加大写字母开头，帮助读者和检查工具识别里面可能使用了 React 能力。一个只做排序或格式化、没有调用其他 Hook 的普通函数，不必为了统一名字就加上 use；函数名前缀也不会凭空带来状态。<Cite id="hook-naming" /></p>
    </ArticleSection>
    <ArticleSection id="effects" title="订阅也要负责清理">
      <Anchors slug="hook" names={["quiz-heading", "prompt-heading"]} />
      <p>计数器只需要状态，不需要 Effect。另一种常见 Hook 是读取窗口尺寸：组件要保存宽度，并监听浏览器的 resize。提取它时，应把订阅与清理一起带走，不能只封装“添加监听”那一半。</p>
      <p id="hook-cleanup" className="vp-citation-target">useEffect 可以让组件与外部系统保持同步。设置函数返回清理函数；相关依赖改变后，React 先清理旧连接，再设置新连接，组件移除时也会清理。开发环境的严格模式还会额外做一轮设置与清理，帮助暴露不对称的订阅。<Cite id="hook-cleanup" /></p>
      <p>判断一段代码是否值得提成 Hook，可以问：它封装了什么能力，输入和返回值是否清楚，调用者是否还需要了解里面每一个细节。只把几行代码搬到名字以 use 开头的文件里，却让调用方承担所有清理工作，并没有改善这个边界。</p>
      <ArticleAside title="Hook 不是后台任务"><p>自定义 Hook 的函数体会随组件渲染执行，不是自动启动一个独立线程。耗时计算、请求取消、缓存和错误处理仍需要按实际任务设计；不能因为换成 Hook，就假定这些问题已经解决。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
