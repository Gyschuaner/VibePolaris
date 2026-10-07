export type PromptTrustMode = "data" | "instruction";

export type PromptInjectionDemoState = {
  sourceVisible: boolean;
  promoted: boolean;
  proposed: boolean;
  blocked: boolean;
  summaryReady: boolean;
  status: string;
};

export function getPromptInjectionDemoState(step: number, mode: PromptTrustMode): PromptInjectionDemoState {
  const sourceVisible = step >= 1;
  const promoted = sourceVisible && mode === "instruction";
  const proposed = promoted && step >= 2;
  const blocked = proposed && step >= 3;
  return {
    sourceVisible,
    promoted,
    proposed,
    blocked,
    summaryReady: step >= 3 && !promoted,
    status: !sourceVisible
      ? "资料袋还没有打开"
      : !promoted
        ? step >= 3 ? "网页仍是资料，摘要完成" : "来源已标记为 data"
        : !proposed
          ? "错误信任：动作尚未提出"
          : blocked ? "send_secret 未授权 · 已拒绝" : "模型提出 send_secret，等待工具检查",
  };
}
