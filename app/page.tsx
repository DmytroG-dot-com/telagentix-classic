import type { Metadata } from "next";
import { ClassicHome } from "./site-client";
import { siteConfig } from "./site-config";

export const metadata: Metadata = {
  title: `${siteConfig.brandName} — Moving AI from Theory to Infrastructure`,
  description:
    `${siteConfig.brandName} designs and deploys practical AI infrastructure and workflow systems that help businesses operate faster, reduce manual work, and scale without adding headcount.`,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return <ClassicHome />;
}
