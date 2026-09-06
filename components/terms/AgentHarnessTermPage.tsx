import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { BespokeTermPageProps } from "./BespokeTermScaffold";
import { HarnessLesson } from "./HarnessLesson";
import styles from "./AgentHarnessTermPage.module.css";

const questions = [
  { question: "如果模型想删除文件呢？", answer: "提出请求不代表获得权限。Harness 可以允许读取、拒绝删除，或在执行前等待你确认。权限检查发生在工具真正执行之前。" },
  { question: "如果文件不存在呢？", answer: "文件工具返回实际错误，Harness 把错误交回模型。模型可以检查路径，或请你提供文件；不能把一次失败的读取当成成功。" },
  { question: "如果任务做了一半中断呢？", answer: "保存进度、产物位置和必要状态，让下一次运行知道已经完成了什么。会话记录、检查点或进度文件，都是可用的实现方式。" },
  { question: "模型说完成，就真的完成了吗？", answer: "还要对照任务标准检查结果：待办有没有遗漏，文件是否生成，页面是否能用。Harness 可以接入这些检查，再把问题反馈给模型，但不能保证每次判断都正确。" },
  { question: "它会一直运行下去吗？", answer: "可以设置轮数、时间或费用限制，也可以暂停并等待你提供信息。达到限制表示本轮停止，不表示任务已经成功。" },
];

const concepts = [
  ["Prompt", "告诉模型要做什么，以及遵循什么要求。"],
  ["工具", "实际执行某个操作，例如读取文件或搜索网页。"],
  ["MCP", "规范应用与外部工具、数据之间的连接和交互。"],
  ["Skill", "打包某类任务的操作说明、参考资料和可选脚本，按需加载。"],
  ["Harness", "把输入、模型调用、工具执行和运行状态组织成持续推进的过程。"],
];

const sources = [
  { label: "理解一次智能体循环", author: "Claude Code Docs", url: "https://code.claude.com/docs/en/agent-sdk/agent-loop" },
  { label: "从上下文、行动到结果检查", author: "Anthropic", url: "https://claude.com/blog/building-agents-with-the-claude-agent-sdk" },
  { label: "长任务如何保存进度并继续", author: "Anthropic", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
  { label: "了解更完整的 Harness 能力", author: "LangChain", url: "https://docs.langchain.com/oss/python/deepagents/overview" },
  { label: "MCP 的职责边界", author: "MCP", url: "https://modelcontextprotocol.io/docs/learn/architecture" },
  { label: "Skill 如何按需加载", author: "Agent Skills", url: "https://agentskills.io/home" },
];

export function AgentHarnessTermPage({ related }: BespokeTermPageProps) {
  return <main className={styles.page} id="main-content">
    <div className={styles.meta}>
      <Link href="/" className={styles.back}><ArrowLeft size={15} />返回星图</Link>
      <span>AI · Agent</span>
    </div>
    <header className={styles.hero}>
      <h1>Harness <span>智能体运行框架</span></h1>
      <p>围绕模型运行的一层程序：准备输入，执行模型发出的工具请求，把结果交回模型，并管理任务如何继续或停止。</p>
    </header>
    <HarnessLesson />
    <div className={styles.reading}>
      <nav className={styles.contents} aria-label="本页内容">
        <a href="#harness-how">理解原理</a><a href="#harness-questions">真实任务</a><a href="#harness-concepts">概念对照</a><a href="#harness-use">实际使用</a>
      </nav>

      <section className={styles.section} id="harness-how" aria-labelledby="how-title">
        <h2 id="how-title">模型决定下一步，<br />Harness 把这一步运行起来。</h2>
        <p>刚才，模型提出读取 <code>todo.txt</code> 的请求，文件工具实际打开文件。Harness 把请求交给工具，再把读取结果放进下一次模型输入。</p>
        <p><strong>发出请求、真正执行、收到结果，是三件不同的事。</strong>只有工具返回内容，模型才获得了这份文件的信息。</p>
        <dl className={styles.parts}>
          <div><dt>上下文<span>这次能看到什么</span></dt><dd>任务、工具说明和已经返回的结果，共同组成模型这次能看到的信息。第 2 步还没有文件正文，第 5 步才把它加入输入。</dd></div>
          <div><dt>工具调度<span>把请求变成行动</span></dt><dd>接收模型的工具请求，检查是否允许执行，再交给对应工具。第 4 步，文件工具才真正开始读取。</dd></div>
          <div><dt>运行循环<span>根据结果继续</span></dt><dd>结果交回模型后，如果还需要行动，就继续调用工具。这个过程可以重复多轮，直到输出回答或触发停止条件。</dd></div>
        </dl>
        <p className={styles.aside}>这里演示的是固定待办，不会读取你的文件。按钮控制讲解节奏；真实运行由程序连续推进。</p>
      </section>

      <section className={styles.section} id="harness-questions" aria-labelledby="questions-title">
        <h2 id="questions-title">真实任务，还会遇到这些情况</h2>
        <p>刚才是一次顺利完成的读取。任务更长、工具更多时，还要处理权限、错误、进度和结果检查。</p>
        <div className={styles.questions}>{questions.map(item => <details key={item.question}>
          <summary>{item.question}<CaretDown size={16} aria-hidden="true" className={styles.toggle} /></summary>
          <p>{item.answer}</p>
        </details>)}</div>
        <p className={styles.aside}>规划、长期记忆和子代理也可以加入其中。它们按任务需要选择，并非每个 Harness 都必须配齐。</p>
      </section>

      <section className={styles.section} id="harness-concepts" aria-labelledby="concepts-title">
        <h2 id="concepts-title">这些概念，各自负责什么？</h2>
        <table className={styles.comparison}>
          <caption className={styles.srOnly}>Prompt、工具、MCP、Skill 与 Harness 的职责对照</caption>
          <thead><tr><th scope="col">概念</th><th scope="col">解决的问题</th></tr></thead>
          <tbody>{concepts.map(([name, description]) => <tr key={name}><th scope="row">{name}</th><td>{description}</td></tr>)}</tbody>
        </table>
        <p className={styles.aside}>模型是理解输入、生成回答或工具请求的部分；Agent 通常指围绕模型构建、能够采取行动的整体系统。Harness 是支撑这个系统运行的程序部分。</p>
      </section>

      <section className={styles.section} id="harness-use" aria-labelledby="use-title">
        <h2 id="use-title">什么时候需要关心 Harness？</h2>
        <p>当你希望 AI 自己查资料、操作文件，并根据结果继续下一步时，就需要有人组织这段运行过程。使用现成的智能体工具时，这一层通常已经由产品提供；开发自己的智能体时，才需要选择现有实现或补充控制逻辑。</p>
        <div className={styles.example}>
          <h3>可以这样向 AI 提需求</h3>
          <blockquote>为这个文件助手加入读取流程：收到读取请求后，先检查允许访问的路径，再把文件内容或错误交回模型。涉及删除时等待我确认，并为任务设置明确的停止条件。</blockquote>
        </div>
        <p>只需要回答一个资料齐全的问题时，直接调用模型可能就够了。是否需要更复杂的 Harness，取决于任务需要多少行动和控制。</p>
      </section>

      <footer className={styles.further}>
        <div className={styles.next}><h2>接下来理解</h2><nav aria-label="继续理解">{related.slice(0, 3).map(item => <Link href={"/terms/" + item.slug} key={item.slug}>{item.zh}<ArrowUpRight size={16} /></Link>)}</nav></div>
        <details className={styles.sources}><summary>参考资料 <span>6 篇官方文档与教程</span></summary><ul>{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={14} /></a><span>{source.author}</span></li>)}</ul></details>
        <a href="#harness-demo" className={styles.revisit}>回到演示 <ArrowLeft size={14} /></a>
      </footer>
    </div>
  </main>;
}
