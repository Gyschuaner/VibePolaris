import { source } from "./ai-stack-concept-sources/shared";

export const hallucinationConceptSources = [
  source("NIST", "AI RMF: Generative AI Profile · §2.2 Confabulation", "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf", ["hallucination-definition-claim", "hallucination-confidence", "hallucination-boundary-claim"]),
  source("Anthropic", "Reduce hallucinations", "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations", ["hallucination-abstain", "hallucination-quote", "hallucination-verify", "hallucination-limit"]),
  source("Anthropic", "Citations", "https://platform.claude.com/docs/en/build-with-claude/citations", ["hallucination-citation"]),
  source("Microsoft Azure", "Grounding Data Design for AI Workloads", "https://learn.microsoft.com/en-us/azure/well-architected/ai/grounding-data-design", ["hallucination-grounding", "hallucination-retrieval"]),
  source("Lei Huang 等", "A Survey on Hallucination in Large Language Models", "https://arxiv.org/abs/2311.05232", ["hallucination-survey"], "2024"),
];
