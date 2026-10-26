import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import "./brand.css";
import { industryLinks } from "./industry-links";
import { siteConfig } from "./site-config";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.brandName} — Moving AI from Theory to Infrastructure`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Practical AI infrastructure, implementation, and workflow systems built around the tools service businesses already use.",
  applicationName: siteConfig.brandName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    title: `${siteConfig.brandName} — Moving AI from Theory to Infrastructure`,
    description: "Practical, proven AI systems built to move from plan to production.",
    siteName: siteConfig.brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — Moving AI from Theory to Infrastructure`,
    description: "Practical, proven AI systems built to move from plan to production.",
  },
};

const organizationId = `${siteConfig.siteUrl}/#organization`;
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: siteConfig.brandName,
  legalName: siteConfig.legalName,
  url: siteConfig.siteUrl,
  email: siteConfig.email,
  ...(siteConfig.phone.href ? { telephone: siteConfig.phone.href.replace("tel:", "") } : {}),
  makesOffer: industryLinks.map(([name, slug]) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: `${name} AI Automation`,
      url: `${siteConfig.servicesUrl}/${slug}`,
      provider: { "@id": organizationId },
    },
  })),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: siteConfig.seo.backgroundColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
