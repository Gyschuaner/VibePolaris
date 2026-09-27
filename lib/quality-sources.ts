const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const groundingSources = [
  source('Microsoft Support', 'What information does Copilot use to answer my prompt?', 'https://support.microsoft.com/en-us/microsoft-365-copilot/what-information-does-copilot-use-to-answer-my-prompt', ['ground-definition']),
  source('Microsoft Azure Well-Architected Framework', 'Grounding data design', 'https://learn.microsoft.com/en-us/azure/well-architected/ai/grounding-data-design', ['ground-data']),
  source('Patrick Lewis 等', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', 'https://arxiv.org/pdf/2005.11401', ['ground-retrieval'], '2020'),
  source('Anthropic', 'Reduce hallucinations', 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', ['ground-insufficient']),
];
export const hallucinationSources = [
  source('Ziwei Ji 等', 'Survey of Hallucination in Natural Language Generation', 'https://arxiv.org/pdf/2202.03629', ['hall-definition', 'hall-axes'], '2022'),
  source('Joshua Maynez、Shashi Narayan、Bernd Bohnet、Ryan McDonald', 'On Faithfulness and Factuality in Abstractive Summarization', 'https://arxiv.org/pdf/2005.00661', ['hall-fluency'], '2020'),
  source('Stephanie Lin、Jacob Hilton、Owain Evans', 'TruthfulQA: Measuring How Models Mimic Human Falsehoods', 'https://arxiv.org/pdf/2109.07958', ['hall-imitation'], '2021'),
  source('Sebastian Farquhar、Jannik Kossen、Lorenz Kuhn、Yarin Gal', 'Detecting hallucinations in large language models using semantic entropy', 'https://sebastianfarquhar.com/assets/papers/farquharDetecting2024.pdf', ['hall-detection'], '2024-06-19'),
];
export const evaluationSources = [
  source('Anthropic', 'Demystifying evals for AI agents', 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', ['eval-task', 'eval-repeat', 'eval-graders']),
  source('Percy Liang、Rishi Bommasani、Tony Lee 等', 'Holistic Evaluation of Language Models', 'https://arxiv.org/pdf/2211.09110', ['eval-metrics'], '2023'),
  source('Marco Tulio Ribeiro、Tongshuang Wu、Carlos Guestrin、Sameer Singh', 'Beyond Accuracy: Behavioral Testing of NLP Models with CheckList', 'https://arxiv.org/pdf/2005.04118', ['eval-coverage'], '2020'),
  source('NIST CAISI · Maia Hamin、Benjamin Edelman', 'Cheating on AI Agent Evaluations', 'https://www.nist.gov/caisi/cheating-ai-agent-evaluations', ['eval-integrity'], '2025-11-28'),
];
