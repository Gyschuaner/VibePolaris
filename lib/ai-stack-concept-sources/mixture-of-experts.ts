import { source } from "./shared";

export const mixtureOfExpertsSources = [
  source("Shazeer et al.", "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer", "https://arxiv.org/abs/1701.06538", ["moe-definition", "moe-routing"]),
  source("Fedus, Zoph & Shazeer", "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity", "https://jmlr.org/papers/volume23/21-0998/21-0998.pdf", ["moe-routing", "moe-boundary"]),
  source("Du et al.", "GLaM: Efficient Scaling of Language Models with Mixture-of-Experts", "https://arxiv.org/abs/2112.06905", ["moe-definition", "moe-boundary"]),
  source("Hugging Face", "Mixture of experts overview", "https://huggingface.co/blog/moe", ["moe-lab"]),
];
