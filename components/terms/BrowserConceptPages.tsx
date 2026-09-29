import { Broadcast, CloudSun, MusicNote } from "@phosphor-icons/react/dist/ssr";
import { browserApiSources, effectSources } from "@/lib/browser-concept-sources";
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { BrowserApiLesson, EffectLesson } from "./BrowserConceptLessons";
import shared from "./EventConcepts.module.css";
import styles from "./BrowserConcepts.module.css";

function Anchors({ slug, names }: { slug: string; names: string[] }) {
  return names.map(name => <span key={name} id={`${slug}-${name}`} className={shared.anchor} />);
}

export function EffectTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={effectSources} />;
  return <ConceptArticle slug="effect" title="副作用" subtitle="React Effect" sources={effectSources}
    sections={[["sync", "让订阅跟上当前频道"], ["cleanup", "先撤销，再建立"], ["dependencies", "依赖描述同步的条件"], ["choice", "不需要 Effect 的计算"]]}
    hero={<ConceptHero slug="effect" label="接收器保持原位；音乐订阅先完全撤销，天气订阅随后接通，最终只连接天气"><div className={styles.effectHero}>
      <svg className={styles.effectPaths} viewBox="0 0 330 234" preserveAspectRatio="none" aria-hidden="true"><path className={styles.effectOldPath} pathLength="100" d="M75 57 C145 57 175 120 245 120" /><path className={styles.effectNewPath} pathLength="100" d="M75 177 C145 177 175 120 245 120" /></svg>
      <div className={`${styles.effectSource} ${styles.effectMusic}`}><MusicNote size={27} weight="light" /><span>音乐</span></div>
      <div className={`${styles.effectSource} ${styles.effectWeather}`}><CloudSun size={27} weight="light" /><span>天气</span></div>
      <div className={styles.effectReceiver}><Broadcast size={34} weight="light" /><span>接收器</span></div>
    </div></ConceptHero>}
    intro={<>界面选择了新的频道，消息订阅也要随之切换。React 的 Effect 用来<strong>让组件与外部系统保持同步</strong>；建立连接时，也要考虑何时撤销它。</>}
    relatedIntro={<>Effect 是一种 <ConceptTerm slug="hook">Hook</ConceptTerm>。它读取 <ConceptTerm slug="state">状态</ConceptTerm>，按需要调用 <ConceptTerm slug="browser-api">浏览器 API</ConceptTerm> 或其他外部系统，而不是代替所有事件处理。</>}>
    <ArticleSection id="sync" title="让订阅跟上当前频道">
      <Anchors slug="effect" names={["question", "definition"]} />
      <p>一个消息面板正在接收音乐播报。订阅就是告诉消息源：音乐有新播报时，把它交给这个面板；不再需要接收时，再告诉消息源取消订阅。你把频道改为天气，只更新标题还不够：如果旧订阅还在，面板可能继续收到音乐消息。页面显示的选择，要与实际接入的消息源一致。</p>
      <p id="effect-sync" className="vp-citation-target">组件函数先根据当前数据算出界面该显示什么，这一步叫渲染；React 再把变化更新到页面。订阅消息不是计算界面：如果在渲染时直接订阅，组件每重新渲染一次，就可能多订一次。React 在界面更新后运行 Effect，让它按当前频道开始监听。本文讨论的是 React Effect；编程中的“副作用”含义更广，不只指这个 Hook。<Cite id="effect-sync" /></p>
      <p>也能在频道选择框的事件处理里手动取消旧订阅、建立新订阅；但首次显示、关闭后重开，或程序里其他地方改变频道时，都得再安排一遍。Effect 把“当前频道需要哪份订阅”集中写在一处：频道、消息源或接收开关变了，它就重新同步。</p>
      <p>下面使用浏览器内的本地消息源，真实建立和移除监听。先播报音乐，再把接收器切到天气；分别向两个频道播报，观察哪条消息能进来。这里没有连接服务器，也不保存离线消息。</p>
      <Anchors slug="effect" names={["scene-heading"]} /><EffectLesson />
      <p>切换频道会清空面板上正在显示的消息；关闭接收后仍可播报，但面板收到的消息数不再增加。重新开启只接收之后的新消息。这些约定属于本例；真实聊天系统是否补发历史，需要由消息服务另行实现。</p>
    </ArticleSection>
    <ArticleSection id="cleanup" title="先撤销，再建立">
      <p id="effect-cleanup" className="vp-citation-target"><strong>频道等依赖变化时，React 先运行上一次的清理函数，再用新值建立同步。</strong>建立音乐订阅的那次 Effect 会留下一个取消函数；它记住这一次订阅的频道（音乐）和接收消息用的函数。切到天气时，React 先用这份旧记录取消音乐订阅，再建立天气订阅。组件从页面移除时，也会清理当时仍有效的订阅。<Cite id="effect-cleanup" /></p>
      <p id="effect-lifecycle" className="vp-citation-target">组件还在页面上，旧订阅也可能已经不适用。把每次订阅看作一段有起止的同步：频道从音乐变成天气，就结束音乐的那一段，再开始天气的这一段。<Cite id="effect-lifecycle" /></p>
      <div className={styles.sideExplanation}><pre className={shared.code}>{'useEffect(() => {\n  const receive = message => {\n    setMessage(message);\n  };\n  source.subscribe(channel, receive);\n  return () => {\n    source.unsubscribe(channel, receive);\n  };\n}, [source, channel]);'}</pre><div><p>这段示意代码把消息源的接口简化为 <code>subscribe</code> / <code>unsubscribe</code>；<code>setMessage</code> 是更新页面消息的函数。每次运行 Effect 都会创建自己的 <code>receive</code>，清理函数用同一次运行中的频道和 <code>receive</code> 取消订阅，因此音乐的清理不会误关后来建立的天气订阅。这段代码只展示频道切换；上面的演示还把接收开关算进同步条件。</p><p>在演示里打开“查看实际订阅记录”，能看见旧频道的取消发生在新频道订阅之前。这份记录由代码执行时写入，顺序不是动画预设的。</p></div></div>
      <ArticleAside title="开发模式中的额外执行"><p id="effect-strict" className="vp-citation-target">开启严格模式后，React 在开发环境会额外执行一轮设置与清理，帮助检查它们是否对称。用“只运行一次”的标记遮住重复日志，会掩盖忘记清理的问题；应检查建立、撤销、再建立之后是否仍只有一份有效的连接。<Cite id="effect-strict" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="dependencies" title="依赖描述同步的条件" className={shared.offset}>
      <p id="effect-dependencies" className="vp-citation-target">本例的订阅读取了频道、接收开关和消息源；其中任何一个值发生变化，都可能需要重新同步。示意代码末尾的 <code>[source, channel]</code> 是依赖数组，列出这段 Effect 读取、可能随界面更新而改变的值；实际演示还读取接收开关，也要把它列入依赖。React 逐项比较新旧值（使用 <code>Object.is</code>），有变化才重新运行这段 Effect。依赖数组不是“想什么时候运行”的任意开关，也不应靠删掉依赖来压住重新执行。<Cite id="effect-dependencies" /></p>
      <p>如果订阅读的是旧频道，先查依赖是否完整。如果输入框每敲一个字就重新订阅，再查每次渲染是否都创建了新对象或函数：React 会把新建的函数视为另一个值，依赖比较就会认为它变了。先明确代码需要保持的同步关系，再讨论如何减少执行。</p>
      <blockquote className={shared.callout}>哪份外部资源仍然有效，<br />应与当前界面使用的数据一致。</blockquote>
    </ArticleSection>
    <ArticleSection id="choice" title="不需要 Effect 的计算">
      <Anchors slug="effect" names={["quiz-heading", "prompt-heading"]} />
      <div className={styles.choices}><div><h3>计算</h3><p>单价 × 数量得到总价，直接在渲染中算。</p></div><div><h3>操作</h3><p>点一次“发送”就发出一条消息，放在事件处理里。</p></div><div><h3>同步</h3><p>当前频道决定持续监听谁，用 Effect 管理订阅。</p></div></div>
      <p id="effect-derived" className="vp-citation-target">能从现有 <ConceptTerm slug="props">Props</ConceptTerm>（组件从外面接收到的数据）或状态算出的值，通常不必再用 Effect 写进另一份状态。原来的值和写进状态的那份需要额外保持一致；而 Effect 要等渲染完成后才运行，界面可能先显示旧结果、再更新一次。<Cite id="effect-derived" /></p>
      <p id="effect-event" className="vp-citation-target">事件处理描述用户这一次做了什么；Effect 描述组件此刻需要与什么保持同步。本例的“播报”是一次操作，“持续接收当前频道”才是同步。把两者分开，代码的触发原因也会更清楚。<Cite id="effect-event" /></p>
    </ArticleSection>
  </ConceptArticle>;
}

export function BrowserApiTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={browserApiSources} />;
  return <ConceptArticle slug="browser-api" title="浏览器 API" sources={browserApiSources}
    sections={[["host", "语言之外的浏览器能力"], ["measure", "让浏览器测量一块区域"], ["limits", "存在，不代表一定能用"], ["responsibility", "接口能力与业务责任"]]}
    hero={<ConceptHero slug="browser-api" label="浏览器窗口中的页面区域变宽，测量括号贴住内容区，随后 JavaScript 收到内容宽度读数"><div className={styles.browserHero}>
      <div className={styles.browserWindow}><span className={styles.browserWindowLabel}>浏览器</span><div className={styles.browserTarget}>页面区域<i aria-hidden="true" /></div></div>
      <div className={styles.browserTransfer} aria-hidden="true">↓</div>
      <div className={styles.browserReadout}><span>JS 收到</span><code>contentRect.width</code><strong>200 px</strong></div>
    </div></ConceptHero>}
    intro={<>计算、判断和循环，JavaScript 自己就能表达。读取页面尺寸、发起网络请求或操作剪贴板，则要调用<strong>浏览器向代码提供的接口</strong>。</>}
    relatedIntro={<>浏览器 API 扩展 <ConceptTerm slug="javascript">JavaScript</ConceptTerm> 在网页中的能力。网页发网络请求看 <ConceptTerm slug="fetch-api">Fetch API</ConceptTerm>，把数据存在本地看 <ConceptTerm slug="local-storage">本地存储</ConceptTerm>，与服务器保持持续连接看 <ConceptTerm slug="websocket">WebSocket</ConceptTerm>。</>}>
    <ArticleSection id="host" title="语言之外的浏览器能力">
      <Anchors slug="browser-api" names={["question", "definition"]} />
      <p>一张图表要放进可伸缩的侧栏。代码能算出刻度，却不能仅靠加减乘除知道侧栏现在有多宽；页面由浏览器排版，代码得向浏览器询问当下的尺寸。</p>
      <p id="browser-css" className="vp-citation-target">如果只要图表的外框跟着侧栏伸缩，可以用页面样式规则 CSS 让它的宽度随容器变化，JavaScript 不必知道具体像素数。这里还想让 JavaScript 根据实际宽度调整刻度，才需要取到尺寸。<Cite id="browser-css" /></p>
      <p id="browser-host" className="vp-citation-target">浏览器 API 是浏览器这个运行环境提供给代码的能力，不是 JavaScript 语法本身。API 就是代码使用这些能力的入口：调用浏览器提供的方法，或让浏览器在变化时通知代码。比如 DOM 让代码读写网页内容，Fetch 用来请求数据，此外还有尺寸观察、媒体、存储等接口。同样的 JavaScript 换到别的程序里运行，能用的接口也可能不同。<Cite id="browser-host" /></p>
      <div className={`${styles.choices} vp-citation-target`} id="browser-layers"><div><h3>语言</h3><p>函数、判断和数组，描述计算与控制。</p></div><div><h3>浏览器</h3><p>文档、布局、网络，提供运行环境的能力。</p></div><div><h3>应用</h3><p>决定图表怎么画、消息怎么显示、失败如何处理。<Cite id="browser-layers" /></p></div></div>
      <p>React 等库帮你组织界面，但不会凭空生成浏览器没有提供的能力。看到一段代码时，先分清它在做普通计算、调用库，还是请求运行环境做一件事。</p>
    </ArticleSection>
    <ArticleSection id="measure" title="让浏览器测量一块区域">
      <p id="browser-measure" className="vp-citation-target">测量用的接口叫 <code>ResizeObserver</code>。代码先让它观察网页中的一块区域；浏览器发现这块区域尺寸变化时，就调用预先登记的函数，把新的宽度交给代码。这个函数叫回调。下面改变的是页面里这一块区域，不是整个窗口；代码从测量结果的 <code>contentRect.width</code> 取宽度，显示时四舍五入。<Cite id="browser-measure" /></p>
      <p id="browser-content-box" className="vp-citation-target">这里量的是区域放内容的那部分宽度。内容与边框之间的留白叫内边距；内边距和边框都不计入 <code>contentRect.width</code>。本演示的目标区域没有设置内边距或边框，因此当前画面里的区域宽度与读数相同；如果加上内边距，外框就会比读数宽。<Cite id="browser-content-box" /></p>
      <p>拖动滑块，观察区域和像素读数一起变化。再关掉“观察尺寸”开关、继续拖动滑块：区域仍能伸缩，但读数停留在最后一次测量。这里实际调用浏览器接口，不使用预填的宽度结果。</p>
      <Anchors slug="browser-api" names={["scene-heading"]} /><BrowserApiLesson />
      <div className={styles.sideExplanation}><div><p id="browser-disconnect" className="vp-citation-target">示意代码里的 <code>observe(element)</code> 开始观察这块区域；尺寸变化后，回调收到新的读数，<code>showWidth</code> 把它显示出来。<code>disconnect()</code> 停止观察。重新开启后，浏览器会再给出当前尺寸，不会逐条补发暂停期间的变化；离开页面时也应停止不再需要的观察。<Cite id="browser-disconnect" /></p></div><pre className={shared.code}>{'const observer = new ResizeObserver(\n  ([entry]) => {\n    showWidth(entry.contentRect.width);\n  }\n);\nobserver.observe(element);\n// 不再需要时\nobserver.disconnect();'}</pre></div>
      <p id="browser-once" className="vp-citation-target">如果只在某一刻需要读一次元素的外框尺寸，浏览器还提供 <code>getBoundingClientRect()</code>。它读到的是包含内边距和边框的外框，不等于本例的内容宽度；本例要在尺寸变化后持续取得新值，所以登记观察。<Cite id="browser-once" /></p>
      <ArticleAside title="测量结果不要反过来制造循环"><p id="browser-loop" className="vp-citation-target">若每次收到尺寸就继续扩大被观察的元素，会再次触发观察。本例只把数值写到区域外的读数中，不用它改写目标宽度。实际组件也要避免“测量 → 改尺寸 → 再测量”的循环。<Cite id="browser-loop" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="limits" title="存在，不代表一定能用" className={shared.offset}>
      <p>用接口之前，先确认当前浏览器有没有提供它，再按这项能力的规则发起操作，并为成功或失败安排反馈。尺寸观察不需要用户批准；剪贴板、位置或媒体能力则有各自的限制，不能套用一张通用的权限表。</p>
      <p id="browser-permission" className="vp-citation-target">例如剪贴板接口（<code>Clipboard API</code>）要求安全上下文，如通过 HTTPS 打开的页面。浏览器还可能要求授权，或要求操作由用户刚刚的点击、按键触发；读取和写入的限制也不一样。检测到 <code>navigator.clipboard</code>，并不能保证随时读取或写入都会成功。<Cite id="browser-permission" /></p>
      <p>实现“复制链接”时，由用户点击发起操作，等接口返回成功后再提示成功。接口不可用或操作被拒绝时，可以提供可选中的文字，让用户手动复制。本页的尺寸演示不会读取或修改剪贴板。</p>
    </ArticleSection>
    <ArticleSection id="responsibility" title="接口能力与业务责任">
      <Anchors slug="browser-api" names={["quiz-heading", "prompt-heading"]} />
      <blockquote className={shared.callout}>浏览器提供能力和结果，<br />应用决定怎样用它们。</blockquote>
      <p>浏览器量出区域宽度，不意味着图表的刻度已经调整；剪贴板接口返回复制成功，也不意味着接收方读到了链接。应用还得判断这些结果是否满足用户要做的事。</p>
      <p>使用接口时，要想清楚需要哪项能力、什么时候开始、结果怎样进入界面、不再需要时如何停止。浏览器不支持或操作被拒绝时，就提供手动复制等替代办法，而不是让按钮按下去毫无反馈。</p>
    </ArticleSection>
  </ConceptArticle>;
}
