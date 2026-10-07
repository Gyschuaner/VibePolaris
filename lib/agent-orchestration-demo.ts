export type OrchestrationMode = "parallel" | "serial";

export type OrchestrationDemoState = {
  research: "queued" | "running" | "ready";
  verify: "queued" | "running" | "conflict" | "ready";
  write: "locked" | "waiting" | "writing" | "ready";
  report: "queued" | "ready";
  evidenceCount: number;
  conflictVisible: boolean;
  resolved: boolean;
  status: string;
};

export function getAgentOrchestrationDemoState(step: number, mode: OrchestrationMode, conflict = false, resolved = false): OrchestrationDemoState {
  const currentStep = Math.max(0, Math.min(5, step));
  const conflictVisible = conflict && currentStep >= 2 && !resolved;
  const canWrite = currentStep >= 3 && !conflictVisible;
  const reportReady = currentStep >= 5 && canWrite;
  const research = currentStep === 0 ? "queued" : currentStep === 1 ? "running" : "ready";
  const verify = currentStep === 0
    ? "queued"
    : currentStep === 1
      ? mode === "parallel" ? "running" : "queued"
      : conflictVisible
        ? "conflict"
        : mode === "serial" && currentStep === 2
          ? "running"
          : "ready";
  const write = !canWrite ? currentStep >= 2 ? "locked" : "waiting" : currentStep === 3 ? "writing" : "ready";
  return {
    research,
    verify,
    write,
    report: reportReady ? "ready" : "queued",
    evidenceCount: reportReady || resolved ? 7 : research === "ready" ? 8 : 0,
    conflictVisible,
    resolved,
    status: reportReady
      ? "7 条一致证据已经扣进报告，合并规则满足，可以交付"
      : conflictVisible
        ? "核对发现 1 处冲突，撰写夹子保持锁住，不能假装结果完整"
        : resolved
          ? "冲突证据已排除，撰写拿到 7 条一致证据"
          : mode === "serial" && currentStep === 1
            ? "串行模式先完成检索，核对暂时没有输入"
            : currentStep === 0
              ? "编排台先写清分工和依赖，任务还没有开始"
              : currentStep === 1
                ? "无依赖的检索与核对可以同时翻开，撰写仍在等核对"
                : currentStep === 2
                  ? "核对结果还没有交给撰写，先保留当前状态"
                  : "核对完成，撰写正在把证据拼成报告",
  };
}
