import { source } from "./ai-stack-concept-sources/shared";

export const permissionBoundarySources = [
  source("NIST", "Least privilege", "https://csrc.nist.gov/glossary/term/least_privilege", ["permission-definition"]),
  source("NIST", "Role Based Access Control FAQs", "https://csrc.nist.gov/projects/role-based-access-control/faqs", ["permission-scope"]),
  source("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", ["permission-enforce"]),
  source("Model Context Protocol", "Authorization", "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization", ["permission-protocol"]),
  source("NIST", "SP 800-162: Attribute Based Access Control", "https://csrc.nist.gov/pubs/sp/800/162/final", ["permission-boundary"]),
];

export const xssRedesignSources = [
  source("OWASP", "Cross Site Scripting Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", ["xss-context", "xss-limit"]),
  source("OWASP", "Cross Site Scripting", "https://community.owasp.org/attacks/xss/", ["xss-attack"]),
  source("MDN Web Docs", "Element.innerHTML", "https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML", ["xss-inner"]),
  source("MDN Web Docs", "Node.textContent", "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent", ["xss-text"]),
  source("MDN Web Docs", "Trusted Types API", "https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API", ["xss-trusted"]),
];

export const skillRedesignSources = [
  source("Agent Skills", "Specification", "https://agentskills.io/specification", ["skill-structure", "skill-trigger"]),
  source("Anthropic Engineering", "Equipping agents for the real world with Agent Skills", "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills", ["skill-purpose", "skill-disclosure", "skill-security"], "2025-10"),
  source("Anthropic Docs", "Agent Skills overview", "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview", ["skill-resources"]),
  source("OpenAI Developers", "Skills | OpenAI API", "https://developers.openai.com/api/docs/guides/tools-skills", ["skill-structure", "skill-disclosure", "skill-resources"]),
  source("OpenAI Developers", "Skills | Plugins", "https://developers.openai.com/plugins/concepts/skills", ["skill-security"]),
];

export const evaluationRunRedesignSources = [
  source("OpenAI", "Working with evals", "https://developers.openai.com/api/docs/guides/evals", ["evalrun-definition", "evalrun-record"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["evalrun-compare"]),
  source("OpenAI", "Graders", "https://developers.openai.com/api/docs/guides/graders", ["evalrun-trace"]),
  source("NIST", "AI RMF Playbook", "https://airc.nist.gov/airmf-resources/playbook/", ["evalrun-boundary"]),
  source("Inspect", "Scoring", "https://inspect.aisi.org.uk/scoring.html", ["evalrun-record"]),
];

export const safetyEvaluationRedesignSources = [
  source("OpenAI", "Safety best practices", "https://developers.openai.com/api/docs/guides/safety-best-practices", ["safety-definition", "safety-tool"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["safety-coverage"]),
  source("NIST", "AI RMF Playbook", "https://airc.nist.gov/airmf-resources/playbook/", ["safety-gate"]),
  source("HELM", "Holistic Evaluation of Language Models", "https://arxiv.org/abs/2211.09110", ["safety-boundary"], "2023"),
  source("OWASP", "Cross Site Scripting Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", ["safety-tool"]),
];

export const costEvaluationRedesignSources = [
  source("OpenAI", "Cost optimization", "https://developers.openai.com/api/docs/guides/cost-optimization", ["cost-definition", "cost-measure"]),
  source("OpenAI", "Working with evals", "https://developers.openai.com/api/docs/guides/evals", ["cost-measure"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["cost-budget"]),
  source("OpenAI", "Batch API", "https://developers.openai.com/api/docs/guides/batch", ["cost-conditions"]),
  source("HELM", "Holistic Evaluation of Language Models", "https://arxiv.org/abs/2211.09110", ["cost-limit"], "2023"),
];

export const latencyEvaluationRedesignSources = [
  source("OpenAI", "Latency optimization", "https://developers.openai.com/api/docs/guides/latency-optimization", ["latency-definition", "latency-timeline"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["latency-tail"]),
  source("MLCommons", "MLPerf Inference", "https://mlcommons.org/benchmarks/inference-datacenter/", ["latency-boundary"], "2025"),
  source("OpenAI", "Working with evals", "https://developers.openai.com/api/docs/guides/evals", ["latency-timeline"]),
  source("HELM", "Holistic Evaluation of Language Models", "https://arxiv.org/abs/2211.09110", ["latency-timeout"], "2023"),
];

export const passFailRedesignSources = [
  source("OpenAI", "Graders", "https://developers.openai.com/api/docs/guides/graders", ["passfail-definition"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["passfail-evidence"]),
  source("OpenAI", "Safety best practices", "https://developers.openai.com/api/docs/guides/safety-best-practices", ["passfail-unscored"]),
  source("NIST", "AI RMF Playbook", "https://airc.nist.gov/airmf-resources/playbook/", ["passfail-gate"]),
  source("Inspect", "Scoring", "https://inspect.aisi.org.uk/scoring.html", ["passfail-limit"]),
];

export const rubricRedesignSources = [
  source("OpenAI", "Graders", "https://developers.openai.com/api/docs/guides/graders", ["rubric-definition"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["rubric-calibration"]),
  source("G-Eval", "NLG Evaluation using GPT-4 with Better Human Alignment", "https://arxiv.org/abs/2303.16634", ["rubric-dimensions"], "2023"),
  source("MT-Bench", "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", "https://arxiv.org/abs/2306.05685", ["rubric-examples"], "2023"),
  source("Inspect", "Scoring", "https://inspect.aisi.org.uk/scoring.html", ["rubric-boundary"]),
];

export const humanGraderRedesignSources = [
  source("OpenAI", "Graders", "https://developers.openai.com/api/docs/guides/graders", ["human-definition"]),
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["human-process"]),
  source("G-Eval", "NLG Evaluation using GPT-4 with Better Human Alignment", "https://arxiv.org/abs/2303.16634", ["human-calibration"], "2023"),
  source("MT-Bench", "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", "https://arxiv.org/abs/2306.05685", ["human-boundary"], "2023"),
  source("Inspect", "Scoring", "https://inspect.aisi.org.uk/scoring.html", ["human-blind"]),
];
