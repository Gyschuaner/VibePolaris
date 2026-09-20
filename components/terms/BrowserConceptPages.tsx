import { Broadcast, Ruler } from "@phosphor-icons/react/dist/ssr";
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
    sections={[["sync", "让订阅跟上当前频道"], ["cleanup", "先撤销，再建立"], ["dependencies", "依赖描述同步的条件"], ["choice", "哪些代码不需要 Effect"]]}
    hero={<ConceptHero slug="effect" label="接收器的调谐指针从一个频道移动到另一个频道"><div className={styles.effectHero}><span>音乐 · 天气</span><div className={styles.heroDial}><i /></div><div><Broadcast size={40} weight="light" /><span>切换订阅</span></div></div></ConceptHero>}
    intro={<>界面选择了新的频道，消息订阅也要随之切换。React 的 Effect 用来<strong>让组件与外部系统保持同步</strong>；建立连接时，也要考虑何时撤销它。</>}
    relatedIntro={<>Effect 是一种 <ConceptTerm slug="hook">Hook</ConceptTerm>。它读取 <ConceptTerm slug="state">状态</ConceptTerm>，按需要调用 <ConceptTerm slug="browser-api">浏览器 API</ConceptTerm> 或其他外部系统，而不是代替所有事件处理。 </>}>
    <ArticleSection id="sync" title="让订阅跟上当前频道">
      <Anchors slug="effect" names={["question", "definition"]} />
      <p>一个消息面板正在接收音乐播报。你把频道改为天气，只更新标题还不够：如果旧订阅还在，面板可能继续收到音乐消息。页面显示的选择，与实际接入的消息源，需要一致。</p>
      <p id="effect-sync" className="vp-citation-target">渲染负责根据数据算出界面。建立订阅会影响组件外的系统，不应在渲染计算里直接执行。React 在提交界面后运行 Effect，让订阅按照当前值建立起来。本文讨论的是 React Effect；编程中的“副作用”含义更广，不只指这个 Hook。<Cite id="effect-sync" /></p>
      <p>下面使用浏览器内的本地消息源，真实建立和移除监听。先播报音乐，再把接收器切到天气；分别向两个频道播报，观察哪条消息能进来。这里没有连接服务器，也不保存离线消息。</p>
      <Anchors slug="effect" names={["scene-heading"]} /><EffectLesson />
      <p>切换频道会清空上一条显示，关闭接收后仍可播报，但计数不再增加。重新开启只接收之后的新消息。这些约定属于本例；真实聊天系统是否补发历史，需要由消息服务另行实现。</p>
    </ArticleSection>
    <ArticleSection id="cleanup" title="先撤销，再建立">
      <p id="effect-cleanup" className="vp-citation-target"><strong>依赖变化时，React 先运行上一次的清理函数，再用新值建立同步。</strong>组件从页面移除时，也会清理最后一份订阅。清理关闭的是那次设置建立的连接，不应误关后来创建的另一份。<Cite id="effect-cleanup" /></p>
      <div className={styles.sideExplanation}><pre className={shared.code}>{'useEffect(() => {\n  const receive = message => {\n    setMessage(message);\n  };\n  source.subscribe(channel, receive);\n  return () => {\n    source.unsubscribe(channel, receive);\n  };\n}, [source, channel]);'}</pre><div><p>这段示意代码把消息源的接口简化为 subscribe / unsubscribe；setMessage 是 useState 的更新函数。订阅函数和取消函数使用同一个频道与回调引用，成对出现。</p><p>在演示里打开“实际订阅记录”，能看见旧频道的取消发生在新频道订阅之前。记录来自 Effect 与清理函数，动画不决定执行顺序。</p></div></div>
      <ArticleAside title="开发时为什么会多执行一次"><p id="effect-strict" className="vp-citation-target">开启严格模式后，React 在开发环境会额外执行一轮设置与清理，帮助检查它们是否对称。用“只运行一次”的标记遮住重复日志，会掩盖漏清理；应检查一次、撤销、再一次之后是否仍只有有效的连接。<Cite id="effect-strict" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="dependencies" title="依赖描述同步的条件" className={shared.offset}>
      <p id="effect-dependencies" className="vp-citation-target">本例的订阅读取了频道、接收开关和消息源；其中任何相关值改变，都可能需要重新同步。依赖数组应包含 Effect 读取的响应式值，React 用 Object.is 比较前后的依赖。它不是“想什么时候运行”的任意开关，也不应靠删掉依赖来压住重新执行。<Cite id="effect-dependencies" /></p>
      <p>如果订阅读的是旧频道，先查依赖是否完整。如果每次输入都重新连接，再查是否每次渲染都创建了新的对象或函数。先让代码表达真正的同步关系，再讨论减少不必要的执行。</p>
      <blockquote className={shared.callout}>哪份外部资源仍然有效，<br />应与当前界面使用的数据一致。</blockquote>
    </ArticleSection>
    <ArticleSection id="choice" title="哪些代码不需要 Effect">
      <Anchors slug="effect" names={["quiz-heading", "prompt-heading"]} />
      <div className={styles.choices}><div><h3>计算</h3><p>单价 × 数量得到总价，直接在渲染中算。</p></div><div><h3>操作</h3><p>点击“发送”触发一次消息，放在事件处理里。</p></div><div><h3>同步</h3><p>当前频道决定持续监听谁，用 Effect 管理订阅。</p></div></div>
      <p id="effect-derived" className="vp-citation-target">能从现有 Props 或状态算出的值，通常不必再用 Effect 写进另一份状态。两份数据需要额外保持一致，还可能先渲染旧结果、再触发一次更新。<Cite id="effect-derived" /></p>
      <p id="effect-event" className="vp-citation-target">事件处理描述用户这一次做了什么；Effect 描述组件此刻需要与什么保持同步。本例的“播报”是一次操作，“持续接收当前频道”才是同步。把两者分开，代码的触发原因也会更清楚。<Cite id="effect-event" /></p>
    </ArticleSection>
  </ConceptArticle>;
}

export function BrowserApiTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={browserApiSources} />;
  return <ConceptArticle slug="browser-api" title="浏览器 API" sources={browserApiSources}
    sections={[["host", "语言之外的浏览器能力"], ["measure", "让浏览器测量一块区域"], ["limits", "存在，不代表一定能用"], ["responsibility", "接口与业务各自负责什么"]]}
    hero={<ConceptHero slug="browser-api" label="页面区域展开，刻度尺展示浏览器测量尺寸的能力"><div className={styles.browserHero}><div><Ruler size={37} weight="light" /></div><div className={styles.ruler} /><span>ResizeObserver</span></div></ConceptHero>}
    intro={<>计算、判断和循环由 JavaScript 表达。读取页面尺寸、发起网络请求、操作剪贴板，则需要<strong>浏览器向代码提供的接口</strong>。</>}
    relatedIntro={<>浏览器 API 扩展 <ConceptTerm slug="javascript">JavaScript</ConceptTerm> 在网页中的能力。网络请求看 <ConceptTerm slug="fetch-api">Fetch API</ConceptTerm>，本地保存看 <ConceptTerm slug="local-storage">本地存储</ConceptTerm>，持续连接看 <ConceptTerm slug="websocket">WebSocket</ConceptTerm>。</>}>
    <ArticleSection id="host" title="语言之外的浏览器能力">
      <Anchors slug="browser-api" names={["question", "definition"]} />
      <p>一张图表要放进可伸缩的侧栏。代码能算出刻度，却不能仅靠加减乘除知道侧栏现在有多宽；这个尺寸由浏览器的页面布局决定，需要向浏览器取得。</p>
      <p id="browser-host" className="vp-citation-target">浏览器 API 是运行环境提供的能力，不是 JavaScript 语言语法本身。DOM 用来访问文档，Fetch 用来请求数据，还有尺寸观察、媒体、存储等接口。相同的 JavaScript 代码换到另一个运行环境，能调用的接口也可能不同。<Cite id="browser-host" /></p>
      <div className={`${styles.choices} vp-citation-target`} id="browser-layers"><div><h3>语言</h3><p>函数、条件和数组，描述计算与控制。</p></div><div><h3>浏览器</h3><p>文档、布局、网络，提供运行环境的能力。</p></div><div><h3>应用</h3><p>决定图表怎么画、消息怎么显示、失败如何处理。<Cite id="browser-layers" /></p></div></div>
      <p>React 等库帮你组织界面，但不会凭空生成浏览器没有提供的能力。看到一段代码时，先分清它在做普通计算、调用库，还是请求运行环境做一件事。</p>
    </ArticleSection>
    <ArticleSection id="measure" title="让浏览器测量一块区域">
      <p id="browser-measure" className="vp-citation-target">ResizeObserver 可以观察元素的尺寸变化。下面改变的是页面里这一块区域，不是整个窗口；读数来自浏览器回调中的 contentRect.width，并四舍五入显示。内容宽度不包含边框和内边距。<Cite id="browser-measure" /></p>
      <p>拖动滑块，观察区域和像素读数一起变化。再关掉“观察尺寸”后调节：区域仍能伸缩，但读数停留在最后一次测量。这里实际调用浏览器接口，不使用预填的宽度结果。</p>
      <Anchors slug="browser-api" names={["scene-heading"]} /><BrowserApiLesson />
      <div className={styles.sideExplanation}><div><p id="browser-disconnect" className="vp-citation-target">observe 开始观察目标，disconnect 停止这份观察器。页面恢复观察后会重新收到当前尺寸；不需要假装逐条补回暂停期间的变化。离开页面时也应清理不再需要的观察。<Cite id="browser-disconnect" /></p></div><pre className={shared.code}>{'const observer = new ResizeObserver(\n  ([entry]) => {\n    showWidth(entry.contentRect.width);\n  }\n);\nobserver.observe(element);\n// 不再需要时\nobserver.disconnect();'}</pre></div>
      <ArticleAside title="测量结果不要反过来制造循环"><p id="browser-loop" className="vp-citation-target">若每次收到尺寸就继续扩大被观察的元素，会再次触发观察。本例只把数值写到区域外的读数中，不用它改写目标宽度。实际组件也要避免“测量 → 改尺寸 → 再测量”的循环。<Cite id="browser-loop" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="limits" title="存在，不代表一定能用" className={shared.offset}>
      <p>接口使用前先看能力是否存在，再按该接口的规则发起操作，并处理结果。尺寸观察不需要用户批准；剪贴板、位置或媒体能力则有各自的限制，不能套用一张通用的权限表。</p>
      <p id="browser-permission" className="vp-citation-target">例如异步 Clipboard API 要求安全上下文，浏览器还可能要求权限或最近的用户操作；具体限制随浏览器和读写动作不同。检测到 navigator.clipboard，并不能保证随时读取或写入都会成功。<Cite id="browser-permission" /></p>
      <p>实现“复制链接”时，应从用户点击发起操作，等待返回后再显示成功。接口不可用或操作被拒绝时，可以提供可选中的文字，让用户手动复制。本页的尺寸演示不会读取或修改剪贴板。</p>
    </ArticleSection>
    <ArticleSection id="responsibility" title="接口与业务各自负责什么">
      <Anchors slug="browser-api" names={["quiz-heading", "prompt-heading"]} />
      <blockquote className={shared.callout}>浏览器告诉你发生了什么，<br />应用决定接下来怎么处理。</blockquote>
      <p>测到区域是 240 像素，不意味着图表已经适配；复制操作成功，不意味着接收方读到了链接。接口的结果与用户任务的完成之间，通常还有应用自己的判断。</p>
      <p>实际接入时，给每次调用划清范围：需要哪项能力、什么时候开始、结果怎样进入界面、不再需要时如何停止。遇到不支持或拒绝，就回到可执行的替代路径，而不是让按钮失去反馈。</p>
    </ArticleSection>
  </ConceptArticle>;
}
