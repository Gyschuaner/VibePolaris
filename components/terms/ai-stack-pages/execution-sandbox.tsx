import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { executionSandboxSources } from "@/lib/ai-stack-concept-sources/execution-sandbox";
import { SandboxWorkbench } from "../ai-stack-lessons/sandbox-workbench";

export function ExecutionSandboxTermPage() {
  const sections: [string, string][] = [["sandbox-start", "把这张表交给脚本，需要交出多少权限？"], ["sandbox-files", "看得见哪些文件，能写到哪里"], ["sandbox-network", "网络和资源，要另外划边界"], ["sandbox-lifetime", "报告还在沙箱里，就不算取回来了"], ["sandbox-limits", "盒子的边界也需要维护"]];
  return <Article slug="execution-sandbox" title="执行沙箱" subtitle="Execution Sandbox · 给代码一块能做事、又有边界的临时环境" sources={executionSandboxSources} sections={sections} intro={<>你让 AI 帮忙汇总一张费用表，它写好了脚本。脚本需要读表和保存报告；项目密钥、其他人的文件和任意外网，并不在这个任务里。执行沙箱要把“可以做什么”落实到运行环境中。</>}>
    <ArticleSection id="sandbox-start" title="把这张表交给脚本，需要交出多少权限？">
      <p>把代码发给模型看，和让代码运行，是两回事。运行中的代码可以请求打开文件、连接网络、占用内存；只在提示词里写“别乱读文件”，不会让这些请求自动失效。</p>
      <p id="sandbox-definition" className="vp-citation-target"><strong>执行沙箱是在受限制的运行环境里执行代码，让它只接触任务允许的资源。</strong>隔离机制由环境来执行。以 Linux 容器为例，namespaces 把部分系统视图分开，cgroups 负责资源计量与限制；它们分别解决“能看见什么”和“能用多少”等不同问题。<Cite id="sandbox-definition" sources={executionSandboxSources} /></p>
      <p>下面只有两条费用：纸 12 元，笔 8 元。点击“计算并写报告”，会真正读取这段示例表格并求和。报告出现在框内，说明它仍属于临时环境；“取回报告”才会把副本放到框外。</p>
      <SandboxWorkbench />
    </ArticleSection>
    <ArticleSection id="sandbox-files" title="看得见哪些文件，能写到哪里">
      <p>图里的项目密钥始终留在框外。尝试读取时，你会收到拒绝结果，密钥没有被搬进来。实际配置也应逐项说清：上传的表放在哪里，输出写到哪里，哪些目录没有交给任务。</p>
      <p id="sandbox-mount" className="vp-citation-target">“挂载”可以理解成把一个已有目录接到环境内部，让代码能通过内部路径读到它。Docker 的 bind mount 会把宿主目录直接交给容器，而且默认可写；其中的创建、修改、删除也可能影响宿主文件。设为只读能阻止对这份挂载的写入，却不会隐藏里面原本就能读取的内容。<Cite id="sandbox-mount" sources={executionSandboxSources} /></p>
      <p>试着先开启“临时目录只读”，再计算。表格还在，但报告写不出来。本例故意把输入和输出放在同一目录，方便看清读写权限的区别；实际任务常把输入目录设为只读，再单独给一个可写的输出目录。</p>
      <p>因此，配置不能只写“开启沙箱”。还要检查究竟交进了哪些文件、目录和控制接口。如果把密钥所在目录也交进去，沙箱并不会替你猜到其中哪个文件不该给脚本看。</p>
    </ArticleSection>
    <ArticleSection id="sandbox-network" title="网络和资源，要另外划边界">
      <p id="sandbox-net-policy" className="vp-citation-target">文件范围和网络范围分别配置。Docker 的 <code>--network none</code> 只建立回环设备，让容器没有通常的外部网络连接；一般的容器网络并不天然禁止外网。演示选择了无外网的策略，所以每次尝试访问都会被拒。<Cite id="sandbox-net-policy" sources={executionSandboxSources} /></p>
      <p>有些任务需要下载公开数据，有些只需处理已经上传的表。需要联网时，应按任务允许具体的目标和方式，并考虑外发数据；“能访问网站”这项权限会改变脚本能做的事。</p>
      <p id="sandbox-budget" className="vp-citation-target">文件和网络都限制住了，脚本仍可能一直计算，或申请大量内存。Docker 容器默认没有资源上限，CPU 和内存需要另设限制。cgroups 的资源限制与文件隔离是不同的控制面；“代码在容器里”本身不能保证它不会耗尽机器资源。<Cite id="sandbox-budget" sources={executionSandboxSources} /></p>
      <p>运行时限则由具体执行服务管理。这里用按钮手动模拟到期；真实服务需要真的终止对应进程，并决定临时环境是否随之清理。收到拒绝、超时或资源不足，都应作为明确结果交还给应用。</p>
    </ArticleSection>
    <ArticleSection id="sandbox-lifetime" title="报告还在沙箱里，就不算取回来了">
      <p>先写报告，直接点击“模拟到期销毁”：框内表格和报告一起清空，之后再取回已经来不及。新建环境后再做一次，这回先取回报告再销毁，框外副本会留下。两次求和都成功，最终能否交付文件却不同。</p>
      <p id="sandbox-storage" className="vp-citation-target">这是临时数据与持久数据的区别。Docker 容器可写层的数据在容器被销毁后不再保留；volume 则能独立于容器保留。仅停止容器、销毁容器、清理挂载目录，可能产生不同结果，要看具体存储配置。不能把“进程结束”一概理解成“所有文件都没了”。<Cite id="sandbox-storage" sources={executionSandboxSources} /></p>
      <p>在应用里，报告生成后还应记录取回位置、检查内容是否完整，再告诉用户可以下载。终端输出“成功”只能说明脚本给出了这段文字；文件确实存在、金额计算正确、结果能够交付，都需要对应证据。</p>
    </ArticleSection>
    <ArticleSection id="sandbox-limits" title="盒子的边界也需要维护">
      <p id="sandbox-isolation" className="vp-citation-target">沙箱是对影响范围的限制，安全程度还取决于实现和配置。Docker 安全文档把内核、守护进程、挂载和权限配置分别列为考虑因素；配置过宽或底层漏洞都可能留下越界机会。<Cite id="sandbox-isolation" sources={executionSandboxSources} /></p>
      <ArticleAside title="为什么有的环境还会加一层隔离？"><p id="sandbox-gvisor" className="vp-citation-target">gVisor 的 Sentry 会自行处理应用的系统调用，减少应用直接接触宿主系统接口的机会。它仍依赖宿主的资源控制，网络策略也要配置；项目明确指出沙箱不能替代安全的整体架构。这类做法有兼容性和性能取舍，需要按实际代码选择。<Cite id="sandbox-gvisor" sources={executionSandboxSources} /></p></ArticleAside>
      <p>运行环境也不验证报告里的结论。求和脚本写错公式，或者上传的表本身缺行，都可能在一个隔离良好的环境里产出错误报告。回到这个任务，最有用的检查是：两条记录是否都读到了，12 + 8 是否等于 20，报告是否已取回。</p>
      <p>给 AI 的执行要求可以具体写成：“只提供这份费用表，输入只读、输出目录可写，不开放外网；设运行时限和资源上限。分别记录读取、写入、超时的结果，取回报告后核对行数和合计。”这些条件才能逐项落到配置与验收上。</p>
    </ArticleSection>
  </Article>;
}
