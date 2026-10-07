export type MemoryCardValue = "TypeScript" | "Python";
export type MemoryDrawerStatus = "ask" | "saved" | "retrieved" | "inserted" | "corrected" | "deleted";

export type MemoryDrawerState = {
  step: number;
  value: MemoryCardValue;
  status: MemoryDrawerStatus;
  drawerCount: number;
  drawerLabel: string;
  cardLabel: string;
  cardDetail: string;
  promptLabel: string;
  outputLabel: string;
  statusLabel: string;
  statusDetail: string;
  cardState: "outside" | "stored" | "retrieved" | "inserted" | "corrected" | "deleted";
};

export function getMemoryDrawerState(step: number, value: MemoryCardValue = "TypeScript", deleted = false): MemoryDrawerState {
  const safeStep = Math.min(5, Math.max(0, Math.floor(step)));
  const effectiveDeleted = deleted || safeStep >= 5;
  const effectiveValue: MemoryCardValue = value === "Python" || safeStep >= 4 ? "Python" : "TypeScript";
  const status: MemoryDrawerStatus = effectiveDeleted ? "deleted" : safeStep === 0 ? "ask" : safeStep === 1 ? "saved" : safeStep === 2 ? "retrieved" : safeStep === 3 ? "inserted" : "corrected";
  const cardState = effectiveDeleted ? "deleted" : safeStep === 0 ? "outside" : safeStep === 1 ? "stored" : safeStep === 2 ? "retrieved" : safeStep === 3 ? "inserted" : "corrected";
  return {
    step: safeStep,
    value: effectiveValue,
    status,
    drawerCount: effectiveDeleted ? 1 : safeStep >= 1 ? 2 : 1,
    drawerLabel: effectiveDeleted ? "抽屉里还剩 1 条" : safeStep >= 1 ? "抽屉里有 2 条" : "尚未写入",
    cardLabel: effectiveDeleted ? "代码偏好已删除" : `代码示例用 ${effectiveValue}`,
    cardDetail: effectiveDeleted ? "未来取回：已阻断" : safeStep === 0 ? "当前消息 · 等待同意" : "source=user · scope=code",
    promptLabel: effectiveDeleted ? "没有自动带入语言偏好" : safeStep >= 3 ? `context += language:${effectiveValue}` : safeStep >= 2 ? "代码偏好已取回，等待放入" : "本轮输入尚未加入记忆",
    outputLabel: effectiveDeleted ? "下一次需要重新说明语言" : safeStep >= 4 ? "TypeScript 示例（已生成）" : safeStep >= 3 ? `${effectiveValue} 示例（本轮）` : "等待本轮输入",
    statusLabel: effectiveDeleted ? "删除只影响未来取回" : status === "ask" ? "卡片还在抽屉外" : status === "saved" ? "卡片已放入抽屉" : status === "retrieved" ? "只抽出代码范围那张" : status === "inserted" ? "卡片已压进本轮输入" : "卡片已改写，旧输出不回写",
    statusDetail: effectiveDeleted ? "已经生成的 TypeScript 回复仍保持原样；下一次任务不会自动带入这条偏好。" : status === "ask" ? "当前聊天可以参考这句话，但应用不能悄悄把它变成长期记录。" : status === "saved" ? "记录带着来源和范围，食谱卡留在抽屉里不随手带出。" : status === "retrieved" ? "取回只是应用拿到记录，模型还没有看到它。" : status === "inserted" ? `只有放进本轮输入，模型才会按 ${effectiveValue} 生成。` : "纠正改变之后的取回结果，过去已经生成的回答不会被倒写。",
    cardState,
  };
}
