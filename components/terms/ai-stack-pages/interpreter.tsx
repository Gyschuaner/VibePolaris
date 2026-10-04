import { Terminal } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { InterpreterLesson } from "../ai-stack-lessons/interpreter";
import { interpreterSources } from "@/lib/ai-stack-concept-sources/interpreter";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["interpreter-definition", "解释器什么时候开始执行"], ["interpreter-process", "把一次执行拆成指针和状态"], ["interpreter-boundary", "解释不等于逐行翻译"]];

export function InterpreterTermPage() {
  return <Article slug="interpreter" title="解释器" subtitle="Interpreter · 在运行时逐步执行程序指令" sources={interpreterSources} sections={sections}
    hero={<ConceptHero slug="interpreter" label="指令指针逐步前进，变量表从未赋值变为 1 再变为 3"><div className={styles.toolchainHero}><div className={styles.interpreterHero}><div className={styles.interpreterCode}><span className={styles.panelLabel}>程序</span><div className={styles.interpreterCodeLine}><span>1</span><span className={styles.interpreterPointer}>›</span><code>x = 1</code></div><div className={styles.interpreterCodeLine}><span>2</span><span> </span><code>x = x + 2</code></div><div className={styles.interpreterCodeLine}><span>3</span><span> </span><code>print(x)</code></div></div><div className={styles.interpreterState}><span className={styles.panelLabel}>运行时状态</span><div className={styles.interpreterVariable}><code>x</code><strong>未赋值</strong></div><div className={styles.interpreterOutput}><Terminal size={17}/><span>等待输出</span></div></div></div><p className={styles.heroNote}>程序先有可用的运行时，指针才会从第一条指令开始移动。</p></div></ConceptHero>}
    intro={<>你把脚本交给一个运行时，它没有先交付一份完整的目标程序才开始工作，而是拿到可执行的程序表示，<strong>按步骤推进并在每一步更新变量、调用和输出。</strong>这个负责“现在执行哪条、状态变成什么”的组件，就是解释器或更大的运行时系统中的解释执行部分。</>}>
    <ArticleSection id="interpreter-definition" title="解释器什么时候开始执行">
      <p id="interpreter-definition-text" className="vp-citation-target">解释器在运行时拿到源代码或字节码这样的程序，逐步执行其中的指令并更新执行状态。区分解释与编译时，先问两个问题：程序什么时候开始执行？是否先交付一份完整的目标程序，再由另一个运行时执行？<ConceptTerm slug="compiler">编译器</ConceptTerm>和解释器可以出现在同一条链路里，名称不能替代这两个判断。<Cite id="interpreter-definition-text" sources={interpreterSources}/></p>
      <p>“逐步”不是说解释器一定每读一行文字就执行一次。源码可能先被解析成指令或字节码，指令指针再按照控制流移动；循环、函数调用和条件分支都可能让下一条指令不是下一行文字。</p>
      <ArticleAside title="为什么还会听到字节码和即时编译"><p id="interpreter-jit" className="vp-citation-target">有些运行时会先准备字节码，或在执行中用即时编译优化热点路径。有没有字节码不是唯一判断标准；要看最终怎样交付代码、何时开始执行，以及哪个运行时维护执行上下文。<Cite id="interpreter-jit" sources={interpreterSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="interpreter-process" title="把一次执行拆成指针和状态">
      <p id="interpreter-execution" className="vp-citation-target">执行上下文会保存当前代码运行所需的环境记录、控制位置和其他状态。ECMAScript 规范把执行上下文和环境记录分开描述；这帮助我们理解：指针指向下一步不等于变量已经更新，变量表和控制台要等相应指令真正执行后才变化。<Cite id="interpreter-execution" sources={interpreterSources}/></p>
      <p>下面的固定程序只有三条指令。先看指针在哪里，再单步推进：第一步写入 `x = 1`，第二步读旧值并写回 `x = 3`，第三步把当前值打印出来。切换到错误程序后，第一步已经发生的赋值会保留；第二步找不到 `missing` 时，错误出现在执行到它的时刻。</p>
      <InterpreterLesson />
      <p id="interpreter-bytecode" className="vp-citation-target">Python 的 `dis` 工具可以把代码对应的字节码指令展示出来，便于观察指令而不是把源码行号当作执行位置。具体指令集属于实现细节，演示里的三步只用来说明“指令—状态—输出”的关系，不声称复刻某一种语言的完整虚拟机。<Cite id="interpreter-bytecode" sources={interpreterSources}/></p>
    </ArticleSection>
    <ArticleSection id="interpreter-boundary" title="解释不等于逐行翻译">
      <p id="interpreter-boundary-text" className="vp-citation-target">把“解释器”写成“读一行、翻译一行”会漏掉语法树、字节码、函数调用和控制流。脚本可以先完成解析或编译的一部分，再由运行时逐步执行；编译器也可能包含即时编译阶段。更稳妥的说法是：解释执行关注程序在运行时怎样推进，以及状态在哪一刻更新。<Cite id="interpreter-boundary-text" sources={interpreterSources}/></p>
      <p>同一个项目可能同时使用转译器把 TypeScript 变成 JavaScript、打包器组织模块、开发服务器提供文件，最后再由 JavaScript 运行时解释或即时编译。它们解决的时间点和输出不同，不能因为都叫“处理代码”就合并成一个工具。</p>
      <p id="interpreter-lua" className="vp-citation-target">Lua 参考手册把语言语义和运行时行为放在一起描述，也说明实现可以采用不同的内部方式。<strong>实现细节会变化，但执行者仍要维护当前状态并处理错误出口。</strong><Cite id="interpreter-lua" sources={interpreterSources}/></p>
      <p><strong>读者判断</strong>：如果第二条指令使用了不存在的变量，你能指出错误发生在编译、指针推进，还是控制台输出之后吗？在这个演示中，它发生在指针执行第二条指令时，第一条已经写入的状态仍然存在。</p>
    </ArticleSection>
  </Article>;
}
