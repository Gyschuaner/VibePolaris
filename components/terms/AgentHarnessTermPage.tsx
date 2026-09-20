import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowsClockwise, Check, Plus } from "@phosphor-icons/react/dist/ssr";

import { HarnessV4Lesson } from "./HarnessV4Lesson";
import { HarnessV4Toc } from "./HarnessV4Toc";
import { HarnessLearningMap } from "./HarnessLearningMap";
import { harnessSectionTitles } from "@/lib/harness-sections";

const sources = [
  ["ref-1", "Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents", "Anthropic · Agent、工具反馈与停止条件"],
  ["ref-2", "Agent Harness", "https://learn.microsoft.com/en-us/agent-framework/concepts/harness", "Microsoft Learn · 运行程序的组成"],
  ["ref-3", "Tool use with Claude", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", "Anthropic · 请求、执行和工具返回"],
  ["ref-4", "MCP architecture overview", "https://modelcontextprotocol.io/docs/learn/architecture", "Model Context Protocol · 协议范围与工具"],
  ["ref-5", "Effective harnesses for long-running agents", "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", "Anthropic · 状态交接、长任务与验证"],
  ["ref-6", "Agent Skills overview", "https://agentskills.io/home", "Agent Skills · 指令、脚本和资源"],
  ["ref-7", "Context windows", "https://platform.claude.com/docs/en/build-with-claude/context-windows", "Anthropic · 上下文与工具交互"],
  ["ref-8", "Harness · 词义", "https://www.merriam-webster.com/dictionary/harness", "Merriam-Webster · 普通词义"],
  ["ref-9", "df(1)", "https://man7.org/linux/man-pages/man1/df.1.html", "GNU df 手册 · 文件系统空间"],
  ["ref-10", "du(1)", "https://man7.org/linux/man-pages/man1/du.1.html", "GNU du 手册 · 文件与目录占用"],
] as const;

export function AgentHarnessTermPage() {
  return (
    <main className="vp-concept" id="main-content">
      <div className="vp-page-layout">
        <HarnessV4Toc />
        <div className="vp-reading-content">
          <div className="vp-meta"><nav aria-label="面包屑" className="vp-crumb"><Link href="/terms"><ArrowLeft size={14} aria-hidden="true" />术语</Link><em>/</em><Link href="/terms?cat=AI%C2%B7Agent">AI · Agent</Link><em>/</em><span>Harness</span></nav></div>
          <header className="vp-hero">
            <div className="vp-hero-top"><span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" /><h1>Harness <span>让模型真正动手的运行系统</span></h1></div>
            <p className="vp-hero-lead"><strong>模型负责“想”，Harness 负责让模型“真正干活”。</strong></p>
            <p className="vp-hero-intro">模型会告诉你怎么修服务。让它打开日志、修改文件，再根据测试结果接着做，需要一套围绕模型运行的系统。</p>
          </header>

          <section className="vp-chapter" id="why"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.why}</h2>
            <p>先看一个没有连接工具的模型。你问它：</p>
            <blockquote className="vp-dialogue">帮我看看这个项目为什么运行失败。</blockquote>
            <div className="vp-reading-flow" aria-label="普通模型调用">
              <span>你的问题</span><ArrowRight aria-hidden="true" /><strong>模型</strong><ArrowRight aria-hidden="true" /><span>一段回答</span>
            </div>
            <p>它可能建议：“检查一下 8000 端口是否被占用。”但打开项目、运行命令、把结果贴回来，仍要你自己做。<strong>生成排查建议，并不等于执行排查。</strong></p>
          </div></section>

          <section className="vp-chapter" id="need"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.need}</h2>
            <p><strong>Agent Harness 是围绕模型运行的程序：</strong>把任务交给模型，检查并执行工具请求，再把结果送回去，让模型决定下一步。</p>
            <figure className="vp-teach-figure" aria-label="Agent 内部的模型、Harness 与工具分工">
              <div className="vp-agent-outline">
                <span className="vp-frame-title">Agent · 整个智能体</span>
                <div className="vp-system-model"><b>Model / 模型</b><span>根据当前信息，提出下一步</span></div>
                <div className="vp-double-link"><span>↓ 工具请求</span><span>↑ 执行结果</span></div>
                <div className="vp-system-harness"><b>Harness / 运行程序</b><p>检查请求 · 调用工具 · 保存结果</p></div>
                <div className="vp-system-stem" aria-hidden="true">↕</div>
                <div className="vp-system-tools"><div><b>文件</b></div><div><b>命令行</b></div><div><b>浏览器</b></div></div>
              </div>
            </figure>
            <p>模型选择“做什么”，Harness 负责“能不能做、怎样执行、结果怎么交回”。下一步来自模型对新结果的判断。</p>
          </div></section>

          <section className="vp-chapter" id="name"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.name}</h2>
            <p>Harness 原指马具、系带一类连接装置。借这个比喻：模型提供能力，Harness 把它接到工具和环境上，并约束操作范围。</p>
            <div className="vp-inline-equation">Agent ≈ Model + Harness</div>
            <p>这是一种便于理解的分工：模型与运行系统，再加上工具和环境，共同组成能围绕目标行动的智能体。</p>
          </div></section>

          <section className="vp-chapter" id="practice"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.practice}</h2>
            <blockquote className="vp-dialogue">我的服务器磁盘为什么满了？</blockquote>
            <p>只有模型时，它会建议你运行 <code>df -h</code>。接上 Harness 后，请求、执行和结果可以连续往下走：</p>
            <figure className="vp-disk-story" aria-label="两轮磁盘排查：先发现 data 分区已满，再定位 logs 目录">
              <div className="vp-disk-round">
                <div className="vp-disk-request"><h3>模型：先看哪个分区满了</h3><code>df -h</code><span><ArrowDown size={18} aria-hidden="true" />Harness 检查并执行</span></div>
                <div className="vp-disk-result"><div className="vp-disk-total"><code>/data</code><strong>99%</strong></div><div className="vp-disk-meter" role="img" aria-label="data 分区已用 99%，99 GB，共 100 GB"><i /></div><p>100 GB 中已用 99 GB</p></div>
              </div>
              <div className="vp-result-bridge"><ArrowsClockwise size={20} aria-hidden="true" /><span>结果交回模型，决定继续查 <code>/data</code></span></div>
              <div className="vp-disk-round">
                <div className="vp-disk-request"><h3>模型：再看谁占得最多</h3><code>du -sh /data/*</code><span><ArrowDown size={18} aria-hidden="true" />Harness 检查并执行</span></div>
                <div className="vp-disk-bars" aria-label="目录占用：logs 82 GB，models 12 GB，cache 4 GB">
                  {[["logs", 82], ["models", 12], ["cache", 4]].map(([name, size]) => <div key={name}><code>{name}</code><span><i style={{ width: `${size}%` }} /></span><b>{size} GB</b></div>)}
                </div>
              </div>
              <div className="vp-disk-finding"><Check size={20} aria-hidden="true" /><p>定位到 <code>/data/logs</code> 占用最多，接下来可继续查看日志。</p></div>
            </figure>
            <p>这个“判断 → 执行 → 看结果 → 再判断”的过程，就是 <strong>Agent Loop（智能体循环）</strong>。任务完成、遇到权限限制或达到轮数上限时，循环停止。</p>
          </div></section>

          <section className="vp-chapter" id="boundary"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.boundary}</h2>
            <p>模型输出 <code>read_file("server.log")</code>，只是提出读取请求。真正拿到日志，还要经过这些步骤：</p>
            <ol className="vp-request-path" aria-label="工具请求的执行顺序">
              {[["检查请求", "找到工具，核对参数与权限"], ["执行工具", "打开 server.log，读取内容"], ["保存结果", "关联这次请求与返回值"], ["再问模型", "带上日志，判断下一步"]].map(([title, body], index) => <li key={title}><span className="vp-path-index">{index + 1}</span><h3>{title}</h3><p>{body}</p>{index < 3 && <ArrowRight className="vp-path-arrow" size={20} aria-hidden="true" />}</li>)}
            </ol>
            <p>检查不通过，就返回拒绝原因；工具执行失败，就返回错误。模型拿到结果后，才能决定是否继续。</p>
            <h3>上下文，就是模型这一次拿到的信息</h3>
            <div className="vp-context-shift">
              <div><h4>读取前</h4><ul><li>用户任务</li><li>工作规则</li><li>可用工具</li></ul></div>
              <ArrowRight size={24} aria-hidden="true" />
              <div><h4>读取后</h4><ul><li>原有信息</li><li className="is-new">本次读取请求</li><li className="is-new">日志：第一行缺少冒号</li></ul></div>
            </div>
            <p>Harness 把新结果放进下一次输入，模型才“看见”了日志。</p>
          </div></section>

          <section className="vp-chapter" id="tools"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.tools}</h2>
            <p><strong>Tool 负责一个具体操作，Harness 负责把这些操作组织起来。</strong>工具接收参数，执行工作，返回内容或错误。</p>
            <div className="vp-table-wrap"><table className="vp-teaching-table" aria-label="常见工具与能力"><thead><tr><th>工具</th><th>做什么</th><th>返回什么</th></tr></thead><tbody>
              {[["read_file(path)", "读取文件", "文件正文"], ["edit_file(…)", "修改内容", "补丁结果"], ["run_shell(command)", "执行命令", "输出与退出状态"], ["search_web(query)", "检索网页", "资料与来源"]].map(([name, action, result]) => <tr key={name}><td><code>{name}</code></td><td>{action}</td><td>{result}</td></tr>)}
            </tbody></table></div>
            <p>例如，文件工具返回“server.log 不存在”，这次操作就结束了。要不要查目录、换路径或询问用户，由模型根据这个结果决定，再交给 Harness 推进。</p>
          </div></section>

          <section className="vp-chapter" id="inside"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.inside}</h2>
            <p>它们是六种职责，可以写在同一个程序里，也可以分成多个模块。</p>
            <dl className="vp-responsibilities">
              {[["Model · 模型", "判断下一步", "根据日志，决定查看 app.py"], ["Instructions · 指令", "规定工作要求", "先检查，修改后必须测试"], ["Tools · 工具", "执行具体操作", "读日志、写补丁、运行检查"], ["Context · 上下文", "提供本次信息", "任务、规则、源码与工具结果"], ["Agent Loop · 循环", "继续或停止", "测试失败，带着错误再问模型"], ["Runtime / State · 运行与状态", "保留任务进度", "改了什么，授权了什么，走到哪一步"]].map(([name, role, example]) => <div key={name}><dt>{name}</dt><dd><strong>{role}</strong><p>{example}</p></dd></div>)}
            </dl>
            <p><strong>指令是要求，权限检查是执行时的限制。</strong>同样，Context 是这次给模型看的信息，State 是程序保存的运行状态；两者不必完全相同。</p>
          </div></section>

          <section className="vp-chapter" id="service"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.service}</h2>
            <p>演示项目的 <code>app.py</code> 少了一个冒号，服务无法启动。观察模型怎样读日志、查源码、修改，再通过 <code>/health</code> 检查结果。</p>
          </div></section>
          <HarnessV4Lesson />

          <section className="vp-chapter" id="quality"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.quality}</h2>
            <p>同一个模型、同一个补丁，是否继续验证，会产生不同结果：</p>
            <figure className="vp-verification-paths" aria-label="不验证与持续验证的执行路径对比">
              <div><h3>修改后就结束</h3><div className="vp-verification-track"><span>写入补丁</span><ArrowRight size={20} aria-hidden="true" /><span>报告完成</span></div><p>文件改了，服务是否恢复仍未知。</p></div>
              <div><h3>验证后再结束</h3><div className="vp-verification-track"><span>写入补丁</span><ArrowRight size={20} aria-hidden="true" /><span>运行检查</span><ArrowRight size={20} aria-hidden="true" /><strong>通过后完成</strong></div><div className="vp-verification-retry"><ArrowsClockwise size={20} aria-hidden="true" /><span>失败：错误交回模型，继续修正</span></div></div>
            </figure>
            <p>Harness 决定结果是否被记录、检查是否执行、失败后能否接着做。能力要看任务实际完成得怎样。</p>
          </div></section>

          <section className="vp-chapter" id="compare"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.compare}</h2>
            <div className="vp-table-wrap"><table className="vp-teaching-table" aria-label="Model、Harness、Tool 和 Agent 的分工"><thead><tr><th>概念</th><th>修服务时的职责</th></tr></thead><tbody>
              <tr><td>Model / 模型</td><td>判断先查哪里、怎样修改。</td></tr>
              <tr><td>Harness / 运行系统</td><td>调度请求、检查权限、保存结果、继续循环。</td></tr>
              <tr><td>Tool / 工具</td><td>实际读取日志、写补丁、运行测试。</td></tr>
              <tr><td>Agent / 智能体</td><td>把这些部分组合起来，完成“修好服务”。</td></tr>
            </tbody></table></div>
            <h3>MCP 和 Skill 放在哪里？</h3>
            <p><strong>MCP</strong> 约定应用怎样连接工具与数据；<strong>Skill</strong> 提供某类任务的说明和资源。它们都可以被 Harness 使用，帮助整个 Agent 工作。</p>
          </div></section>

          <section className="vp-chapter" id="code"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.code}</h2>
            <details className="vp-code-details"><summary><span>展开最小循环</span><Plus size={16} aria-hidden="true" /></summary><div className="vp-code-panel"><pre><code>{`context = [工作规则, 用户任务, 工具说明]

for step in range(最大轮数):
    reply = 调用模型(context)
    context.append(reply)

    if reply.是最终回答:
        核对证据并报告当前结果(reply, context)
        break

    if not reply.有工具请求:
        报告无法继续并保存状态()
        break

    for call in reply.工具请求:
        if not 参数合法且已获授权(call):
            result = 说明拒绝原因(call)
        else:
            result = 带超时和异常处理地执行工具(call)
        context.append(关联请求与结果(call, result))
else:
    报告达到轮数上限并保存状态()`}</code></pre></div></details>
          </div></section>

          <section className="vp-chapter" id="roadmap"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.roadmap}</h2>
            <p>先走通模型调用、工具调用和循环，再按需要补上上下文、记忆与权限。沿着星星，继续读下一篇。</p>
            <HarnessLearningMap />
          </div></section>

          <section className="vp-chapter" id="related"><div className="vp-chapter-content">
            <h2>{harnessSectionTitles.related}</h2>
            <details className="vp-reference" id="references"><summary><span>查看原始资料</span><Plus size={16} aria-hidden="true" /></summary><ol className="vp-reference-list">{sources.map(([id, title, url]) => <li id={id} key={id}><a href={url} rel="noopener noreferrer" target="_blank">{title}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}</ol></details>
          </div></section>
        </div>
      </div>
    </main>
  );
}
