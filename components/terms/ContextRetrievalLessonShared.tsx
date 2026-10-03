"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Database,
  FileText,
  Funnel,
  LockSimple,
  MagnifyingGlass,
  Memory,
  ShieldCheck,
  Warning,
} from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { Caption } from "./AiStackConceptLessonShared";
import { useResetOnSceneStart } from "./AgentConceptLessonShared";
import styles from "./ConceptArticle.module.css";

export type ContextRetrievalMode =
  | "context-window"
  | "agent-loop"
  | "agent-memory"
  | "working-memory"
  | "execution-sandbox"
  | "embedding"
  | "vector-store"
  | "retrieval"
  | "chunking"
  | "reranking";

const captions: Record<ContextRetrievalMode, { labels: string[]; titles: string[]; copy: string[] }> = {
  "context-window": {
    labels: ["预算进入", "加入材料", "保留输出"],
    titles: ["输入和输出共用一份预算", "材料变多会挤占空间", "超出时先处理上下文"],
    copy: ["16k 的一次请求先为回答预留 2k，系统指令占 2k。", "历史对话和工具结果一起进入，输入总量已到 15k。", "再加一段旧消息会超限；演示把最早一段移出，才保住输出区。"],
  },
  "agent-loop": {
    labels: ["读取状态", "执行一步", "判断停止"],
    titles: ["循环从当前状态开始", "结果必须回到状态", "完成或达到上限才停"],
    copy: ["任务还有 2 个检查项，允许最多 3 轮工具调用。", "测试指出 disabled 状态仍错误，下一步改动只针对这个结果。", "修复后测试通过，循环停止；没有通过时不能把计划写成完成。"],
  },
  "agent-memory": {
    labels: ["取得同意", "取回记录", "纠正或删除"],
    titles: ["保存是一项明确的应用决定", "只取回当前任务相关的记录", "旧记录可以被纠正或删除"],
    copy: ["用户同意保存“代码示例优先 TypeScript”这一偏好。", "新会话只取回与代码示例相关的一条记录，并标出来源时间。", "用户撤回后记录消失；已经生成的旧回答不会被倒写。"],
  },
  "working-memory": {
    labels: ["写入任务状态", "更新候选", "交付后清理"],
    titles: ["工作记忆只服务当前任务", "工具结果会改变下一步", "临时状态和交付结果分开"],
    copy: ["预算、候选清单和调用次数放进当前任务快照。", "价格和库存结果让候选从 5 个收敛到 2 个。", "清掉临时清单与计数；已经交付的两个候选是否长期保存另行决定。"],
  },
  "execution-sandbox": {
    labels: ["进入隔离环境", "拦截访问", "到时销毁"],
    titles: ["先声明可访问范围", "每个越界动作都有独立结果", "限制不是安全保证"],
    copy: ["脚本只得到临时目录、无外网和 2 秒 CPU 预算。", "读项目文件与网络请求被拒；标准输出仍可收集。", "时间到后进程终止、临时目录销毁；内核或配置漏洞仍需另外防护。"],
  },
  embedding: {
    labels: ["编码输入", "比较距离", "返回相近项"],
    titles: ["文字先变成向量", "距离只是表示空间里的关系", "结果仍需回到原文"],
    copy: ["“忘记密码”和三条句子分别得到向量；二维点只是教学投影。", "前两条距离较近，改写查询后相似度会变化。", "系统返回相近原文和分数，不直接生成答案或证明事实。"],
  },
  "vector-store": {
    labels: ["写入索引", "套用过滤", "返回候选"],
    titles: ["向量和原文标识一起存", "元数据会改变候选范围", "存储器不替你判断事实"],
    copy: ["每条记录带向量、文档 ID、版本和权限标签。", "打开“只看 2026 版”过滤后，近邻候选从 20 条变成 7 条。", "返回相似度和来源位置，应用还要检查版本、权限和正文。"],
  },
  retrieval: {
    labels: ["提交查询", "召回候选", "停在原文"],
    titles: ["检索只负责找材料", "top-k 决定带回多少候选", "没有生成结论"],
    copy: ["问题“退款多久到账”进入一个含 200 段资料的库。", "改变 top-k 后，候选集合从 1 条扩到 3 条；每条仍带来源 ID。", "流程停在原文卡片，下一步是否生成答案属于 RAG 或应用逻辑。"],
  },
  chunking: {
    labels: ["展开文档", "切分规则", "检查命中"],
    titles: ["长文先被切成可索引单元", "长度和重叠改变上下文", "命中不等于完整理解"],
    copy: ["一篇 2400 字政策文档先保留标题、段落和页码。", "从 800 字无重叠切换到 500 字并重叠 100 字，块数和边界随之变化。", "查询命中包含定义的第 4 块；仍要核对相邻条件是否被切走。"],
  },
  reranking: {
    labels: ["初次召回", "重新评分", "截取结果"],
    titles: ["重排只接收已有候选", "更精细的比较改变顺序", "漏召回的内容回不来"],
    copy: ["快速召回先给 A、B、C 三条，候选范围已经确定。", "重排器把查询和每条正文放在一起比较，B 的分数升到第一。", "只保留前两条；全库里从未进入候选的 D 不会被这一步补回。"],
  },
};

export function ContextRetrievalLesson({ mode }: { mode: ContextRetrievalMode }) {
  const scene = useScene(3);
  const [history, setHistory] = useState<"short" | "long">("short");
  const [turnLimit, setTurnLimit] = useState<2 | 3>(3);
  const [memoryAction, setMemoryAction] = useState<"none" | "saved" | "deleted">("none");
  const [workingPhase, setWorkingPhase] = useState<"five" | "two">("five");
  const [sandbox, setSandbox] = useState({ file: false, network: false, time: false });
  const [query, setQuery] = useState<"password" | "avatar">("password");
  const [filtered, setFiltered] = useState(false);
  const [topK, setTopK] = useState<1 | 3>(3);
  const [chunkRule, setChunkRule] = useState<"large" | "overlap">("large");
  const [rankBasis, setRankBasis] = useState<"first" | "rerank">("first");

  useResetOnSceneStart(scene, () => {
    setHistory("short");
    setTurnLimit(3);
    setMemoryAction("none");
    setWorkingPhase("five");
    setSandbox({ file: false, network: false, time: false });
    setQuery("password");
    setFiltered(false);
    setTopK(3);
    setChunkRule("large");
    setRankBasis("first");
  });

  const caption = captions[mode];
  const captionCopy = mode === "context-window"
    ? history === "long"
      ? caption.copy
      : [caption.copy[0], "历史对话和工具结果一起进入，输入总量目前为 12k，输出区仍要保留。", "再加一段旧消息会超限；切换长历史后才会进入裁剪分支。"]
    : mode === "agent-memory"
      ? [memoryAction === "saved" ? "用户已同意保存一项偏好，记录带有来源和时间。" : "应用先请求保存同意；当前记录仍为空。", memoryAction === "saved" ? caption.copy[1] : "当前没有可取回的相关记录。", memoryAction === "deleted" ? caption.copy[2] : "用户可以纠正或删除，旧回答不会被倒写。"]
      : mode === "working-memory"
        ? [caption.copy[0], "价格和库存结果让候选从 5 个逐步收敛，下一阶段交付 2 个。", caption.copy[2]]
        : mode === "execution-sandbox"
          ? [caption.copy[0], `${sandbox.file ? "文件允许" : "文件被拒"} · ${sandbox.network ? "网络允许" : "网络被拒"}；标准输出仍可收集。`, sandbox.file && sandbox.network && sandbox.time ? caption.copy[2] : "仍有访问范围未开放；逐项检查后，才会在到时销毁环境。"]
          : mode === "vector-store"
            ? [caption.copy[0], filtered ? caption.copy[1] : "候选范围仍为 20 条；打开版本过滤后才会变成 7 条。", caption.copy[2]]
            : mode === "chunking"
              ? [caption.copy[0], chunkRule === "overlap" ? caption.copy[1] : "当前仍是 800 字、无重叠；切换规则后才会看到 500/100 的边界。", chunkRule === "overlap" ? caption.copy[2] : "当前规则只有 3 块；命中后仍需核对相邻条件。"]
              : mode === "reranking"
                ? [caption.copy[0], rankBasis === "rerank" ? caption.copy[1] : "当前仍按召回分排序；切换重排分后 B 才会升到第一。", rankBasis === "rerank" ? caption.copy[2] : "尚未重排；全库里从未进入候选的 D 仍不会出现。"]
                : caption.copy;
  const controls = <Caption scene={scene} labels={caption.labels} titles={caption.titles} copy={captionCopy} />;

  if (mode === "context-window") {
    const used = history === "short" ? 12 : 15;
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="上下文窗口预算演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="改变历史材料长度">
        <button type="button" aria-pressed={history === "short"} onClick={() => { setHistory("short"); scene.seek(2); }}>短历史 · 12k</button>
        <button type="button" aria-pressed={history === "long"} onClick={() => { setHistory("long"); scene.seek(2); }}>长历史 · 15k</button>
      </div>
      <div className={styles.contract}><div><FileText size={25} /><h3>输入</h3><p>系统 2k + 历史 {used - 2}k</p></div><ArrowRight size={20} /><div><Memory size={25} /><h3>窗口 16k</h3><p>{used}k 已占用 · 输出预留 2k</p></div><ArrowRight size={20} /><div>{history === "long" && scene.step === 2 ? <Warning size={25} /> : <CheckCircle size={25} />}<h3>{history === "long" && scene.step === 2 ? "裁剪最早消息" : "可生成"}</h3><p>{history === "long" && scene.step === 2 ? "先处理输入，不能假装全部可见" : "输出区仍有预算"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>{history === "long" && scene.step === 2 ? "长历史挤占输入预算；裁剪或压缩发生后，模型看到的内容已经不同。" : "窗口是一次请求的总预算，不是长期记忆，也不保证每个位置同样容易利用。"}</p>
    </div>;
  }

  if (mode === "agent-loop") {
    const calls = scene.step === 0 ? 0 : scene.step === 1 ? 1 : 2;
    const done = scene.step === 2 && turnLimit === 3;
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="智能体循环演示">
      {controls}
      <label className={styles.inputExample}>最多轮数 <select value={turnLimit} onChange={(event) => { setTurnLimit(Number(event.target.value) as 2 | 3); scene.seek(2); }}><option value={2}>2 轮</option><option value={3}>3 轮</option></select></label>
      <div className={styles.contract}><div><MagnifyingGlass size={25} /><h3>当前状态</h3><p>待修复清单 {done ? "2/2" : "1/2"}</p></div><ArrowRight size={20} /><div><Database size={25} /><h3>工具结果</h3><p>测试 {calls ? "失败 → 修复 → 通过" : "尚未运行"}</p></div><ArrowRight size={20} /><div>{done ? <CheckCircle size={25} /> : <Warning size={25} />}<h3>{done ? "停止" : turnLimit === 2 && scene.step === 2 ? "达到上限" : "继续"}</h3><p>{done ? "条件满足" : turnLimit === 2 && scene.step === 2 ? "不能写成完成" : "状态仍未收敛"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>每轮必须把结果写回当前状态；没有停止条件的重复调用不等于完成任务。</p>
    </div>;
  }

  if (mode === "agent-memory") {
    const saved = memoryAction === "saved";
    const deleted = memoryAction === "deleted";
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="智能体记忆生命周期演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="记忆操作"><button type="button" aria-pressed={saved} onClick={() => { setMemoryAction("saved"); scene.seek(1); }}>保存偏好</button><button type="button" aria-pressed={deleted} onClick={() => { setMemoryAction("deleted"); scene.seek(2); }}>纠正并删除</button></div>
      <div className={styles.contract}><div><Memory size={25} /><h3>记录</h3><p>{saved && !deleted ? "TypeScript · 用户同意 · 2026-10" : "暂无长期偏好"}</p></div><ArrowRight size={20} /><div><MagnifyingGlass size={25} /><h3>取回</h3><p>{saved && !deleted ? "代码任务命中 1 条" : "没有可用记录"}</p></div><ArrowRight size={20} /><div>{deleted ? <CheckCircle size={25} /> : <LockSimple size={25} />}<h3>{deleted ? "可撤回" : "需同意"}</h3><p>{deleted ? "旧回答不被倒写" : "不自动保存聊天"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>记忆是应用管理的持久记录；取回、纠正、失效和删除都要有明确规则。</p>
    </div>;
  }

  if (mode === "working-memory") {
    const delivered = scene.step === 2;
    const count = delivered ? 0 : scene.step === 1 ? 3 : workingPhase === "five" ? 5 : 2;
    const calls = delivered ? 0 : scene.step === 1 ? 1 : workingPhase === "two" ? 2 : 0;
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工作记忆状态演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="推进任务状态"><button type="button" aria-pressed={workingPhase === "five"} onClick={() => { setWorkingPhase("five"); scene.seek(0); }}>5 个候选</button><button type="button" aria-pressed={workingPhase === "two"} onClick={() => { setWorkingPhase("two"); scene.seek(2); }}>筛到 2 个</button></div>
      <div className={styles.contract}><div><FileText size={25} /><h3>当前目标</h3><p>预算 ≤ 500 · 需要有货</p></div><ArrowRight size={20} /><div><Database size={25} /><h3>工作状态</h3><p>{delivered ? "临时状态已清理" : `候选 ${count} · 调用 ${calls}`}</p></div><ArrowRight size={20} /><div>{delivered ? <CheckCircle size={25} /> : <LockSimple size={25} />}<h3>{delivered ? "交付" : "进行中"}</h3><p>{delivered ? "结果保留 2 个" : "结果会改写下一步"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>工作记忆是本轮任务的可变状态；它和跨会话偏好、最终交付物不是同一层。</p>
    </div>;
  }

  if (mode === "execution-sandbox") {
    const blocked = !sandbox.file || !sandbox.network || !sandbox.time;
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="执行沙箱权限演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="沙箱权限开关">{(["file", "network", "time"] as const).map((key) => <button key={key} type="button" aria-pressed={sandbox[key]} onClick={() => { setSandbox((current) => ({ ...current, [key]: !current[key] })); scene.seek(1); }}>{key === "file" ? "项目文件" : key === "network" ? "外网" : "运行时间"}</button>)}</div>
      <div className={styles.contract}><div><ShieldCheck size={25} /><h3>允许范围</h3><p>临时目录 · 标准输出</p></div><ArrowRight size={20} /><div><LockSimple size={25} /><h3>请求访问</h3><p>{sandbox.file ? "文件允许" : "文件被拒"} · {sandbox.network ? "网络允许" : "网络被拒"}</p></div><ArrowRight size={20} /><div>{blocked ? <Warning size={25} /> : <CheckCircle size={25} />}<h3>{blocked ? "仍需限制" : "达到演示上限"}</h3><p>{blocked ? "限制面没有自动消失" : "2 秒后销毁环境"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>沙箱减少访问范围，但不能被解释为绝对安全；配置、内核、依赖和结果检查仍是独立责任。</p>
    </div>;
  }

  if (mode === "embedding") {
    const near = query === "password" ? "重置密码 · 0.88" : "修改头像 · 0.84";
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="嵌入向量相似度演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="改变查询"> <button type="button" aria-pressed={query === "password"} onClick={() => { setQuery("password"); scene.seek(2); }}>忘记密码</button><button type="button" aria-pressed={query === "avatar"} onClick={() => { setQuery("avatar"); scene.seek(2); }}>怎么换头像</button></div>
      <div className={styles.contract}><div><FileText size={25} /><h3>查询向量</h3><p>{query === "password" ? "[0.12, 0.81, …]" : "[0.66, 0.21, …]"}</p></div><ArrowRight size={20} /><div><MagnifyingGlass size={25} /><h3>距离比较</h3><p>三条原文各有一条相似度</p></div><ArrowRight size={20} /><div><CheckCircle size={25} /><h3>相近候选</h3><p>{scene.step === 2 ? near : "等待比较"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>向量只提供表示空间里的相近关系；返回的原文仍要被应用核对，嵌入本身不会生成答案。</p>
    </div>;
  }

  if (mode === "vector-store") {
    const candidates = filtered ? 7 : 20;
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="向量存储索引演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="元数据过滤"><button type="button" aria-pressed={filtered} onClick={() => { setFiltered((value) => !value); scene.seek(1); }}>{filtered ? "关闭 2026 版本过滤" : "只看 2026 版本"}</button></div>
      <div className={styles.contract}><div><Database size={25} /><h3>索引记录</h3><p>向量 + 文档 ID + 版本</p></div><ArrowRight size={20} /><div><Funnel size={25} /><h3>候选范围</h3><p>近邻 20 → {candidates}</p></div><ArrowRight size={20} /><div><CheckCircle size={25} /><h3>返回</h3><p>top 5 原文位置和分数</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>过滤条件改变的是可搜索范围；向量存储不会因为保存过文档就自动知道哪条事实最新。</p>
    </div>;
  }

  if (mode === "retrieval") {
    const result = topK === 1 ? "退款政策" : "退款政策 · 退订课程 · 账户注销";
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="检索候选演示">
      {controls}
      <label className={styles.inputExample}>返回候选数量 <select value={topK} onChange={(event) => { setTopK(Number(event.target.value) as 1 | 3); scene.seek(1); }}><option value={1}>top-1</option><option value={3}>top-3</option></select></label>
      <div className={styles.contract}><div><MagnifyingGlass size={25} /><h3>查询</h3><p>退款多久到账</p></div><ArrowRight size={20} /><div><Database size={25} /><h3>候选</h3><p>{result}</p></div><ArrowRight size={20} /><div><LockSimple size={25} /><h3>停止</h3><p>只交付原文，不生成结论</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>top-k 只改变带回的候选数量；检索和生成回答是两个阶段，不能把候选命中写成事实成立。</p>
    </div>;
  }

  if (mode === "chunking") {
    const result = chunkRule === "large" ? "3 块 · 边界较少" : "6 块 · 保留 100 字重叠";
    const hit = chunkRule === "large" ? "命中第 2 块" : "命中第 4 块";
    return <div className={styles.lab} ref={scene.ref} role="region" aria-label="文档分块规则演示">
      {controls}
      <div className={styles.choices} role="group" aria-label="切换分块规则"><button type="button" aria-pressed={chunkRule === "large"} onClick={() => { setChunkRule("large"); scene.seek(1); }}>800 字，无重叠</button><button type="button" aria-pressed={chunkRule === "overlap"} onClick={() => { setChunkRule("overlap"); scene.seek(1); }}>500 字，重叠 100</button></div>
      <div className={styles.contract}><div><FileText size={25} /><h3>长文档</h3><p>2400 字 · 标题和页码保留</p></div><ArrowRight size={20} /><div><Database size={25} /><h3>切分结果</h3><p>{result}</p></div><ArrowRight size={20} /><div>{scene.step === 2 ? <CheckCircle size={25} /> : <Warning size={25} />}<h3>{scene.step === 2 ? hit : "等待检查"}</h3><p>{scene.step === 2 ? "相邻条件仍需核对" : "边界会改变可见上下文"}</p></div></div>
      <p className={styles.inputExample}><strong>可观察证据</strong>没有通用的最佳块大小；切得更小可能保留细节，也可能把标题和限制条件切开。</p>
    </div>;
  }

  const order = rankBasis === "first" ? "A 0.82 · B 0.78 · C 0.76" : "B 0.94 · A 0.71 · C 0.12";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="检索重排序演示">
    {controls}
    <div className={styles.choices} role="group" aria-label="切换排序依据"><button type="button" aria-pressed={rankBasis === "first"} onClick={() => { setRankBasis("first"); scene.seek(1); }}>召回分</button><button type="button" aria-pressed={rankBasis === "rerank"} onClick={() => { setRankBasis("rerank"); scene.seek(1); }}>重排分</button></div>
    <div className={styles.contract}><div><MagnifyingGlass size={25} /><h3>初次候选</h3><p>A · B · C 已进入范围</p></div><ArrowRight size={20} /><div><Funnel size={25} /><h3>当前顺序</h3><p>{order}</p></div><ArrowRight size={20} /><div>{rankBasis === "rerank" && scene.step === 2 ? <CheckCircle size={25} /> : <LockSimple size={25} />}<h3>{rankBasis === "rerank" && scene.step === 2 ? "截取 B、A" : "等待重排"}</h3><p>漏召回的 D 不会出现</p></div></div>
    <p className={styles.inputExample}><strong>可观察证据</strong>重排序只重新安排已有候选；它不能扫描全库，也不能把漏掉的资料补回。</p>
  </div>;
}
