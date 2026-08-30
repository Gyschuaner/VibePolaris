import { HomeDomains } from "@/components/HomeDomains";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader home />
      <main className="home-wrap constellation-home">
        <HomeDomains />
      </main>
    </>
  );
}
