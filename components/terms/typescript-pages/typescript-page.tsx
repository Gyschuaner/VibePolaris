import { typescriptSources as sources } from "@/lib/typescript-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { RuntimeValidationLab, TypeAnnotationLab, TypeScriptHero } from "./typescript-experiments";

export function TypeScriptTermPage() {
  return <Article slug="typescript" title="TypeScript" subtitle="写代码时，先看见类型不合的地方" hero={<TypeScriptHero />} sources={sources} intro={<>购物车本来有 2 件，再加 3 件，结果却显示“23 件”。计算公式没变，传进去的 <code>2</code> 多了一对引号。<strong>TypeScript 能在运行前发现这类类型错配；数据真正进来时，仍要检查它是什么。</strong></>} sections={[
    ["ts-two-section", "2 和“2”，差的可不只是引号"],
    ["ts-check-section", "红色下划线为什么能提前出现"],
    ["ts-javascript-section", "标注擦掉后，运行的是 JavaScript"],
    ["ts-data-section", "接口回来的数据，得真的看一眼"],
    ["ts-boundaries-section", "类型对了，程序也可能算错"],
    ["ts-task-section", "让 AI 交付一份能核对的类型约定"],
  ]}>
    <ArticleSection id="ts-two-section" title="2 和“2”，差的可不只是引号">
      <p>先看两个很普通的值。<code>2</code> 是数字，可以拿来计算；<code>"2"</code> 是字符串，也就是一段文字。它们在屏幕上都像一个“2”，代码对它们的处理却不同。</p>
      <p id="ts-addition" className="vp-citation-target">JavaScript 的 <code>+</code> 既能做数字加法，也能拼接文字。两个数字相加，<code>2 + 3</code> 得到 <code>5</code>；其中一边是字符串时，<code>"2" + 3</code> 会把另一边也转成文字，拼成 <code>"23"</code>。它没有报错，只是做了另一件事。<Cite id="ts-addition" sources={sources} /></p>
      <p>购物车想要的是加法。麻烦往往出在交接处：写计算的人以为收到数字，调用它的人却给了文字。如果能在交接前写清“这里必须是数字”，很多错配就不用等到用户点按钮才暴露。</p>
    </ArticleSection>
    <ArticleSection id="ts-check-section" title="红色下划线为什么能提前出现">
      <p id="ts-definition" className="vp-citation-target"><strong>TypeScript 在 JavaScript 的基础上加入类型信息和静态类型检查。</strong>“静态”指检查器分析代码，不必先把程序运行一遍。它会核对某个值能不能用在当前位置，例如把字符串交给一个要求数字的函数。<Cite id="ts-definition" sources={sources} /></p>
      <p>下面的 <code>add</code> 是一个函数：把一段计算取个名字，之后就能反复调用。括号里的 <code>a</code>、<code>b</code> 是它接收的两个值，也叫参数；冒号后的 <code>number</code> 写明参数必须是数字。</p>
      <p id="ts-parameters" className="vp-citation-target">调用 <code>add("2", 3)</code> 时，检查器能从代码中看见 <code>"2"</code> 是字符串，而第一个参数要求数字，于是在这里报告错误。编辑器里的红色下划线，就是这次核对的结果。换成数字 <code>2</code>，这个错配就消失了。<Cite id="ts-parameters" sources={sources} /></p>
      <TypeAnnotationLab />
      <p id="ts-inference" className="vp-citation-target">也不用给每个值都手写标签。写下 <code>let count = 2</code>，TypeScript 通常能推断 <code>count</code> 是数字；再把文字赋给它时，也会提示不匹配。显式标注更适合需要说清交接约定的地方，例如函数参数和对外的数据结构。<Cite id="ts-inference" sources={sources} /></p>
    </ArticleSection>
    <ArticleSection id="ts-javascript-section" title="标注擦掉后，运行的是 JavaScript">
      <p id="ts-erasure" className="vp-citation-target">点击实验里的“看 JavaScript”，冒号和 <code>number</code> 标注会从代码中消失。TypeScript 的这些类型信息会在转换时擦除，最终执行的仍是 <ConceptTerm slug="javascript">JavaScript</ConceptTerm>。它不会在函数旁边留下一个自动校验每次输入的保安，也不会把 <code>"2"</code> 悄悄改成数字。<Cite id="ts-erasure" sources={sources} /></p>
      <p>所以实验里即使显示类型错误，你仍能运行那段对应的 JavaScript，并得到 <code>"23"</code>。这里把“检查代码”和“执行代码”分开，方便你看清两件事各自做了什么。</p>
      <p id="ts-emit" className="vp-citation-target">真实项目会不会在发现类型错误后继续产出文件，取决于构建设置。TypeScript 的 <code>noEmitOnError</code> 设置为 <code>true</code> 时，会在报错时停止输出；它的默认值是 <code>false</code>。不要把“编辑器没有红线”与“构建允许发布”当成同一件事。<Cite id="ts-emit" sources={sources} /></p>
    </ArticleSection>
    <ArticleSection id="ts-data-section" title="接口回来的数据，得真的看一眼">
      <p>前一个实验的参数直接写在代码里，检查器看得见。接口返回什么、用户这次输入什么，往往要运行后才知道。对这些外部数据，先承认“还不知道它的类型”，比先宣布“它肯定是数字”更稳妥；代码中可以用 <code>unknown</code> 表示这个暂时未知的值。</p>
      <p id="ts-assertion" className="vp-citation-target"><code>quantity as number</code> 是<strong>类型断言</strong>：告诉检查器按数字理解这个值。它不会查看数据，不会转换值，也不会因为收到字符串而自动抛错。断言本身在输出 JavaScript 时同样会被擦除。<Cite id="ts-assertion" sources={sources} /></p>
      <RuntimeValidationLab />
      <p id="ts-runtime-check" className="vp-citation-target">换成“真正检查值”后，代码执行 <code>typeof quantity</code>，查看当前值的实际类型。收到字符串就拒绝继续；确认是数字后才计算。TypeScript 也能理解这段判断，把通过检查后的值视作数字，这叫<strong>类型收窄</strong>。运行时判断负责检查数据，类型检查器负责跟上这项已确认的事实。<Cite id="ts-runtime-check" sources={sources} /></p>
      <p>可以把实验换回数字 <code>2</code> 再试：两种写法都得到 <code>5</code>。只看正常输入，断言很容易显得“已经校验过”；切到文字 <code>"2"</code>，区别才露出来。</p>
      <ArticleAside title="整个订单对象，要怎么检查？"><p>真实订单还可能有商品编号、数量、价格等字段。检查对象是否存在、每个必需字段是否齐全、字段的实际类型是否符合约定，可以逐项写判断，也可以使用运行时校验库。只写一个 TypeScript 对象类型，不能完成这些数据检查。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="ts-boundaries-section" title="类型对了，程序也可能算错">
      <p>数字 <code>-2</code> 也是 <code>number</code>，小数 <code>2.5</code> 也是。刚才的 <code>typeof</code> 检查会允许它们通过，可商品数量通常还得满足“正整数”。这类业务规则要另外写出来，不能只凭一个 <code>number</code> 判断。</p>
      <p id="ts-any" className="vp-citation-target">还有一种常见的退路：把难处理的数据标成 <code>any</code>。这会放宽相关类型检查，错误也可能随之失去提醒。红线消失只说明检查器不再拦住这段用法，不能作为数据正确的证据。<Cite id="ts-any" sources={sources} /></p>
      <p>类型检查也不会替你确认服务器在线、库存足够、用户有权下单。它擅长核对代码里的类型关系；网络失败、实际数据和业务约束，需要对应的错误处理、校验和测试。</p>
    </ArticleSection>
    <ArticleSection id="ts-task-section" title="让 AI 交付一份能核对的类型约定">
      <p>可以这样交代任务：“购物车数量按数字计算；接口数据先作为未知值接收，确认是正整数后再使用。不要用 <code>as number</code> 或 <code>any</code> 掩盖类型错误。收到文字数量时显示明确错误。”</p>
      <p>看它交付的代码时，找三处具体证据：函数接收什么类型，外部数据在哪里被检查，检查失败后程序做什么。再用数字 <code>2</code> 和文字 <code>"2"</code> 各试一次。你要核对的是数据怎么被使用，而不只是文件扩展名有没有变成 <code>.ts</code>。</p>
    </ArticleSection>
  </Article>;
}
