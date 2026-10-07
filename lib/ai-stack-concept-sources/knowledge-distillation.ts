import { source } from "./shared";

export const knowledgeDistillationSources = [
  source("Hinton, Vinyals & Dean", "Distilling the Knowledge in a Neural Network", "https://arxiv.org/abs/1503.02531", ["distillation-definition", "distillation-soft-targets"]),
  source("Sanh et al.", "DistilBERT, a distilled version of BERT", "https://arxiv.org/abs/1910.01108", ["distillation-definition", "distillation-boundary"]),
  source("Jiao et al.", "TinyBERT: Distilling BERT for Natural Language Understanding", "https://arxiv.org/abs/1909.10351", ["distillation-soft-targets", "distillation-boundary"]),
  source("Hinton", "Knowledge distillation lecture notes", "https://www.cs.toronto.edu/~hinton/absps/distillation.pdf", ["distillation-lab"]),
];
