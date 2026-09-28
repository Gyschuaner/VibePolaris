import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { McpHero, McpLab } from "./McpLab";
import { mcpSources } from "@/lib/extended-concept-sources";
import styles from "./Mcp.module.css";

const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={mcpSources} />;

export function McpTermPage() {
  return <ConceptArticle slug="mcp" title="MCP" subtitle="模型上下文协议" hero={<McpHero />} sources={mcpSources}
    sections={[["connect", "先查一次借阅指南"], ["reuse", "换个应用，沿用同一套约定"], ["roles", "设置里的几个名字"], ["primitives", "除了工具，还能提供什么"], ["boundary", "接入以后，哪些事仍要判断"]]}
    intro={<>你在 AI 应用里看到的“添加 MCP 服务器”，通常用来接入一个提供外部资料或功能的程序。<strong>MCP 约定了应用和这个程序怎样互相介绍能力、提出请求、返回结果。</strong>双方遵守同一套约定，就能复用这部分接入方式。</>}
    relatedIntro={<>想继续看模型怎样提出操作请求，可以读<ConceptTerm slug="tools">工具调用</ConceptTerm>；取回的资料怎样用于回答，可以读<ConceptTerm slug="context">上下文</ConceptTerm>。MCP 讲的是这些能力怎样接入应用。</>}>
    <ArticleSection id="connect" title="先查一次借阅指南">
      <span id="mcp-definition" /><span id="mcp-question" />
      <p>假设你想问：“青禾图书馆的书能借多久？”规则写在图书馆的借阅指南里，但你没有把指南发给 AI。只凭这句话，模型可能知道图书馆通常怎样借书，却没有依据确定这家馆的具体规定。</p>
      <p>你可以自己找到指南，复制给 AI。也可以让应用接入一个能查询指南的程序：应用把查询交给它，它去资料里找，再把找到的内容送回来。本页用一座虚构图书馆说明后一种做法。</p>
      <p>在这条路上，双方得先知道怎样配合。应用怎么问“你能做什么”？服务怎么说明“我能搜索，但你需要给我关键词”？查询结果回来时，应用又怎么辨认这是哪次请求的回复？<strong>MCP 就是双方对这些消息的共同约定。</strong><span id="mcp-standard" className="vp-citation-target">它是一份公开的协议，开发者可以据此编写互相配合的应用和服务。<Cite id="mcp-standard" /></span></p>

      <div className={styles.walkthrough}>
        <div><span>01</span><h3>先拿到能力说明</h3><p>接入图书馆资料服务后，应用询问它有哪些工具。服务回答：有一个“搜索指南”工具，用来查借阅规则，需要一个文字关键词。此时拿到的是使用说明，还没有查到借期。</p></div>
        <div><span>02</span><h3>再提出具体查询</h3><p>应用把工具说明提供给模型。模型根据你的问题选择“搜索指南”，填入“借书期限”；应用把这次请求交给服务。服务实际搜索指南，找到“普通图书借期 30 天”。</p></div>
        <div><span>03</span><h3>把查到的内容带回回答</h3><p>服务按约定返回结果，应用将它交给模型，模型才有依据回答“这家馆普通图书可借 30 天”。服务返回错误时，应用需要处理这次失败，不能当成已经查到了规则。</p></div>
      </div>
      <p id="mcp-discovery" className="vp-citation-target">上面的“查清单”和“执行查询”是两件事。MCP 为它们分别规定了消息格式；工具的名称、用途、要填写什么，由服务提供。<strong>协议规定怎样描述一个工具，并不替图书馆编写搜索功能。</strong><Cite id="mcp-discovery" /></p>
      <p>下面可以播放一次完整查询，也可以逐步推进。先用聊天助手查询，再切换到写作助手，观察同一份工具说明怎样交给另一个应用。两个演示应用都支持 MCP，并已具备查看这份指南的权限；所有数据都在本页模拟，不会连接真实账号或修改借阅记录。</p>
      <span id="mcp-scene-heading" /><McpLab />
      <p>写作助手是另一个应用，需要建立自己的连接。切换后播放过程，可以看到它重新询问工具清单。右侧的资料服务没有换，也无需为写作助手另写一份工具说明：连接后，写作助手能读懂同一份说明，用同样的方式提出查询。这里复用的是应用与服务的通信约定。最后把结果写成一句答复、借书提醒，还是一段介绍，由各个应用和当前任务决定。</p>
    </ArticleSection>

    <ArticleSection id="reuse" title="换个应用，沿用同一套约定">
      <p>没有 MCP，开发者也能让聊天助手直接查询图书馆。例如，图书馆已经提供了 <ConceptTerm slug="api">API</ConceptTerm>：一个供其他程序使用的入口，说明请求该发到哪里、关键词怎样填写、返回内容长什么样。开发者照着这份说明编写接入代码，把模型想查的内容转换成图书馆能接受的请求，再把结果整理给模型。</p>
      <p>困难往往出现在要连接更多应用和服务时。写作助手也想查图书馆，聊天助手又想查另一个资料库，它们可能各有自己的工具接入方式。每一处都要有人处理“怎样介绍功能、怎样调用、怎样接收结果”。已有代码和工具包可以复用，但双方缺少共同约定的部分仍需适配。</p>
      <div className={styles.comparison}>
        <div><span>专门接入</span><h3>按这个应用的办法对接</h3><p>开发者按聊天助手要求的格式登记“搜索指南”的名称和输入，把调用转成图书馆的查询请求。换个要求不同的应用，这些对应关系还要重新处理。</p></div>
        <div><span>通过 MCP 接入</span><h3>双方按公开约定配合</h3><p>图书馆资料服务提供 MCP 工具说明；兼容的应用按同一种方式取得说明、提交请求和接收结果。</p></div>
      </div>
      <p id="mcp-reuse" className="vp-citation-target">MCP 最初希望减少这类重复工作：接入不同数据源时，开发者常常要分别编写连接代码。应用实现对协议的支持，服务也按协议提供能力，就有机会让同一服务供多个应用使用，而不必为每个组合重新定义通信方式。<Cite id="mcp-reuse" /></p>
      <p>省下的是这部分重复适配，实际搜索仍要有人实现。如果图书馆已有 API，MCP 服务可以在收到请求后继续调用它；也可以直接读取本地资料。<strong>MCP 与现有 API 可以一起使用。</strong>把普通网页地址填进 MCP 设置里，则不会让那个网页自动变成 MCP 服务。</p>
      <p>这里也有条件：应用和服务要支持彼此兼容的协议版本、连接方式，以及你需要的功能。服务只提供“搜索指南”时，换一个更强的模型，也不会凭空多出“替我续借”。</p>
    </ArticleSection>

    <ArticleSection id="roles" title="设置里的几个名字">
      <p>MCP 的英文全称是 Model Context Protocol，通常译为“模型上下文协议”。看懂刚才的查询，再看配置里的英文会容易一些。</p>
      <p id="mcp-roles" className="vp-citation-target">你正在使用的 AI 应用叫 <strong>Host（宿主）</strong>，它安排界面、模型和外部能力怎样配合。应用内部负责与某个服务通信的部分叫 <strong>MCP Client（客户端）</strong>。提供“搜索指南”能力的程序叫 <strong>MCP Server（服务端，常译为服务器）</strong>。<Cite id="mcp-roles" /></p>
      <div className={styles.roles} aria-label="MCP 客户端在 AI 应用内，MCP 服务在应用外，资料由服务读取">
        <div className={styles.hostBox}><strong>AI 应用 · Host</strong><p>界面与任务安排</p><span>与模型交互</span><b>MCP Client</b></div>
        <div className={styles.roleArrow}><span>请求 →</span><span>← 结果</span></div>
        <div className={styles.external}><strong>MCP Server</strong><p>提供“搜索指南”</p><div className={styles.dataSource}>↓ 读取<br />图书馆借阅指南</div></div>
      </div>
      <p>这里的“服务器”首先是在说一个程序承担的职责，不是说你必须买一台新电脑。它可以运行在你的电脑上，也可以由别人放在远处运行。图中的借阅指南是资料，MCP 服务是负责查资料的程序；二者不要混为一谈。</p>
      <p id="mcp-transport" className="vp-citation-target">添加本机服务时，应用可能让你填写“启动命令”：运行哪个程序、附带哪些参数。这些内容通常由服务提供方给出；应用按配置启动程序后，在本机与它传递消息，配置里常见的 <code>stdio</code> 指的就是这种通信方式。远程服务通常需要一个专门接收 MCP 请求的地址，通过 <code>HTTP</code> 传递消息。填写哪一类，要看服务提供方给出的接入说明，以及应用支持的连接方式。<Cite id="mcp-transport" /></p>
      <p>因此，“添加一个 MCP”通常是“在这个应用里配置一个 MCP 服务”的省略说法。使用现成服务时，你主要是选择服务、填写所需配置并完成必要的登录或授权。开发者才需要把服务的具体功能实现出来，让它能按协议响应。</p>
      <ArticleAside title="为什么技术文档里会出现 tools/list 和 tools/call？">
        <p id="mcp-messages" className="vp-citation-target"><code>tools/list</code> 是询问工具清单的消息名；<code>tools/call</code> 是请求调用某个工具的消息名。清单里的 <code>name</code> 标识工具，<code>description</code> 描述用途，<code>inputSchema</code> 说明输入要求。本例里，“搜索指南”需要一个文字关键词。<Cite id="mcp-messages" /></p>
        <p>这些名字方便开发者让程序自动处理消息。你通常只会看到应用整理后的工具卡片或操作记录，不需要手写这些消息，也不能从按钮的样子判断底层一定用了 MCP。</p>
      </ArticleAside>
    </ArticleSection>

    <ArticleSection id="primitives" title="除了工具，还能提供什么">
      <span id="mcp-prompt-heading" />
      <p>前面的“搜索指南”属于工具。MCP 还约定了另外两类常见内容，让服务能直接提供资料和可复用的提示模板。继续用图书馆这个例子看，三者的区别在于你取得了什么。</p>
      <dl className={styles.primitives}>
        <div id="mcp-tools" className="vp-citation-target"><dt>工具 <span>Tools</span></dt><dd>“搜索指南”是一个可执行的操作。给它“借书期限”这个关键词，服务就运行一次搜索，返回相关段落。工具也可以执行修改，例如续借，但前提是服务实现并开放了相应功能。<Cite id="mcp-tools" /></dd></div>
        <div id="mcp-resources" className="vp-citation-target"><dt>资源 <span>Resources</span></dt><dd>服务可以把“借阅指南全文”作为一份可读取的资料，提供它的标识和内容。应用决定什么时候读取、把哪些部分交给模型：有的让你从列表里选，有的根据当前任务或模型的选择自动取用，MCP 不统一规定这种交互。资料列在服务里，还不代表它已经进入这次回答的<ConceptTerm slug="context">上下文</ConceptTerm>，也就是模型这次实际收到的信息。<Cite id="mcp-resources" /></dd></div>
        <div id="mcp-prompts" className="vp-citation-target"><dt>提示模板 <span>Prompts</span></dt><dd>服务还可以提供“生成借书提醒”的任务模板，让用户选用后填入书名、到期日等信息。它本身没有替你查询借期，也没有发送提醒。<Cite id="mcp-prompts" /></dd></div>
      </dl>
      <p id="mcp-primitives" className="vp-citation-target">同一份指南既可能被搜索工具查到，也可能作为资源直接读取，这是两种提供资料的方式。服务不必同时实现工具、资源和提示模板；应用也可能只支持其中一部分。不要因为设置里只显示了工具，就认定 MCP 只能调用工具。<Cite id="mcp-primitives" /></p>
    </ArticleSection>

    <ArticleSection id="boundary" title="接入以后，哪些事仍要判断">
      <span id="mcp-quiz-heading" />
      <p id="mcp-boundary" className="vp-citation-target"><ConceptTerm slug="tools">工具调用</ConceptTerm>讲的是模型提出操作请求、程序执行、结果返回这个过程；MCP 则给应用和外部服务之间的消息提供共同约定。有些应用直接调用自己内置的工具，有些通过现有 API 对接，也有些通过 MCP 接入。看到“AI 查了资料”，还需要查看具体接入方式，才能知道这里有没有使用 MCP。<Cite id="mcp-boundary" /></p>
      <p id="mcp-control" className="vp-citation-target">连接成功也不代表可以任意操作。你需要知道服务由谁提供、会接收什么数据、账户允许它做什么；应用和服务也要检查权限，决定哪些请求可以执行。协议相同，只说明双方有共同的通信规则，不能据此判断对方可信。涉及续借、删除或发送消息等操作时，还要按应用和服务的权限规则处理。<Cite id="mcp-control" /></p>
      <p>假如查询后断开连接，已经取得的“30 天”仍可能留在聊天记录里。那是上次取得的内容，不是刚刚重新核对的结果。类似地，如果某个工具已经完成续借，之后断开 MCP 连接也不会自动撤销续借；需要另一个实际操作才能改变已经保存的记录。</p>
      <ArticleAside title="已经显示“已连接”，为什么还是查不到？">
        <p>先看应用是否发现了“搜索指南”工具。如果没有，可能是服务没有提供、应用没有启用，或双方不支持需要的功能。如果能看到工具，再看这次操作返回了什么：输入不符合要求、资料不存在、账户权限不足、服务暂时不可用，都可能让查询失败。</p>
        <p>这些信息比反复要求模型“再聪明一点”更有用。若服务根本不提供“续借”，修改问法也不会补上这项功能；你可以换用提供它的服务，或回到图书馆原有的操作入口。</p>
      </ArticleAside>
      <p>再换个场景：一个 AI 应用能通过 MCP 读取待办清单，却不能勾选完成。你现在可以先看服务有没有提供“修改待办”的工具，以及账户是否获准使用它。共同协议让能力更容易接进来，具体能读什么、改什么，仍取决于接入的服务和授权。</p>
    </ArticleSection>
  </ConceptArticle>;
}
