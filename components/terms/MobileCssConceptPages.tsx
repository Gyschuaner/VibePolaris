import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { MobileConceptLesson } from "./MobileConceptLessons";
import { adaptiveLayoutSources, appLifecycleSources, appPermissionSources, boxModelSources, crossPlatformSources, cssSelectorSources, offlineFirstSources, pushNotificationSources, safeAreaSources, webviewSources } from "@/lib/mobile-css-concept-sources";
import styles from "./ConceptArticle.module.css";
import { ArrowRight, Bell, Browser, CheckCircle, Cloud, Code, Database, FileText, GitBranch, Layout, ShieldCheck, Stack, TreeStructure, User } from "@phosphor-icons/react/dist/ssr";

const offlineSections: [string, string][] = [["offline-task", "断网时仍要完成的任务"], ["offline-local", "先保存在哪里"], ["offline-sync", "重新联网并处理冲突"], ["offline-boundary", "缓存、离线优先与服务器确认"]];
const adaptiveSections: [string, string][] = [["adaptive-task", "窗口变了，任务不能丢"], ["adaptive-space", "按可用空间重排"], ["adaptive-focus", "布局变化时保留关系"], ["adaptive-boundary", "与响应式和设备型号的区别"]];
const safeAreaSections: [string, string][] = [["safe-task", "全屏页面里的危险位置"], ["safe-values", "动态 inset 从哪里来"], ["safe-orientation", "旋转和不同平台"], ["safe-boundary", "背景能到边缘，控件不能乱贴"]];
const lifecycleSections: [string, string][] = [["lifecycle-task", "离开页面前的草稿"], ["lifecycle-states", "可见、后台与冻结"], ["lifecycle-save", "什么时候保存才可靠"], ["lifecycle-boundary", "恢复不等于继续运行"]];
const permissionSections: [string, string][] = [["permission-task", "相机权限应该何时出现"], ["permission-request", "用途说明与系统请求"], ["permission-branches", "允许、拒绝与替代路径"], ["permission-boundary", "声明、状态和平台差异"]];
const pushSections: [string, string][] = [["push-task", "订单状态怎样到达用户"], ["push-route", "令牌、服务器和网关"], ["push-result", "展示、点击与核对"], ["push-boundary", "过期令牌和通知权限"]];
const crossSections: [string, string][] = [["cross-task", "一套规则，两个平台"], ["cross-core", "共享什么才划算"], ["cross-adapter", "平台能力放在边界"], ["cross-boundary", "共享代码不等于相同行为"]];
const webviewSections: [string, string][] = [["webview-task", "在原生应用里打开网页"], ["webview-host", "宿主负责什么"], ["webview-bridge", "一条受约束的消息桥"], ["webview-boundary", "为什么不能信任所有页面"]];
const selectorSections: [string, string][] = [["selector-task", "为什么这条规则没有命中"], ["selector-match", "选择器如何筛节点"], ["selector-cascade", "命中后还要竞争"], ["selector-boundary", "选择器不是最终样式"]];
const boxSections: [string, string][] = [["box-task", "卡片为什么比 width 更宽"], ["box-parts", "一个盒子的四个区域"], ["box-sizing", "两种尺寸算法"], ["box-boundary", "margin 在盒子外面"]];

function Cite({ id, sources }: { id: string; sources: typeof offlineFirstSources }) { return <ArticleCitation id={id} sources={sources} />; }

function MobileHero({ trigger, change, proof }: { trigger: string; change: string; proof: string }) {
  return <div className={styles.contract} aria-label={`${trigger}：${change}，证据是${proof}`}>
    <div><span>触发</span><h3>{trigger}</h3><p>先从读者正在做的任务开始。</p></div>
    <div><span>机制变化</span><h3>{change}</h3><p>页面把真正改变的对象放在这里。</p></div>
    <p className={styles.resultFlow}><CheckCircle size={22} />{proof}</p>
  </div>;
}

export function OfflineFirstTermPage() {
  return <ConceptArticle slug="offline-first" title="Offline-first" subtitle="离线优先" hero={<MobileHero trigger="网络断开" change="本地保存 → 待同步队列" proof="重新连接后出现服务器结果和冲突选择" />} sections={offlineSections} sources={offlineFirstSources} intro={<>离线优先让应用先用设备上已经保存的数据完成眼前任务，网络恢复后再把变更同步到服务器。<strong>它不是“加一层缓存”，而是一套在断网时仍能工作、重新连接后能处理结果的读写安排。</strong></>}>
    <ArticleSection id="offline-task" title="断网时仍要完成的任务">
      <p>你在地铁里修改一条出行笔记，网络图标突然变灰。应用如果只把输入直接发给服务器，保存按钮就只能一直转圈，重新打开页面还可能看不到刚写的内容。离线优先先问的是：这项任务能不能在本地完成，哪些结果必须等服务器确认。</p>
      <p id="offline-layer" className="vp-citation-target">对可以离线完成的任务，应用把本地数据源放在优先位置。它先从本地读出笔记，也先把本次编辑保存到本地；网络可用时，再由同步层把本地变更送到远端。Android 的离线优先资料把本地数据源、网络数据源和同步职责分开描述。<Cite id="offline-layer" sources={offlineFirstSources} /></p>
      <p>这里的“优先”描述读取和编辑的顺序，不是说服务器不重要。服务器仍然负责跨设备共享和最终的业务判断，只是用户不必因为一次短暂断网而失去正在做的工作。</p>
      <p>先把这件事记住：<strong>设备上出现“已保存”时，表示本地保存完成；它不自动表示服务器已经收到。</strong>下面的演示用一条笔记追踪这两个结果的差别。</p>
      <MobileConceptLesson slug="offline-first" />
    </ArticleSection>
    <ArticleSection id="offline-local" title="先保存在哪里" className={styles.splitSection}>
      <p id="offline-source" className="vp-citation-target">本地数据源可以是应用自己的数据库，也可以是浏览器提供的持久化存储。关键不在具体技术名，而在于应用把“当前可读的数据”交给统一的数据层，让界面不必每次都直接等待网络。<Cite id="offline-source" sources={offlineFirstSources} /></p>
      <p id="offline-persist" className="vp-citation-target">在浏览器里，IndexedDB 提供按对象保存结构化数据的能力，适合存放比一段临时字符串更完整的本地记录。它仍受浏览器存储策略和清理规则影响，所以需要在产品里说明哪些内容只是缓存、哪些内容是用户草稿。<Cite id="offline-persist" sources={offlineFirstSources} /></p>
      <div className={styles.contract}><div><Database size={26} /><h3>本地数据</h3><p>笔记正文、版本号和同步状态在设备上持久化。</p></div><div><span>不是</span><code>服务器已确认</code><p>本地写入完成后仍可能等待上传、拒绝或冲突处理。</p></div></div>
      <p>待同步队列保存的不只是“再发一次”这个动作，还需要知道改了哪条记录、基于哪个版本、当前是否已经尝试过。这样网络恢复时，系统才能知道应该上传哪一项，以及服务器返回的结果属于哪一次修改。</p>
      <ArticleAside title="把缓存和草稿分开想"><p>缓存可以被删掉后重新从服务器取回；用户草稿通常不能这样处理。把两者都叫“本地数据”会让清理策略、提示文字和恢复逻辑混在一起。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="offline-sync" title="重新联网并处理冲突">
      <p id="offline-queue" className="vp-citation-target">恢复连接只意味着队列有机会运行。后台同步机制通常会在网络恢复后重试待处理请求，但每次重试仍可能失败，也需要避免同一个变更被重复应用。Workbox 的 Background Sync 文档把请求排队与重试作为独立机制说明。<Cite id="offline-queue" sources={offlineFirstSources} /></p>
      <p id="offline-retry" className="vp-citation-target">同步成功的证据是服务器返回了这次变更的结果，而不是设备又亮起了网络图标。服务器也可能告诉应用版本冲突、字段校验失败或当前用户没有权限；这些结果都要回到本地记录和界面。<Cite id="offline-retry" sources={offlineFirstSources} /></p>
      <p>例如你离线改了标题，另一台电脑同时改了同一标题。应用可以按字段合并、保留服务器版并让用户选择，或把两份版本都保留下来。无论规则是什么，都应该让读者看见这次取舍，而不是安静地覆盖。</p>
      <p>一个可靠的同步流程会把“待上传”“服务器接受”“需要处理”分开表示。用户可以继续编辑下一条笔记，但当前这条是否已经跨设备可见，仍应有明确状态。</p>
    </ArticleSection>
    <ArticleSection id="offline-boundary" title="缓存、离线优先与服务器确认">
      <p id="offline-cache" className="vp-citation-target">Service Worker 可以拦截网页请求并从缓存提供资源，这能改善离线读取和启动体验；它本身不会替你设计业务数据的写入、冲突和服务器确认。把“页面能打开”说成“应用支持离线编辑”会越过这个边界。<Cite id="offline-cache" sources={offlineFirstSources} /></p>
      <p>同样，失败重试也不等于离线优先。重试解决的是一次请求没成功之后是否再试；离线优先还要回答断网时读什么、写什么、何时同步、冲突由谁决定。</p>
      <div className={styles.distinctions}><div><h3>可以本地完成</h3><p>编辑草稿、查看最近缓存、整理未发送内容。</p></div><div><h3>必须得到服务器结果</h3><p>扣款、抢占库存、发布跨设备可见的最终版本。</p></div></div>
      <p>读者遇到“离线优先”时，可以先问三件事：断网时当前动作的结果保存在哪里，重新连接时谁负责把它送出去，冲突或拒绝出现时用户能看到什么。答不上其中一项，通常只是缓存或简单重试，还没有形成完整的离线优先方案。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function AdaptiveLayoutTermPage() {
  return <ConceptArticle slug="adaptive-layout" title="Adaptive layout" subtitle="自适应布局" hero={<MobileHero trigger="窗口宽度改变" change="单列 → 并列 → 侧栏" proof="订单和键盘焦点仍指向原任务" />} sections={adaptiveSections} sources={adaptiveLayoutSources} intro={<>自适应布局根据窗口当前可用的空间和姿态重新安排内容关系。<strong>它改变的是导航、列表和详情怎样共存，不是把一张固定页面按比例拉伸。</strong></>}>
    <ArticleSection id="adaptive-task" title="窗口变了，任务不能丢">
      <p>你在平板上打开一个订单：窄窗口时先看订单列表，点开后进入详情；把窗口拖宽，列表和详情可以并排。用户期待的是同一张订单仍然被选中，而不是布局一变就回到第一条。</p>
      <p id="adaptive-window" className="vp-citation-target">Android 的自适应布局资料把窗口大小和折叠姿态当作运行时输入，建议根据可用空间决定布局关系。窗口可以在运行中变化，应用要重新计算能否并列显示，而不是只在启动时选择一个设备档位。<Cite id="adaptive-window" sources={adaptiveLayoutSources} /></p>
      <p id="adaptive-fold" className="vp-citation-target">折叠设备的姿态还可能把可用区域分成两块，铰链位置和当前窗口边界会影响内容能否跨过去。自适应布局要读取这些运行时约束，再决定列表和详情放在同一侧、两侧还是暂时单列。<Cite id="adaptive-fold" sources={adaptiveLayoutSources} /></p>
      <p>因此，自适应布局的核心问题是“当前空间适合怎样完成任务”。当空间不足，详情可以暂时占满窗口；当空间增加，导航和上下文可以回来。两种结果都应保持标题、选中项和键盘焦点的关系。</p>
      <MobileConceptLesson slug="adaptive-layout" />
      <p>演示中的“订单 42 · 已选中”是一个真实按钮，不是随布局复制出来的文字。切换宽度或布局步骤后，它仍然代表同一条记录；用键盘操作时，焦点也应留在这个控件或能明确映射回它。</p>
    </ArticleSection>
    <ArticleSection id="adaptive-space" title="按可用空间重排">
      <p id="adaptive-size" className="vp-citation-target">窗口大小类别是对当前可用空间的归纳，不是设备品牌的清单。它帮助应用决定何时从单列切到双列、何时显示侧栏，但具体断点仍应由内容是否可读、触控是否可用来验证。<Cite id="adaptive-size" sources={adaptiveLayoutSources} /></p>
      <p id="adaptive-media" className="vp-citation-target">在 Web 中，Media Queries 让 CSS 根据视口特征选择规则，例如宽度、方向和用户偏好。查询提供条件，布局规则仍要写清楚在条件满足时怎样改变。<Cite id="adaptive-media" sources={adaptiveLayoutSources} /></p>
      <div className={styles.contract}><div><Layout size={26} /><h3>空间输入</h3><p>可用宽度、方向、折叠姿态和输入方式。</p></div><div><GitBranch size={26} /><h3>布局决定</h3><p>单列、并列或侧栏，取决于任务关系和内容约束。</p></div></div>
      <p>如果列表标题在 500px 时已经被截断，不能因为“平板应该更宽”就继续并排。断点是为了保护任务，不是为了给设备贴标签。</p>
    </ArticleSection>
    <ArticleSection id="adaptive-focus" title="布局变化时保留关系">
      <p id="adaptive-responsive" className="vp-citation-target">响应式设计通常指网页使用弹性网格、图片和媒体查询适应不同屏幕；自适应布局进一步关心在不同空间下是否需要改变内容的组织方式。两者可以一起用，但不能把等比缩放当作完整的任务适配。<Cite id="adaptive-responsive" sources={adaptiveLayoutSources} /></p>
      <p>例如订单详情从“覆盖列表的页面”变成“列表旁的面板”，视觉位置变了，但当前订单 ID、返回路径和焦点应保持连续。实现时要保存语义上的选中项，不要只保存某个像素位置。</p>
      <p id="adaptive-container" className="vp-citation-target">组件嵌在不同父容器时，CSS Container Queries 可以让组件根据自己的容器空间改变排布，而不是只看整个视口。它适合处理卡片在侧栏和主栏里的不同宽度，但仍需要由组件定义可读和可操作的状态。<Cite id="adaptive-container" sources={adaptiveLayoutSources} /></p>
      <ArticleAside title="键盘焦点也是任务关系"><p>宽度变化后，如果焦点突然跳到页面顶部，键盘用户会失去正在编辑的控件。重排 DOM 或切换面板时，应该把焦点映射回语义上相同的控制项，并在无法映射时给出清楚位置。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="adaptive-boundary" title="与响应式和设备型号的区别">
      <p>“窄屏、中等、宽屏”是布局决策的结果；“手机、平板、折叠屏”是产品或硬件的描述。后者可能有相同的窗口宽度，前者也可能在同一台设备上随分屏和旋转变化。</p>
      <p>自适应布局也不替代安全区域、生命周期或平台能力。刘海需要另算安全 inset，应用进入后台需要另算保存时机，通知和相机仍然需要平台权限。</p>
      <div className={styles.distinctions}><div><h3>它能回答</h3><p>当前空间怎样排列，任务关系如何保留。</p></div><div><h3>它不能单独回答</h3><p>哪种设备、是否有刘海、是否获准访问相机。</p></div></div>
      <p>检查一个布局方案时，先拖动窗口再看任务是否仍能继续：内容是否被截断，返回路径是否还在，焦点是否可找到。通过这些证据，才知道布局真的自适应了。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function SafeAreaTermPage() {
  return <ConceptArticle slug="safe-area" title="Safe area" subtitle="安全区域" hero={<MobileHero trigger="设备有刘海或手势区" change="背景铺满，关键内容读取动态 inset" proof="标题和底部按钮离开危险边界" />} sections={safeAreaSections} sources={safeAreaSources} intro={<>安全区域是系统或浏览器为刘海、圆角、状态栏和手势区留下的动态安全边距；inset 指这段系统或浏览器提供的安全距离。<strong>背景可以继续画到屏幕边缘，标题、按钮等关键内容要根据当前值离开危险位置。</strong></>}>
    <ArticleSection id="safe-task" title="全屏页面里的危险位置">
      <p>你做了一个全屏阅读页，背景图片铺满了手机。顶部标题紧贴屏幕边缘，底部“下一章”按钮却被手势条盖住。问题不是背景太大，而是可操作内容没有避开系统占用的区域。</p>
      <p id="safe-area-native" className="vp-citation-target">在 iOS 中，UIKit 的 safe area 表示视图中不会被导航栏、状态栏或其他遮挡覆盖的区域。约束关键内容到 safe area，可以让系统根据设备形态计算边距。<Cite id="safe-area-native" sources={safeAreaSources} /></p>
      <p>安全区域是内容和物理屏幕之间的关系。它不要求整页缩成一个小矩形：通常让背景延伸到边缘，同时只给标题、按钮、输入框和滚动内容增加必要的内边距。</p>
      <MobileConceptLesson slug="safe-area" />
    </ArticleSection>
    <ArticleSection id="safe-values" title="动态 inset 从哪里来">
      <p id="safe-area-env" className="vp-citation-target">Web 页面可以通过 CSS 环境变量读取系统提供的安全距离，例如 <code>env(safe-area-inset-top)</code> 和 <code>env(safe-area-inset-bottom)</code>。环境变量表示浏览器当前环境的值，不应被写成固定数字。<Cite id="safe-area-env" sources={safeAreaSources} /></p>
      <p id="safe-area-web" className="vp-citation-target">MDN 的 <code>env()</code> 文档也提醒，这些值由用户代理提供，页面可以把它们用于 padding 或 margin。当前没有额外危险区时，值可能是 0；设备、方向和浏览器状态改变后，值也可能改变。<Cite id="safe-area-web" sources={safeAreaSources} /></p>
      <div className={styles.contract}><div><span>背景</span><code>inset: 0</code><p>仍然铺满可视画布，保持沉浸感。</p></div><div><span>关键内容</span><code>padding-bottom: env(...)</code><p>把按钮和滚动末尾推到手势区外。</p></div></div>
      <p>如果页面同时有固定页头和安全区域，最终间距通常是设计间距加上动态 inset，而不是二选一。实现时要确认 padding 不会让内容在窄屏上变得不可用。</p>
    </ArticleSection>
    <ArticleSection id="safe-orientation" title="旋转和不同平台">
      <p id="safe-area-insets" className="vp-citation-target">Android 的 WindowInsets 描述系统栏、显示切口和手势区域等窗口 inset。应用需要在窗口变化时重新读取，而不是只在启动时记一次。<Cite id="safe-area-insets" sources={safeAreaSources} /></p>
      <p id="safe-area-cutout" className="vp-citation-target">Android 的显示切口文档区分了让内容延伸到切口区域和让内容避开切口的策略。不同页面可以做不同选择，但选择应该和背景、文字和交互控件的责任对应。<Cite id="safe-area-cutout" sources={safeAreaSources} /></p>
      <p>旋转到横屏后，危险区域可能从顶部变到左右两侧。一个只处理 top 和 bottom 的实现，在横屏时可能让侧边按钮贴到圆角或切口；四个方向都应有对应的处理策略。</p>
      <ArticleAside title="把设备形态当作输入"><p>安全区域和自适应布局都随窗口变化，但它们回答不同问题：自适应布局决定内容怎样排，安全区域决定内容距离系统危险边界多远。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="safe-boundary" title="背景能到边缘，控件不能乱贴">
      <p>“全屏”不等于每个元素都贴边，“安全”也不等于所有内容都缩进相同距离。背景、滚动容器、标题和操作按钮的边界要分别判断。</p>
      <div className={styles.distinctions}><div><h3>适合延伸</h3><p>背景色、插图、装饰性图片和不承载文字的层。</p></div><div><h3>需要避开</h3><p>文字、输入框、可点击按钮、滚动内容的最后一行。</p></div></div>
      <p>固定 20px 在某台手机上看起来刚好，换到有刘海或手势条的设备就可能遮挡；反过来，过大的固定值也会浪费没有危险区域的屏幕。用动态 inset 加上最小设计间距，才能同时照顾两种情况。</p>
      <p>验收时至少旋转一次、切换一个有切口的设备形态，并观察底部最后一个操作是否仍能点击。只看普通矩形屏幕，不能证明安全区域实现正确。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function AppLifecycleTermPage() {
  return <ConceptArticle slug="app-lifecycle" title="App lifecycle" subtitle="应用生命周期" hero={<MobileHero trigger="用户切到后台" change="前台 → 后台 → 可能被回收" proof="重新打开只能从已持久化草稿尝试恢复" />} sections={lifecycleSections} sources={appLifecycleSources} intro={<>应用生命周期描述运行环境如何让页面或应用经历创建、可见、后台、冻结、销毁和重新创建。<strong>它帮助你安排保存、暂停和恢复，但不承诺每一个“即将离开”的事件都会发生。</strong></>}>
    <ArticleSection id="lifecycle-task" title="离开页面前的草稿">
      <p>你在手机上写发布说明，切到聊天应用复制一段链接，回来时页面被重新打开，刚写的内容只剩标题。你可能以为“切后台时保存一下”就够了，但系统可能在后台直接回收进程，页面没有机会执行最后一步。</p>
      <p id="lifecycle-states-source" className="vp-citation-target">Android Activity 生命周期把创建、开始、恢复、暂停、停止和销毁等阶段区分开来；浏览器也会通过可见性、冻结和恢复事件表达页面是否继续参与工作。不同平台的事件名称不同，共同点是运行环境会改变，应用要据此调整资源和状态。<Cite id="lifecycle-states-source" sources={appLifecycleSources} /></p>
      <p>生命周期不是一条保证执行到底的流水线。进入后台时可以暂停视频和网络轮询，但重要草稿不能等到销毁时才写入。下面用一次编辑和进程回收来对照两种保存策略。</p>
      <MobileConceptLesson slug="app-lifecycle" />
    </ArticleSection>
    <ArticleSection id="lifecycle-states" title="可见、后台与冻结">
      <p id="lifecycle-hidden" className="vp-citation-target">Page Visibility API 让网页知道文档是否可见。不可见时，页面通常应减少动画和不必要的轮询；可见性变化本身并不意味着页面一定会在之后继续存在。<Cite id="lifecycle-hidden" sources={appLifecycleSources} /></p>
      <p id="lifecycle-freeze" className="vp-citation-target">Chrome 的 Page Lifecycle 文档还描述了 freeze、resume 和 discard 等状态。被 discard 后，页面的内存状态已经不存在，重新打开时只能依赖外部保存的数据。<Cite id="lifecycle-freeze" sources={appLifecycleSources} /></p>
      <div className={styles.resultFlow}><span>前台编辑</span><ArrowRight size={19} /><span>后台/冻结</span><ArrowRight size={19} /><span>可能被回收</span><ArrowRight size={19} /><span>重新创建</span></div>
      <p>用户看到的是同一个应用入口，运行环境看到的可能已经是一个新实例。恢复逻辑要先读取持久化状态，再把它映射回当前页面，而不是假设旧对象仍在内存里。</p>
    </ArticleSection>
    <ArticleSection id="lifecycle-save" title="什么时候保存才可靠">
      <p id="lifecycle-save-source" className="vp-citation-target">Android 的保存状态资料建议把短暂 UI 状态交给合适的保存机制，并在状态变化时尽早记录。保存应由应用的数据模型负责，不应只依赖生命周期最后一个回调。<Cite id="lifecycle-save-source" sources={appLifecycleSources} /></p>
      <p>编辑器可以在用户停止输入一小段时间后写入草稿，也可以在字段变化时写入一个轻量版本。保存成功后再更新“已保存”标记，避免界面显示的状态超过实际持久化结果。</p>
      <ArticleAside title="不要把 beforeunload 当保险箱"><p><code>beforeunload</code> 适合在页面离开前询问用户是否要离开未保存内容，但它并不保证在移动设备被系统回收时触发。把最后一次保存放在这里，会让最重要的数据恰好没有保存机会。</p></ArticleAside>
      <p>暂停音频、断开轮询和释放相机属于资源管理；保存用户草稿属于数据管理。两者可以在同一个生命周期变化里发生，但失败处理和可靠性要求不同。</p>
    </ArticleSection>
    <ArticleSection id="lifecycle-boundary" title="恢复不等于继续运行">
      <p id="lifecycle-unload" className="vp-citation-target">MDN 对 <code>beforeunload</code> 的说明指出，它不能可靠覆盖移动端的所有离开场景，而且使用不当可能影响浏览器的缓存和返回体验。重要数据应在有机会时提前保存。<Cite id="lifecycle-unload" sources={appLifecycleSources} /></p>
      <div className={styles.distinctions}><div><h3>可以恢复</h3><p>已持久化的草稿、选中的文档 ID、未完成的本地任务。</p></div><div><h3>不能假定</h3><p>旧的网络请求、内存对象、定时器和后台进程还在运行。</p></div></div>
      <p>重新创建后还要验证外部数据是否过期、用户是否仍有权限、草稿是否与服务器版本冲突。恢复入口只说明“找回了一些状态”，不等于任务已经自动完成。</p>
      <p>检查生命周期实现时，手动切到后台、旋转、锁屏或模拟进程回收，再回来观察：草稿是否存在，加载是否重新开始，重复提交是否被避免。单纯点击页面内的返回按钮不能覆盖这些运行环境变化。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function AppPermissionTermPage() {
  return <ConceptArticle slug="app-permission" title="App permission" subtitle="应用权限" hero={<MobileHero trigger="用户点击拍照上传" change="用途说明 → 系统决定" proof="允许打开相机，拒绝仍有文件上传" />} sections={permissionSections} sources={appPermissionSources} intro={<>应用权限决定某项能力能不能代表用户访问相机、麦克风、位置或通知。<strong>好的权限流程从具体任务开始，在需要时解释用途，让系统作决定，并为拒绝准备可用的替代路径。</strong></>}>
    <ArticleSection id="permission-task" title="相机权限应该何时出现">
      <p>你在订单页点击“拍照上传发票”。如果应用一打开就弹出相机权限，用户还不知道为什么需要；如果点击拍照后没有任何解释，系统弹窗也会显得突然。权限请求应该跟着当前任务出现。</p>
      <p id="permission-timing" className="vp-citation-target">权限最佳实践通常建议在用户触发相关功能时请求，并在系统对话框之前解释用途。这样用户可以把“允许相机”与刚刚选择的拍照任务联系起来，而不是在启动时面对一串没有上下文的询问。<Cite id="permission-timing" sources={appPermissionSources} /></p>
      <p>“请求权限”只是流程的一步，不是功能本身。功能还要处理已授权、一次拒绝、系统不再直接弹窗、系统限制和替代输入，最后才把状态呈现给用户。</p>
      <MobileConceptLesson slug="app-permission" />
    </ArticleSection>
    <ArticleSection id="permission-request" title="用途说明与系统请求">
      <p id="permission-android" className="vp-citation-target">Android 把权限声明和运行时请求分开：应用先在清单中声明需要的能力，再由用户在运行过程中决定是否授权。请求结果会影响当前功能，应用不能把自定义按钮当成系统许可。<Cite id="permission-android" sources={appPermissionSources} /></p>
      <p id="permission-apple" className="vp-citation-target">Apple 平台也要求应用说明使用受保护资源的目的，并让系统管理用户选择。不同平台的文案、状态名称和再次请求规则不完全相同，所以页面应该围绕能力和结果写，而不是假设一个跨平台弹窗流程。<Cite id="permission-apple" sources={appPermissionSources} /></p>
      <div className={styles.contract}><div><span>应用先做</span><code>说明用途 → 发起请求</code><p>解释这一项能力会帮助当前任务做什么。</p></div><div><span>系统决定</span><code>允许 / 拒绝 / 受限</code><p>应用根据返回状态选择后续路径。</p></div></div>
      <p>在 Web 中，浏览器也会基于来源、上下文和用户设置处理权限。应用得到的可能是 granted、denied 或 prompt 等状态，但状态本身仍要和具体能力的调用结果分开验证。</p>
    </ArticleSection>
    <ArticleSection id="permission-branches" title="允许、拒绝与替代路径">
      <p id="permission-state" className="vp-citation-target">Permissions API 可以查询部分能力的当前状态，帮助页面在请求前决定是直接继续、显示解释，还是引导用户修改设置。但并非所有能力和所有浏览器都支持同样的查询，不能把一个 API 当作所有权限的统一答案。<Cite id="permission-state" sources={appPermissionSources} /></p>
      <p id="permission-media" className="vp-citation-target">调用 <code>getUserMedia()</code> 时，浏览器仍会检查来源、用户选择和设备条件；获得相机流之前，页面不能假定“已经有相机”。拒绝后应保留用户的其他上传方式，或者清楚说明下一步。<Cite id="permission-media" sources={appPermissionSources} /></p>
      <div className={styles.distinctions}><div><h3>允许</h3><p>打开相机，完成当前上传任务。</p></div><div><h3>拒绝</h3><p>保留文件选择或手动输入，不把整页锁死。</p></div><div><h3>系统不再直接弹窗</h3><p>停止重复弹窗，提供系统设置入口和说明。</p></div></div>
      <p>替代路径不是把相机功能偷偷删掉，而是承认当前能力不可用后，把同一个业务目标交给另一种输入完成。</p>
    </ArticleSection>
    <ArticleSection id="permission-boundary" title="声明、状态和平台差异">
      <p>清单或 Info.plist 里的声明说明应用请求了什么，不代表用户已经授权；运行时状态说明当前是否可能调用，也不代表摄像头一定存在或不会在调用时失败。</p>
      <p id="permission-denied" className="vp-citation-target">Android 的权限文档区分了普通拒绝和不再询问等情况。反复请求同一项能力可能只会增加打扰，甚至让用户找不到完成任务的入口。<Cite id="permission-denied" sources={appPermissionSources} /></p>
      <p>浏览器、iOS 和 Android 对再次请求、系统设置和临时权限的处理不同。跨平台页面应把“用户能完成什么”放在主线，把各平台的状态映射放在实现层，并在真机上验证。</p>
      <p>验收权限流程时，至少走一次允许和一次拒绝；如果产品依赖系统不再直接弹窗后的设置入口，再验证该分支。只点击“允许”不能说明权限设计完整。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PushNotificationTermPage() {
  return <ConceptArticle slug="push-notification" title="Push notification" subtitle="推送通知" hero={<MobileHero trigger="订单状态发生变化" change="令牌 → FCM/APNs → 系统通知" proof="点击后从服务器核对最新订单" />} sections={pushSections} sources={pushNotificationSources} intro={<>推送通知把服务器上的变化提示到用户设备。<strong>它是一条经过令牌、推送服务、系统权限和展示策略的链路，不是服务器发一段文字就等于用户看到了。</strong></>}>
    <ArticleSection id="push-task" title="订单状态怎样到达用户">
      <p>你在电商应用里等待包裹，仓库状态变成“已发出”。业务希望用户收到提醒并点回订单详情。要解释这件事，需要跟着消息走过安装、令牌登记、服务器提交、平台投递和用户点击几个不同位置。</p>
      <p id="push-route-source" className="vp-citation-target">Firebase 的 FCM 架构把应用服务器、FCM 后端、平台传输层和客户端分开。Apple 的远程通知服务器也要求业务服务器向 APNs 提交消息，再由系统负责到达设备。它们共同说明：业务服务器不是直接操作手机通知栏。<Cite id="push-route-source" sources={pushNotificationSources} /></p>
      <p>通知的内容可以带一个订单 ID，让点击后打开正确详情，但关键状态仍应回到服务器确认。通知适合提示用户回来，不适合独自承担库存、付款或配送的事实来源。</p>
      <MobileConceptLesson slug="push-notification" />
    </ArticleSection>
    <ArticleSection id="push-route" title="令牌、服务器和网关">
      <p id="push-token" className="vp-citation-target">应用安装或注册通知时，平台为这次安装生成一个注册令牌，应用把令牌和用户或设备实例的映射交给业务服务器。Firebase 的令牌管理文档强调，令牌可能刷新，服务器要保存当前值并更新映射。<Cite id="push-token" sources={pushNotificationSources} /></p>
      <p id="push-server" className="vp-citation-target">服务器收到订单变化后，选择目标令牌并把消息提交给 FCM 或 APNs。平台网关根据设备、应用和系统策略继续投递；这条路上的每一层都有自己的错误和重试语义。<Cite id="push-server" sources={pushNotificationSources} /></p>
      <div className={styles.resultFlow}><span>安装令牌</span><ArrowRight size={19} /><span>业务映射</span><ArrowRight size={19} /><span>FCM / APNs</span><ArrowRight size={19} /><span>系统通知</span></div>
      <p>令牌不是永久设备 ID。重装、清理数据、平台刷新或长期不活跃，都可能让旧映射失效；把它当成永远不变的身份证，会让通知越来越多地投向错误地址。</p>
    </ArticleSection>
    <ArticleSection id="push-result" title="展示、点击与核对">
      <p id="push-android" className="vp-citation-target">Android 13 及以上对通知权限有运行时请求，用户可以拒绝展示；系统和应用的前台策略也可能决定是否用站内提示替代系统通知。<Cite id="push-android" sources={pushNotificationSources} /></p>
      <p id="push-apple" className="vp-citation-target">Apple 的 UserNotifications 框架区分请求授权、安排通知和处理用户响应。收到消息、展示通知、用户点击和应用打开是不同事件，不能压缩成一个“已送达”。<Cite id="push-apple" sources={pushNotificationSources} /></p>
      <div className={styles.contract}><div><Bell size={27} /><h3>展示</h3><p>系统或应用把提示呈现给用户，可能受权限和前台状态影响。</p></div><div><ArrowRight size={27} /><h3>点击</h3><p>应用读取订单 ID，打开详情，再从服务器取得最新事实。</p></div></div>
      <p>如果用户很久以后才点击通知，订单可能已经又变化过。深链只负责把用户带到合理位置，页面仍需要重新加载并处理权限、登录和过期订单。</p>
    </ArticleSection>
    <ArticleSection id="push-boundary" title="过期令牌和通知权限">
      <p id="push-invalid" className="vp-citation-target">当推送服务返回令牌无效或不可注册时，服务器应该清理或更新映射。继续向同一个失效令牌重试，只会制造噪声和资源浪费。<Cite id="push-invalid" sources={pushNotificationSources} /></p>
      <div className={styles.distinctions}><div><h3>投递成功</h3><p>平台接受了提交，不能推出系统已经展示。</p></div><div><h3>展示成功</h3><p>通知出现在设备上，不能推出用户已经阅读。</p></div><div><h3>业务确认</h3><p>打开应用后重新读取服务器，才核对当前订单状态。</p></div></div>
      <p>推送也不是实时通信的强保证。设备离线、专注模式、系统节能、用户关闭通知和应用前台策略都可能改变结果。需要可靠实时状态时，应把服务器状态作为真源，并在应用内主动刷新。</p>
      <p>验收时走令牌登记、权限拒绝、设备离线和点击回详情四条路径；只在开发机收到一次通知，不能证明整条链路和失效清理都正确。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function CrossPlatformDevelopmentTermPage() {
  return <ConceptArticle slug="cross-platform-development" title="Cross-platform development" subtitle="跨平台开发" hero={<MobileHero trigger="同一订单要跑在两个平台" change="共享规则 → 平台适配器" proof="业务一致，权限和相机由各平台处理" />} sections={crossSections} sources={crossPlatformSources} intro={<>跨平台开发把能共用的业务规则、数据和部分界面放在共享核心，再用平台实现接上 iOS 和 Android 的差异。<strong>共享的是清楚的边界，不是承诺所有行为完全相同。</strong></>}>
    <ArticleSection id="cross-task" title="一套规则，两个平台">
      <p>你要做一个订单应用：总价计算、优惠规则和订单状态在 iOS 与 Android 应该一致，但相机、通知、文件选择和生命周期由各自系统管理。真正的问题不是“代码能不能复制”，而是哪些决策应该保持一致、哪些能力必须面对平台差异。</p>
      <p id="cross-core-source" className="vp-citation-target">Flutter 的架构说明把框架层、引擎和平台嵌入区分开；Kotlin Multiplatform 也把共享业务逻辑和平台代码分开组织。共同的做法是先找到可验证的共享核心，再把平台 API 留在边界。<Cite id="cross-core-source" sources={crossPlatformSources} /></p>
      <p>共享核心可以是“计算订单总额”的纯函数，也可以是跨平台的数据模型；它不应该偷偷依赖某台设备有没有相机。下面把一条代码从共享区移动到平台边界，看它为什么会改变可维护性。</p>
      <MobileConceptLesson slug="cross-platform-development" />
    </ArticleSection>
    <ArticleSection id="cross-core" title="共享什么才划算">
      <p>适合共享的部分通常有明确输入和输出：价格计算、表单校验、同步状态、业务规则和数据解析。它们可以用同一组测试在两个平台运行，减少规则漂移。后面说的“适配器”，就是把共享接口翻译成各平台调用的连接层。</p>
      <p id="cross-runtime" className="vp-citation-target">React Native 的架构资料说明 JavaScript、原生模块和运行时之间存在通信与调度边界。共享代码仍要经过运行时和平台实现，性能、线程和生命周期的行为不能只凭同一份源码推断。<Cite id="cross-runtime" sources={crossPlatformSources} /></p>
      <div className={styles.contract}><div><Code size={26} /><h3>共享核心</h3><p><code>calculateTotal(items, coupon)</code> 不访问平台 API。</p></div><div><GitBranch size={26} /><h3>平台入口</h3><p><code>takePhoto()</code> 由 iOS 与 Android 各自实现。</p></div></div>
      <p>共享比例没有固定答案。一个平台控件如果在另一个平台上需要完全不同的交互和可访问性，强行共享视图层可能比共享规则更贵。</p>
    </ArticleSection>
    <ArticleSection id="cross-adapter" title="平台能力放在边界">
      <p id="cross-channel" className="vp-citation-target">Flutter 的 platform channels 让 Dart 代码通过约定的消息调用平台侧实现。这个通道是边界：共享代码表达“请求拍照”，平台实现决定使用哪套相机 API、权限和返回错误。<Cite id="cross-channel" sources={crossPlatformSources} /></p>
      <p>适配器的价值是把差异集中起来。iOS 适配器可以处理系统不再直接弹窗的权限状态，Android 适配器可以处理不同版本的通知权限，共享业务层只接收“成功、取消或失败”的结果。</p>
      <p id="cross-kmp" className="vp-citation-target">Kotlin Multiplatform 的共享模块也不是消除平台代码，而是让团队选择哪些逻辑共享、哪些平台实现。清楚的边界方便分别测试和在必要时替换实现。<Cite id="cross-kmp" sources={crossPlatformSources} /></p>
      <ArticleAside title="接口先写结果，再写平台名"><p>共享接口可以叫 <code>takePhoto()</code>，返回图片或取消；它不必把 AVCaptureSession、CameraX 等平台类暴露给业务规则。平台名放在适配器里，业务层更容易理解和测试。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="cross-boundary" title="共享代码不等于相同行为">
      <p id="cross-maui" className="vp-citation-target">.NET MAUI 也把单项目、多平台目标和原生平台能力放在同一开发体验里，但各平台的窗口、权限和控件行为仍需要实际验证。框架提供共享路径，不会替团队替换平台约束。<Cite id="cross-maui" sources={crossPlatformSources} /></p>
      <div className={styles.distinctions}><div><h3>可以统一</h3><p>业务规则、数据结构、错误分类和部分展示状态。</p></div><div><h3>仍需平台测试</h3><p>相机、通知、后台、文件系统、导航和性能。</p></div></div>
      <p>“跨平台”也不等于一次编译后到处不用看。平台版本、硬件和系统设置会改变结果；自动化测试覆盖共享核心，真机测试覆盖平台边界，两者缺一不可。</p>
      <p>判断一个方案是否合理时，先问每个共享模块有没有平台依赖，再看适配器能否把权限、失败和取消传回。共享越多不一定越好，边界越清楚才更容易维护。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function WebviewTermPage() {
  return <ConceptArticle slug="webview" title="WebView" subtitle="内嵌网页容器" hero={<MobileHero trigger="网页请求分享订单" change="网页消息 → 宿主校验 → 原生调用" proof="未知来源不会执行原生分享" />} sections={webviewSections} sources={webviewSources} intro={<>WebView 是原生应用里由系统网页引擎提供的页面容器。<strong>网页负责展示和发起受限请求，宿主应用负责导航、权限、存储和消息桥的安全边界。</strong></>}>
    <ArticleSection id="webview-task" title="在原生应用里打开网页">
      <p>你要在购物 App 里展示帮助中心，同时允许用户从帮助页点击“分享本订单”。最省事的做法可能是在原生页面里嵌入一个网页，但这会带来两个问题：网页能看到什么，网页能调用哪些原生能力。</p>
      <p id="webview-container-source" className="vp-citation-target">Android WebView 和 Apple WKWebView 都提供了在原生应用中加载网页的容器。宿主可以控制导航、Cookie、下载和与原生代码的通信；它们不是把完整浏览器无条件搬进应用。<Cite id="webview-container-source" sources={webviewSources} /></p>
      <p>这层容器让原生壳和 Web 内容共享一部分体验，也让宿主承担了版本、内存、登录状态和权限的管理。下面模拟一条网页请求原生分享的消息。</p>
      <MobileConceptLesson slug="webview" />
    </ArticleSection>
    <ArticleSection id="webview-host" title="宿主负责什么">
      <p id="webview-engine" className="vp-citation-target">WKWebView 使用系统 WebKit 引擎，Android WebView 也受系统组件和版本影响。网页在容器里的表现不一定和用户独立打开的浏览器完全相同，宿主需要针对自己的引擎、存储和生命周期测试。<Cite id="webview-engine" sources={webviewSources} /></p>
      <p>宿主决定哪些 URL 可以继续导航，哪些页面需要回到原生登录或外部浏览器。它还要处理网页崩溃、加载失败、网络变化、下载和返回栈，这些都不应该被隐藏在“一个 iframe”式的想象里。</p>
      <div className={styles.contract}><div><Browser size={26} /><h3>网页层</h3><p>渲染帮助内容，发出结构化的分享请求。</p></div><div><ShieldCheck size={26} /><h3>宿主层</h3><p>验证来源和参数，再决定是否调用原生能力。</p></div></div>
      <p>网页能访问的 Cookie、存储和相机能力取决于宿主配置、来源和系统规则。登录状态不会因为放进 WebView 就自动和原生账号一致。</p>
    </ArticleSection>
    <ArticleSection id="webview-bridge" title="一条受约束的消息桥">
      <p id="webview-message" className="vp-citation-target">WKScriptMessageHandler 等桥接机制允许网页向原生发送消息。消息桥应该约定有限的方法名、协议版本、参数结构和返回结果，例如只允许 <code>shareOrder</code>，并要求一个订单 ID。<Cite id="webview-message" sources={webviewSources} /></p>
      <p id="webview-origin" className="vp-citation-target"><code>postMessage()</code> 的接收方需要检查消息来源，不能只检查消息里自报的字段。MDN 对跨窗口消息的说明强调了 target origin 和 event.origin 的作用；来源、方法和参数三项都通过后才进入原生调用。<Cite id="webview-origin" sources={webviewSources} /></p>
      <div className={styles.resultFlow}><span>网页消息</span><ArrowRight size={19} /><span>origin 校验</span><ArrowRight size={19} /><span>方法/参数校验</span><ArrowRight size={19} /><span>结构化结果</span></div>
      <p>验证失败也要有明确结果：拒绝请求、记录原因、让网页显示可理解的错误。不要让网页通过“调用一个万能方法，再把原生类名传进去”的方式获得任意能力。</p>
    </ArticleSection>
    <ArticleSection id="webview-boundary" title="为什么不能信任所有页面">
      <p id="webview-bridge-source" className="vp-citation-target">Android 的安全文档指出，不安全的 WebView 原生桥可能让恶意网页调用敏感原生功能。尤其是桥暴露过多方法、没有限制导航来源或直接执行网页传来的任意参数时，风险会扩大。<Cite id="webview-bridge-source" sources={webviewSources} /></p>
      <div className={styles.distinctions}><div><h3>受信页面</h3><p>固定来源、有限方法、严格参数和可记录的失败。</p></div><div><h3>未知页面</h3><p>禁止原生桥，或只允许完全无权限的展示能力。</p></div></div>
      <p>WebView 不是一个天然安全的隔离盒。即便网页来自自己的域名，也要考虑重定向、第三方内容、被注入的脚本、过期登录和消息重放。</p>
      <p>验收时至少加载受信页面和未知来源两种情况，确认原生方法只在来源、方法和参数验证通过后执行。再检查分享成功与取消等结构化返回，才能证明桥的正常路径和边界。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function CssSelectorTermPage() {
  return <ConceptArticle slug="css-selector" title="CSS selector" subtitle="CSS 选择器" hero={<MobileHero trigger="规则没有改变通知卡片" change="条件 → DOM 匹配集合" proof="命中后再经过层叠竞争" />} sections={selectorSections} sources={cssSelectorSources} intro={<>CSS 选择器描述哪些 DOM 元素符合一组条件。<strong>它先负责找出候选元素，匹配成功后浏览器还要经过层叠计算，才决定最终样式。</strong></>}>
    <ArticleSection id="selector-task" title="为什么这条规则没有命中">
      <p>你给订单卡片写了 <code>.card &gt; button[disabled]</code>，页面却没有把禁用按钮变灰。先不要马上提高权重：可能按钮不是卡片的直接子元素，或者 <code>disabled</code> 属性落在了另一个节点上。</p>
      <p id="selector-match-source" className="vp-citation-target">Selectors 规范把选择器定义为匹配元素的条件，条件可以包括类型、类、属性、关系和伪类。浏览器会在 DOM 树中判断每个元素是否满足这些条件。<Cite id="selector-match-source" sources={cssSelectorSources} /></p>
      <p>选择器解决的是“哪些元素属于这条规则”。它不读取你脑中的组件名称，也不保证这条规则最后赢过另一条同样命中的声明。下面逐步改动选择器，看集合怎样变化。</p>
      <MobileConceptLesson slug="css-selector" />
    </ArticleSection>
    <ArticleSection id="selector-match" title="选择器如何筛节点">
      <p id="selector-kinds" className="vp-citation-target">类型选择器匹配元素名，类和属性选择器匹配节点上的信息，组合器表达父子或兄弟关系，伪类表达状态或结构条件。例如 <code>.card:hover</code> 只有鼠标悬停等状态满足时才匹配。<Cite id="selector-kinds" sources={cssSelectorSources} /></p>
      <div className={styles.contract}><div><TreeStructure size={26} /><h3>DOM 树</h3><p>两个 <code>article.card</code> 各自包含按钮，其中一个直接子按钮带有 <code>disabled</code> 属性。</p></div><div><CheckCircle size={26} /><h3>匹配集合</h3><p>每次组合条件都会减少或改变被选中的节点。</p></div></div>
      <p id="selector-child" className="vp-citation-target">子代组合器 <code>&gt;</code> 只匹配直接子元素；如果中间多了一层包装节点，规则就不会命中。换成空格的后代组合器会扩大范围，但也可能误选更深层的节点。<Cite id="selector-child" sources={cssSelectorSources} /></p>
      <p>调试选择器时，先在开发者工具中确认 DOM 结构和匹配节点，再判断是不是层叠问题。否则不断增加类名或 <code>!important</code>，只会把真正的结构错误藏起来。</p>
    </ArticleSection>
    <ArticleSection id="selector-cascade" title="命中后还要竞争">
      <p id="selector-specificity" className="vp-citation-target">特异性会在同一层叠来源中比较选择器的权重列：ID、类/属性/伪类、类型/伪元素。它不是把选择器字符数简单相加，也不是所有样式冲突的第一层规则。<Cite id="selector-specificity" sources={cssSelectorSources} /></p>
      <p id="selector-cascade-source" className="vp-citation-target">CSS Cascade 还会先考虑来源、重要性和层，再比较特异性和出现顺序。只有前面的条件相同，后出现的声明才可能成为胜者。<Cite id="selector-cascade-source" sources={cssSelectorSources} /></p>
      <div className={styles.resultFlow}><span>选择器匹配</span><ArrowRight size={19} /><span>候选声明</span><ArrowRight size={19} /><span>来源 / 层 / 特异性</span><ArrowRight size={19} /><span>最终值</span></div>
      <p>因此，“规则没生效”至少有两种原因：没有选中目标，或者选中了但在层叠竞争中输了。两种问题的修法不同，应该先定位发生在哪一层。</p>
    </ArticleSection>
    <ArticleSection id="selector-boundary" title="选择器不是最终样式">
      <p>选择器也不会创建元素、改变 DOM 层级或自动修复类名拼写。它只能把符合条件的元素带进某条声明的候选集合。</p>
      <div className={styles.distinctions}><div><h3>先检查匹配</h3><p>元素是否存在，类名、属性和关系是否正确。</p></div><div><h3>再检查层叠</h3><p>另一条规则是否在来源、层、特异性或顺序上胜出。</p></div></div>
      <p>给读者一个新例子：如果 `.toolbar .notice` 命中了，但颜色仍没变，下一步查层叠；如果 `.toolbar &gt; .notice` 没命中，先看通知节点是不是直接孩子。能做出这一区分，就真正掌握了选择器的作用。</p>
      <p>验收时同时检查一个命中、一个结构不匹配和一个层叠覆盖案例。只把按钮改成红色，不足以证明页面解释了匹配与最终结果的差别。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function BoxModelTermPage() {
  return <ConceptArticle slug="box-model" title="CSS box model" subtitle="CSS 盒模型" hero={<MobileHero trigger="卡片比 width 更宽" change="content → padding → border" proof="margin 在盒子外，box-sizing 改变尺寸起点" />} sections={boxSections} sources={boxModelSources} intro={<>CSS 盒模型把元素的空间拆成 content、padding、border 和 margin。<strong>理解它，就能解释为什么一个写着 width: 200px 的卡片最后占了更宽的空间。</strong></>}>
    <ArticleSection id="box-task" title="卡片为什么比 width 更宽">
      <p>你给一张卡片写了 <code>width: 200px</code>，又加了左右各 12px 的内边距和 5px 的边框。测量时发现外框接近 234px。代码没有偷偷改数字，浏览器只是把 width 和盒子模型的其他区域一起计算了。</p>
      <p id="box-definition" className="vp-citation-target">CSS 盒模型把每个元素表示为内容区、内边距、边框和外边距的层。MDN 的介绍用这四个区域解释元素在布局中占据的空间；W3C 的 Box Model 规范定义了这些盒子之间的关系。<Cite id="box-definition" sources={boxModelSources} /></p>
      <p>先把“内容宽度”和“外框宽度”分开，很多尺寸问题就能定位。下面逐步加入 padding 和 border，再切换 <code>box-sizing</code> 看 width 的含义如何变化。</p>
      <MobileConceptLesson slug="box-model" />
    </ArticleSection>
    <ArticleSection id="box-parts" title="一个盒子的四个区域">
      <p id="box-areas" className="vp-citation-target">content 是文字或子元素所在的区域，padding 在内容和边框之间，border 围住前两者，margin 位于整个盒子之外。每一层都可能影响布局，但负责的空间不同。<Cite id="box-areas" sources={boxModelSources} /></p>
      <div className={styles.contract}><div><Layout size={26} /><h3>盒子内部</h3><p><code>content + padding + border</code> 组成 border box。</p></div><div><Stack size={26} /><h3>盒子外部</h3><p><code>margin</code> 参与相邻盒子的间距，通常不算进 border box。</p></div></div>
      <p>如果文字变长，content 可能增高；如果 padding 增大，文字周围的呼吸空间和外框尺寸都可能增加。调试时先标出每一层，而不是只盯着元素的 width。</p>
      <ArticleAside title="把数值放在同一张账单上"><p>content 200px、左右 padding 各 12px、左右 border 各 5px 时，content-box 的 border box 宽度是 200 + 24 + 10 = 234px。margin 还要另算。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="box-sizing" title="两种尺寸算法">
      <p id="box-sizing-source" className="vp-citation-target"><code>box-sizing: content-box</code> 时，width 和 height 指向内容区，padding 和 border 会在外面加出来；<code>border-box</code> 时，指定尺寸包含内容、padding 和 border。CSS Sizing 规范和 MDN 都把这两种计算方式分开说明。<Cite id="box-sizing-source" sources={boxModelSources} /></p>
      <p id="box-border" className="vp-citation-target">切换到 <code>border-box</code> 不会删除 padding 或 border，而是让它们从指定的总尺寸里分配空间。内容空间可能因此变窄，文字是否换行仍要观察。<Cite id="box-border" sources={boxModelSources} /></p>
      <div className={styles.resultFlow}><span>width</span><ArrowRight size={19} /><span>{"content-box：内容宽度"}</span><ArrowRight size={19} /><span>{"border-box：外框宽度"}</span></div>
      <p id="box-width" className="vp-citation-target">CSS <code>width</code> 的计算还会受到包含块、最小/最大尺寸和布局上下文影响。把“width 是最终占用宽度”当成普遍规则，会在 Flex、Grid 或滚动容器里继续遇到误差。<Cite id="box-width" sources={boxModelSources} /></p>
    </ArticleSection>
    <ArticleSection id="box-boundary" title="margin 在盒子外面">
      <p id="box-margin" className="vp-citation-target">margin 是盒子和其他元素之间的外部空间，不属于 border box。在相邻块元素之间，垂直 margin 还可能发生折叠；因此两个元素的外部间距不一定等于两个 margin 值简单相加。<Cite id="box-margin" sources={boxModelSources} /></p>
      <div className={styles.distinctions}><div><h3>修改 padding</h3><p>内容与边框之间变大，盒子内部和可能的总尺寸都会变化。</p></div><div><h3>修改 margin</h3><p>盒子与外部相邻内容的距离变化，盒子自身 border box 不变。</p></div></div>
      <p>盒模型也不是所有布局尺寸问题的唯一原因。Flex 的收缩、Grid 的轨道、百分比的包含块和滚动条都可能改变最终结果，但它们是在盒模型算清之后继续参与的布局规则。</p>
      <p>验收一个宽度问题时，先在开发者工具中看 content、padding、border、margin 的实际数值，再确认 box-sizing 和布局上下文。看到一张卡片“比 width 宽”，不需要先猜浏览器出错。</p>
    </ArticleSection>
  </ConceptArticle>;
}
