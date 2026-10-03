const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const benchmarkSources = [
  source('Alex Wang、Amanpreet Singh、Julian Michael 等', 'GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding', 'https://arxiv.org/pdf/1804.07461', ['bench-definition'], '2019'),
  source('MLCommons', 'MLPerf Inference Submission Guide', 'https://docs.mlcommons.org/inference/submission/', ['bench-protocol']),
  source('Percy Liang、Rishi Bommasani、Tony Lee 等', 'Holistic Evaluation of Language Models', 'https://arxiv.org/pdf/2211.09110', ['bench-metrics'], '2023'),
  source('Douwe Kiela 等', 'Dynabench: Rethinking Benchmarking in NLP', 'https://arxiv.org/pdf/2104.14337', ['bench-transfer'], '2021'),
];
export const graderSources = [
  source('Inspect', 'Scoring', 'https://inspect.aisi.org.uk/scoring.html', ['grader-definition', 'grader-unscored']),
  source('Anthropic', 'Demystifying evals for AI agents', 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', ['grader-outcome']),
  source('Yang Liu、Dan Iter、Yichong Xu 等', 'G-EVAL: NLG Evaluation using GPT-4 with Better Human Alignment', 'https://arxiv.org/pdf/2303.16634', ['grader-rubric'], '2023'),
  source('Lianmin Zheng、Wei-Lin Chiang、Ying Sheng 等', 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena', 'https://arxiv.org/pdf/2306.05685', ['grader-bias'], '2023'),
];
export const evalDatasetSources = [
  source('Anthropic', 'Demystifying evals for AI agents', 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', ['evaldata-definition']),
  source('Timnit Gebru、Jamie Morgenstern、Briana Vecchione 等', 'Datasheets for Datasets', 'https://arxiv.org/pdf/1803.09010', ['evaldata-document'], '2021'),
  source('Google for Developers', 'Datasets: Dividing the original dataset', 'https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets', ['evaldata-holdout']),
  source('scikit-learn', 'Cross-validation: evaluating estimator performance', 'https://scikit-learn.org/stable/modules/cross_validation.html', ['evaldata-groups']),
];
export const evaluationRunSources = [
  source('OpenAI', 'Working with evals', 'https://developers.openai.com/api/docs/guides/evals', ['evalrun-definition', 'evalrun-record']),
  source('Anthropic', 'Demystifying evals for AI agents', 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', ['evalrun-trace', 'evalrun-compare']),
  source('OpenAI', 'Graders', 'https://developers.openai.com/api/docs/guides/graders', ['evalrun-grader']),
  source('NIST', 'AI RMF Playbook', 'https://airc.nist.gov/airmf-resources/playbook/', ['evalrun-boundary']),
];
export const gradingRubricSources = [
  source('OpenAI', 'Graders', 'https://developers.openai.com/api/docs/guides/graders', ['rubric-definition-detail']),
  source('Yang Liu、Dan Iter、Yichong Xu 等', 'G-EVAL: NLG Evaluation using GPT-4 with Better Human Alignment', 'https://arxiv.org/pdf/2303.16634', ['rubric-dimensions-detail']),
  source('Anthropic', 'Demystifying evals for AI agents', 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', ['rubric-calibration-detail']),
  source('Inspect', 'Scoring', 'https://inspect.aisi.org.uk/scoring.html', ['rubric-boundary-detail']),
];
export const regressionEvaluationSources = [
  source('OpenAI', 'Working with evals', 'https://developers.openai.com/api/docs/guides/evals', ['regression-definition-detail', 'regression-record-detail']),
  source('Anthropic', 'Demystifying evals for AI agents', 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', ['regression-compare-detail']),
  source('NIST', 'AI RMF Playbook', 'https://airc.nist.gov/airmf-resources/playbook/', ['regression-gate-detail']),
  source('Percy Liang、Rishi Bommasani、Tony Lee 等', 'Holistic Evaluation of Language Models', 'https://arxiv.org/pdf/2211.09110', ['regression-boundary-detail'], '2023'),
];
