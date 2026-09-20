import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "@phosphor-icons/react/dist/ssr";

import type { BespokeTermPageProps } from "./BespokeTermScaffold";
import { HarnessV4Lesson } from "./HarnessV4Lesson";
import { HarnessV4Toc } from "./HarnessV4Toc";

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

function Ref({ id }: { id: string }) {
  return <a className="vp-source-inline" href={`#${id}`} aria-label={`参考资料 ${id.replace("ref-", "")}`}>[{id.replace("ref-", "")}]</a>;
}

export function AgentHarnessTermPage({ related }: BespokeTermPageProps) {
  const contextHref = `/terms/${related.find((item) => item.slug === "context")?.slug ?? "context"}`;
  return (
    <main className="vp-concept" id="main-content">
      <div className="vp-page-layout">
        <HarnessV4Toc />
        <div className="vp-reading-content">
          <div className="vp-meta"><nav aria-label="面包屑" className="vp-crumb"><Link href="/terms"><ArrowLeft size={14} aria-hidden="true" />术语</Link><em>/</em><Link href="/terms?cat=AI%C2%B7Agent">AI · Agent</Link><em>/</em><span>Harness</span></nav></div>
          <header className="vp-hero">
            <div className="vp-hero-top"><span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" /><h1>Harness <span>让模型真正动手的运行系统</span></h1></div>
            <p className="vp-hero-lead"><strong>模型负责“想”，Harness 负责让模型“真正干活”。</strong></p>
            <p className="vp-hero-intro">一个模型会告诉你怎么修服务，但它怎么打开日志、修改文件，再根据测试结果接着做？这篇从一次普通问答开始，把中间的过程一层层拆开。先不用懂 MCP、Skills 或 Memory。</p>
          </header>

      <section className="vp-chapter" id="why"><div className="vp-chapter-content"><h2>1. 先看只有模型时，会发生什么</h2>
        <p>假设你现在只有一个大语言模型，比如 Qwen、DeepSeek、GPT 或 Claude。这里说的是模型本身，还没有给它接上文件工具、浏览器或命令行。</p><p>你给它一句话：</p><blockquote className="vp-dialogue">帮我看看这个项目为什么运行失败。</blockquote><p>这次调用的过程很简单：</p>
        <figure className="vp-teach-figure"><div className="vp-simple-flow"><div><b>输入</b><small>你的问题</small></div><span className="vp-flow-arrow" aria-hidden="true">→</span><div><b>模型</b><small>根据输入生成内容</small></div><span className="vp-flow-arrow" aria-hidden="true">→</span><div><b>输出</b><small>一段回答</small></div></div><figcaption>这是一次普通模型调用，还没有发生文件读取或命令执行。</figcaption></figure>
        <p>模型可能回答：“可能是端口冲突，你可以运行 <code>lsof -i :8000</code> 看一下。”你暂时不用记住这个命令，它的意思是检查 8000 这个端口有没有被其他程序占用。</p><p><strong>它只是告诉你怎么做。</strong>它没有打开项目，没有查看日志，也没有执行这条命令。更没有替你修改代码、重启服务或检查修复结果。后面的操作，还得你自己完成。</p><p>就算它把排错步骤写得很完整，写出来的仍然是步骤。把“第一步：打开日志”显示在屏幕上，和服务器上的日志真的被打开，是两件事。</p><p>所以，先把模型理解为“大脑”：它根据拿到的信息判断、提出建议。但要让建议变成操作，还需要连接外部程序。<Ref id="ref-3" /></p><p className="vp-note">这里把“想”用作通俗比喻，指模型根据输入生成下一步选择。多模态模型还可以接收图片等信息；这不改变“生成请求”和“执行操作”的区别。</p>
      </div></section>

      <section className="vp-chapter" id="need"><div className="vp-chapter-content"><h2>2. 谁让模型真的动手？</h2>
        <p>现在，你不想再照着建议一步步操作了。你希望说完“帮我修好这个服务”，它就能自己推进：先看项目目录和说明，找到相关代码与日志，定位错误，修改文件，重新启动，再运行测试。</p><p>测试没通过，就把新错误找出来继续修；测试通过，再告诉你改了什么、验证了什么。这是我们希望整个智能体完成的工作。</p><p>那谁来负责让这些事情接起来？模型输出了“读取日志”，谁接住它？日志读完后，谁把内容交回去？谁再调用一次模型，让它决定下一步？</p><p><strong>需要一个围绕模型运行的程序。</strong>它接收用户任务，调用模型，处理模型提出的工具请求，再带着结果调用下一轮。我们在这里把这套运行程序叫作 <strong>Agent Harness</strong>。<Ref id="ref-2" /></p>
        <figure className="vp-teach-figure"><div className="vp-agent-outline"><span className="vp-frame-title">Agent · 整个智能体</span><div className="vp-system-model"><b>Model / 模型</b><span>看当前信息，提出下一步</span></div><div className="vp-double-link"><span>↓ 工具请求</span><span>↑ 执行结果</span></div><div className="vp-system-harness"><b>Harness / 运行程序</b><p>调用模型 · 检查请求 · 调用工具<br />保存结果 · 管理状态 · 继续或停止</p></div><div className="vp-system-stem" aria-hidden="true">↕</div><div className="vp-system-tools"><div><b>文件工具</b><span>读写文件</span></div><div><b>命令行工具</b><span>执行命令</span></div><div><b>浏览器工具</b><span>操作网页</span></div></div></div><figcaption>模型、Harness 和工具的分工。Harness 可以由多个模块组成，不一定是一个单独进程。</figcaption></figure>
        <p>读图时可以从中间看：Harness 向上调用模型，向下调用工具。模型决定“接下来查日志”，文件工具负责把日志读出来，Harness 负责让请求和返回值在两边正确流转。</p><p>这个程序并不需要从一开始就很庞大。最简单的版本，就是一段反复执行“调用模型 → 处理工具请求 → 收集结果”的代码。任务变复杂以后，再逐步加上权限检查、超时、状态保存和错误处理。</p><p>还有一个容易误会的地方：<strong>Harness 负责运行循环，不等于把每一步业务决策都写死。</strong>它可以规定“不能越过授权目录”“最多运行多少轮”，而“先查哪个文件、测试失败后改哪里”仍然可以由模型根据结果决定。</p>
      </div></section>

      <section className="vp-chapter" id="name"><div className="vp-chapter-content"><h2>3. 为什么叫 Harness？</h2><p>英文 <em>harness</em> 的含义包括马具、系带一类连接或约束装置。<Ref id="ref-8" /> 可以借用马具来建立直觉：马提供动力，马具把这种动力连接到车上，让它能够完成具体的运输工作。</p><p>对应到这里，模型有理解和生成内容的能力；Harness 把这种能力接到工具和环境上，并规定哪些操作可以执行、结果怎样收回来、遇到问题怎样停下。</p><p>这个比喻只用来理解“连接与约束”。它不是说模型不知道目标，也不是说 Harness 会替模型做所有决定。实际系统里，一部分决定来自模型，一部分边界由程序执行。</p><p>先用一个便于入门的关系记住它：</p><div className="vp-inline-equation">Agent ≈ Model + Harness</div><p>左边是能围绕任务行动的整个智能体；右边是模型，以及让它运行起来的程序。工具、环境和配置也参与其中，所以这不是严格公式。各项目对 Harness 的范围也会有不同划分。<Ref id="ref-1" /></p><p className="vp-note">本文讲的是 Agent Harness。另一些文档中的 evaluation harness 指评测运行框架；看到同一个词，要先看它所在的语境。</p></div></section>

      <section className="vp-chapter" id="practice"><div className="vp-chapter-content"><h2>4. 用“磁盘为什么满了”走一遍</h2><p>先看一个不用改代码的例子。你问：</p><blockquote className="vp-dialogue">我的服务器磁盘为什么满了？</blockquote><p>只有模型时，它可能回答：“你可以运行 <code>df -h</code> 看一下。”这条命令用来查看各个文件系统的空间使用情况。<Ref id="ref-9" />模型给出命令之后，就等着你去执行、把结果贴回来。</p><p>加入 Harness 后，用户不用再手动搬运每一次结果。下面是一段假设的排查过程，命令输出是教学数据。</p>
        <div className="vp-walkthrough"><div className="vp-walk-step"><span className="vp-walk-index">1</span><div><h3>先把问题交给模型</h3><p>Harness 准备本次输入：你的问题，以及它允许模型使用的工具说明。模型因此知道，可以请求命令行工具查看磁盘情况。</p></div></div><div className="vp-walk-step"><span className="vp-walk-index">2</span><div><h3>模型提出第一条命令</h3><p>模型请求运行 <code>df -h</code>。此时服务器还没有执行命令，只是模型把“想做的事”交给了 Harness。</p></div></div><div className="vp-walk-step"><span className="vp-walk-index">3</span><div><h3>Harness 检查请求，工具开始执行</h3><p>Harness 检查命令是否在允许范围内，检查通过后调用命令行工具。真正查看磁盘空间的是这个工具，不是模型。</p><figure className="vp-terminal"><figcaption>第一次工具执行 <span>教学输出</span></figcaption><pre><code>$ df -h{"\n"}Filesystem  Size  Used  Avail  Use%  Mounted on{"\n"}/dev/sdb1   100G   99G     1G   99%  /data</code></pre></figure><p>你不用逐列分析，只看最后两项：挂载在 <code>/data</code> 的文件系统，已经用了 99%。</p></div></div><div className="vp-walk-step"><span className="vp-walk-index">4</span><div><h3>把结果交回模型</h3><p>Harness 收到上面的输出，把它加入下一次模型调用的输入。模型这时才拿到了“满的是 /data”这条新信息。</p><p>这一步很容易漏掉：<strong>工具已经拿到结果，不代表模型已经看到了结果。</strong>外部程序还需要把结果传进去。</p></div></div><div className="vp-walk-step"><span className="vp-walk-index">5</span><div><h3>模型根据结果决定继续查哪里</h3><p>模型看到 <code>/data</code> 满了，于是请求 <code>du -sh /data/*</code>，检查这里各个可见项目的占用。<Ref id="ref-10" />这不是提前写死的第二步；如果满的是另一个挂载点，检查位置也应改变。</p></div></div><div className="vp-walk-step"><span className="vp-walk-index">6</span><div><h3>Harness 再调用工具，再收集结果</h3><figure className="vp-terminal"><figcaption>第二次工具执行 <span>教学输出</span></figcaption><pre><code>$ du -sh /data/*{"\n"}82G  /data/logs{"\n"}12G  /data/models{"\n"}4G   /data/cache</code></pre></figure><p>返回值显示，列出的项目中 <code>/data/logs</code> 占得最多。Harness 又把这份结果交回模型，模型可以继续要求查看日志目录，或者先报告目前定位到的情况。</p></div></div></div>
        <p>整个过程和普通问答的区别，现在就能看出来了：</p><figure className="vp-teach-figure"><div className="vp-sequence-line"><span>普通问答</span><code>用户 → 模型 → 回答</code></div><div className="vp-sequence-line"><span>带工具的循环</span><code>用户 → 模型 → 工具请求 → 工具结果 → 模型 → 下一步…</code></div><figcaption>后一行省略了中间的 Harness；请求的调度、结果的传递和下一轮调用，都由它来组织。</figcaption></figure><p>这种“判断下一步 → 执行 → 看结果 → 再判断”的反复过程，就是 <strong>Agent Loop（智能体循环）</strong>。在一些材料里，请求执行的动作叫 <em>Action</em>，拿回的结果叫 <em>Observation</em>。<Ref id="ref-1" /></p><p>Loop 不是把同一条命令不断重跑，而是让新结果影响下一步。它也不该无限运行：任务完成、需要你确认、工具被拒绝、耗时或轮数达到上限，都可能使它停止。</p><p className="vp-note">这里仅作排查，没有删除文件。<code>df</code> 和 <code>du</code> 的统计口径不同；发现大目录后，仍需确认里面是什么、能否清理，不能直接删。</p></div></section>

      <section className="vp-chapter" id="boundary"><div className="vp-chapter-content"><h2>5. 一句“我要读日志”，中间到底发生了什么？</h2><p>回到修服务的例子。模型准备查看 <code>server.log</code>，可能输出一条结构化请求。结构化的意思是：把工具名称和参数按约定的格式写出来，让程序容易识别。</p><figure className="vp-terminal"><figcaption>模型输出的工具请求 <span>简化示意，不是某个 API 的固定格式</span></figcaption><pre><code>{`{
  "tool": "read_file",
  "arguments": {
    "path": "server.log"
  }
}`}</code></pre></figure><p><code>read_file</code> 表示“读文件”，<code>path</code> 表示文件路径。整段请求只是在说：“请调用读文件工具，读取 server.log。”它不是日志本身，也不是一段会自己执行的代码。<Ref id="ref-3" /></p><p>Harness 收到这条请求后，接着做下面这些事：</p><ol className="vp-explained-list"><li><strong>找到工具。</strong>已注册的工具里有没有 <code>read_file</code>？没有，就返回“工具不存在”。</li><li><strong>检查参数。</strong><code>path</code> 有没有传入？格式是否正确？</li><li><strong>检查权限和边界。</strong>这个文件是否处于允许访问的目录？有权限才继续。</li><li><strong>调用读文件工具。</strong>文件工具打开文件，尝试读取内容。</li><li><strong>接收返回值。</strong>成功时拿到日志文本；失败时拿到“文件不存在”或“权限不足”等错误。</li><li><strong>记录结果。</strong>把结果和对应请求关联起来，放进后续模型调用会使用的上下文。</li><li><strong>再次调用模型。</strong>这次模型看到日志，才有信息判断下一步。</li></ol><p>可以把这一来一回读成一句对话：模型说“我要读日志”；Harness 检查后让工具去读；工具把日志送回；Harness 再带着日志问模型“接下来呢？”</p><p>这里有两个时间点：<strong>请求已经生成</strong>，以及<strong>操作已经执行</strong>。两者之间可能还有参数检查、人工授权、排队或拒绝。</p><h3>上下文为什么也在这里出现？</h3><p>Context（上下文）先理解成“模型这一次收到的信息”。第一次调用时，日志还没读；读取结束后，下一次输入才会多出它。</p><div className="vp-context-comparison"><div><h4>读取之前，这次模型能看到</h4><p>用户任务：修好服务。<br />工作规则：允许读日志，修改需授权。<br />工具说明：read_file 可以读取指定文件。</p></div><div><h4>读取之后，下一次还会带上</h4><p>刚才的读取请求。<br />工具返回的日志内容。<br />例如：app.py 第一行缺少冒号。</p></div></div><p>不是模型凭空“记起”了服务器里的文件，而是程序把新信息放进了输入。文件存在于磁盘上、内容保存在运行记录里、内容进入本次模型输入，是三种不同状态。<Ref id="ref-7" /></p></div></section>

      <section className="vp-chapter" id="tools"><div className="vp-chapter-content"><h2>6. Tool 是什么？它和 Harness 怎么分？</h2><p>Tool 就是系统提供给模型请求使用的具体能力。它通常由一段程序或一个外部服务实现，接收参数，完成操作，再返回结果。</p><p>先不用把它想得很特殊。一个能读文件的函数，包装成模型能够请求调用的接口后，就能作为文件工具。</p><div className="vp-table-wrap"><table className="vp-teaching-table"><caption>几种常见的工具能力，名称仅作示例</caption><thead><tr><th>工具</th><th>做什么</th><th>可能返回什么</th></tr></thead><tbody>{[["read_file(path)","读取指定文件","文件正文，或读取错误"],["edit_file(…)","修改指定内容","补丁应用结果，或修改失败"],["run_shell(command)","执行命令","输出文本、退出状态或超时"],["search_web(query)","检索网页","搜索结果、来源信息"],["query_database(…)","查询数据库","记录，或查询错误"],["take_screenshot()","获取屏幕图像","截图或图像引用"]].map(([name, action, result]) => <tr key={name}><td><code>{name}</code></td><td>{action}</td><td>{result}</td></tr>)}</tbody></table></div><p>为什么不直接把 Tool 叫 Harness？因为工具只负责一个具体操作。<code>read_file</code> 负责把日志读出来，却不负责决定要不要查日志，也不负责拿着日志再调用模型。</p><p>这些调用之间的组织工作属于 Harness。一个 Harness 可以接很多工具；同一个工具也可以被不同的 Harness 使用。<Ref id="ref-3" /></p><p>例如文件工具返回“server.log 不存在”，它的工作已经结束了。要不要查目录、改路径、询问用户，是下一轮要处理的事。</p><p className="vp-note">工具名、用途和参数要求需要告诉模型；仅仅在电脑上安装一个程序，模型不会自动知道怎么请求它。</p></div></section>

      <section className="vp-chapter" id="inside"><div className="vp-chapter-content"><h2>7. 先认清这六样东西</h2><p>把前面的过程放在一起，一个最小 Agent 系统里会遇到下面这些概念。它们不是要求你安装的六个软件，而是不同的职责。<strong>模型是 Harness 调用的对象，不是说模型本身也是 Harness。</strong></p><div className="vp-table-wrap"><table className="vp-teaching-table"><caption>名称、直觉和在当前例子中的作用</caption><thead><tr><th>名称</th><th>先这样理解</th><th>修服务时对应什么</th></tr></thead><tbody>{[["Model", "根据现有信息选下一步", "看到语法错误后，决定读取 app.py"],["Instructions", "告诉模型任务和做事要求", "修改前先检查，完成后报告验证结果"],["Tools", "执行具体操作的能力", "读日志、改文件、启动并检查服务"],["Context", "这次模型收到的信息", "任务、规则、工具说明、已选入的日志和源码"],["Agent Loop", "反复调用模型、工具并传回结果", "测试失败后，把错误带入下一轮"],["Runtime / State", "运行任务，并记录走到了哪里", "修改已完成，测试等待中，写入是否获授权"]].map(([name, meaning, example]) => <tr key={name}><td>{name}<br /><small>{name === "Model" ? "模型" : name === "Instructions" ? "工作指令" : name === "Tools" ? "工具" : name === "Context" ? "上下文" : name === "Agent Loop" ? "执行循环" : "运行程序与状态"}</small></td><td>{meaning}</td><td>{example}</td></tr>)}</tbody></table></div><p>Harness 通常负责把这些部分组织起来。具体项目可以把上下文、工具处理和状态控制写在一起，也可以拆成独立模块。<Ref id="ref-2" /></p><h3>工作指令和权限检查，不是一回事</h3><p>指令里写“不要修改项目外的文件”，是在告诉模型应该遵守什么。权限检查则是在程序中拒绝越界操作。前者是要求，后者才是在执行时把关。</p><h3>Context 和 State，也不是一回事</h3><p>“模型本次看到了测试错误”是在说 Context；“这个任务已经运行 6 轮、还有一项待测试”是在说 State。程序可以保存很多状态，但未必每次都把它们完整发给模型。</p><p>任务变长后，可以再考虑 Memory、Sandbox、Retry、Timeout、Compaction、Tracing 和 Evaluation。Skills、任务计划、子代理也可以按需加入，它们不是“配齐了才算 Harness”的资格清单。<Ref id="ref-5" /></p></div></section>

      <section className="vp-chapter" id="service"><div className="vp-chapter-content"><h2>8. 现在，再让它修好一个服务</h2><p>前面已经拆清了分工。把它们接起来，看看“帮我修好这个服务”到底怎样推进。</p><p>这里的服务可以理解成一个接收请求、返回响应的程序。演示项目的 <code>app.py</code> 有一处语法错误：函数定义后少了一个冒号 <code>:</code>。你不用会写 Python，只要知道程序会把这件事记进错误日志。</p><p>它先读取 <code>server.log</code>，从报错定位到 <code>app.py</code>；再读源码，确认哪一行要改；修改完成后调用检查工具。检查工具会启动服务，并访问用于确认存活状态的 <code>/health</code> 接口。</p><p><strong>看动画时，先只盯住三件事：模型提出了什么，工具执行了没有，结果回到模型了吗。</strong>“上下文”页签展示准备给后续调用的信息，“轨迹”页签展示已经发生的记录。</p></div></section>
      <HarnessV4Lesson />

      <section className="vp-chapter" id="quality"><div className="vp-chapter-content"><h2>9. 同一个模型，为什么换一套 Harness 就可能不同？</h2><p>假设两个系统使用同一个模型，都拿到了“补上冒号”这个正确建议。它们后面的处理仍可能不同。</p><p>第一个系统执行了修改，就直接把“文件已更新”当成“问题已解决”。如果文件里还有第二个错误，它没有运行测试，也就没有把新错误送回模型的机会。</p><p>第二个系统要求修改后必须检查。工具返回新错误后，Harness 把它加入下一轮输入，让模型继续判断。这时，同一个模型有了第一套系统没有提供的新证据。</p><p>差别不是模型突然聪明了，而是有没有检查结果、有没有下一轮、失败有没有被记录。长任务还会遇到类似问题：上次改了哪些文件？任务中断后从哪里接上？测试到底执行过没有？<Ref id="ref-5" /></p><p>模块更多不自动等于效果更好；多余的循环和工具同样可能增加成本、延迟与出错机会。要根据真实任务结果比较。<Ref id="ref-1" /></p></div></section>

      <section className="vp-chapter" id="compare"><div className="vp-chapter-content"><h2>10. 最后分清 Model、Harness 和 Agent</h2><p>回到最初那三个词。现在不用背抽象定义，直接放回修服务的过程：</p><div className="vp-table-wrap"><table className="vp-teaching-table"><thead><tr><th>概念</th><th>在这个任务里做什么</th></tr></thead><tbody><tr><td>Model / 模型</td><td>看任务、日志和源码，提出“先查哪里”“怎样修改”的请求，也生成最后的说明。</td></tr><tr><td>Harness / 运行系统</td><td>调用模型，检查并分发工具请求，带回结果，保存状态，控制继续、等待或停止。</td></tr><tr><td>Tool / 工具</td><td>实际读取日志、写入补丁或启动测试，把执行结果返回给调用方。</td></tr><tr><td>Agent / 智能体</td><td>把模型和运行程序等组合起来，围绕“修好服务”推进任务的整个系统。</td></tr></tbody></table></div><p>所以，“我用的是哪个模型”和“我的 Agent 是怎么搭的”是两个不同问题。换模型是在换决策与生成能力；改 Harness 则可能是在改工具、输入组织、权限、状态或循环方式。</p><h3>那 MCP、Skill 放哪里？</h3><p>MCP 是连接外部工具与资源的一套通信约定。文件工具可以通过 MCP 接入，也可以直接写成本地函数。MCP 不替你规定整个 Agent 应该怎样循环、怎样规划任务。<Ref id="ref-4" /></p><p>Skill 可以理解成针对某类任务准备的说明和资源包。它给出做事方法，但不代替运行程序。<Ref id="ref-6" /></p><p>模型读了排错指南，仍需要 Harness 把工具请求变成操作，再把操作结果带回来。</p></div></section>

      <section className="vp-chapter" id="code"><div className="vp-chapter-content"><h2>再往里看：循环可以写成什么样？</h2><p>下面是教学伪代码，不要求现在就会写。沿着中文注释读，可以看到前面讲的分工落在程序的什么位置。</p><details className="vp-code-details"><summary><span>展开最小循环，逐行看职责</span><Plus size={16} aria-hidden="true" /></summary><div className="vp-code-panel"><pre><code>{`context = [工作规则, 用户任务, 工具说明]

for step in range(最大轮数):
    reply = 调用模型(context)       # 让模型选下一步
    context.append(reply)          # 记下回答或工具请求

    if reply.是最终回答:
        核对证据并报告当前结果(reply, context)
        break                      # 停止不一定代表任务成功

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
    报告达到轮数上限并保存状态()`}</code></pre></div></details><p>模型决定请求哪个工具；循环程序接住请求、执行检查、保存结果。轮数用完了，应当报告未完成或当前状态，而不是把“程序停了”写成“任务成功了。</p></div></section>

      <section className="vp-chapter" id="roadmap"><div className="vp-chapter-content"><h2>接下来怎么学</h2><p>下一篇可以从一次工具调用开始：告诉模型有哪些工具，接住它的请求，真正执行一个函数，再把结果传回来。然后把这段过程放进循环，就有了一个最小 Harness。</p><p>后面的知识按依赖关系继续展开：</p><ol className="vp-roadmap">{[["模型调用", "输入由什么组成，模型返回的是回答还是工具请求。"], ["Tool Calling", "一个函数如何变成模型可请求使用的工具。"], ["Agent Loop", "谁发起下一轮，怎样暂停，什么时候结束。"], ["Context", "日志、源码和历史记录怎样进入本次输入。"], ["Memory", "长期保存的信息，和本次上下文有什么区别。"], ["Prompt / Instructions", "给模型什么工作要求，哪些要求还需要程序检查。"], ["MCP", "应用怎样连接外部工具与资源。"], ["Skills", "某类任务的说明、资料和脚本怎样按需加载。"], ["Plan / Todo / State", "打算做什么、已经做了什么、还在等什么。"], ["Sandbox / Permissions", "操作在哪里运行，如何限制能访问的内容。"], ["Trace / Evaluation", "还原实际过程，并用任务结果检查系统效果。"], ["写一个最小 Harness", "把前面学到的模型、工具、循环和检查组合起来。"]].map(([title, body]) => <li key={title}><span>{title}</span><p>{body}</p></li>)}</ol><p><strong>模型是大脑；Harness 是围绕它运行的系统；Agent 是组合起来工作的整体。</strong></p></div></section>

      <section className="vp-chapter" id="check"><div className="vp-chapter-content"><details className="vp-selfcheck"><summary><h2>两道小题</h2><span>展开 <Plus size={14} /></span></summary><p>关于读取请求和测试结果。</p><div className="vp-quiz"><h3>模型返回 read_file(&quot;server.log&quot;)，此时发生了什么？</h3><p>答案：模型提出了读取请求。Harness 还需要检查并调用文件工具。</p><h3>补丁写入成功，但健康检查返回新错误，下一步怎么做？</h3><p>答案：把检查错误交给模型继续判断；写入成功不代表任务完成。</p></div></details></div></section>

      <section className="vp-chapter" id="related"><div className="vp-chapter-content"><h2>相关词条</h2><div className="vp-reading-links"><Link className="vp-related-link" href="/terms?q=工具调用"><span>工具调用</span><small>先看一个请求怎样变成执行</small><ArrowRight size={16} /></Link><Link className="vp-related-link" href="/terms?q=Agent+Loop"><span>Agent Loop</span><small>再把一次执行接成循环</small><ArrowRight size={16} /></Link><Link className="vp-related-link" href={contextHref}><span>Context / 上下文</span><small>看哪些信息进入了下一次调用</small><ArrowRight size={16} /></Link></div><details className="vp-reference" id="references"><summary><span>参考资料与说明</span><Plus size={15} /></summary><p className="vp-reference-note">概念边界参考以下文档；服务修复、磁盘输出和流程分解为教学示例，不是实际运行记录。</p><ol className="vp-reference-list">{sources.map(([id, title, url, note]) => <li id={id} key={id}><a href={url} rel="noopener noreferrer" target="_blank">[{id.replace("ref-", "")}] {title} <ArrowUpRight size={13} /></a><span>{note}</span></li>)}</ol></details></div></section>
        </div>
      </div>
    </main>
  );
}
