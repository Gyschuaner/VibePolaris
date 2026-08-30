import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const experienceDir = resolve(root, "content/zh/term-experiences");

const notesByHost = new Map([
  ["www.rfc-editor.org", "协议定义与报文语义"],
  ["platform.openai.com", "接口参数与调用行为"],
  ["model-spec.openai.com", "模型行为与指令边界"],
  ["openai.github.io", "可运行示例与实现细节"],
  ["www.postgresql.org", "数据库行为与约束"],
  ["arxiv.org", "原论文的方法与实验"],
  ["developer.mozilla.org", "浏览器行为与常见用法"],
  ["www.w3.org", "Web 标准与无障碍要求"],
  ["html.spec.whatwg.org", "HTML 标准语义"],
  ["dom.spec.whatwg.org", "DOM 标准行为"],
  ["fetch.spec.whatwg.org", "Fetch 标准行为"],
  ["tc39.es", "JavaScript 语言规范"],
  ["git-scm.com", "命令语义与状态变化"],
  ["docs.github.com", "协作流程与平台行为"],
  ["cheatsheetseries.owasp.org", "攻击面与防护检查"],
  ["owasp.org", "安全风险与验证方法"],
  ["genai.owasp.org", "生成式 AI 安全风险"],
  ["www.gov.uk", "服务设计与无障碍要求"],
  ["nvlpubs.nist.gov", "术语、风险与评估框架"],
  ["csrc.nist.gov", "安全要求与风险边界"],
  ["airc.nist.gov", "AI 风险管理说明"],
  ["www.nist.gov", "计量方法与标准说明"],
  ["developer.android.com", "Android 平台行为与约束"],
  ["developer.apple.com", "Apple 平台行为与设计要求"],
  ["react.dev", "React API 与运行机制"],
  ["docs.aws.amazon.com", "云服务行为与配置约束"],
  ["aws.amazon.com", "云架构模式与适用范围"],
  ["docs.npmjs.com", "包管理命令与文件语义"],
  ["www.typescriptlang.org", "类型系统与编译行为"],
  ["nodejs.org", "Node.js 运行时行为"],
  ["vite.dev", "构建与模块处理方式"],
  ["webpack.js.org", "打包过程与配置行为"],
  ["rollupjs.org", "模块打包与输出行为"],
  ["pnpm.io", "依赖安装与存储结构"],
  ["nextjs.org", "渲染模式与框架行为"],
  ["playwright.dev", "浏览器测试与自动等待"],
  ["jestjs.io", "测试替身与断言行为"],
  ["glossary.istqb.org", "测试术语与范围定义"],
  ["www.mongodb.com", "分布式数据行为与配置"],
  ["kubernetes.io", "编排对象与运行状态"],
  ["spark.apache.org", "数据处理模型与执行语义"],
  ["kafka.apache.org", "消息传递与消费语义"],
  ["json-schema.org", "JSON 结构约束与校验"],
  ["spec.openapis.org", "接口描述规范"],
  ["www.iana.org", "协议参数与注册信息"],
  ["www.nngroup.com", "用户研究与交互原则"],
  ["media.nngroup.com", "用户研究方法与证据"],
  ["www.usability.gov", "可用性方法与实践"],
  ["designsystem.digital.gov", "设计系统与组件原则"],
  ["www.designcouncil.org.uk", "设计过程与研究方法"],
  ["www.designtokens.org", "设计令牌格式与边界"],
  ["tr.designtokens.org", "设计令牌技术规范"],
  ["modelcontextprotocol.io", "协议角色与消息行为"],
]);

function noteFor(url) {
  const hostname = new URL(url).hostname;
  return notesByHost.get(hostname) ?? "原始规范与实现说明";
}

const files = readdirSync(experienceDir).filter((name) => name.endsWith(".json"));
let changed = 0;

for (const file of files) {
  const path = resolve(experienceDir, file);
  const experiences = JSON.parse(readFileSync(path, "utf8"));
  for (const experience of experiences) {
    for (const source of experience.sources) {
      const note = noteFor(source.url);
      if (source.note !== note) {
        source.note = note;
        changed += 1;
      }
    }
  }
  writeFileSync(path, `${JSON.stringify(experiences, null, 2)}\n`, "utf8");
}

process.stdout.write(`已整理 ${changed} 条来源说明。\n`);
