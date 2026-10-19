import { ArticleSection, ArticleAside, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { HmrLesson, HmrSubscriptions } from "../ai-stack-lessons/hmr";
import { hmrSources } from "@/lib/ai-stack-concept-sources/hmr";

const sections: [string, string][] = [["hmr-definition", "按钮换了，刚填的名字还在"], ["hmr-workbench", "把页面状态留在槽位之外"], ["hmr-boundary", "谁来接住新的模块"], ["hmr-cleanup", "旧监听不能一直留着"], ["hmr-limits", "刷新后名字没了，先看什么"]];

export function HmrTermPage() {
  return <Article slug="hmr" title="热模块替换" subtitle="Hot Module Replacement · 换进新代码，尽量留住正在使用的页面" sources={hmrSources} sections={sections}
    intro={<>你正在调试一张报名表，姓名已经填好，按钮也点了三次。只是想把按钮换个样式，保存代码后却又得从头填表，会很烦。<strong>HMR 尝试把改过的代码接进正在运行的页面，让不需要重建的部分继续留在原处。</strong>但新代码能不能接住旧页面，还需要有人处理这次变化。</>}>
    <ArticleSection id="hmr-definition" title="按钮换了，刚填的名字还在">
      <p id="hmr-definition-text" className="vp-citation-target">HMR 是 Hot Module Replacement，中文叫热模块替换。模块就是一块有独立职责的代码，例如负责画按钮的文件。普通整页刷新会重新启动页面脚本；HMR 则尝试在应用还运行着的时候更新、增加或移除模块。对正在调试的人来说，直接的好处是不用每次改个按钮，都重新走一遍填表和点击的过程。<Cite id="hmr-definition-text" sources={hmrSources} /></p>
      <p>这里的“热”是说应用还在运行。它也不替你保存填写内容到数据库。如果页面最终还是重建了，原本只放在内存里的姓名和计数就可能回到初始值。</p>
      <p>没有 HMR 也能开发：保存文件后重新加载网页，看修改是否生效。区别在于，HMR 多做了一件事：在重建整页之前，先试着把局部变化接进去。编辑器保存、代码编译和模块在页面里生效，是不同的事情；保存成功不能单凭颜色变化来判断。</p>
    </ArticleSection>
    <ArticleSection id="hmr-workbench" title="把页面状态留在槽位之外">
      <p>先在下面写一个名字，点几次按钮。然后保存按钮的新版本。按钮会换成绿色的新版，名字和计数仍是你刚才亲手输入的内容。这个示例让外层页面持有姓名与计数，只把里面的按钮节点换掉，所以状态不会跟着按钮一起丢掉。</p>
      <HmrLesson />
      <p>再取消“有能接受本次变化的更新边界”，重新保存。新版按钮仍然会出现，但整个示例页面从头初始化：姓名清空，计数归零。只是改变能否接受更新这一个条件，你就能看到局部替换和整页重建的差别。切换开关本身不会抹去已经填写的内容。</p>
      <p id="hmr-state" className="vp-citation-target">真实工具对状态的保留会更细。例如 Next.js 的 Fast Refresh 会尽量保留函数组件里的 React 状态，但组件形态、其他导出、Hook 的顺序或渲染错误都可能改变结果。它在 HMR 之上处理 React 组件更新，不能从“用了 HMR”直接推断所有组件的内部状态都留下。<Cite id="hmr-state" sources={hmrSources} /></p>
    </ArticleSection>
    <ArticleSection id="hmr-boundary" title="谁来接住新的模块">
      <p id="hmr-transport" className="vp-citation-target">保存源码后，开发工具发现变化，准备更新代码并通知页面里的更新运行时。运行时是浏览器里负责接收和应用更新的那部分代码。它处理的范围可能包含变化文件以及受影响的依赖，不能简单理解成“只改一个文件，就绝对只下载那一个文件”。webpack 的更新会用清单和更新代码块描述这些变化。<Cite id="hmr-transport" sources={hmrSources} /></p>
      <p id="hmr-accept" className="vp-citation-target">拿到新代码还不够。原来引用按钮的那部分应用，需要知道怎样把新的按钮接到旧页面上。模块或框架声明能处理这次变化的地方，就叫更新边界。Vite 的 <code>import.meta.hot.accept()</code> 提供这样的接收接口；有些边界接自己的变化，有些接某个依赖的变化。接收回调还需要做相应的更新工作。<Cite id="hmr-accept" sources={hmrSources} /></p>
      <p id="hmr-bubble" className="vp-citation-target">在 webpack 中，变化可以沿“谁引用了我”向外寻找接受位置：按钮自己不会处理，引用它的外层页面可能会。如果一直找不到可接受的位置，运行时无法完成这次局部更新；开发服务器通常会改为重新加载整页。无边界时的处理也受工具配置影响。<Cite id="hmr-bubble" sources={hmrSources} /></p>
      <ArticleAside title="普通使用者需要写这些接口吗？"><p id="hmr-framework" className="vp-citation-target">用框架的常见开发模板时，这些处理通常已经由插件或框架提供。Vite 明确把手动 HMR API 主要面向框架和工具作者。对初学者，更有用的是认出局部更新与整页重建的差别，出问题时再检查具体框架的更新限制。<Cite id="hmr-framework" sources={hmrSources} /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="hmr-cleanup" title="旧监听不能一直留着">
      <p>有的模块加载时，会订阅消息：以后每来一条消息，就执行一次处理函数。假如换新版时又订阅一次，却没移除旧订阅，页面看起来更新好了，后台实际上留着两份处理函数。一条消息来了，就处理两次；再更新一次，可能变成三次。</p>
      <p id="hmr-dispose" className="vp-citation-target">这类持续存在的工作叫副作用。HMR 提供 <code>dispose</code> 清理接口，让被替换的旧模块释放自己注册的监听、计时器或其他资源。有需要转交的状态，也可以使用工具提供的传递机制。清理负责处理旧模块留下的东西，接受更新负责接上新代码。<Cite id="hmr-dispose" sources={hmrSources} /></p>
      <HmrSubscriptions />
      <p>取消清理，替换两次监听模块，再发一条消息：三枚监听会一起留下，处理次数增加三次。重新启用清理并替换，只会移除当前旧模块的监听，更早漏掉的监听还在。想看从头正确清理的效果，点“清空并重试”，保持清理开启再替换几次。真实代码里的清理函数也需要拿到取消订阅的句柄，不会自动找出所有历史泄漏。已经处理过的消息不会因为清理而“没发生过”。这个实验没有开后台定时器，只在你点击时触发，方便观察一次消息究竟被谁处理。</p>
    </ArticleSection>
    <ArticleSection id="hmr-limits" title="刷新后名字没了，先看什么">
      <p id="hmr-fallback" className="vp-citation-target">先分清页面是局部重绘、组件重新挂载，还是整个网页重新加载。比如 Next.js 的 Fast Refresh，文件被 React 树之外的代码引用时可能回退整页加载；函数组件的渲染错误可能触发重新挂载。两种现象都可能丢失局部状态，却不能只凭计数归零就断定网络断了。<Cite id="hmr-fallback" sources={hmrSources} /></p>
      <p>接着看刚才改了什么：只是按钮样式，还是改了组件结构、导出或共享模块？开发工具有没有报编译错误、连接错误或无法接受更新？如果保存一次后收到两条相同消息，再查旧订阅有没有清理。问题不同，排查位置也不同。</p>
      <p>HMR 主要服务开发时的反馈。上线给访客看的版本仍要走构建和部署，开发页面已经更新。仍要实际点击并检查结果。</p>
      <p>继续读 <ConceptTerm slug="hot-reload">热重载</ConceptTerm>，可以对比开发工具几种刷新方式；读 <ConceptTerm slug="component">组件</ConceptTerm>，可以进一步看页面状态放在哪里。</p>
    </ArticleSection>
  </Article>;
}
