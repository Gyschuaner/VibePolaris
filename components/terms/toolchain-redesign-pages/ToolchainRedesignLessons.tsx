"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./ToolchainRedesignConcepts.module.css";

function LessonTop({ label, title, onReset, resetLabel }: { label: string; title: string; onReset: () => void; resetLabel: string }) {
  return <div className={styles.toolLessonTop}><div><span>{label}</span><strong>{title}</strong></div><button className={styles.toolReset} type="button" onClick={onReset} aria-label={resetLabel}><ArrowCounterClockwise size={16} /></button></div>;
}

function Status({ title, detail }: { title: string; detail: string }) {
  return <div className={styles.toolStatus} role="status"><strong>{title}</strong><span>{detail}</span></div>;
}

export function LockfileLesson() {
  const [locked, setLocked] = useState(true);
  return <div className={styles.toolLesson} role="region" aria-label="锁文件复现演示"><LessonTop label="两台机器" title="删掉记录，第二次安装就要重新猜" onReset={() => setLocked(true)} resetLabel="重置锁文件演示" /><div className={styles.toolButtons} role="group" aria-label="锁文件状态"><button type="button" aria-pressed={locked} onClick={() => setLocked(true)}>保留锁文件</button><button type="button" aria-pressed={!locked} onClick={() => setLocked(false)}>删除锁文件</button></div><div className={styles.lockLab}><div><small>机器 1</small><b>A1.3.1 · B2.0.4</b><output>已安装</output></div><div className={styles.lockLabSeal}>{locked ? "lock" : "?"}</div><div><small>机器 2</small><b>{locked ? "A1.3.1 · B2.0.4" : "A1.4.0 · B2.1.0"}</b><output>{locked ? "同一棵树" : "重新解析"}</output></div></div><Status title={locked ? "记录把选择变成证据" : "范围还在，选择已经漂移"} detail={locked ? "清单允许范围，锁文件记录这次实际解析；npm ci 可以按它复现。" : "删除锁文件不会更新依赖意图，只会让下一台机器重新面对仓库候选。"} /></div>;
}

export function MonorepoLesson() {
  const [changed, setChanged] = useState<"ui" | "api">("ui");
  const affected = changed === "ui" ? ["ui", "web"] : ["api"];
  return <div className={styles.toolLesson} role="region" aria-label="单体仓库影响范围演示"><LessonTop label="改一个包" title="目录相邻不代表都要重建" onReset={() => setChanged("ui")} resetLabel="重置单体仓库演示" /><div className={styles.toolButtons} role="group" aria-label="选择改动包"><button type="button" aria-pressed={changed === "ui"} onClick={() => setChanged("ui")}>改 ui</button><button type="button" aria-pressed={changed === "api"} onClick={() => setChanged("api")}>改 api</button></div><div className={styles.repoLab}><div className={styles.repoCard} data-active={affected.includes("web")}><strong>web</strong><small>{affected.includes("web") ? "进入构建" : "跳过"}</small></div><button type="button" data-active={changed === "ui"} onClick={() => setChanged("ui")}><strong>ui</strong><small>{affected.includes("ui") ? "进入构建" : "跳过"}</small></button><button type="button" data-active={changed === "api"} onClick={() => setChanged("api")}><strong>api</strong><small>{affected.includes("api") ? "进入构建" : "跳过"}</small></button></div><Status title={`${affected.length} / 3 个项目进入构建`} detail={changed === "ui" ? "web 依赖 ui，所以共享包变化向上游传播；api 没有这条边。" : "api 独立变化只影响自己的构建，monorepo 没有把它变成一个部署单元。"} /></div>;
}

export function EnvironmentVariableLesson() {
  const [value, setValue] = useState("dev");
  const [processValue, setProcessValue] = useState("dev");
  const synced = processValue === value;
  return <div className={styles.toolLesson} role="region" aria-label="环境变量进程快照演示"><LessonTop label="进程快照" title="改变量和重启进程是两件事" onReset={() => { setValue("dev"); setProcessValue("dev"); }} resetLabel="重置环境变量演示" /><div className={styles.toolButtons} role="group" aria-label="环境变量操作"><button type="button" onClick={() => setValue("prod")}>父环境改成 prod</button><button type="button" onClick={() => setProcessValue(value)} aria-pressed={synced}>重新启动进程</button></div><div className={styles.envLab}><label>父环境<output>{value}</output><input type="range" min="0" max="1" step="1" value={value === "dev" ? 0 : 1} onChange={event => setValue(event.target.value === "1" ? "prod" : "dev")} /></label><label>正在运行的进程<output>{processValue}</output><span>{synced ? "读取当前快照" : "仍持有启动时的副本"}</span></label></div><Status title={synced ? `进程已读取 ${value}` : `旧进程仍是 ${processValue}`} detail="环境变量是进程的入口，不是会自动刷新所有进程的全局变量；前端构建变量还可能进入浏览器资源。" /></div>;
}

export function SourceMapLesson() {
  const [mapped, setMapped] = useState(true);
  return <div className={styles.toolLesson} role="region" aria-label="源映射坐标对照演示"><LessonTop label="一次堆栈点击" title="映射存在时，坐标才有回家的路" onReset={() => setMapped(true)} resetLabel="重置源映射演示" /><div className={styles.toolButtons} role="group" aria-label="源映射状态"><button type="button" aria-pressed={mapped} onClick={() => setMapped(true)}>提供 map</button><button type="button" aria-pressed={!mapped} onClick={() => setMapped(false)}>不提供 map</button></div><div className={styles.mapLab}><button type="button" data-active={mapped} onClick={() => setMapped(true)}><code>bundle.js:1:240</code><strong>{mapped ? "→ src/app.ts:18:7" : "只能停在生成代码"}</strong></button><button type="button" data-active={!mapped} onClick={() => setMapped(false)}><code>sourceMappingURL</code><strong>{mapped ? "命中本次构建" : "找不到映射条目"}</strong></button></div><Status title={mapped ? "调试器高亮原始语句" : "运行没有改变，只有可读位置消失"} detail="source map 提供位置对照，不会修复错误；它可能包含路径或源码内容，发布范围要单独决定。" /></div>;
}

export function LinterLesson() {
  const [unused, setUnused] = useState(true);
  const [constant, setConstant] = useState(true);
  const count = Number(unused) + Number(constant);
  return <div className={styles.toolLesson} role="region" aria-label="代码检查器规则演示"><LessonTop label="两条规则" title="关掉报告，不等于代码变好了" onReset={() => { setUnused(true); setConstant(true); }} resetLabel="重置代码检查器演示" /><div className={styles.lintLab}><label><span>no-unused-vars · total</span><input type="checkbox" checked={unused} onChange={event => setUnused(event.target.checked)} /><output>{unused ? "报告" : "关闭"}</output></label><label><span>no-constant-condition · if(true)</span><input type="checkbox" checked={constant} onChange={event => setConstant(event.target.checked)} /><output>{constant ? "报告" : "关闭"}</output></label></div><Status title={`${count} 条诊断留在提交门口`} detail="linter 读取源码结构并按规则报告模式；关闭一条规则只是少看一条报告，不是完成测试或证明业务正确。" /></div>;
}

export function FormatterLesson() {
  const [width, setWidth] = useState(80);
  const code = width === 60
    ? "const items = [\n  \"alpha\",\n  \"beta\",\n  \"gamma\",\n  \"delta\",\n  \"epsilon\", // values remain\n];"
    : width === 80
      ? "const items = [\n  \"alpha\", \"beta\", \"gamma\",\n  \"delta\", \"epsilon\", // values remain in this order\n];"
      : width === 100
        ? "const items = [\"alpha\", \"beta\", \"gamma\",\n  \"delta\", \"epsilon\"]; // values remain in this order"
        : "const items = [\"alpha\", \"beta\", \"gamma\", \"delta\", \"epsilon\"]; // values remain in this order";
  const lines = code.split("\n").length;
  return <div className={styles.toolLesson} role="region" aria-label="格式化器折行演示"><LessonTop label="同一段数组" title="标尺改变换行，元素没有凭空增减" onReset={() => setWidth(80)} resetLabel="重置格式化器演示" /><div className={styles.formatLab}><label>行宽 {width}<input type="range" min="60" max="120" step="20" value={width} onChange={event => setWidth(Number(event.target.value))} /><output>· {lines} 行 · 5 项</output></label><code>{code}</code></div><Status title={`printWidth=${width} 只改变排版`} detail="格式化器按结构重新打印；它不是 linter，也不能替测试证明插件或配置没有改变程序行为。" /></div>;
}

export function ExpressionLesson() {
  const [price, setPrice] = useState(10);
  const result = price * 2 + 3;
  return <div className={styles.toolLesson} role="region" aria-label="表达式求值演示"><LessonTop label="一棵值树" title="只换一个叶子，上层结果重新求值" onReset={() => setPrice(10)} resetLabel="重置表达式演示" /><div className={styles.exprLab}><label>price = {price}<input type="range" min="10" max="12" step="1" value={price} onChange={event => setPrice(Number(event.target.value))} /><small>tax = 3 · 2 是常量</small></label><output>({price} × 2) + 3 = {result}</output></div><Status title={`根节点得到 ${result}`} detail="表达式的共同结果是一个值；console.log 的显示、赋值语句和副作用要分别判断。" /></div>;
}

export function FunctionLesson() {
  const [external, setExternal] = useState(false);
  const [frameOpen, setFrameOpen] = useState(false);
  const [calls, setCalls] = useState(0);
  const result = 60 + (external ? calls : 0);
  return <div className={styles.toolLesson} role="region" aria-label="函数局部调用帧演示"><LessonTop label="一次调用" title="局部参数每次重建，外部状态另算" onReset={() => { setExternal(false); setFrameOpen(false); setCalls(0); }} resetLabel="重置函数演示" /><div className={styles.functionLab}><div className={styles.toolButtons}><button type="button" aria-pressed={!external} onClick={() => setExternal(false)}>纯计算</button><button type="button" aria-pressed={external} onClick={() => setExternal(true)}>读外部计数</button><button type="button" onClick={() => { if (!frameOpen) setCalls(value => value + 1); setFrameOpen(value => !value); }}>{frameOpen ? "return 结果" : "调用 calculate(20, 3)"}</button></div><div className={styles.functionFrameLab} data-open={frameOpen}><span>局部调用帧</span><strong>{frameOpen ? "price=20 · count=3" : "已弹出"}</strong><small>{frameOpen ? "参数已入栈，函数体正在求值" : "等待下一次调用"}</small></div><output>本次结果：{result}<br />栈深度：{frameOpen ? "0 → 1" : calls ? "1 → 0" : "0"}</output></div><Status title={frameOpen ? "调用帧已入栈" : calls ? "返回值已交回调用方" : "还没有调用"} detail={external ? "同样的实参也可能因函数读取外部状态而得到不同结果；函数仍然是函数。" : "定义、调用、局部帧和返回值是可复用行为的骨架，纯度要另行检查。"} /></div>;
}

export function ParameterLesson() {
  const [variant, setVariant] = useState<"full" | "default" | "swap">("full");
  const output = variant === "full" ? "price=100 · rate=0.2" : variant === "default" ? "price=100 · rate=0.2（默认）" : "price=0.2 · rate=100（顺序交换）";
  const slots = variant === "swap" ? [["price", "0.2"], ["rate", "100"]] : [["price", "100"], ["rate", variant === "default" ? "0.2 · 默认" : "0.2"]];
  return <div className={styles.toolLesson} role="region" aria-label="参数绑定演示"><LessonTop label="一次调用" title="绑定负责放值，不负责替你理解业务" onReset={() => setVariant("full")} resetLabel="重置参数演示" /><div className={styles.toolButtons} role="group" aria-label="参数调用形式"><button type="button" aria-pressed={variant === "full"} onClick={() => setVariant("full")}>discount(100, 0.2)</button><button type="button" aria-pressed={variant === "default"} onClick={() => setVariant("default")}>discount(100)</button><button type="button" aria-pressed={variant === "swap"} onClick={() => setVariant("swap")}>discount(0.2, 100)</button></div><div className={styles.parameterLab}><code>discount(price, rate = 0.2)</code><div className={styles.parameterBinding}>{slots.map(([name, value]) => <div className={styles.parameterBindingSlot} data-warning={variant === "swap"} key={name}><span>{name}</span><strong>{value}</strong></div>)}</div><output>{output}</output></div><Status title={variant === "swap" ? "函数照位置接收了不合业务的值" : variant === "default" ? "缺少实参，使用定义里的默认值" : "两个实参落入对应槽位"} detail="参数是定义里的名称，实参是本次调用的值；类型、范围和业务含义仍要由语言或函数自己检查。" /></div>;
}

export function ReturnValueLesson() {
  const [hasReturn, setHasReturn] = useState(true);
  return <div className={styles.toolLesson} role="region" aria-label="返回值通道演示"><LessonTop label="同一段函数" title="控制台看到了，不代表调用方拿到了" onReset={() => setHasReturn(true)} resetLabel="重置返回值演示" /><div className={styles.toolButtons} role="group" aria-label="返回语句"><button type="button" aria-pressed={hasReturn} onClick={() => setHasReturn(true)}>保留 return 8</button><button type="button" aria-pressed={!hasReturn} onClick={() => setHasReturn(false)}>删除 return</button></div><div className={styles.returnLab}><div className={styles.returnLog}>console.log(8)<br /><small>控制台：8（始终显示）</small></div><output>result = double(4)<br />{hasReturn ? "result：8" : "result：undefined"}</output></div><Status title={hasReturn ? "返回通道打开，调用方收到 8" : "日志仍显示 8，但调用结果是 undefined"} detail="return 结束本次调用并交值；打印和直接修改外部状态是另外两条路径。" /></div>;
}
