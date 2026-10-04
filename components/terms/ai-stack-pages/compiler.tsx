import { ArrowRight, Cpu, FileCode, FileJs } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { CompilerLesson } from "../ai-stack-lessons/compiler";
import { compilerSources } from "@/lib/ai-stack-concept-sources/compiler";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["compiler-definition", "编译器先把源代码变成什么"], ["compiler-process", "检查、转换和目标环境"], ["compiler-boundary", "产物能生成，不等于任务完成"]];

export function CompilerTermPage() {
  return <Article slug="compiler" title="编译器" subtitle="Compiler · 把一种写法转换成另一种可执行形式" sources={compilerSources} sections={sections}
    hero={<ConceptHero slug="compiler" label="源代码经过解析、转换，最后交给运行时；错误停在实际发生的那一层"><div className={styles.toolchainHero}><div className={styles.compilerHero}><div><FileCode size={25}/><span>源代码</span><strong>add(2, 3)</strong><code>人写的形式</code></div><ArrowRight size={20} aria-hidden="true"/><div><Cpu size={25}/><span>编译链</span><strong>语法树 → 中间表示</strong><code>逐层检查</code></div><ArrowRight size={20} aria-hidden="true"/><div><FileJs size={25}/><span>运行时</span><strong>output = 5</strong><code>目标代码已执行</code></div></div><p className={styles.heroNote}>生成目标代码和真正运行，是两个相邻但不同的步骤。</p></div></ConceptHero>}
    intro={<>你写下 `add(2, 3)` 时，电脑还没有拿到一条可以直接执行的指令。<strong>编译器会先读懂这段写法，再把它交给目标环境。</strong>它能在交付前拦住语法问题，却不能替运行时证明每个名字、资源和业务结果都正确。</>}>
    <ArticleSection id="compiler-definition" title="编译器先把源代码变成什么">
      <p id="compiler-definition-text" className="vp-citation-target">编译是把一种语言写成的程序转换成另一种格式或语言；编译器是执行这件事的程序。传统编译器可以把高级语言变成机器码或其他可运行形式，也可以把 TypeScript 变成 JavaScript，这时常被称为 <ConceptTerm slug="transpiler">转译器</ConceptTerm>。<Cite id="compiler-definition-text" sources={compilerSources}/></p>
      <p>可以把源代码想成一份给人看的施工图，把目标代码想成目标环境真正能读的指令。编译器先读取结构，检查它是否符合规则，再按目标环境的约束生成结果。没有目标形式，浏览器只看到它不认识的类型标记或语法，就无法开始运行。</p>
      <ArticleAside title="编译和运行不是同一刻"><p id="compiler-runtime" className="vp-citation-target">提前编译（AOT）在程序运行前生成结果；即时编译（JIT）由运行时在执行过程中完成一部分转换。两者都属于编译，只是发生的时间和负责的组件不同。<Cite id="compiler-runtime" sources={compilerSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="compiler-process" title="检查、转换和目标环境">
      <p id="compiler-types" className="vp-citation-target">TypeScript 的编译器可以检查类型，并把类型标记擦除后生成 JavaScript；类型系统本身不会在运行时改变 JavaScript 的行为。也就是说，编辑器里出现类型错误时，不能因为“最后会被擦掉”就当成问题已经解决。<Cite id="compiler-types" sources={compilerSources}/></p>
      <p>先拿一小段代码做追踪：`add(2, 3)` 会一路走到 `output = 5`；把它改成 `add(2, )`，你会看到解析器在参数列表处停下；换成 `legacy?.value`，这里的 `?.` 表示属性不存在时先得到 `undefined`，结构虽然读懂，却可能在生成面向旧目标的代码时被拦住；`add(2, missing)` 则会走到运行时，等真正取值时才报错。点选不同案例，上一条路径会清空，屏幕上的每个值都来自当前输入。</p>
      <CompilerLesson />
      <p id="compiler-config" className="vp-citation-target">编译选项通常写在配置文件中，例如 TypeScript 的 `tsconfig.json` 用来指定要包含的文件、编译选项和项目关系。配置改变后，实际目标、输出目录和检查范围也可能改变，所以排查“本地能跑、构建失败”时要同时看源码和配置。<Cite id="compiler-config" sources={compilerSources}/></p>
    </ArticleSection>
    <ArticleSection id="compiler-boundary" title="产物能生成，不等于任务完成">
      <p id="compiler-target" className="vp-citation-target">目标代码必须适合它要运行的环境。WebAssembly 也是一种可以由多种语言编译得到、再由浏览器运行的二进制形式；“编译成功”只说明生成了某种目标格式，不说明目标环境里所有 API、资源路径和运行时条件都已经满足。<Cite id="compiler-target" sources={compilerSources}/></p>
      <p>因此可以把检查分成三层：编译器是否接受了源代码，目标环境能否加载并运行产物，业务验收是否证明用户任务完成。把第一层的绿灯直接写成“功能完成”，会把运行时错误、缺少依赖和错误数据都藏起来。</p>
      <p><strong>读者判断</strong>：如果编译器输出了 `app.js`，你能指出还需要在哪两个地方继续检查吗？答案是目标环境能否运行，以及业务结果是否符合预期。</p>
    </ArticleSection>
  </Article>;
}
