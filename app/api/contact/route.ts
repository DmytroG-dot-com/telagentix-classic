import { siteConfig } from "@/app/site-config";
import { isLeadWebhookConfigured, sendLeadToWebhook } from "@/lib/lead-webhook";
import {
  cleanAttribution,
  cleanSingleLineText,
  readJsonObject,
} from "@/lib/request-guards";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  organization?: unknown;
  website?: unknown;
  software?: unknown;
  bottleneck?: unknown;
  goal?: unknown;
  attribution?: unknown;
};

const hasUsableEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contactFallback = siteConfig.phone.display
    ? `call ${siteConfig.phone.display}`
    : `email ${siteConfig.email}`;
  const parsedBody = await readJsonObject<ContactRequest>(request);
  if (!parsedBody.ok) return parsedBody.response;

  const body = parsedBody.value;
  const name = cleanSingleLineText(body.name, 160);
  const email = cleanSingleLineText(body.email, 180);
  const phone = cleanSingleLineText(body.phone, 50);
  const organization = cleanSingleLineText(body.organization, 180);
  const website = cleanSingleLineText(body.website, 400);
  const software = cleanSingleLineText(body.software, 300);
  const bottleneck = cleanSingleLineText(body.bottleneck, 300);
  const goal = cleanSingleLineText(body.goal, 1800);
  const attribution = cleanAttribution(body.attribution);

  if (!hasUsableEmail(email)) {
    return Response.json(
      { error: "Please add a valid work email." },
      { status: 400 },
    );
  }

  if (!isLeadWebhookConfigured()) {
    return Response.json(
      { error: `Online contact delivery is temporarily unavailable. Please ${contactFallback}.` },
      { status: 503 },
    );
  }

  const capturedAt = new Date().toISOString();
  const leadIntakeBrief = [
    "Classic landing contact form",
    `Contact: ${name || "Not provided"}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Organization: ${organization || "Not provided"}`,
    `Website: ${website || "Not provided"}`,
    `Current software: ${software || "Not provided"}`,
    `Primary bottleneck: ${bottleneck || "Not provided"}`,
    `Desired first outcome: ${goal || "Not provided"}`,
    `Landing page: ${attribution.landingPage || "/"}`,
    `Referrer: ${attribution.referrer || "Not provided"}`,
    `UTM source: ${attribution.utmSource || "Not provided"}`,
    `UTM campaign: ${attribution.utmCampaign || "Not provided"}`,
    `Contact request submitted: ${capturedAt}`,
  ].join("\n");

  const leadSubmitted = await sendLeadToWebhook({
    source: siteConfig.contact.leadSource,
    isTest: false,
    vertical: siteConfig.chat.verticalSlug,
    icp: {
      slug: siteConfig.chat.verticalSlug,
      industry: siteConfig.chat.industry,
    },
    landingRoute: "/",
    attribution,
    name: name || undefined,
    email,
    phone: phone || undefined,
    organization: organization || undefined,
    businessWebsite: website || null,
    businessScale: null,
    currentSoftware: software || null,
    primaryBottleneck: bottleneck || null,
    desiredOutcome: goal || null,
    workflowSummary: "Classic landing contact form",
    smsConsent: {
      marketing: false,
      nonMarketing: false,
      version: siteConfig.contact.consentVersion,
      capturedAt,
    },
    submittedAt: capturedAt,
    leadIntakeBrief,
  });

  if (!leadSubmitted) {
    return Response.json(
      { error: `We couldn’t send your request just now. Please ${contactFallback}.` },
      { status: 502 },
    );
  }

  return Response.json({ contactSubmitted: true });
}
