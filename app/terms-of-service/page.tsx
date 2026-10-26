import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter, SiteHeader } from "../site-client";
import { siteConfig } from "../site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Review the terms governing use of the ${siteConfig.brandName} website and its inquiry features.`,
  alternates: { canonical: "/terms-of-service" },
  openGraph: { url: "/terms-of-service" },
};

export default function TermsPage() {
  return (
    <div className="page-shell"><SiteHeader /><main><section className="page-hero"><div className="container"><Link className="back-link" href="/"><ArrowLeft size={18} /> Back to Home</Link><h1>Terms of Service</h1><p>Last updated: August 26, 2026</p></div></section><article className="legal-content">
      <p>These terms govern your use of the {siteConfig.legalName} website and its informational and inquiry features.</p>
      <h2>Use of the Website</h2><p>You may use this website for lawful informational and business-inquiry purposes. You may not interfere with its operation, attempt unauthorized access, or misuse any interactive feature.</p>
      <h2>Services and Proposals</h2><p>Website content is general information and does not create a client relationship. Project scope, fees, timelines, ownership, and warranties must be defined in a separate written agreement.</p>
      <h2>AI Advisor</h2><p>The website&apos;s AI advisor provides general, automated information and may make mistakes. Its responses are not professional, legal, clinical, financial, or safety advice and do not create a binding proposal. Final scope, feasibility, safeguards, pricing, and human handoffs must be confirmed separately.</p>
      <h2>Intellectual Property</h2><p>{siteConfig.legalName} brand assets, original content, and software are owned by their respective rights holders and may not be reused without permission.</p>
      <h2>Disclaimers</h2><p>Results vary by business, implementation, market, and operational factors. No performance figure on this website is a guarantee of future results.</p>
      <h2>Contact</h2><p>Questions about these terms may be sent to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
    </article></main><SiteFooter /></div>
  );
}
