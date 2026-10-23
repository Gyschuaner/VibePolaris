import modules from "../content/site-modules.json" with { type: "json" };

export type SiteModule = "graph" | "canvas" | "library" | "news" | "notes" | "about";
export const siteModules: Readonly<Record<SiteModule, boolean>> = modules;

export function siteHome(flags = siteModules) {
  if (flags.graph) return "/";
  if (flags.canvas) return "/canvas";
  if (flags.library) return "/library";
  if (flags.news) return "/news";
  if (flags.about) return "/about";
  return "/me";
}
