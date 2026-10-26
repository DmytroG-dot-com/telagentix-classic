import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";

export const alt = `${siteConfig.brandName} — AI Automation and Infrastructure`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function logoDimensions() {
  if (siteConfig.logo.kind === "text") return { width: 0, height: 0 };

  const maxWidth = siteConfig.logo.kind === "mark" ? 108 : 560;
  const maxHeight = siteConfig.logo.kind === "mark" ? 108 : 112;
  const ratio = siteConfig.logo.width / siteConfig.logo.height;

  if (ratio > maxWidth / maxHeight) {
    return { width: maxWidth, height: maxWidth / ratio };
  }

  return { width: maxHeight * ratio, height: maxHeight };
}

async function logoDataUrl() {
  if (siteConfig.logo.kind === "text") return null;

  const relativePath = siteConfig.logo.darkSrc.replace(/^\/+/, "");
  const extension = path.extname(relativePath).toLowerCase();
  const mimeType = extension === ".svg" ? "image/svg+xml" : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/png";
  const data = await readFile(path.join(process.cwd(), "public", relativePath));
  return `data:${mimeType};base64,${data.toString("base64")}`;
}

export default async function SocialImage() {
  const logo = await logoDataUrl();
  const dimensions = logoDimensions();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "62px 72px 58px",
          color: "#ffffff",
          backgroundColor: siteConfig.seo.backgroundColor,
          backgroundImage: `radial-gradient(circle at 88% 12%, ${siteConfig.seo.accentColor}55 0, transparent 34%), linear-gradient(135deg, ${siteConfig.seo.backgroundColor} 0%, #050a12 100%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {siteConfig.logo.kind !== "text" ? <img src={logo as string} width={dimensions.width} height={dimensions.height} alt="" style={{ objectFit: "contain" }} /> : (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 92, height: 92, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 24, color: siteConfig.seo.backgroundColor, backgroundColor: siteConfig.seo.accentColor, fontSize: 54, fontWeight: 800 }}>{siteConfig.logo.mark}</div>
                <div style={{ fontSize: 46, fontWeight: 750 }}>{siteConfig.brandName}</div>
              </div>
            )}
            {siteConfig.logo.kind === "mark" && <div style={{ fontSize: 46, fontWeight: 750 }}>{siteConfig.brandName}</div>}
          </div>
          <div style={{ display: "flex", padding: "12px 20px", border: "1px solid rgba(255,255,255,.26)", borderRadius: 999, color: "rgba(255,255,255,.76)", fontSize: 22 }}>{siteConfig.domain}</div>
        </div>

        <div style={{ width: 950, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", marginBottom: 21, color: siteConfig.seo.accentColor, fontSize: 19, fontWeight: 750, letterSpacing: ".18em" }}>AI AUTOMATION &amp; INFRASTRUCTURE</div>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 780, lineHeight: 1.04, letterSpacing: "-.045em" }}>AI systems built for real operations.</div>
          <div style={{ display: "flex", width: 870, marginTop: 24, color: "rgba(255,255,255,.72)", fontSize: 27, lineHeight: 1.35 }}>Practical automation that helps service businesses respond faster, reduce manual work, and scale efficiently.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,.62)", fontSize: 20 }}>
          <div style={{ width: 52, height: 5, borderRadius: 999, backgroundColor: siteConfig.seo.accentColor }} />
          Moving AI from theory to infrastructure.
        </div>
      </div>
    ),
    size,
  );
}
