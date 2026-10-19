import { ArticleSection, ArticleAside, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { DependencyLesson } from "../ai-stack-lessons/dependency";
import { dependencySources } from "@/lib/ai-stack-concept-sources/dependency";

const sections: [string, string][] = [["dependency-definition", "我只想要日历，为什么装了好多包"], ["dependency-shared", "撤掉日历，日期工具还不能删"], ["dependency-files", "清单、锁记录与目录各自说什么"], ["dependency-types", "开发时需要，也算依赖"], ["dependency-trouble", "缺少一个包，先查是谁需要它"]];
export function DependencyTermPage() {
  return <Article slug="dependency" title="依赖" subtitle="Dependency · 你用的代码，还需要别的代码才能工作" sources={dependencySources} sections={sections}
    intro={<>给记账网站加个日历，你安装了一个包，目录里却出现了好几个陌生名字。<strong>日历自己也要借用别的代码，例如日期格式和语言数据。你的应用需要日历，日历又需要这些包，这些“需要”就是依赖关系。</strong>别急着按陌生名字删文件，先看看是谁把它带进来的。</>}>
    <ArticleSection id="dependency-definition" title="我只想要日历，为什么装了好多包">
      <p id="dependency-definition-text" className="vp-citation-target">这里说的包，是一份可以安装、复用的代码及其相关文件。npm 项目通常在 <code>package.json</code> 里声明需要哪些包：<code>dependencies</code> 把包名对应到版本要求。你给自己的应用写下日历包，它就是直接依赖；日历也有自己的清单，写明它需要什么。<Cite id="dependency-definition-text" sources={dependencySources} /></p>
      <p id="dependency-chain" className="vp-citation-target">如果日历需要日期工具，日期工具又需要语言数据，安装工具就要继续追踪这些需要关系。后两者通过别的包进入你的项目，叫传递依赖。要看中间哪个包需要它们。npm 可以用 <code>npm ls --all</code> 查看完整逻辑依赖树，用 <code>npm explain 包名</code> 追溯一个包为何被包含。<Cite id="dependency-chain" sources={dependencySources} /></p>
      <p>没有外部包，也可以自己写日历、格式化日期和处理语言差异；装包是选择复用别人已经写好的能力。你省下了一部分实现工作，也接下了这些包的版本与兼容要求。功能、维护成本和所需环境都要一起考虑。</p>
    </ArticleSection>
    <ArticleSection id="dependency-shared" title="撤掉日历，日期工具还不能删">
      <p>现在给同一个网站加上导出报表。导出包也需要日期工具，于是日期工具有了两个来处：日历和导出。撤掉日历，导出仍然要用它；再撤掉导出，日期工具及其语言数据才都没有来自应用的路径。</p>
      <p>下面是“谁需要谁”。两条上方的线来自应用的直接声明，中间汇合到同一个日期工具；下方继续连着语言数据。只撤掉一条声明，就看另一条需要关系是否还在。</p>
      <DependencyLesson />
      <p>试着先撤掉日历，你会看到直接依赖从两个变成一个，但日期工具和语言数据仍在。再撤掉导出，清单可达包归零，下方旧目录却还没动；点击同步，它才跟着本次清单改变。把清单和现有目录分开，才能看出“现在需要”与“以前装过”的区别。</p>
      <p id="dependency-layout" className="vp-citation-target">真实目录也未必照着这张图一层套一层。npm 的默认安装策略会把能共享的包提升到上层，并在必要时保留重复项；<code>npm ls</code> 展示的是逻辑关系 <code>node_modules</code> 的物理目录布局。本例固定为能共享的一组版本，没有模拟完整的版本解析与目录布局。<Cite id="dependency-layout" sources={dependencySources} /></p>
    </ArticleSection>
    <ArticleSection id="dependency-files" title="清单、锁记录与目录各自说什么">
      <p>这几个名字容易混在一起。<code>package.json</code> 是你声明的需要，例如允许日历使用某个版本范围；安装目录 <code>node_modules</code> 是本地拿到的包文件。</p>
      <p id="dependency-lock-text" className="vp-citation-target"><code>package-lock.json</code> 记录 npm 生成的确切依赖树，包括本次选定的具体版本。它可以和源码一起保存，让同事或构建环境重建同一组依赖。锁文件记录解析选择，声明清单记录依赖要求，两者配合使用。<Cite id="dependency-lock-text" sources={dependencySources} /></p>
      <p id="dependency-ci" className="vp-citation-target">自动构建常使用 <code>npm ci</code> 按已有锁记录干净安装。若清单与锁记录不匹配，它会报错退出，不替你更新锁记录；这正好能暴露“改了清单却忘了同步安装结果”的问题。真正安装前要在项目中检查两份文件。<Cite id="dependency-ci" sources={dependencySources} /></p>
      <p>版本范围的符号为什么会允许不同版本，继续读 <ConceptTerm slug="semantic-versioning">语义化版本</ConceptTerm>。本页先把“我需要什么”“这次选了什么”“本地有哪些文件”分清。</p>
    </ArticleSection>
    <ArticleSection id="dependency-types" title="开发时需要，也算依赖">
      <p id="dependency-types-text" className="vp-citation-target">有的包只用于构建和测试，通常放在 <code>devDependencies</code>；有的是运行代码的需要，放在 <code>dependencies</code>。可选依赖 <code>optionalDependencies</code> 安装失败时可以不让整个安装失败，但程序仍要处理它缺失的情况。插件还可能通过 <code>peerDependencies</code> 声明对宿主版本的兼容要求。这些字段描述的是不同用途，不能只数安装目录有多少包。<Cite id="dependency-types-text" sources={dependencySources} /></p>
      <ArticleAside title="开发依赖不会发给访客吗？"><p>不要仅凭字段得出这个结论。构建工具可以只在生成网页时运行，但构建结果里也可能包含被实际引用的库代码。由构建、导入和部署方式共同决定。</p></ArticleAside>
      <p>源码里没有直接 import 某个包。它可能由其他包使用，也可能由构建或测试脚本调用。先查用途，再判断该不该保留。</p>
    </ArticleSection>
    <ArticleSection id="dependency-trouble" title="缺少一个包，先查是谁需要它">
      <p>在演示里打开“下一次同步缺少日期工具”，再同步。需要关系仍然连着日期工具，目录里却没有它，报告就会标出缺失。先关掉故障再同步，它才恢复；只改开关不会凭空把文件补回来。这种差别比单独看“安装成功”几个字更容易理解。</p>
      <p id="dependency-prune" className="vp-citation-target">反过来，目录里有但当前依赖关系不需要的包，也可能是旧安装留下的。npm 的 <code>prune</code> 用于移除多余包；正常安装常会自动清理，异常中断或操作错误仍可能留下残留。删除某个包之前先追溯它的来处。<Cite id="dependency-prune" sources={dependencySources} /></p>
      <p>如果遇到版本冲突，问题又不同：两个包可能对同一个库提出了不兼容的要求。需要检查具体约束和错误信息，不能靠“保留一个最新版”解决所有情况。本例只有固定兼容版本。</p>
      <p>下次看到陌生包名，先试着说清它的用途、直接或传递来处、实际版本和本地是否存在。把这几件事对上，才知道该改清单、更新锁记录，还是修复一次没有装完整的环境。</p>
    </ArticleSection>
  </Article>;
}
