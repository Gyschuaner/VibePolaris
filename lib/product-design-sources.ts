import { source } from "./ai-stack-concept-sources/shared";

export const focusManagementSources = [
  source("W3C ARIA APG", "Dialog (Modal) Pattern", "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/", ["focus-dialog", "focus-return"]),
  source("W3C ARIA APG", "Keyboard Interface", "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/", ["focus-sequence", "focus-visible"]),
  source("W3C", "Understanding Focus Order", "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html", ["focus-order"]),
  source("W3C", "Understanding Focus Visible", "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html", ["focus-visible"]),
];

export const iterationSources = [
  source("GOV.UK Service Manual", "Point 8: Iterate and improve frequently", "https://www.gov.uk/service-manual/service-standard/point-8-iterate-and-improve-frequently", ["iteration-service", "iteration-loop"]),
  source("Scrum.org", "The 2020 Scrum Guide", "https://scrumguides.org/scrum-guide.html", ["iteration-increment", "iteration-inspect"]),
  source("GOV.UK Service Manual", "How user research improves service design", "https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design", ["iteration-research"]),
  source("GOV.UK Service Manual", "Point 10: Define what success looks like", "https://www.gov.uk/service-manual/service-standard/point-10-define-success-publish-performance-data", ["iteration-success"]),
];
