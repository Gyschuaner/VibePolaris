import { source } from "./shared";

export const outOfDistributionSources = [
  source("Hendrycks & Gimpel", "A Baseline for Detecting Misclassified and Out-of-Distribution Examples", "https://arxiv.org/abs/1610.02136", ["ood-definition", "ood-confidence"]),
  source("Koh et al.", "WILDS: A Benchmark of in-the-Wild Distribution Shifts", "https://arxiv.org/abs/2012.07421", ["ood-definition", "ood-lab"]),
  source("Long et al.", "Rethinking the Evaluation of Out-of-Distribution Detection: A Sorites Paradox", "https://arxiv.org/abs/2406.09867", ["ood-lab", "ood-boundary"]),
  source("Ovadia et al.", "Can You Trust Your Model's Uncertainty?", "https://arxiv.org/abs/1906.02530", ["ood-confidence", "ood-boundary"]),
];
