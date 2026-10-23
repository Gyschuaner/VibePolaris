export function navigationSection(pathname: string) {
  if (pathname === "/" || pathname.startsWith("/terms/") || pathname.startsWith("/guides/")) return "graph";
  for (const section of ["canvas", "news", "about", "me"] as const) {
    if (pathname === `/${section}` || pathname.startsWith(`/${section}/`)) return section;
  }
  return null;
}
