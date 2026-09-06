// Deterministic teaching fixture: no model or filesystem requests are made.
export const feedback = [
  { id: "01", text: "搜索结果出来太慢", category: "性能" },
  { id: "02", text: "页面切换会卡顿", category: "性能" },
  { id: "03", text: "希望能导出 Markdown", category: "导出" },
  { id: "04", text: "需要批量下载笔记", category: "导出" },
  { id: "05", text: "想和同事共享词条", category: "协作" },
  { id: "06", text: "希望能一起编辑笔记", category: "协作" },
] as const;
export type SummaryGroup = { title: string; text: string; ids: string[] };
export function makeSummary(repaired: boolean): SummaryGroup[] {
  return [
    { title: "性能", text: "优化搜索与页面切换速度", ids: ["01", "02"] },
    { title: "导出", text: "支持 Markdown 与批量下载", ids: ["03", "04"] },
    { title: "协作", text: repaired ? "支持词条共享与共同编辑" : "支持词条共享", ids: repaired ? ["05", "06"] : ["05"] },
  ];
}
export function validateSummary(groups: SummaryGroup[]) {
  const ids = groups.flatMap(group => group.ids);
  const missing = feedback.filter(item => !ids.includes(item.id)).map(item => item.id);
  const unknown = ids.filter(id => !feedback.some(item => item.id === id));
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  return { missing, covered: feedback.length - missing.length, passed: missing.length === 0 && unknown.length === 0 && duplicates.length === 0 && groups.length === 3 };
}
export const frames = [
  { label: "把 6 条反馈整理成 3 类，保留来源。", phase: "ready", duration: 500 },
  { label: "模型请求读取文件，Harness 检查只读权限。", phase: "request", duration: 1700 },
  { label: "文件内容进入上下文。", phase: "read", duration: 2000 },
  { label: "模型生成第一版总结。", phase: "draft", duration: 2300 },
  { label: "验收发现：遗漏了 #06「共同编辑」。", phase: "check", duration: 3000 },
  { label: "Harness 把缺项交回模型，启动第二轮。", phase: "repair", duration: 2500 },
  { label: "补上共同编辑，再次检查全部来源。", phase: "verify", duration: 2400 },
  { label: "6 / 6 条反馈已覆盖，保存结果并停止。", phase: "done", duration: 0 },
] as const;
export type Simulation = { mode: "with" | "without"; frame: number; playing: boolean };
export type SimulationAction = { type: "mode"; mode: Simulation["mode"] } | { type: "reset" | "next" } | { type: "play" | "tick"; reduced?: boolean };
export const initialSimulation: Simulation = { mode: "with", frame: 0, playing: false };
export function simulation(state: Simulation, action: SimulationAction): Simulation {
  const last = state.mode === "with" ? frames.length - 1 : 1;
  switch (action.type) {
    case "mode": return { mode: action.mode, frame: 0, playing: false };
    case "reset": return { ...state, frame: 0, playing: false };
    case "next": return { ...state, frame: Math.min(state.frame + 1, last), playing: false };
    case "play": return state.playing ? { ...state, playing: false } : { ...state, frame: action.reduced ? last : state.frame === last ? 1 : Math.max(1, state.frame), playing: !action.reduced };
    case "tick": {
      if (!state.playing) return state;
      const frame = action.reduced ? last : Math.min(state.frame + 1, last);
      return { ...state, frame, playing: frame < last };
    }
  }
}
