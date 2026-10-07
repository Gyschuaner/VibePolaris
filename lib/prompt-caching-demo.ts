export type PromptCachingEdit = "question" | "tools" | "system";
export type PromptCachingDemoStatus = "idle" | "saved" | "hit" | "partial" | "miss";

export type PromptCachingSegment = {
  id: "system" | "tools" | "format" | "question";
  label: string;
  detail: string;
  state: "base" | "reused" | "changed" | "recompute";
};

export type PromptCachingDemoState = {
  step: number;
  edit: PromptCachingEdit;
  sameModel: boolean;
  cacheFresh: boolean;
  cacheSaved: boolean;
  reusedSegments: number;
  status: PromptCachingDemoStatus;
  statusLabel: string;
  statusDetail: string;
  cacheStamp: string;
  response: string;
  segments: PromptCachingSegment[];
};

const segments: Array<Omit<PromptCachingSegment, "state">> = [
  { id: "system", label: "系统规则", detail: "用中文回答，并遵守退款口径" },
  { id: "tools", label: "工具说明", detail: "billing.lookup · policy-v3" },
  { id: "format", label: "输出格式", detail: "先给结论，再给原文位置" },
  { id: "question", label: "本次问题", detail: "退款多久到账？" },
];

export function getPromptCachingDemoState(
  step: number,
  edit: PromptCachingEdit = "question",
  sameModel = true,
  cacheFresh = true,
): PromptCachingDemoState {
  const currentStep = Math.max(0, Math.min(5, step));
  const cacheSaved = currentStep >= 1;
  const canReuse = cacheSaved && sameModel && cacheFresh && currentStep >= 2;
  const firstChangedIndex = edit === "question" ? 3 : edit === "tools" ? 1 : 0;
  const reusedSegments = canReuse ? firstChangedIndex : 0;
  const status: PromptCachingDemoStatus = !cacheSaved
    ? "idle"
    : currentStep < 2
      ? "saved"
      : !sameModel || !cacheFresh
        ? "miss"
        : reusedSegments === segments.length - 1
          ? "hit"
          : reusedSegments > 0
            ? "partial"
            : "miss";
  const statusLabel = status === "idle"
    ? "底片还没叠印"
    : status === "saved"
      ? "缓存章已盖下"
      : status === "hit"
        ? "前缀命中 · 复用 3 段"
        : status === "partial"
          ? `前缀在第 ${reusedSegments + 1} 段断开`
          : "没有可复用前缀";
  const statusDetail = status === "idle"
    ? "先处理稳定底片，才能留下下一次可复用的中间计算。"
    : status === "saved"
      ? "缓存保存的是读过前缀的计算，不是上一轮的最终答案。"
      : status === "hit"
        ? "只换问题便签，前三段仍从开头连续相同；回答仍按本次问题重新生成。"
        : status === "partial"
          ? "第二段变了，第三段即使文字没变，也不能越过新的前文继续复用。"
          : !sameModel
            ? "模型变了，不能把另一个模型的中间状态当成当前模型的缓存。"
            : !cacheFresh
              ? "缓存章已经褪色；以前处理过不代表现在仍保留状态。"
              : "第一段发生变化，连续前缀从开头就不再匹配。";
  const segmentStates = segments.map((segment, index): PromptCachingSegment => ({
    ...segment,
    state: !cacheSaved
      ? "base"
      : currentStep < 2
        ? "base"
        : index < reusedSegments
          ? "reused"
          : index === firstChangedIndex && (edit !== "question" || currentStep >= 2)
            ? "changed"
            : "recompute",
  }));
  const cacheStamp = !cacheSaved
    ? "未盖章"
    : status === "saved"
      ? "写入 3/4 段"
      : reusedSegments > 0
        ? `命中 ${reusedSegments}/4 段`
        : "命中 0/4 段";
  const response = edit === "tools"
    ? "本次新回答：读取 policy-v3 后生成"
    : edit === "system"
      ? "本次新回答：按新规则生成"
      : "本次新回答：回答“退款多久到账？”";
  return {
    step: currentStep,
    edit,
    sameModel,
    cacheFresh,
    cacheSaved,
    reusedSegments,
    status,
    statusLabel,
    statusDetail,
    cacheStamp,
    response,
    segments: segmentStates,
  };
}

export const promptCachingEditLabels: Record<PromptCachingEdit, string> = {
  question: "换问题便签",
  tools: "改工具说明",
  system: "改系统规则",
};
