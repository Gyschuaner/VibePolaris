import { source } from "./ai-stack-concept-sources/shared";

export const responsiveSources = [
  source("MDN", "Responsive web design", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design", ["responsive-definition", "responsive-rules"]),
  source("Pete LePage, Rachel Andrew · web.dev", "Responsive web design basics", "https://web.dev/articles/responsive-web-design-basics", ["responsive-breakpoint", "responsive-content"], "2019-02-12"),
  source("MDN", "CSS container queries", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries", ["responsive-container"]),
  source("W3C WAI", "Understanding Success Criterion 1.4.10: Reflow", "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html", ["responsive-reflow", "responsive-exception"]),
];

export const cssSources = [
  source("MDN", "CSS first steps", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics", ["css-definition", "css-responsibility"]),
  source("MDN", "Cascade layers and the cascade", "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade", ["css-cascade", "css-specificity"]),
  source("W3C CSS Working Group", "CSS Cascading and Inheritance Level 5", "https://www.w3.org/TR/css-cascade-5/", ["css-cascade", "css-computed"]),
  source("MDN", "CSS grid layout: Basic concepts", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts", ["css-layout", "css-boundary"]),
  source("MDN", "CSS box model", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model", ["css-box", "css-boundary"]),
];
