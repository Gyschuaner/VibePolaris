export type ToolChoiceStrategy = "auto" | "required" | "none";

export type ToolChoiceDemoState = {
  candidatesVisible: boolean;
  selected: "calendar_update" | null;
  proposed: boolean;
  approvalWaiting: boolean;
  calendarChanged: false;
  status: string;
};

export function getToolChoiceDemoState(step: number, strategy: ToolChoiceStrategy): ToolChoiceDemoState {
  const candidatesVisible = step >= 1;
  const selected = strategy === "none" || step < 2 ? null : "calendar_update";
  const proposed = selected !== null && step >= 2;
  const approvalWaiting = proposed && step >= 3;
  return {
    candidatesVisible,
    selected,
    proposed,
    approvalWaiting,
    calendarChanged: false,
    status: !candidatesVisible
      ? "工具转盘还没有打开"
      : strategy === "none"
        ? "none：本轮不提出工具调用"
        : !proposed
          ? `${strategy}：等待模型提出选择`
          : approvalWaiting ? "calendar_update 已提出 · 写操作等待审批" : "calendar_update 已提出 · 尚未执行",
  };
}
