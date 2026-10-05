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

export const conversionRateSources = [
  source("Google Analytics", "GA4 event parameters", "https://developers.google.com/analytics/devguides/collection/ga4/event-parameters", ["conversion-event", "conversion-params"]),
  source("Google Analytics", "GA4 users and user metrics", "https://support.google.com/analytics/answer/12253918?hl=en", ["conversion-users", "conversion-dedup"]),
  source("Amplitude", "Interpret funnel analysis", "https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-interpret", ["conversion-formula", "conversion-window"]),
  source("Google Analytics", "Funnel reports API", "https://developers.google.com/analytics/devguides/reporting/data/v1/funnels", ["conversion-steps", "conversion-window"]),
];

export const funnelSources = [
  source("Google Analytics", "Funnel reports API", "https://developers.google.com/analytics/devguides/reporting/data/v1/funnels", ["funnel-steps", "funnel-order"]),
  source("Amplitude", "Interpret funnel analysis", "https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-interpret", ["funnel-window", "funnel-dropoff"]),
  source("Amplitude", "Funnel Analysis FAQ", "https://amplitude.com/docs/analytics/charts/funnel-analysis/faq", ["funnel-order", "funnel-open"]),
  source("Amplitude", "Build your first funnel", "https://amplitude.com/docs/quick-guides/build-your-first-funnel", ["funnel-route", "funnel-scope"]),
];

export const usabilityTestingSources = [
  source("GOV.UK Service Manual", "Using moderated usability testing", "https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing", ["usability-task", "usability-observe", "usability-prompt"]),
  source("GOV.UK Service Manual", "Plan user research for your service", "https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service", ["usability-plan", "usability-boundary"]),
  source("GOV.UK Service Manual", "Analyse a research session", "https://www.gov.uk/service-manual/user-research/analyse-a-research-session", ["usability-analysis"]),
  source("Nielsen Norman Group", "Task Scenarios for Usability Testing", "https://www.nngroup.com/articles/task-scenarios-usability-testing/", ["usability-task", "usability-boundary"]),
];

export const mockupSources = [
  source("Figma", "Wireframe vs. mock-up: what’s the difference?", "https://www.figma.com/resource-library/wireframe-vs-mockup/", ["mockup-structure", "mockup-visual"]),
  source("GOV.UK Service Manual", "Making prototypes", "https://www.gov.uk/service-manual/design/making-prototypes", ["mockup-prototype", "mockup-states"]),
  source("Figma Learn", "Guide to prototyping in Figma", "https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma", ["mockup-prototype", "mockup-review"]),
  source("GOV.UK Service Manual", "Designing good government services", "https://www.gov.uk/service-manual/design/introduction-designing-government-services", ["mockup-review", "mockup-boundary-text"]),
];

export const sitemapSources = [
  source("W3C WAI", "Page Structure Tutorial", "https://www.w3.org/WAI/tutorials/page-structure/", ["sitemap-page-structure", "sitemap-hierarchy"]),
  source("W3C WAI", "Make the Site Hierarchy Easy to Understand and Navigate", "https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p02-site-structure/", ["sitemap-hierarchy", "sitemap-nav"]),
  source("GOV.UK", "Plan new GOV.UK content", "https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/plan-new-govuk-content/", ["sitemap-orphan", "sitemap-nav"]),
  source("Google Search Central", "What Is a Sitemap", "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview", ["sitemap-xml", "sitemap-boundary-text"]),
];

export const designTokenSources = [
  source("Design Tokens Community Group", "Design Tokens Technical Reports 2025.10", "https://www.designtokens.org/tr/2025.10/", ["token-definition", "token-reference"]),
  source("Design Tokens Community Group", "Design Tokens Community Group", "https://www.designtokens.org/", ["token-interoperability", "token-semantic"]),
  source("Android Developers", "Material Design 3 in Compose", "https://developer.android.com/develop/ui/compose/designsystems/material3", ["token-theme", "token-component"]),
  source("Lightning Design System", "Design Tokens", "https://v1.lightningdesignsystem.com/design-tokens/", ["token-semantic", "token-boundary"]),
];
