import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Brain, Circuitry, HardDrives, LinkSimple, Plus, Robot, Wrench } from "@phosphor-icons/react/dist/ssr";
import { getRelatedTerms, getTerm } from "@/lib/content";
import { InlineTerm } from "./InlineTerm";
import { HarnessV4Lesson } from "./HarnessV4Lesson";
import { HarnessV4Toc } from "./HarnessV4Toc";
import { HarnessLearningMap } from "./HarnessLearningMap";
import { HarnessReferences } from "./HarnessReferences";
import { HarnessContextFlow, HarnessOutcomeFlow, HarnessRequestFlow } from "./HarnessStoryScenes";
import { HarnessHeroOverview } from "./HarnessHeroOverview";
import { harnessSectionTitles } from "@/lib/harness-sections";
import styles from "./HarnessStory.module.css";

function Term({ slug, children, description }: { slug: string; children: ReactNode; description?: string }) {
  const term = getTerm(slug);
  if (!term) throw new Error(`Missing inline term: ${slug}`);
  return <InlineTerm title={term.zh} english={term.en} description={description ?? term.definition} href={`/terms/${slug}`}>{children}</InlineTerm>;
}

export function AgentHarnessTermPage() {
  return <main className={`vp-concept ${styles.page}`} id="main-content">
    <div className="vp-page-layout">
      <HarnessV4Toc />
      <div className="vp-reading-content">
        <div className="vp-meta"><nav aria-label="面包屑" className="vp-crumb"><Link href="/"><ArrowLeft size={14} aria-hidden="true" />星图</Link><em>/</em><Link href="/?cat=AI%C2%B7Agent">AI · Agent</Link><em>/</em><span>Harness</span></nav></div>
        <header className="vp-hero">
          <div className={styles.heroComposition}>
          <div className="vp-hero-top"><span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" /><h1>Harness<span>智能体运行框架</span></h1></div>
          <HarnessHeroOverview />
          </div>
          <p className="vp-hero-intro">Harness 是围绕<Term slug="llm">模型</Term>搭建的运行系统。它准备模型要看的信息，处理工具请求，保存任务进度，让多次判断和操作能接着进行。</p>
        </header>

        <section className="vp-chapter" id="service"><div className="vp-chapter-content">
          <span id="why" className={styles.alias} />
          <h2>{harnessSectionTitles.service}</h2>
          <p>一个服务启动失败了，你让模型帮忙修复。如果没有提供日志、代码，也没有接入工具，模型只能根据这句话给出排查建议。查找文件、运行命令和把结果发回来，都需要你自己做。</p>
          <p>接入 Harness 后，系统可以把这些操作接起来：模型请求读日志，工具返回报错；模型根据报错提出修改，工具改文件，再运行检查。下面用同一个任务，对照这两种过程。</p>
          <HarnessV4Lesson />
          <p>在这个例子里，第一次读到的日志指向 <code>app.py</code> 第一行：函数定义缺少冒号。模型据此查看并修改代码。补丁写入后还要检查服务；如果检查又报错，就把新错误交回模型，继续定位问题。</p>
        </div></section>

        <section className="vp-chapter" id="need"><div className="vp-chapter-content">
          <h2>{harnessSectionTitles.need}</h2>
          <p id="cite-harness" className="vp-citation-target">模型根据当前输入生成回复，或提出要使用哪个<Term slug="tools">工具</Term>。Harness 接收这些请求，按配置检查权限、调用工具并保存结果，再决定是否发起下一轮模型调用。工具则负责实际操作，例如读取文件或执行一条命令。</p>
          <p>Harness 通常还要把工具的名称、用途和<Term slug="parameter">参数</Term>要求告诉模型。以读日志为例，模型需要知道有一个读取文件的工具，以及调用时必须提供文件路径，才能提出可执行的请求。</p>
          <HarnessRequestFlow />
          <p id="cite-tool-request" className="vp-citation-target">图中的 <code>read_file("server.log")</code> 表示模型提出的工具请求。实际接口通常把工具名和参数放在结构化数据里；普通回复里出现这段文字，并不等于文件已经被读取。应用处理请求、执行工具后，才会产生结果。</p>
          <p id="cite-tools" className="vp-citation-target">工具只负责这次操作。例如读取工具返回“文件不存在”，它的工作就结束了。接下来换路径、查询目录还是询问用户，需要模型结合错误继续判断，由 Harness 接着处理新的请求。</p>
          <p>本文把模型、Harness 和工具协作完成任务的系统称为 Agent（智能体）。Harness 指其中组织运行的程序及配置：用哪些指令、开放哪些工具、怎样保存进度，都在它的设计范围内。一个简单的任务可以从几次模型调用和工具执行开始，按需要补上这些能力。</p>
          <details className={styles.supplement} id="compare">
            <summary><Circuitry size={22} aria-hidden="true" /><span>角色分工</span><Plus className={styles.supplementToggle} size={18} aria-hidden="true" /></summary>
            <div className={styles.supplementBody}>
            <span id="tools" className={styles.alias} /><span id="inside" className={styles.alias} />
            <dl className={styles.roles}>
              {[
                { name: "Model · 模型", role: "提出下一步", example: "看到日志后，决定查看 app.py。", Icon: Brain },
                { name: "Harness · 运行系统", role: "把请求变成行动", example: "检查权限、调度工具、保存结果。", Icon: Circuitry },
                { name: "Tool · 工具", role: "执行具体操作", example: "读取文件、写入补丁、运行检查。", Icon: Wrench },
                { name: "Agent · 智能体", role: "围绕目标持续行动", example: "模型、运行系统与工具一起完成修复。", Icon: Robot },
              ].map(({ name, role, example, Icon }) => <div key={name}><dt><Icon size={26} aria-hidden="true" />{name}</dt><dd><strong>{role}</strong><p>{example}</p></dd></div>)}
            </dl>
            </div>
          </details>
          <p id="cite-terminology" className="vp-citation-target">阅读其他资料时，会看到“框架”“运行时”和“Harness”有重叠。LangChain 的一种分法是：框架提供搭建智能体的组件，运行时处理持久化、恢复等执行问题，Harness 则把工具、指令和默认行为配成一套可用的系统。本文侧重这套系统在运行中做什么；这些名称并没有统一的严格边界。</p>
          <details className={styles.supplement} id="name">
            <summary><LinkSimple size={22} aria-hidden="true" /><span>词义由来</span><Plus className={styles.supplementToggle} size={18} aria-hidden="true" /></summary>
            <div className={styles.supplementBody}>
            <div className={styles.connection} aria-hidden="true"><Brain /><i /><LinkSimple /><i /><Wrench /></div>
            <p id="cite-word" className="vp-citation-target">Harness 原指马具、系带一类连接装置。借这个比喻：模型提供能力，Harness 把它接到工具和环境上，并约束操作范围。</p>
            </div>
          </details>
        </div></section>

        <section className="vp-chapter" id="boundary"><div className="vp-chapter-content">
          <h2>{harnessSectionTitles.boundary}</h2>
          <p id="cite-context" className="vp-citation-target"><Term slug="context">上下文</Term>是模型这次生成回复时能参考的信息，包括任务、<Term slug="prompt">指令</Term>、对话记录和工具结果。工具在外部读到日志后，需要把结果加入后续调用，模型才能依据它继续判断。</p>
          <p>第一次调用时，模型只知道“服务启动失败”，所以先请求日志。下一次调用带上了“第一行缺少冒号”的报错，模型才有依据去检查 <code>app.py</code>。这两次调用可以使用同一个模型，变化的是它收到的信息。</p>
          <HarnessContextFlow />
          <p id="cite-state" className="vp-citation-target">Harness 保存的<Term slug="state">运行状态</Term>可以包含已经执行的请求、返回结果和任务进度。上下文则是本轮实际提供给模型的信息：外部可以保存完整日志，每次调用只取其中需要的部分。下次要用到某条旧记录时，还得把它重新带进输入。</p>
          <p id="cite-context-selection" className="vp-citation-target">例如日志有几万行，可以先搜索报错位置，再读附近的内容；已经处理过的旧输出可以整理成摘要，保留当前错误和未完成事项。这样能把有限的上下文留给眼前的问题。摘要也可能遗漏细节，所以关键文件和原始结果仍要能查回。</p>
          <p id="cite-loop" className="vp-citation-target">模型提出请求，工具执行，结果进入下一次输入，模型再判断下一步。这个反复进行的过程叫 <Term slug="agent-loop">Agent Loop（智能体循环）</Term>。单次调用负责生成这一轮的回复或请求，Harness 负责把多轮调用和执行过程接起来。</p>
          <p id="cite-workflow" className="vp-citation-target">演示把一次修复的路线固定下来，方便观察。实际任务中，读哪个文件、要不要再查日志，可以由模型根据新结果选择。如果步骤始终由程序预先排好，通常称为工作流；这类做法适合路径明确的任务。Harness 可以支持其中的固定规则，也可以容纳模型临时决定的操作。</p>
          <h3>跨会话继续任务</h3>
          <p id="cite-handoff" className="vp-citation-target">任务做得久了，还会遇到上下文放不下、需要换一次会话继续的情况。Anthropic 在长任务实验中把它比作工程师交班：下一班要知道目标、进度和遗留问题。他们让智能体留下进度文件和 Git 提交，下一次先读取这些记录，再选择未完成的工作。这些记录使新会话有依据接着做。</p>
          <p id="cite-handoff-example" className="vp-citation-target">放到修服务的例子里，交接记录可以是：“已补上 <code>app.py</code> 的冒号；服务能启动；<code>/health</code> 仍返回 500；下一步检查健康检查函数。”恢复后先核对文件与检查结果，再继续处理。只保存一句“正在修复服务”，不足以说明哪些操作已经做过。</p>
          <details className={styles.supplement} id="practice">
            <summary><HardDrives size={22} aria-hidden="true" /><span>磁盘占用示例</span><Plus className={styles.supplementToggle} size={18} aria-hidden="true" /></summary>
            <div className={styles.supplementBody}>
            <div className="vp-disk-story">
              <div className="vp-disk-round">
                <div id="cite-df" className="vp-disk-request vp-citation-target"><h3>先查哪块磁盘满了</h3><code>df -h</code><p>工具返回：/data 已用 99%。</p></div>
                <div className="vp-disk-result"><div className="vp-disk-total"><code>/data</code><strong>99%</strong></div><div className="vp-disk-meter" role="img" aria-label="data 分区使用率 99%"><i /></div></div>
              </div>
              <div className="vp-disk-round">
                <div id="cite-du" className="vp-disk-request vp-citation-target"><h3>再查谁占得最多</h3><code>du -sh /data/*</code><p>模型根据上一轮结果，继续定位目录。</p></div>
                <div className="vp-disk-bars" aria-label="logs 82 GB，models 12 GB，cache 4 GB">{[["logs", 82], ["models", 12], ["cache", 4]].map(([name, size]) => <div key={name}><code>{name}</code><span><i style={{ width: `${size}%` }} /></span><b>{size} GB</b></div>)}</div>
              </div>
            </div>
            </div>
          </details>
        </div></section>

        <section className="vp-chapter" id="quality"><div className="vp-chapter-content">
          <h2>{harnessSectionTitles.quality}</h2>
          <p id="cite-verification" className="vp-citation-target">文件写入成功，只能说明修改已经保存。要判断服务是否修好，还需要事先明确检查条件。本例要求服务能启动，并且健康检查 <code>/health</code> 返回正常响应；模型说“修好了”不能代替这些检查。</p>
          <p>如果检查失败，Harness 把错误交回模型，让它继续修正。如果操作没有获得授权，则应在执行前由<Term slug="permission-boundary">权限检查</Term>拦住。把“不要修改文件”写在指令里可以指导模型，但实际能否写入，还需要由程序或运行环境限制。</p>
          <HarnessOutcomeFlow />
          <p id="cite-environment" className="vp-citation-target">检查要有工具能够执行，结果也要让模型读到。OpenAI 的 Harness 工程实践就包括把浏览器操作、日志和指标接入工作环境，让智能体能够复现问题并验证修改。沿用这个思路，修服务时应让模型拿到实际启动日志和健康检查响应，才能依据结果继续处理。</p>
          <p id="cite-stopping" className="vp-citation-target">循环也需要停止条件：检查通过后返回结果，缺少信息或授权时等待用户，达到设定的轮数或时间上限时结束。这样即使模型反复尝试同一种无效操作，系统也有办法停下来，而不是一直消耗资源。</p>
          <p id="cite-failures" className="vp-citation-target">排查智能体失败时，可以顺着执行记录往回找：请求了不存在的工具，说明工具选择出了问题；路径和参数正确却读取超时，要查执行环节；一直重复读同一份日志，则要看是否缺少进展判断。Chip Huyen 在《AI Engineering》的公开书摘中，分别讨论了规划、工具执行和效率方面的失败，这种分法有助于找准需要改的部分。</p>
          <p id="cite-harness-config" className="vp-citation-target">同一个模型接入不同的 Harness，表现也可能不同。工具是否可用、错误有没有传回来、哪些信息被保留，都会影响后续过程。评估时既要看任务有没有完成，也要看用了多少轮、花了多久。对简单任务，先把少量工具和一次检查接好，再根据实际失败补充机制。</p>
        </div></section>

        <section className="vp-chapter" id="roadmap"><div className="vp-chapter-content">
          <h2>{harnessSectionTitles.roadmap}</h2>
          <p>可用工具决定系统能执行哪些操作，上下文决定模型这次能看到什么，循环把多次判断和执行接起来。需要进一步了解其中一部分时，可以从下面的关联词条继续阅读。</p>
          <HarnessLearningMap terms={getRelatedTerms(getTerm("agent-harness")!, 8)} />
          <Link className="term-graph-link" href="/?term=agent-harness"><span className="brand-star-only" aria-hidden="true" />打开完整星图<ArrowRight size={16} aria-hidden="true" /></Link>
          <p><span id="cite-mcp" className="vp-citation-target"><Term slug="mcp">MCP</Term> 约定应用怎样连接工具与数据。</span><span id="cite-skills" className="vp-citation-target"> <InlineTerm title="技能" english="Agent Skill" description="把某类任务的操作说明和相关资源放在一起，供智能体按需使用。通常包含 SKILL.md，也可以附带脚本、模板和参考材料。">Skill</InlineTerm> 提供特定任务的说明和资源。</span>它们都可以被 Harness 使用。</p>
        </div></section>
        <section className="vp-chapter" id="related"><div className="vp-chapter-content"><h2>{harnessSectionTitles.related}</h2><HarnessReferences /></div></section>
      </div>
    </div>
  </main>;
}
