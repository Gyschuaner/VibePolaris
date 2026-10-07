import { source } from "./ai-stack-concept-sources/shared";

export const responsiveSources = [
  source("MDN", "Responsive web design", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design", ["responsive-definition", "responsive-rules"]),
  source("Pete LePage, Rachel Andrew · web.dev", "Responsive web design basics", "https://web.dev/articles/responsive-web-design-basics", ["responsive-breakpoint", "responsive-content"], "2019-02-12"),
  source("MDN", "CSS container queries", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries", ["responsive-container"]),
  source("W3C WAI", "Understanding Success Criterion 1.4.10: Reflow", "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html", ["responsive-reflow", "responsive-exception"]),
];

export const cssSources = [
  source("MDN", "CSS first steps", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics", ["css-definition", "css-responsibility", "css-boundary"]),
  source("MDN", "Cascade layers and the cascade", "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade", ["css-cascade", "css-specificity"]),
  source("W3C CSS Working Group", "CSS Cascading and Inheritance Level 5", "https://www.w3.org/TR/css-cascade-5/", ["css-cascade", "css-computed"]),
  source("MDN", "CSS grid layout: Basic concepts", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts", ["css-layout"]),
  source("MDN", "CSS box model", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model", ["css-box"]),
];

export const formSources = [
  source("MDN", "Client-side form validation", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation", ["form-definition", "form-client"]),
  source("MDN", "Constraint validation", "https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation", ["form-client", "form-boundary"]),
  source("W3C WAI", "Labels or Instructions", "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html", ["form-label"]),
  source("W3C WAI", "Error Identification", "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html", ["form-error"]),
  source("OWASP", "Input Validation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html", ["form-boundary", "form-server"]),
];

export const htmlSources = [
  source("WHATWG", "HTML Living Standard", "https://html.spec.whatwg.org/", ["html-definition", "html-structure"]),
  source("MDN", "Structuring documents", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents", ["html-structure", "html-semantics"]),
  source("MDN", "HTML elements reference", "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements", ["html-elements", "html-native"]),
  source("W3C WAI", "Info and relationships", "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html", ["html-semantics", "html-boundary"]),
];

export const javascriptSources = [
  source("MDN", "JavaScript language overview", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Language_overview", ["javascript-definition", "javascript-state"]),
  source("MDN", "Introduction to events", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events", ["javascript-events"]),
  source("MDN", "Introduction to client-side APIs", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Introduction", ["javascript-dom", "javascript-host"]),
  source("TC39", "ECMAScript language overview", "https://tc39.es/ecma262/2023/multipage/overview.html", ["javascript-definition", "javascript-boundary"]),
];

export const domSources = [
  source("WHATWG", "DOM Living Standard", "https://dom.spec.whatwg.org/", ["dom-definition", "dom-tree"]),
  source("MDN", "DOM scripting introduction", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting", ["dom-tree", "dom-current"]),
  source("MDN", "Document.querySelector", "https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector", ["dom-query"]),
  source("MDN", "Node.textContent", "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent", ["dom-text", "dom-boundary"]),
];

export const frameworkSources = [
  source("Next.js", "Project structure", "https://nextjs.org/docs/app/getting-started/project-structure", ["framework-definition", "framework-convention"]),
  source("React", "Describing the UI", "https://react.dev/learn/describing-the-ui", ["framework-library", "framework-definition"]),
  source("Angular", "Overview", "https://angular.dev/overview", ["framework-convention", "framework-library"]),
  source("Next.js", "Server and Client Components", "https://nextjs.org/docs/app/getting-started/server-and-client-components", ["framework-runtime", "framework-boundary"]),
];

export const ssgSsrSources = [
  source("Next.js", "Static Site Generation (Pages Router)", "https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation", ["ssg-ssr-definition", "ssg-ssr-static"]),
  source("Next.js", "Server-side Rendering (Pages Router)", "https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering", ["ssg-ssr-definition", "ssg-ssr-request"]),
  source("Next.js", "Incremental Static Regeneration", "https://nextjs.org/docs/pages/guides/incremental-static-regeneration", ["ssg-ssr-update", "ssg-ssr-failure"]),
  source("React", "hydrateRoot", "https://react.dev/reference/react-dom/client/hydrateRoot", ["ssg-ssr-hydration"]),
  source("MDN", "HTTP caching", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching", ["ssg-ssr-cache", "ssg-ssr-choice"]),
];
