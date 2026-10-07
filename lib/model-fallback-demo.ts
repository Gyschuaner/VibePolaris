export type RelayPrimary = "rate" | "timeout" | "auth" | "success";
export type RelayBackup = "valid" | "invalid" | "unsupported" | "none";
export type RelayStatus = "primary" | "receipt" | "policy" | "relayed" | "verified" | "stopped";
export type RelaySegmentState = "idle" | "active" | "done" | "locked" | "blocked";

export const relayPrimaryLabels: Record<RelayPrimary, string> = {
  rate: "429 · 限流",
  timeout: "超时 · 未收到响应",
  auth: "401 · 身份验证失败",
  success: "200 · 主调用成功",
};

export const relayBackupLabels: Record<RelayBackup, string> = {
  valid: "支持 JSON · 返回 amount",
  invalid: "支持 JSON · 返回错误字段",
  unsupported: "不支持结构化输出",
  none: "没有可用备用",
};

export type FallbackRelayState = {
  step: number;
  primary: RelayPrimary;
  backup: RelayBackup;
  limit: 1 | 2;
  status: RelayStatus;
  policyAllowed: boolean;
  tokenPosition: number;
  primaryReceipt: string;
  backupReceipt: string;
  policyLabel: string;
  resultLabel: string;
  statusLabel: string;
  statusDetail: string;
  segments: Array<{ id: "primary" | "policy" | "backup" | "verify" | "audit"; label: string; detail: string; state: RelaySegmentState }>;
};

export function getFallbackRelayState(
  step: number,
  primary: RelayPrimary = "rate",
  backup: RelayBackup = "valid",
  limit: 1 | 2 = 2,
): FallbackRelayState {
  const safeStep = Math.min(5, Math.max(0, Math.floor(step)));
  const policyAllowed = primary !== "success" && primary !== "auth" && limit === 2 && backup !== "unsupported" && backup !== "none";
  const backupPassed = backup === "valid";
  const terminalSuccess = policyAllowed && backupPassed;
  const stopped = primary === "success" || primary === "auth" || !policyAllowed || (safeStep >= 4 && !backupPassed);
  const status: RelayStatus = safeStep === 0 ? "primary" : safeStep === 1 ? "receipt" : safeStep === 2 ? "policy" : safeStep === 3 ? (policyAllowed ? "relayed" : "stopped") : safeStep >= 4 && terminalSuccess ? "verified" : "stopped";
  const tokenPosition = status === "primary" ? 7 : status === "receipt" ? 27 : status === "policy" ? 48 : status === "relayed" ? 69 : status === "verified" ? 92 : 48;
  const primaryReceipt = primary === "success" ? '{"amount":120}' : primary === "timeout" ? "未收到响应" : primary === "auth" ? "401" : "429";
  const backupReceipt = backup === "valid" ? '{"amount":120}' : backup === "invalid" ? '{"total":120}' : backup === "unsupported" ? "无法按要求返回" : "未调用";
  const policyLabel = primary === "success"
    ? "主调用已完成，不应切换"
    : primary === "auth"
      ? "先修复身份验证，不能靠换模型绕过"
      : limit === 1
        ? "总尝试上限已用尽"
        : backup === "unsupported"
          ? "备用能力不兼容"
          : backup === "none"
            ? "没有可用备用"
            : "策略允许一次接替";
  const resultLabel = safeStep < 3
    ? "备用尚未接手"
    : !policyAllowed
      ? "没有发起备用调用"
      : safeStep < 4
        ? "备用回执等待核对"
        : backupPassed
          ? "amount 字段检查通过"
          : "收到回复，但字段不符合要求";
  const statusLabel = safeStep === 0
    ? "主腕带已扣上"
    : safeStep === 1
      ? `${relayPrimaryLabels[primary]} 已回执`
      : safeStep === 2
        ? "策略扣正在检查"
        : status === "relayed"
          ? "备用腕带已接住"
          : status === "verified"
            ? "接替结果通过核对"
            : "接力停在边界";
  const statusDetail = safeStep === 0
    ? "先记录主调用的真实状态，再决定是否交接。"
    : safeStep === 1
      ? primary === "timeout" ? "没有响应不等于收到了 429；远端是否完成仍要核实。" : primary === "auth" ? "身份问题不会因为换模型而消失。" : primary === "success" ? "主调用已满足本例字段要求，不需要备用。" : "429 是限流信号，是否切换仍由策略决定。"
      : safeStep === 2
        ? policyLabel
        : !policyAllowed
          ? `${policyLabel}；本例不发起第二次调用。`
          : safeStep === 3
            ? "备用收到同一份任务，但不代表它与主模型完全等价。"
            : backupPassed
              ? "备用返回 amount=120，接替原因仍保留在记录里。"
              : "备用有回复却没通过字段检查，任务仍未完成。";
  const segments: FallbackRelayState["segments"] = [
    { id: "primary", label: "主调用", detail: relayPrimaryLabels[primary], state: safeStep === 0 || safeStep === 1 ? "active" : "done" },
    { id: "policy", label: "策略闸", detail: policyLabel, state: safeStep === 2 ? "active" : safeStep > 2 && policyAllowed ? "done" : safeStep > 2 ? "blocked" : "locked" },
    { id: "backup", label: "备用调用", detail: relayBackupLabels[backup], state: safeStep === 3 ? "active" : safeStep > 3 && policyAllowed ? "done" : "locked" },
    { id: "verify", label: "字段核对", detail: resultLabel, state: safeStep === 4 ? backupPassed ? "active" : "blocked" : safeStep > 4 && backupPassed ? "done" : "locked" },
    { id: "audit", label: "留痕扣", detail: terminalSuccess ? "fallback=429 · 2次" : stopped ? "未完成 · 保留原因" : "等待结果", state: safeStep === 5 ? terminalSuccess ? "active" : "blocked" : safeStep > 5 ? "done" : "locked" },
  ];
  return { step: safeStep, primary, backup, limit, status, policyAllowed, tokenPosition, primaryReceipt, backupReceipt, policyLabel, resultLabel, statusLabel, statusDetail, segments };
}
