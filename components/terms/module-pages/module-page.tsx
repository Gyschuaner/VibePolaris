import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { moduleSources } from "@/lib/module-sources";
import { ModuleHero } from "./module-hero";
import { ModuleLesson } from "./module";

const sections: [string, string][] = [
  ["module-definition-section", "文件边界先把职责分开"],
  ["module-graph-section", "import 画出一张依赖图"],
  ["module-binding-section", "export 交出去的是绑定"],
  ["module-cycle-section", "循环依赖要看初始化顺序"],
];

export function ModuleTermPage() {
  return <Article slug="module" title="模块" subtitle="JavaScript Module · 文件之间怎样交换能力" sources={moduleSources} sections={sections} hero={<ModuleHero />} intro={<>模块把一份 JavaScript 文件变成有边界的职责单元。<strong>它用 export 公开少量能力，用 import 声明依赖；运行时按依赖图初始化模块，并让导入连接到导出绑定。</strong>理解这三件事，才知道“拆文件”为什么能减少互相改坏。</>}>
    <ArticleSection id="module-definition-section" title="文件边界先把职责分开">
      <p id="module-boundary" className="vp-citation-target">模块拥有自己的顶层作用域：文件里的变量默认只在文件内可见，只有显式 <code>export</code> 的名称才成为对外接口，另一个文件通过 <code>import</code> 请求它。模块边界让调用者依赖接口，而不是依赖每一行内部实现。<Cite id="module-boundary" sources={moduleSources} /></p>
      <p id="module-import" className="vp-citation-target"><code>import &#123; format &#125; from &quot;./format.js&quot;</code> 不是把 format.js 的文本复制到当前位置，而是声明“entry.js 需要这个模块导出的名称”。浏览器或构建工具可以提前分析这条静态关系。<Cite id="module-import" sources={moduleSources} /></p>
      <p>下面的演示把 settings.js、greeting.js 和 entry.js 放在同一张小图里。先切换 live binding 与复制快照，再修改一次 locale，差别会出现在最后一张卡上。</p>
      <ModuleLesson />
    </ArticleSection>
    <ArticleSection id="module-graph-section" title="import 画出一张依赖图">
      <p id="module-graph" className="vp-citation-target">静态 import/export 让模块形成一张依赖图：entry.js 依赖 greeting.js，greeting.js 又依赖 settings.js。模块加载器会先处理依赖，再初始化依赖它的模块；同一个模块被多处引用时，仍然对应同一个模块记录。<Cite id="module-graph" sources={moduleSources} /></p>
      <p id="module-once" className="vp-citation-target">“只求值一次”说的是一次模块加载图里的模块记录，而不是说函数只会运行一次。模块顶层初始化通常只发生一次，导出的函数仍然可以被调用很多次。把这两层混在一起，会误判缓存、单例和副作用。<Cite id="module-once" sources={moduleSources} /></p>
      <p>依赖图也让循环更容易被看见：从 A 走到 B，又回到 A，并不自动意味着错误；真正需要追的是初始化阶段谁先读取了尚未完成的导出。</p>
    </ArticleSection>
    <ArticleSection id="module-binding-section" title="export 交出去的是绑定">
      <p id="module-export" className="vp-citation-target"><code>export</code> 可以公开变量、函数、类或默认导出；导入方拿到的是模块对外提供的名称和绑定关系，不会因此获得随意重写导出变量的权限。模块内部仍然拥有修改自己状态的责任。<Cite id="module-export" sources={moduleSources} /></p>
      <p id="module-live" className="vp-citation-target">在 live binding 中，导入方读取的是导出方当前的值。settings.js 把 locale 从 en-US 改成 zh-CN 后，greeting.js 下次读取会看到更新；这和先写成 <code>const copy = locale</code> 的普通快照不同。<Cite id="module-live" sources={moduleSources} /></p>
      <p>实际代码里不必到处依赖可变导出。一个更稳的模块通常公开函数，让状态变化经过明确操作；live binding 是语言的连接语义，不是鼓励把整个应用变成一堆全局变量。</p>
    </ArticleSection>
    <ArticleSection id="module-cycle-section" title="循环依赖要看初始化顺序">
      <p id="module-cycle" className="vp-citation-target">循环依赖表示依赖图里存在回路。ES 模块可以表示这种关系，但如果 A 的顶层初始化要读取 B 还没初始化完的绑定，就会在 temporal dead zone（暂时性死区）里报错；把报错归因成“不能循环 import”过于简单。<Cite id="module-cycle" sources={moduleSources} /></p>
      <p>演示里的“模拟循环依赖”把读取动作放在初始化之前，显示 ReferenceError；取消它后，普通的三文件关系仍能运行。这个分支提醒你先拆共享类型、延后读取或把副作用移到函数调用里，再考虑是否真的需要保留回路。</p>
      <p>模块边界的价值最终落在可解释性：谁提供能力、谁依赖能力、哪一步会产生副作用，都能沿着图找到；文件变多不是模块化，边界和依赖方向清楚才是。</p>
    </ArticleSection>
  </Article>;
}
