import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(pathname) {
  return readFile(new URL(pathname, root), "utf8");
}

test("uses the native Next.js toolchain expected by Vercel", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.equal(packageJson.engines.node, "22.x");
  assert.equal(packageJson.dependencies.next, "16.3.1");

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const packageName of [
    "@cloudflare/vite-plugin",
    "drizzle-orm",
    "vinext",
    "vite",
    "wrangler",
  ]) {
    assert.equal(dependencies[packageName], undefined, packageName);
  }
});

test("keeps the reusable classic landing-page structure", async () => {
  const source = await read("app/site-client.tsx");
  const styles = await read("app/globals.css");
  const config = await read("app/site-config.ts");
  const publicFiles = await readdir(new URL("public/", root));

  assert.doesNotMatch(source, /about-founder-card|founder-portraits|founder-circle/);
  assert.equal(publicFiles.some((filename) => filename.includes("founder")), false);
  assert.equal(publicFiles.some((filename) => filename.includes("praktos")), false);
  assert.match(source, /className="theme-toggle-input" type="checkbox"/);
  assert.match(source, /siteConfig\.logo/);
  assert.match(source, /brand-asset-light/);
  assert.match(source, /brand-asset-dark/);
  assert.doesNotMatch(source, /classList\.toggle\("dark"/);
  assert.match(styles, /body:has\(\.theme-toggle-input:checked\)/);
  assert.match(styles, /\.site-header\.hero-header:not\(\.scrolled\).*background:/);
  assert.match(source, /\$\{siteConfig\.servicesUrl\}\/\$\{slug\}/);
  assert.match(config, /servicesUrl: `https:\/\/services\.\$\{domain\}`/);
  assert.match(source, /src=\{siteConfig\.bookingEmbedUrl\}/);
  assert.match(source, /siteConfig\.about\.story\.map/);
  assert.match(source, /<IndustryDropdown\s+mobile\s+detailsRef=\{mobileIndustriesRef\}/);
  assert.match(source, /aria-controls="mobile-navigation"/);
  assert.match(styles, /\.site-header \{ position: fixed/);
  assert.match(styles, /\.contact-us-link \{ border: 0/);
  assert.doesNotMatch(source, /24\/7 AI Chat/i);
  assert.doesNotMatch(
    source,
    /Quick Inquiry|Mark Petruziello|Open chat|Email Praktos AI|praktos\.ai/,
  );
});

test("publishes complete indexable metadata against the configured canonical domain", async () => {
  const [layout, home, privacy, terms, robots, sitemap, socialImage] = await Promise.all([
    read("app/layout.tsx"),
    read("app/page.tsx"),
    read("app/privacy-policy/page.tsx"),
    read("app/terms-of-service/page.tsx"),
    read("app/robots.ts"),
    read("app/sitemap.ts"),
    read("app/opengraph-image.tsx"),
  ]);

  assert.match(layout, /metadataBase: new URL\(siteConfig\.siteUrl\)/);
  assert.match(layout, /Moving AI from Theory to Infrastructure/);
  assert.match(layout, /card: "summary_large_image"/);
  assert.match(layout, /"max-image-preview": "large"/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /makesOffer: industryLinks\.map/);
  assert.match(layout, /maximumScale: 1/);
  assert.match(layout, /userScalable: false/);
  assert.doesNotMatch(layout, /next\/headers|generateMetadata/);

  assert.match(home, /alternates: \{ canonical: "\/" \}/);
  assert.match(privacy, /alternates: \{ canonical: "\/privacy-policy" \}/);
  assert.match(terms, /alternates: \{ canonical: "\/terms-of-service" \}/);
  assert.match(robots, /allow: "\/"/);
  assert.match(robots, /disallow: "\/api\/"/);
  assert.match(robots, /sitemap: `\$\{siteConfig\.siteUrl\}\/sitemap\.xml`/);
  assert.match(sitemap, /url: siteConfig\.siteUrl/);
  assert.doesNotMatch(sitemap, /servicesUrl/);
  assert.match(socialImage, /from "next\/og"/);
  assert.match(socialImage, /width: 1200, height: 630/);
  assert.match(socialImage, /siteConfig\.logo\.darkSrc/);
  assert.match(socialImage, /siteConfig\.seo\.accentColor/);
});

test("publishes crawlable industry links on the services subdomain", async () => {
  const [source, links, styles] = await Promise.all([
    read("app/site-client.tsx"),
    read("app/industry-links.ts"),
    read("app/globals.css"),
  ]);

  assert.match(source, /className="container footer-industries"/);
  assert.match(source, /href=\{`\$\{siteConfig\.servicesUrl\}\/\$\{slug\}`\}/);
  assert.match(source, /aria-label="Industry solutions"/);
  assert.match(links, /"hvac-companies"/);
  assert.match(links, /"construction-companies"/);
  assert.match(styles, /\.footer-industries/);
});

test("provides a reusable 24/7 chat with structured webhook delivery", async () => {
  const source = await read("app/site-client.tsx");
  const route = await read("app/api/chat/route.ts");
  const webhook = await read("lib/lead-webhook.ts");
  const config = await read("app/site-config.ts");
  const environment = await read(".env.example");

  assert.match(source, /className="chat-launcher"/);
  assert.match(source, /siteConfig\.chat\.assistantName/);
  assert.match(source, /siteConfig\.chat\.avatarSrc/);
  assert.equal((await readdir(new URL("public/", root))).includes("anna-chat.png"), true);
  assert.match(source, /fetch\("\/api\/chat"/);
  assert.match(source, /leadCaptured: chatLeadCaptured/);
  assert.match(source, /Chat does not provide SMS consent/);
  assert.match(route, /https:\/\/api\.openai\.com\/v1\/responses/);
  assert.match(route, /type: "json_schema"/);
  assert.match(route, /sendLeadToWebhook/);
  assert.match(route, /marketing: false/);
  assert.match(route, /nonMarketing: false/);
  assert.match(webhook, /LEAD_DELIVERY_WEBHOOK_URL/);
  assert.match(config, /leadSource: "[a-z0-9-]+-classic-chat"/);
  assert.match(config, /assistantName: "Anna"/);
  assert.match(environment, /OPENAI_API_KEY=/);
  assert.match(environment, /OPENAI_CHAT_MODEL=gpt-5\.4-mini/);
  assert.match(environment, /LEAD_DELIVERY_WEBHOOK_URL=/);
});

test("provides optional phone and contact-form lead delivery", async () => {
  const source = await read("app/site-client.tsx");
  const route = await read("app/api/contact/route.ts");
  const config = await read("app/site-config.ts");

  assert.match(config, /phone:\s*{/);
  assert.match(config, /phone: \{ display: "(?:\+1 [0-9]{3}-[0-9]{3}-[0-9]{4})?", href: "(?:tel:\+1[0-9]{10})?" \}/);
  assert.match(config, /display: string/);
  assert.match(config, /href: string/);
  assert.match(config, /leadSource: "[a-z0-9-]+-classic-contact"/);
  assert.match(source, /function ContactUsButton/);
  assert.match(source, /fetch\("\/api\/contact"/);
  assert.match(source, /siteConfig\.phone\.display &&/);
  assert.match(source, /Providing a phone number does not provide SMS consent/);
  assert.match(route, /sendLeadToWebhook/);
  assert.match(route, /source: siteConfig\.contact\.leadSource/);
  assert.match(route, /marketing: false/);
  assert.match(route, /nonMarketing: false/);
});
