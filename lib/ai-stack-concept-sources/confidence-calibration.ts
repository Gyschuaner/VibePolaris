import { source } from "./shared";

export const confidenceCalibrationSources = [
  source("Guo et al.", "On Calibration of Modern Neural Networks", "https://arxiv.org/abs/1706.04599", ["calibration-definition", "calibration-temperature"]),
  source("Guo et al.", "On Calibration of Modern Neural Networks", "https://proceedings.mlr.press/v70/guo17a.html", ["calibration-temperature", "calibration-boundary"]),
  source("scikit-learn", "Probability calibration", "https://scikit-learn.org/stable/modules/calibration.html", ["calibration-lab", "calibration-boundary"]),
  source("NIST", "AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework", ["calibration-definition", "calibration-boundary"]),
];
