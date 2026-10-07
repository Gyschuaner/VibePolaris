export type AgentLoopLimit = 2 | 3;

export type AgentLoopDemoState = {
  taskStatus: string;
  actionVisible: boolean;
  actionLabel: string;
  receiptVisible: boolean;
  receiptCode: string;
  receiptDetail: string;
  receiptCurrent: boolean;
  stateWritten: boolean;
  stateLabel: string;
  verificationVisible: boolean;
  finished: boolean;
  limited: boolean;
  gateLabel: string;
  status: string;
};

export function getAgentLoopDemoState(step: number, limit: AgentLoopLimit): AgentLoopDemoState {
  const currentStep = Math.max(0, Math.min(6, step));
  // The scene keeps the same concrete incident throughout: the first 500 is
  // archived evidence, the final 200 is a new verification result.
  const limited = limit === 2 && currentStep >= 4;
  const finished = limited || (limit === 3 && currentStep >= 6);
  const success = finished && !limited;
  const receiptVisible = currentStep >= 2;
  const receiptCurrent = currentStep >= 6 && success;
  const stateWritten = currentStep >= 3;
  const verificationVisible = currentStep >= 5 && !limited;
  return {
    taskStatus: currentStep === 0
      ? "500 · API_BASE_URL 缺失"
      : success
        ? "200 · 已验证"
        : currentStep >= 4
          ? "配置已写入 · 待复查"
          : "500 · 待定位",
    actionVisible: currentStep >= 1 && !limited,
    actionLabel: currentStep === 0
      ? "等下一轮动作"
      : currentStep <= 2
        ? "inspect_config()"
        : currentStep === 3
          ? "set API_BASE_URL"
          : "run_checks()",
    receiptVisible,
    receiptCode: receiptCurrent ? "200" : "500",
    receiptDetail: receiptCurrent ? "GET /health · verified" : "API_BASE_URL 缺失",
    receiptCurrent,
    stateWritten,
    stateLabel: currentStep < 3 ? "尚未写回" : currentStep < 4 ? "issue = config" : "API_BASE_URL = set",
    verificationVisible,
    finished,
    limited,
    gateLabel: limited ? "STOPPED · max_turns=2" : success ? "OPEN · 200 OK" : "等待停止判断",
    status: success
      ? "复查拿到新的 200 OK，完成条件成立，循环在这里停下"
      : limited
        ? "两轮用完，第三轮复查没有发生：循环停了，但任务仍未完成"
        : currentStep === 0
          ? "先把失败回执钉在任务单上，循环从可检查的状态开始"
          : currentStep === 1
            ? "动作已经发出；在工具回执回来前，不能把等待写成成功"
            : currentStep === 2
              ? "500 回执给出缺失项，下一轮终于有了可以处理的证据"
              : currentStep === 3
                ? "把 issue = config 写回任务单，下一轮知道要修哪里"
                : currentStep === 4
                  ? "配置已写入；还要再跑一次健康检查，写入本身不是通过证据"
                  : "重新检查还没返回，闸门先保持关闭",
  };
}
