export type ToolResultVariant = "stock0" | "stock8" | "timeout";

export type ToolResultDemoState = {
  requestVisible: boolean;
  resultVisible: boolean;
  validated: boolean;
  answerVisible: boolean;
  variant: ToolResultVariant;
  fieldValue: string;
  rawText: string;
  answer: string;
  status: string;
};

export function getToolResultDemoState(step: number, variant: ToolResultVariant): ToolResultDemoState {
  const resultVisible = step >= 1;
  const validated = step >= 2;
  const answerVisible = step >= 3;
  const fieldValue = variant === "stock0" ? "stock: 0" : variant === "stock8" ? "stock: 8" : "error: timeout";
  const rawText = variant === "timeout" ? "{ call_id: 'inv-7', status: 504 }" : `{ call_id: 'inv-7', stock: ${variant === "stock8" ? 8 : 0}, status: 200 }`;
  const answer = variant === "timeout" ? "K7 暂时无法确认" : variant === "stock8" ? "K7 有 8 件" : "K7 暂时缺货";
  return {
    requestVisible: true,
    resultVisible,
    validated,
    answerVisible,
    variant,
    fieldValue,
    rawText,
    answer,
    status: !resultVisible
      ? "查询票已夹入翻页簿，等待工具返回"
      : !validated
        ? `${variant === "timeout" ? "超时" : "HTTP 200"} 已保存，先别急着下结论`
        : !answerVisible
          ? `${fieldValue} 被校验，准备改写回答`
          : variant === "timeout"
            ? "错误也属于结果：K7 的库存仍然未知"
            : `${fieldValue} 驱动回答：${answer}`,
  };
}
