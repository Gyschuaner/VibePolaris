export type RoutingTask = "extract" | "analysis" | "image";
export type RoutingThreshold = 90 | 95 | 98;
export type RoutingCandidateId = "A" | "B";
export type RoutingCandidateState = "idle" | "eligible" | "picked" | "blocked" | "unavailable";
export type RoutingDialStatus = "ticket" | "weighing" | "chosen" | "blocked";

export const routingTaskLabels: Record<RoutingTask, string> = {
  extract: "提取订单金额",
  analysis: "分析多项条款",
  image: "读取订单截图",
};

export const routingThresholds: RoutingThreshold[] = [90, 95, 98];

const modelTable: Array<{ id: RoutingCandidateId; label: string; cost: number; scores: Record<RoutingTask, number | null> }> = [
  { id: "A", label: "轻量模型 A", cost: 1, scores: { extract: 96, analysis: 76, image: null } },
  { id: "B", label: "强模型 B", cost: 3, scores: { extract: 97, analysis: 92, image: 94 } },
];

const dialAngles = [0, 72, 142, 214, 286, 344];

export type RoutingCandidate = {
  id: RoutingCandidateId;
  label: string;
  cost: number;
  score: number | null;
  reason: string;
  eligible: boolean;
  state: RoutingCandidateState;
};

export type RoutingDialState = {
  step: number;
  task: RoutingTask;
  threshold: RoutingThreshold;
  availableB: boolean;
  status: RoutingDialStatus;
  selected: RoutingCandidateId | null;
  pointer: number;
  dialLabel: string;
  ticketLabel: string;
  ticketDetail: string;
  statusLabel: string;
  statusDetail: string;
  candidates: RoutingCandidate[];
};

export function getRoutingDialState(
  step: number,
  task: RoutingTask = "extract",
  threshold: RoutingThreshold = 90,
  availableB = true,
): RoutingDialState {
  const safeStep = Math.min(5, Math.max(0, Math.floor(step)));
  const candidates = modelTable.map((model) => {
    const score = model.scores[task];
    const reason = model.id === "B" && !availableB
      ? "当前不可用"
      : score === null
        ? "不支持图片输入"
        : score < threshold
          ? `离线分数低于 ${threshold}`
          : "达到本例门槛";
    return {
      ...model,
      score,
      reason,
      eligible: reason === "达到本例门槛",
      state: "idle" as RoutingCandidateState,
    };
  });

  const eligible = candidates.filter((candidate) => candidate.eligible);
  const selected = eligible.sort((left, right) => left.cost - right.cost)[0]?.id ?? null;
  const status: RoutingDialStatus = safeStep === 0 ? "ticket" : safeStep === 1 ? "weighing" : selected ? "chosen" : "blocked";
  const visibleSelection = safeStep >= 2 ? selected : null;
  const dialLabel = safeStep === 0
    ? "等候拆票"
    : safeStep === 1
      ? `门槛 ${threshold} / 100`
      : visibleSelection
        ? `钉住 ${visibleSelection} · ${routingTaskLabels[task]}`
        : "无可用候选";
  const ticketLabel = routingTaskLabels[task];
  const ticketDetail = task === "extract" ? "文本字段 · 低延迟" : task === "analysis" ? "多条款 · 质量优先" : "图片输入 · 需要视觉能力";
  const statusLabel = safeStep === 0
    ? "先看工单，再拨选择盘"
    : safeStep === 1
      ? "候选正在接受同一把门槛"
      : visibleSelection
        ? `请求交给 ${visibleSelection}`
        : "选择停在调用之前";
  const statusDetail = safeStep === 0
    ? "模型还没有被调用；路由只准备做选择。"
    : safeStep === 1
      ? "离线分数只是本例的筛选依据，不是这次回答的正确性保证。"
      : visibleSelection
        ? `${routingTaskLabels[task]}在满足门槛的候选中选择费用较低者；这一步还没有生成回答。`
        : "没有候选时保留限制，不降低门槛，也不把未执行当成完成。";

  return {
    step: safeStep,
    task,
    threshold,
    availableB,
    status,
    selected: visibleSelection,
    pointer: dialAngles[safeStep],
    dialLabel,
    ticketLabel,
    ticketDetail,
    statusLabel,
    statusDetail,
    candidates: candidates.map((candidate) => ({
      ...candidate,
      state: candidate.id === visibleSelection
        ? "picked"
        : candidate.id === "B" && !availableB
          ? "unavailable"
          : safeStep < 2
            ? candidate.eligible ? "eligible" : "blocked"
            : candidate.eligible ? "idle" : "blocked",
    })),
  };
}
