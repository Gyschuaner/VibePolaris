export type HallucinationQuestion = "profit" | "margin";

export type EvidenceCheck = {
  candidate: string;
  answer: string;
  supported: boolean;
  missing: string;
};

export function checkEvidence(question: HallucinationQuestion, profitKnown: boolean): EvidenceCheck {
  const candidate = question === "profit" ? "利润 48 万" : "利润率 40%";
  return profitKnown
    ? { candidate, answer: candidate, supported: true, missing: "" }
    : { candidate: `${candidate}？`, answer: "资料不足", supported: false, missing: "利润字段" };
}
