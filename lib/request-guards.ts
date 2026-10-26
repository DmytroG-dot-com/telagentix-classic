const MAX_REQUEST_BODY_BYTES = 96 * 1024;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const LINE_BREAKS_AND_CONTROLS = /[\u0000-\u001F\u007F]+/g;

export type LeadAttribution = {
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  utmPromo: string;
  utmIcp: string;
  gclid: string;
  fbclid: string;
};

type JsonObjectResult<T extends object> =
  | { ok: true; value: T }
  | { ok: false; response: Response };

export const cleanText = (value: unknown, maxLength: number) =>
  typeof value === "string"
    ? value.replace(CONTROL_CHARACTERS, "").trim().slice(0, maxLength)
    : "";

export const cleanSingleLineText = (value: unknown, maxLength: number) =>
  typeof value === "string"
    ? value.replace(LINE_BREAKS_AND_CONTROLS, " ").trim().slice(0, maxLength)
    : "";

export const cleanAttribution = (value: unknown): LeadAttribution => {
  const candidate = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

  return {
    landingPage: cleanSingleLineText(candidate.landingPage, 600),
    referrer: cleanSingleLineText(candidate.referrer, 600),
    utmSource: cleanSingleLineText(candidate.utmSource, 180),
    utmMedium: cleanSingleLineText(candidate.utmMedium, 180),
    utmCampaign: cleanSingleLineText(candidate.utmCampaign, 240),
    utmContent: cleanSingleLineText(candidate.utmContent, 240),
    utmTerm: cleanSingleLineText(candidate.utmTerm, 240),
    utmPromo: cleanSingleLineText(candidate.utmPromo, 20),
    utmIcp: cleanSingleLineText(candidate.utmIcp, 100),
    gclid: cleanSingleLineText(candidate.gclid, 300),
    fbclid: cleanSingleLineText(candidate.fbclid, 300),
  };
};

export async function readJsonObject<T extends object>(
  request: Request,
): Promise<JsonObjectResult<T>> {
  const rawContentLength = request.headers.get("content-length");
  const contentLength = rawContentLength ? Number(rawContentLength) : 0;

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    return {
      ok: false,
      response: Response.json({ error: "Request body is too large." }, { status: 413 }),
    };
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }

  if (
    rawBody.length > MAX_REQUEST_BODY_BYTES ||
    new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BODY_BYTES
  ) {
    return {
      ok: false,
      response: Response.json({ error: "Request body is too large." }, { status: 413 }),
    };
  }

  try {
    const value = JSON.parse(rawBody) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Expected a JSON object.");
    }

    return { ok: true, value: value as T };
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }
}
