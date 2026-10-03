import { source } from "./shared";

export const prioritySources = [
  source("GOV.UK Service Manual", "Deciding on priorities", "https://www.gov.uk/service-manual/agile-delivery/deciding-on-priorities", [
    "priority-goal-detail",
    "priority-method-detail",
    "priority-capacity-detail",
    "priority-review-detail",
  ]),
  source("GOV.UK Service Manual", "How the discovery phase works", "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works", [
    "priority-problem-detail",
    "priority-evidence-detail",
  ]),
  source("GOV.UK Service Manual", "Developing a roadmap", "https://www.gov.uk/service-manual/agile-delivery/developing-a-roadmap", [
    "priority-roadmap-detail",
    "priority-review-detail",
  ]),
  source("GOV.UK Service Manual", "Planning in agile", "https://www.gov.uk/service-manual/agile-delivery/planning-agile", [
    "priority-dependency-detail",
  ]),
  source("GOV.UK Service Manual", "Iterate and improve frequently", "https://www.gov.uk/service-manual/service-standard/point-8-iterate-and-improve-frequently", [
    "priority-roadmap-detail",
  ]),
];
