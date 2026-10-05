import type { ReactNode } from "react";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { SignatureHeroRuntime } from "../flow-redesign-pages/SignatureHeroRuntime";
import {
  environmentVariableSources,
  expressionSources,
  formatterSources,
  functionSources,
  linterSources,
  lockfileSources,
  monorepoSources,
  parameterSources,
  returnValueSources,
  sourceMapSources,
} from "@/lib/toolchain-redesign-sources";
import {
  EnvironmentVariableLesson,
  ExpressionLesson,
  FormatterLesson,
  FunctionLesson,
  LinterLesson,
  LockfileLesson,
  MonorepoLesson,
  ParameterLesson,
  ReturnValueLesson,
  SourceMapLesson,
} from "./ToolchainRedesignLessons";
import styles from "./ToolchainRedesignConcepts.module.css";

function HeroShell({ kind, label, children }: { kind: "lockfile" | "monorepo" | "environment-variable" | "source-map" | "linter" | "formatter" | "expression" | "function" | "parameter" | "return-value"; label: string; children: ReactNode }) {
  const layoutClass = {
    lockfile: styles.lockfileHero,
    monorepo: styles.repoHero,
    "environment-variable": styles.envHero,
    "source-map": styles.mapHero,
    linter: styles.lintHero,
    formatter: styles.formatHero,
    expression: styles.expressionHero,
    function: styles.functionHero,
    parameter: styles.parameterHero,
    "return-value": styles.returnHero,
  }[kind];
  return <SignatureHeroRuntime kind={kind} label={label}><div className={`${styles.heroTool} ${layoutClass}`}>{children}</div></SignatureHeroRuntime>;
}

function LockfileHero() {
  return <HeroShell kind="lockfile" label="版本范围经过解析后被封存，再交给两台机器复现"><div className={styles.lockRange}><small>范围</small><strong>A ^1.2.0</strong><span className={styles.toolLabel}>允许 1.2+ · &lt;2.0</span></div><div className={styles.lockCandidates}><small>候选</small><i /><i /><span className={styles.toolLabel}>A1.3.1 · B2.0.4</span></div><div className={styles.lockSeal}>lock</div><div className={styles.lockMachines}><b>机器 1</b><b>机器 2</b></div></HeroShell>;
}

function MonorepoHero() {
  return <HeroShell kind="monorepo" label="共享包改动沿依赖关系传播，只点亮真正受影响的项目"><div className={styles.repoOrbit}><div className={styles.repoNode} data-dep="true"><small>web</small><strong>重建</strong></div><div className={styles.repoNode} data-dep="true"><small>ui</small><strong>改动</strong></div><div className={styles.repoNode}><small>api</small><strong>跳过</strong></div><i className={styles.repoPulse} aria-hidden="true" /></div><div className={styles.repoImpact}>影响集合 · 2 / 3</div></HeroShell>;
}

function EnvironmentVariableHero() {
  return <HeroShell kind="environment-variable" label="父环境变成 prod，旧进程保留 dev，新进程重启后才换值"><div className={styles.envParent}><span>父环境</span><strong>dev → prod</strong></div><div className={styles.envProcesses}><div className={styles.envProcess}><small>旧进程 · 快照</small><strong>APP_MODE=dev</strong></div><div className={styles.envProcess}><small>重新启动</small><strong>APP_MODE=prod</strong></div></div><div className={styles.envStamp}>各自读取自己的副本</div></HeroShell>;
}

function SourceMapHero() {
  return <HeroShell kind="source-map" label="生成代码中的坐标被源映射透镜还原成原始源码位置"><div className={styles.mapCode}><small>bundle.js</small><b>1 : 240</b><span>运行时堆栈</span></div><div className={styles.mapLens} aria-hidden="true">map</div><div className={styles.mapSource}><small>src/app.ts</small><b>18 : 7</b><span>调试器高亮</span></div><div className={styles.mapPin}>仍执行 bundle</div></HeroShell>;
}

function LinterHero() {
  return <HeroShell kind="linter" label="源码经过规则扫描后留下两条带行号的诊断"><div className={styles.lintCode}><small>input.ts</small><span className={styles.lintLine}>03 <b>const total = 8</b></span><span className={styles.lintLine}>07 <b>if (true)</b></span><span>return 0</span></div><div className={styles.lintScan}><small>规则扫描</small><span className={styles.lintRule}>unused-vars <strong>03</strong></span><span className={styles.lintRule}>constant-condition <strong>07</strong></span><span className={styles.lintCount}>2 diagnostics</span></div></HeroShell>;
}

function FormatterHero() {
  return <HeroShell kind="formatter" label="一行代码沿着行宽标尺折开，元素数量和顺序保持不变"><div className={styles.formatRuler}><span>0</span><span>40</span><span>80</span><i aria-hidden="true" /><span>120</span></div><div className={styles.formatCode}><span className={styles.formatOneLine}>const items = ["alpha", "beta", "gamma", "delta", "epsilon"];</span><span className={styles.formatWrapped}>{"const items = [\n  \"alpha\", \"beta\", \"gamma\",\n  \"delta\", \"epsilon\"];"}</span></div><div className={styles.formatMeta}><span>5 items</span><span>layout only</span></div></HeroShell>;
}

function ExpressionHero() {
  return <HeroShell kind="expression" label="表达式树从 price、2 和 tax 的叶子向根节点求值"><div className={styles.exprTree}><div className={styles.exprLeaves}><b>price=10</b><b>× 2</b><b>tax=3</b></div><div className={styles.exprBranches}><span>×</span><span>+</span></div><strong className={styles.exprRoot}>23</strong></div><div className={styles.exprValue}>改 price → 根节点重算</div></HeroShell>;
}

function FunctionHero() {
  return <HeroShell kind="function" label="实参进入一次调用帧，函数体求值后把结果沿返回通道交回"><div className={styles.functionCaller}><small>调用方</small><strong>calculate(20, 3)</strong></div><div className={styles.functionFrame}><small>局部调用帧</small><strong>price=20 · count=3</strong><code>20 × 3 = 60</code></div><div className={styles.functionStack}><small>stack</small><i aria-hidden="true" /><span className={styles.functionStackBefore}>0</span><span className={styles.functionStackAfter}>0→1→0</span></div><div className={styles.functionReturn}>return 60 → total</div></HeroShell>;
}

function ParameterHero() {
  return <HeroShell kind="parameter" label="实参按位置滑入函数定义的参数槽位，省略时启用默认值"><div className={styles.parameterDefinition}>discount(price, rate = 0.2)</div><div className={styles.parameterArgs}><div className={styles.parameterArg}><span>实参 1</span><b>100</b></div><div className={styles.parameterArg}><span>实参 2</span><b>0.2</b></div></div><div className={styles.parameterSlots}><div className={styles.parameterSlot}><span>price</span><b>100</b></div><div className={styles.parameterSlot}><span>rate</span><b>0.2 / 默认</b></div></div><div className={styles.parameterWarning}>交换位置不会自动纠正</div></HeroShell>;
}

function ReturnValueHero() {
  return <HeroShell kind="return-value" label="函数计算结果分成日志和返回两条通道，只有返回通道能填入 result"><div className={styles.returnFunction}><small>函数体</small><strong>4 × 2 = 8</strong><span>产生一个值</span></div><div className={styles.returnFork}><i aria-hidden="true" /><div className={styles.returnChannels}><b>console.log · 看见</b><b>return · 交给调用方</b></div></div><div className={styles.returnResult}><small>调用方</small><strong>result = 8</strong><span>返回通道打开</span></div></HeroShell>;
}

const lockSections: [string, string][] = [["lock-definition-section", "清单说允许什么，锁文件说选中了什么"], ["lock-reproduce-section", "复现靠的是同一棵树"], ["lock-boundary-section", "锁住版本不等于锁住风险"]];
export function LockfileTermPage() {
  return <Article slug="lockfile" title="锁文件" subtitle="Lockfile · 把一次依赖选择封存下来" sources={lockfileSources} sections={lockSections} hero={<LockfileHero />} intro={<>`package.json` 只说“允许哪一段版本”，安装器还要从候选里做一次选择。<strong>锁文件把这次选择和传递依赖一起封存</strong>，让下一台机器复现同一棵树，而不是重新猜一遍。</>}>
    <ArticleSection id="lock-definition-section" title="清单说允许什么，锁文件说选中了什么"><p id="lock-definition" className="vp-citation-target">直接依赖写在清单里，像 `A ^1.2.0`；在这个常见的 semver 例子里，它以 1.2.0 为下限，仍停在 2.0.0 之前。解析器会把它展开成确切版本和间接依赖。<Cite id="lock-definition" sources={lockfileSources} />锁文件记录的是这次解析的结果，不是另一份“更严格的清单”。</p><p id="lock-change" className="vp-citation-target">改了允许范围，就应该重新解析并提交新的锁文件。<Cite id="lock-change" sources={lockfileSources} />只删除旧文件会把选择推迟给每台机器，差异反而更难解释。</p><LockfileLesson /></ArticleSection>
    <ArticleSection id="lock-reproduce-section" title="复现靠的是同一棵树"><p id="lock-reproduce" className="vp-citation-target">CI 使用现有锁文件安装时，机器 1 和机器 2 拿到的是同一组精确版本。<Cite id="lock-reproduce" sources={lockfileSources} />这让“这次构建到底用了谁”有了可追查的答案。</p><ArticleAside title="审一次依赖更新"><p>先看清单的范围变化，再看锁文件新增或替换了哪些间接依赖；最后确认 CI 使用的安装命令确实读取这份锁文件。</p></ArticleAside></ArticleSection>
    <ArticleSection id="lock-boundary-section" title="锁住版本不等于锁住风险"><p id="lock-boundary" className="vp-citation-target">锁文件不能替代安全审计，也不能保证原生模块、安装脚本或操作系统差异消失。<Cite id="lock-boundary" sources={lockfileSources} />它只回答“解析结果是什么”，不替你回答“这组依赖是否值得信任”。</p></ArticleSection>
  </Article>;
}

const repoSections: [string, string][] = [["repo-definition-section", "一个仓库可以装下多个项目"], ["repo-impact-section", "依赖边决定重建范围"], ["repo-boundary-section", "仓库边界不是部署边界"]];
export function MonorepoTermPage() {
  return <Article slug="monorepo" title="单体仓库" subtitle="Monorepo · 把相关项目放进同一份历史" sources={monorepoSources} sections={repoSections} hero={<MonorepoHero />} intro={<>web、共享 ui 包和 api 服务可以住在同一个仓库里。<strong>monorepo 统一的是代码历史和工具入口</strong>，真正决定谁要重建的，是包之间的依赖关系。</>}>
    <ArticleSection id="repo-definition-section" title="一个仓库可以装下多个项目"><p id="repo-definition" className="vp-citation-target">工作区把多个包放在同一个根目录下，脚本可以一次触发，也可以按包单独运行。<Cite id="repo-definition" sources={monorepoSources} />这让共享组件和使用它的应用可以在一次提交里配套修改。</p><p id="repo-impact" className="vp-citation-target">改 ui 时，web 因为依赖它进入构建集合；api 没有这条边，所以可以暂时跳过。<Cite id="repo-impact" sources={monorepoSources} />目录挨在一起不是影响范围，依赖图才是。</p><MonorepoLesson /></ArticleSection>
    <ArticleSection id="repo-impact-section" title="依赖边决定重建范围"><p id="repo-boundary" className="vp-citation-target">构建工具通常从目标反向查依赖，决定哪些包需要重新检查。<Cite id="repo-boundary" sources={monorepoSources} />把受影响集合说清楚，能避免每次小改动都把整座仓库重新打包。</p><ArticleAside title="画一张最小依赖图"><p>列出应用、共享包和服务，先画“谁使用谁”，再从一次改动向上游追踪。把可以独立部署的边界另写一列，别用 monorepo 这个词替它下结论。</p></ArticleAside></ArticleSection>
    <ArticleSection id="repo-boundary-section" title="仓库边界不是部署边界"><p>monorepo 可以包含多个独立服务，也可以只放多个前端包；monolith 描述的是运行和部署形态。把两者混为一谈，会让构建策略和架构讨论一起失焦。</p></ArticleSection>
  </Article>;
}

const envSections: [string, string][] = [["env-definition-section", "变量在启动时进入进程"], ["env-public-section", "前端产物会改变暴露面"], ["env-boundary-section", "改值之后要决定谁重启"]];
export function EnvironmentVariableTermPage() {
  return <Article slug="environment-variable" title="环境变量" subtitle="Environment Variable · 给进程一份启动配置" sources={environmentVariableSources} sections={envSections} hero={<EnvironmentVariableHero />} intro={<>同一份代码在开发和生产常常要读不同地址。<strong>环境变量把配置放在进程启动边界之外</strong>，但它不是会自动刷新旧进程的全局开关，也不是天然安全的密钥库。</>}>
    <ArticleSection id="env-definition-section" title="变量在启动时进入进程"><p id="env-snapshot" className="vp-citation-target">父环境在创建进程时复制一份键值对，进程随后从自己的副本读取 `APP_MODE`。<Cite id="env-snapshot" sources={environmentVariableSources} />父环境后来改成 prod，并不会把旧进程手里的 dev 擦掉。</p><p id="env-restart" className="vp-citation-target">要让新值生效，通常需要重新启动进程或重新创建容器。<Cite id="env-restart" sources={environmentVariableSources} />两个进程可以短暂并存，各自报告不同的配置。</p><EnvironmentVariableLesson /></ArticleSection>
    <ArticleSection id="env-public-section" title="前端产物会改变暴露面"><p id="env-public" className="vp-citation-target">服务端运行时变量可以由秘密管理系统注入；前端公开前缀的变量却可能被写进浏览器资源。<Cite id="env-public" sources={environmentVariableSources} />名称叫“环境变量”不能替你判断谁最终能看到它。</p><ArticleAside title="轮换一次配置"><p>记录变量由谁注入、哪个进程读取、什么时候生效、是否进入构建产物；轮换时同时安排重启、旧实例下线和日志清理。</p></ArticleAside></ArticleSection>
    <ArticleSection id="env-boundary-section" title="改值之后要决定谁重启"><p>环境变量解决的是配置传递，不是配置治理。缺失值、错误格式、泄露后的轮换和不同部署环境的默认值，都需要在启动检查和发布记录里明确。</p></ArticleSection>
  </Article>;
}

const mapSections: [string, string][] = [["map-definition-section", "生成位置和源码位置之间的坐标表"], ["map-lookup-section", "透镜只改变调试视角"], ["map-boundary-section", "可读性和暴露面要一起权衡"]];
export function SourceMapTermPage() {
  return <Article slug="source-map" title="源映射" subtitle="Source Map · 把压缩后的坐标带回源码" sources={sourceMapSources} sections={mapSections} hero={<SourceMapHero />} intro={<>线上错误常常只给出 `bundle.js:1:240`。<strong>源映射把这个生成坐标对照到原始文件的行和列</strong>，让调试器能在熟悉的 TypeScript 语句上停住；浏览器执行的代码并没有因此改变。</>}>
    <ArticleSection id="map-definition-section" title="生成位置和源码位置之间的坐标表"><p id="map-contract" className="vp-citation-target">构建工具把生成文件、行列和原始文件、行列写进 map，文件末尾的 `sourceMappingURL` 告诉调试器去哪里查。<Cite id="map-contract" sources={sourceMapSources} />它像一张坐标表，不是第二份可执行代码。</p><p id="map-lookup" className="vp-citation-target">调试器命中映射条目后，会在 `src/app.ts:18:7` 高亮原始语句。<Cite id="map-lookup" sources={sourceMapSources} />错误仍然发生在生成代码里，只是人获得了更好的观察窗口。</p><SourceMapLesson /></ArticleSection>
    <ArticleSection id="map-boundary-section" title="可读性和暴露面要一起权衡"><p id="map-security" className="vp-citation-target">map 可能暴露源码路径、文件名甚至源码内容，发布前要决定公开提供、只上传给错误监控服务，还是不发布。<Cite id="map-security" sources={sourceMapSources} />可调试和可公开不是同一个开关。</p><p id="map-boundary" className="vp-citation-target">没有 map 时程序照常运行，只是堆栈停在生成文件。<Cite id="map-boundary" sources={sourceMapSources} />不要把“找不到原始行”写成“源映射修复了错误”。</p><ArticleAside title="核对一份线上堆栈"><p>先确认 bundle 和 map 来自同一次构建，再点击一个生成坐标；如果跳到了错误版本的源码，优先检查发布缓存和构建产物配对。</p></ArticleAside></ArticleSection>
  </Article>;
}

const lintSections: [string, string][] = [["lint-definition-section", "先解析，再按规则报告"], ["lint-rules-section", "诊断是规则的可见结果"], ["lint-boundary-section", "静态规则不是运行证明"]];
export function LinterTermPage() {
  return <Article slug="linter" title="代码检查器" subtitle="Linter · 在运行之前挑出可疑写法" sources={linterSources} sections={lintSections} hero={<LinterHero />} intro={<>代码能跑通，只能说明这一次运行没有撞上问题。<strong>linter 先把源码解析成结构，再按规则留下带位置的诊断</strong>，让提交前的检查有可讨论的证据，而不是凭感觉挑错。</>}>
    <ArticleSection id="lint-definition-section" title="先解析，再按规则报告"><p id="lint-parse" className="vp-citation-target">检查器读取源码结构，知道 `total` 是变量、`if(true)` 是条件，然后把命中的行号交给规则。<Cite id="lint-parse" sources={linterSources} />它不需要先把完整业务流程跑一遍。</p><p id="lint-rules" className="vp-citation-target">规则集决定什么会被报告，严重级别再决定 CI 是否拦下提交。<Cite id="lint-rules" sources={linterSources} />关闭一条规则只会让这一类诊断不再出现。</p><LinterLesson /></ArticleSection>
    <ArticleSection id="lint-rules-section" title="诊断是规则的可见结果"><p id="lint-change" className="vp-citation-target">同一份源码可以在两套规则下得到不同诊断；报告应保留规则名、位置和处理理由。<Cite id="lint-change" sources={linterSources} />自动修复也要通过差异和测试确认。</p><ArticleAside title="处理一条 lint 报告"><p>先问它命中了哪种结构，再决定修代码、调整规则还是记录误报；不要用“把红灯关掉”替代判断。</p></ArticleAside></ArticleSection>
    <ArticleSection id="lint-boundary-section" title="静态规则不是运行证明"><p id="lint-boundary" className="vp-citation-target">linter 不能替代测试、真实网络和用户反馈；它只覆盖规则能描述的源码模式。<Cite id="lint-boundary" sources={linterSources} />没有诊断，不代表业务逻辑一定正确。</p></ArticleSection>
  </Article>;
}

const formatSections: [string, string][] = [["format-definition-section", "把排版争议交给结构和规则"], ["format-width-section", "行宽是折纸标尺，不是字符断头台"], ["format-boundary-section", "排版稳定仍需验证行为"]];
export function FormatterTermPage() {
  return <Article slug="formatter" title="格式化器" subtitle="Formatter · 让代码按同一把尺子排版" sources={formatterSources} sections={formatSections} hero={<FormatterHero />} intro={<>团队不必在每次审查里争论缩进、引号和换行。<strong>格式化器读取结构，再按配置重新打印</strong>，让差异集中在真正的逻辑上；它和 linter、测试承担的职责不同。</>}>
    <ArticleSection id="format-definition-section" title="把排版争议交给结构和规则"><p id="format-goal" className="vp-citation-target">格式化器通常改变空白、缩进、换行和引号，目标是让同一份结构稳定呈现。<Cite id="format-goal" sources={formatterSources} />五个数组元素还是五个，审查者不必为风格重复投票。</p><p id="format-width" className="vp-citation-target">`printWidth` 是触发折行的参考值，不是硬性的每行上限。<Cite id="format-width" sources={formatterSources} />注释、字符串和语言语法都可能让真实结果偏离标尺。</p><FormatterLesson /></ArticleSection>
    <ArticleSection id="format-width-section" title="行宽是折纸标尺，不是字符断头台"><p>把同一段数组从 120 调到 80，读者可以看到结构被重新排成更多行，但元素顺序没有改变。格式化的价值在于减少噪音，不在于把代码变短。</p><ArticleAside title="更新格式化器配置"><p>先固定解析器、插件和配置版本，再查看一次全量差异；如果出现行为变化，交给测试和审查确认，不要把它归咎于“只是排版”。</p></ArticleAside></ArticleSection>
    <ArticleSection id="format-boundary-section" title="排版稳定仍需验证行为"><p id="format-boundary" className="vp-citation-target">格式化器不判断业务逻辑，也不保证插件永远不会改变语法解释。<Cite id="format-boundary" sources={formatterSources} />提交前仍要运行必要测试，并把配置变化当成工具链变更。</p></ArticleSection>
  </Article>;
}

const expressionSections: [string, string][] = [["expression-definition-section", "表达式的共同结果是一个值"], ["expression-tree-section", "从叶子向根节点求值"], ["expression-boundary-section", "值、输出和副作用要分开"]];
export function ExpressionTermPage() {
  return <Article slug="expression" title="表达式" subtitle="Expression · 一段代码算出一个值" sources={expressionSources} sections={expressionSections} hero={<ExpressionHero />} intro={<>`price * 2 + tax` 看起来像一行小公式，但它在代码里有一个重要身份：<strong>表达式可以被求值并产生一个值</strong>，这个值还能嵌进赋值、调用和条件。</>}>
    <ArticleSection id="expression-definition-section" title="表达式的共同结果是一个值"><p id="expression-value" className="vp-citation-target">表达式可以放在赋值号右边，也可以作为函数调用的实参。<Cite id="expression-value" sources={expressionSources} />语句负责组织动作和控制流程，里面可以包含表达式，但语句本身不一定产生可用值。</p><p id="expression-tree" className="vp-citation-target">把 `(price * 2) + tax` 拆成树，先读叶子，再算乘法节点，最后把结果交给加法节点。<Cite id="expression-tree" sources={expressionSources} />只改 price，新的值会沿树重新求出。</p><ExpressionLesson /></ArticleSection>
    <ArticleSection id="expression-tree-section" title="从叶子向根节点求值"><p id="expression-order" className="vp-citation-target">具体语言决定运算符优先级、短路和求值顺序。<Cite id="expression-order" sources={expressionSources} />复杂表达式拆成中间变量，往往比让读者猜一整棵树更清楚。</p><ArticleAside title="检查一条表达式"><p>标出叶值、运算符、中间值和最终值；再检查是否读取或改变外部状态。看到“算出 23”，还要问这个值被谁接住。</p></ArticleAside></ArticleSection>
    <ArticleSection id="expression-boundary-section" title="值、输出和副作用要分开"><p id="expression-boundary" className="vp-citation-target">`console.log(3)` 让屏幕出现 3，却不意味着这个调用返回 3。<Cite id="expression-boundary" sources={expressionSources} />打印、返回、赋值和副作用必须按语言规则分别判断。</p></ArticleSection>
  </Article>;
}

const functionSections: [string, string][] = [["function-definition-section", "定义和调用是两次不同的时刻"], ["function-scope-section", "调用帧只活在这一次调用里"], ["function-boundary-section", "可复用不等于没有副作用"]];
export function FunctionTermPage() {
  return <Article slug="function" title="函数" subtitle="Function · 给一段行为一个可调用的名字" sources={functionSources} sections={functionSections} hero={<FunctionHero />} intro={<>函数不是把代码切成一块就结束了。<strong>定义先描述行为，调用再提供本次输入</strong>；函数建立局部环境，算完之后把结果或副作用交还给外部。</>}>
    <ArticleSection id="function-definition-section" title="定义和调用是两次不同的时刻"><p id="function-call" className="vp-citation-target">`calculate(20, 3)` 的 20 和 3 是这次调用的实参，函数定义里的 `price` 和 `count` 是接收它们的参数。<Cite id="function-call" sources={functionSources} />每次调用都可以带另一组值。</p><p id="function-scope" className="vp-citation-target">调用帧把局部参数和中间值收在本次执行里，返回后帧弹出。<Cite id="function-scope" sources={functionSources} />外部代码拿到的是返回值，不是凭空看到局部变量。</p><FunctionLesson /></ArticleSection>
    <ArticleSection id="function-scope-section" title="调用帧只活在这一次调用里"><p>栈深度从 0 变成 1，再回到 0，是“进入函数—执行—返回”的可见证据。递归或嵌套调用会让这个数字暂时更深，但每一帧仍对应一次调用。</p><ArticleAside title="读一个函数签名"><p>先列参数、返回值和局部状态，再写一条最小调用；如果函数读取网络、时间或全局变量，把这些外部依赖单独标出来。</p></ArticleAside></ArticleSection>
    <ArticleSection id="function-boundary-section" title="可复用不等于没有副作用"><p id="function-boundary" className="vp-citation-target">函数可以读写外部状态、访问文件或网络，所以相同实参不一定得到相同结果。<Cite id="function-boundary" sources={functionSources} />“封装”描述调用方式，不是纯度保证。</p></ArticleSection>
  </Article>;
}

const parameterSections: [string, string][] = [["parameter-definition-section", "参数是槽位，实参是这次的值"], ["parameter-bind-section", "默认值只在缺少实参时接手"], ["parameter-boundary-section", "绑定不会替你做业务校验"]];
export function ParameterTermPage() {
  return <Article slug="parameter" title="参数" subtitle="Parameter · 给调用准备的命名槽位" sources={parameterSources} sections={parameterSections} hero={<ParameterHero />} intro={<>函数定义先留下 `price` 和 `rate` 两个名字，调用时再把具体数字交进来。<strong>参数是接收数据的槽位，实参是这一次放进去的值</strong>；绑定完成不代表值就符合业务含义。</>}>
    <ArticleSection id="parameter-definition-section" title="参数是槽位，实参是这次的值"><p id="parameter-names" className="vp-citation-target">`discount(price, rate = 0.2)` 中的 `price`、`rate` 是形参；`discount(100, 0.2)` 中的数字是实参。<Cite id="parameter-names" sources={parameterSources} />两者不要在解释里混成同一个词。</p><p id="parameter-bind" className="vp-citation-target">语言按位置、名称或默认值完成绑定。<Cite id="parameter-bind" sources={parameterSources} />顺序交换会让值进入另一个槽位，函数通常不会替你猜“用户本来想传什么”。</p><ParameterLesson /></ArticleSection>
    <ArticleSection id="parameter-bind-section" title="默认值只在缺少实参时接手"><p id="parameter-default" className="vp-citation-target">在这个 JavaScript 数值例子里，调用 `discount(100)` 时，`rate` 使用定义中的 0.2；每次调用都按这份默认值重新绑定，不会记住上一次调用，也不会自动等于 `price`。<Cite id="parameter-default" sources={parameterSources} />没有默认值的必填参数如何处理，则看具体语言。</p><ArticleAside title="检查一组调用"><p>把形参写成槽位表，再逐个填入实参；单独记录缺少、多给、交换顺序和默认值的情况，最后才检查类型和范围。</p></ArticleAside></ArticleSection>
    <ArticleSection id="parameter-boundary-section" title="绑定不会替你做业务校验"><p id="parameter-boundary" className="vp-citation-target">参数绑定通常只负责把值交给函数，非法折扣率、负价格或错误单位仍需要函数或类型系统处理。<Cite id="parameter-boundary" sources={parameterSources} />不要把“成功绑定”误写成“业务输入有效”。</p></ArticleSection>
  </Article>;
}

const returnSections: [string, string][] = [["return-definition-section", "返回通道把值交给调用方"], ["return-output-section", "日志支路不会填变量"], ["return-boundary-section", "没有 return 时要看语言规则"]];
export function ReturnValueTermPage() {
  return <Article slug="return-value" title="返回值" subtitle="Return Value · 把函数结果交回调用方" sources={returnValueSources} sections={returnSections} hero={<ReturnValueHero />} intro={<>函数里算出 8，控制台也显示了 8，调用方却可能拿到 `undefined`。<strong>返回值走的是一条交接通道</strong>：只有执行 `return`，结果才会从函数内部进入调用方的变量。</>}>
    <ArticleSection id="return-definition-section" title="返回通道把值交给调用方"><p id="return-channel" className="vp-citation-target">`return 8` 会结束本次函数执行，把 8 交给 `result = double(4)`。<Cite id="return-channel" sources={returnValueSources} />调用方可以保存它、继续计算或忽略它。</p><p id="return-output" className="vp-citation-target">`console.log(8)` 只把消息写到控制台，不能代替返回通道。<Cite id="return-output" sources={returnValueSources} />首图把两条线分开，就是为了让“看见”和“拿到”不再混在一起。</p><ReturnValueLesson /></ArticleSection>
    <ArticleSection id="return-output-section" title="日志支路不会填变量"><p>调试时可以同时看到日志和返回值，但它们的读者不同：日志给人看，返回值给后续代码用。函数直接修改外部对象又是另一条路径，不能用“屏幕上有数字”概括。</p><ArticleAside title="追一次函数输出"><p>在调用处写下预期变量，在函数内部分别标出日志、外部写入和 return；逐条删除其中一条，看哪条改变了调用方的结果。</p></ArticleAside></ArticleSection>
    <ArticleSection id="return-boundary-section" title="没有 return 时要看语言规则"><p id="return-undefined" className="vp-citation-target">在 JavaScript 中，没有显式 `return` 时调用结果是 `undefined`；Python 等语言有自己的对应规则。<Cite id="return-undefined" sources={returnValueSources} />不要把一种语言的省略行为推广成所有语言的定律。</p><p id="return-boundary" className="vp-citation-target">返回值也不保证函数没有副作用；它只说明这次调用交出了什么。<Cite id="return-boundary" sources={returnValueSources} />是否安全、可缓存或可重复，需要继续看函数的其他读写。</p></ArticleSection>
  </Article>;
}
