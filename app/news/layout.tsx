import { redirect } from "next/navigation";
import { siteHome, siteModules } from "@/lib/site-modules";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  if (!siteModules.news) redirect(siteHome());
  return children;
}
