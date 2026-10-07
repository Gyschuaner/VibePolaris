export type RetrievalMode = "keyword" | "semantic" | "hybrid";
export type RetrievalScope = "all" | "policy" | "revoked";
export type RetrievalTopK = 1 | 3;

export type RetrievalCandidate = {
  id: "policy" | "faq" | "account";
  title: string;
  detail: string;
  score: number;
  source: string | null;
  match: string;
};

export type RetrievalDemoState = {
  mode: RetrievalMode;
  scope: RetrievalScope;
  topK: RetrievalTopK;
  drawerOpen: boolean;
  railStep: number;
  candidates: RetrievalCandidate[];
  visible: RetrievalCandidate[];
  selected: RetrievalCandidate | null;
  unsupportedRemoved: boolean;
  status: "waiting" | "candidate" | "missing" | "citable";
  statusLabel: string;
  statusDetail: string;
};

const candidateSet: Record<RetrievalMode, RetrievalCandidate[]> = {
  keyword: [
    { id: "policy", title: "退款政策", detail: "课程退订 · 第 2 节", score: 0.96, source: "policy-v3 §2", match: "退款 · 到账" },
    { id: "faq", title: "用户问答摘录", detail: "“多久到账？”", score: 0.62, source: null, match: "到账" },
    { id: "account", title: "账户结算说明", detail: "支付渠道 · 第 4 节", score: 0.44, source: "billing-v2 §4", match: "结算" },
  ],
  semantic: [
    { id: "faq", title: "用户问答摘录", detail: "“多久到账？”", score: 0.94, source: null, match: "意思接近" },
    { id: "policy", title: "退款政策", detail: "课程退订 · 第 2 节", score: 0.88, source: "policy-v3 §2", match: "语义相近" },
    { id: "account", title: "账户结算说明", detail: "支付渠道 · 第 4 节", score: 0.57, source: "billing-v2 §4", match: "部分相近" },
  ],
  hybrid: [
    { id: "policy", title: "退款政策", detail: "课程退订 · 第 2 节", score: 0.91, source: "policy-v3 §2", match: "词项 + 语义" },
    { id: "faq", title: "用户问答摘录", detail: "“多久到账？”", score: 0.84, source: null, match: "语义命中" },
    { id: "account", title: "账户结算说明", detail: "支付渠道 · 第 4 节", score: 0.54, source: "billing-v2 §4", match: "词项较少" },
  ],
};

export function getRetrievalDemoState(
  step: number,
  mode: RetrievalMode,
  topK: RetrievalTopK,
  scope: RetrievalScope,
  unsupportedRemoved = false,
): RetrievalDemoState {
  const currentStep = Math.max(0, Math.min(5, step));
  const candidates = candidateSet[mode];
  const filtered = scope === "revoked" ? [] : candidates.filter((candidate) => scope === "all" || candidate.id === "policy");
  const available = filtered.filter((candidate) => !(unsupportedRemoved && candidate.source === null));
  const visible = available.slice(0, topK);
  const selected = currentStep >= 2 ? visible[0] ?? null : null;
  const drawerOpen = currentStep >= 1;
  const railStep = currentStep < 2 ? 0 : currentStep < 4 ? 1 : 2;
  const status: RetrievalDemoState["status"] = !selected
    ? currentStep >= 2 ? "missing" : "waiting"
    : selected.source === null
      ? "missing"
      : currentStep >= 5
        ? "citable"
        : "candidate";
  const statusLabel = status === "waiting"
    ? "等待抽屉打开"
    : status === "missing"
      ? "缺证据 · 不生成结论"
      : status === "citable"
        ? "有来源候选 · 仍需核对"
        : "候选已返回 · 还不是答案";
  const statusDetail = status === "missing"
    ? selected
      ? "最高分卡片没有来源 ID；把相似度当成事实会越过引用闸门。"
      : "当前范围没有可交付的候选；检索空集不能凭空补答案。"
    : status === "citable"
      ? `${selected?.source} · 只交付原文位置，生成回答仍是下一步。`
      : selected
        ? `${selected.source ?? "无来源"} · top-${topK} 只表示当前带回的数量。`
        : "查询还没有进入资料抽屉。";
  return {
    mode,
    scope,
    topK,
    drawerOpen,
    railStep,
    candidates,
    visible,
    selected,
    unsupportedRemoved,
    status,
    statusLabel,
    statusDetail,
  };
}

export function retrievalModeLabel(mode: RetrievalMode) {
  return mode === "keyword" ? "词项" : mode === "semantic" ? "语义" : "混合";
}
