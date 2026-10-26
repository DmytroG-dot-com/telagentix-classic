import type { LeadAttribution } from "@/lib/request-guards";

export type LeadWebhookPayload = {
  source: string;
  isTest: boolean;
  vertical: string;
  icp: {
    slug: string;
    industry: string;
  };
  landingRoute: string;
  attribution: LeadAttribution;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  businessWebsite: string | null;
  businessScale: string | null;
  currentSoftware: string | null;
  primaryBottleneck: string | null;
  desiredOutcome: string | null;
  workflowSummary: string | null;
  smsConsent: {
    marketing: false;
    nonMarketing: false;
    version: string;
    capturedAt: string;
  };
  submittedAt: string;
  leadIntakeBrief: string;
};

export const isLeadWebhookConfigured = () =>
  Boolean(process.env.LEAD_DELIVERY_WEBHOOK_URL?.trim());

export async function sendLeadToWebhook(payload: LeadWebhookPayload) {
  const webhookUrl = process.env.LEAD_DELIVERY_WEBHOOK_URL?.trim();
  if (!webhookUrl) return false;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("Lead delivery webhook failed", payload.source, response.status);
    }

    return response.ok;
  } catch {
    console.error("Lead delivery webhook request failed", payload.source);
    return false;
  }
}
