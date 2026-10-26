import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter, SiteHeader } from "../site-client";
import { siteConfig } from "../site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Learn how ${siteConfig.brandName} collects, uses, and protects information submitted through this website.`,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { url: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell"><SiteHeader /><main><section className="page-hero"><div className="container"><Link className="back-link" href="/"><ArrowLeft size={18} /> Back to Home</Link><h1>Privacy Policy</h1><p>Last updated: August 26, 2026</p></div></section><article className="legal-content">
      <p>{siteConfig.legalName} respects your privacy. This policy explains how information submitted through this website may be collected, used, and protected.</p>
      <h2>Information We Collect</h2><p>We may collect information you submit through inquiry, contact, booking, and chat experiences, along with basic technical information used to operate and improve the website.</p>
      <h2>How We Use Information</h2><p>Information may be used to answer requests, provide services, improve site performance, maintain security, and meet applicable legal obligations.</p>
      <h2>24/7 Chat</h2><p>Messages sent through the 24/7 chat may be processed by an AI service provider to generate replies. If you share business or contact details, the conversation and a structured summary may be sent to our lead-management systems so we can respond to your request. Providing a phone number in chat does not enroll you in marketing or informational text messages.</p>
      <h2>Service Providers</h2><p>Booking, analytics, communications, hosting, and automation providers may process information on our behalf when needed to operate the website and deliver our services.</p>
      <h2>Your Choices</h2><p>You may request access, correction, or deletion of personal information by contacting the business through its published email address.</p>
      <h2>Contact</h2><p>For privacy questions, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
    </article></main><SiteFooter /></div>
  );
}
