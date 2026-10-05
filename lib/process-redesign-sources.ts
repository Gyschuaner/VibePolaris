import { source } from "./ai-stack-concept-sources/shared";

export const loadingStateSources = [
  source("Nielsen Norman Group", "Progress Indicators", "https://www.nngroup.com/articles/progress-indicators/", ["loading-definition", "loading-timing"]),
  source("Nielsen Norman Group", "Designing for Waits and Interruptions", "https://www.nngroup.com/articles/designing-for-waits-and-interruptions/", ["loading-timing", "loading-failure"]),
  source("Material Design", "Progress indicators", "https://m3.material.io/components/progress-indicators/overview", ["loading-timing", "loading-progress"]),
  source("Apple Human Interface Guidelines", "Progress indicators", "https://developer.apple.com/design/human-interface-guidelines/progress-indicators", ["loading-definition", "loading-failure"]),
];

export const microinteractionSources = [
  source("Nielsen Norman Group", "Microinteractions", "https://www.nngroup.com/articles/microinteractions/", ["micro-definition", "micro-states"]),
  source("Material Design", "Motion", "https://m3.material.io/styles/motion/overview", ["micro-states"]),
  source("Apple Human Interface Guidelines", "Playing haptics", "https://developer.apple.com/design/human-interface-guidelines/playing-haptics", ["micro-feedback"]),
  source("W3C WAI", "Status Messages", "https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html", ["micro-feedback", "micro-boundary"]),
];

export const reducedMotionSources = [
  source("W3C", "Media Queries Level 5 · prefers-reduced-motion", "https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion", ["motion-definition", "motion-preference"]),
  source("W3C WAI", "Animation from Interactions", "https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html", ["motion-definition", "motion-boundary"]),
  source("MDN Web Docs", "prefers-reduced-motion", "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", ["motion-preference", "motion-code"]),
  source("web.dev", "prefers-reduced-motion", "https://web.dev/articles/prefers-reduced-motion", ["motion-code", "motion-boundary"]),
];

export const clientServerSources = [
  source("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["client-definition", "client-response"]),
  source("MDN Web Docs", "Overview of HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", ["client-definition", "client-roundtrip"]),
  source("MDN Web Docs", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages", ["client-envelope", "client-response"]),
  source("WHATWG", "Fetch Standard", "https://fetch.spec.whatwg.org/", ["client-roundtrip"]),
];

export const deploySources = [
  source("GitHub Docs", "Workflow artifacts", "https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts", ["deploy-artifact", "deploy-immutability"]),
  source("GitHub Docs", "Deployment environments", "https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments", ["deploy-gate", "deploy-traffic"]),
  source("Kubernetes", "Deployments", "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", ["deploy-traffic", "deploy-rollback"]),
  source("Google SRE", "Canarying Releases", "https://sre.google/workbook/canarying-releases/", ["deploy-traffic", "deploy-rollback"]),
];

export const userFlowSources = [
  source("GOV.UK Service Manual", "Scoping your service", "https://www.gov.uk/service-manual/design/scoping-your-service", ["flow-definition", "flow-entry"]),
  source("GOV.UK Service Manual", "Creating an experience map", "https://www.gov.uk/service-manual/user-research/creating-an-experience-map", ["flow-recovery", "flow-context"]),
  source("GOV.UK Service Manual", "Map a user's whole problem", "https://www.gov.uk/service-manual/design/map-a-users-whole-problem", ["flow-recovery"]),
  source("GOV.UK Design System", "Step by step navigation", "https://design-system.service.gov.uk/patterns/step-by-step-navigation/", ["flow-entry", "flow-recovery"]),
  source("GOV.UK Service Manual", "Introduction to designing government services", "https://www.gov.uk/service-manual/design/introduction-designing-government-services", ["flow-definition", "flow-context"]),
];

export const wireframeSources = [
  source("GOV.UK Service Manual", "Making prototypes", "https://www.gov.uk/service-manual/design/making-prototypes", ["wireframe-structure", "wireframe-boundary"]),
  source("GOV.UK Design System", "Prototyping", "https://design-system.service.gov.uk/get-started/prototyping/", ["wireframe-structure", "wireframe-content"]),
  source("GOV.UK Service Manual", "Introduction to designing government services", "https://www.gov.uk/service-manual/design/introduction-designing-government-services", ["wireframe-content", "wireframe-boundary"]),
  source("GOV.UK Service Manual", "How the alpha phase works", "https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works", ["wireframe-content", "wireframe-boundary"]),
  source("Nielsen Norman Group", "UX Deliverables Glossary", "https://media.nngroup.com/media/articles/attachments/UX-Deliverables-Glossary-PDF-2.pdf", ["wireframe-structure", "wireframe-boundary"]),
];

export const prototypeSources = [
  source("GOV.UK Service Manual", "Making prototypes", "https://www.gov.uk/service-manual/design/making-prototypes", ["prototype-definition", "prototype-evidence"]),
  source("GOV.UK Design System", "Prototyping", "https://design-system.service.gov.uk/get-started/prototyping/", ["prototype-definition", "prototype-task"]),
  source("GOV.UK Prototype Kit", "Tutorials and guides", "https://prototype-kit.service.gov.uk/tutorials-and-guides/", ["prototype-task"]),
  source("GOV.UK Service Manual", "How the alpha phase works", "https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works", ["prototype-evidence", "prototype-decision"]),
  source("Nielsen Norman Group", "UX Prototypes: Low Fidelity vs. High Fidelity", "https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/", ["prototype-definition"]),
];

export const iaSources = [
  source("W3C WAI", "Headings and Labels", "https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels", ["ia-labels", "ia-boundary"]),
  source("W3C WAI", "Navigation Design", "https://www.w3.org/WAI/curricula/designer-modules/navigation-design/", ["ia-zones", "ia-search"]),
  source("W3C WAI", "Writing for Web Accessibility", "https://www.w3.org/WAI/tips/writing/", ["ia-labels", "ia-search"]),
  source("GOV.UK Service Manual", "Scoping your service", "https://www.gov.uk/service-manual/design/scoping-your-service", ["ia-zones", "ia-boundary"]),
  source("GOV.UK Service Manual", "Map a user's whole problem", "https://www.gov.uk/service-manual/design/map-a-users-whole-problem", ["ia-zones", "ia-boundary"]),
];

export const a11ySources = [
  source("WAI-ARIA Authoring Practices", "Keyboard Interface", "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/", ["a11y-focus", "a11y-order"]),
  source("WAI-ARIA Authoring Practices", "Button Pattern", "https://www.w3.org/WAI/ARIA/apg/patterns/button/", ["a11y-focus", "a11y-button"]),
  source("W3C WAI", "Error Identification", "https://www.w3.org/WAI/WCAG22/Understanding/error-identification", ["a11y-error"]),
  source("W3C WAI", "Labels or Instructions", "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions", ["a11y-order", "a11y-error"]),
  source("W3C WAI", "Contrast Minimum", "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum", ["a11y-error"]),
];
