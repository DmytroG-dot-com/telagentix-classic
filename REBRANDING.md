# Rebranding Example Classic

Use this checklist every time this template is copied for a new agency. The goal is to keep the landing-page structure and lead flow unchanged while replacing all client-specific identity, content, destinations, and credentials.

## Information to collect first

- Agency brand name and legal business name
- Primary domain
- Public email address and phone number
- Calendar or booking embed URL
- Logo and brand colors
- Founder story, positioning statement, and quotation
- Chat assistant name and portrait
- Chat lead source, target industry, and opening message
- Contact-form lead source
- Lead-delivery webhook URL
- OpenAI API key for the 24/7 chat

## 1. Copy and rename the project

Copy this entire directory into a new client directory. Keep the application structure, API routes, tests, and webhook utilities unless the client requires a different lead flow.

Update the package name in `package.json` so deployments and logs are easy to distinguish.

## 2. Update the client configuration

Edit `app/site-config.ts`. This is the main content and destination file.

Change:

- `domain` and `brandName`
- `legalName` when it differs from the public brand
- `email`
- `phone.display` and `phone.href`
- `bookingEmbedUrl`
- `logo`, using a full light/dark lockup or a mark with the agency name
- `tagline`
- `chat.assistantName` and `chat.avatarSrc`
- `chat.leadSource`, `chat.verticalSlug`, and `chat.industry`
- `chat.consentVersion`, using the new client slug and launch date
- `chat.welcome` and `chat.suggestions`
- `contact.leadSource` and `contact.consentVersion`
- `contact.bottlenecks` when the client serves a specialized industry
- every field under `about`

`siteUrl` and `servicesUrl` are derived from the domain. Industry links must continue to use:

```text
https://services.CLIENT-DOMAIN.com/industry-slug
```

Do not replace those links with local landing-page anchors.

## 3. Replace the visual identity

### Logo

The current header uses the text-based `BrandLogo` component in `app/site-client.tsx`. Replace its letter mark and wordmark with the client logo, or retain the component and let `brandName` provide the wordmark.

### Colors

Replace both palettes in `app/brand.css`:

- The light palette in `:root`
- The dark palette in `body:has(.theme-toggle-input:checked)`

Check text contrast, button contrast, borders, and the sticky header in both themes.

### Images

- Replace `public/example-hero.jpg` with the client’s hero image while keeping the same filename, or update its reference in `app/site-client.tsx`.
- Replace `public/anna-chat.png` when the client uses a different chat assistant. Keep the portrait square, centered, and clear at 28–42 pixels.
- Replace or add favicon and social-preview assets before launch when the client supplies them.

## 4. Review all public copy

Search for the template brand and placeholder details:

```bash
rg -ni "Example|example.com|202.*555|Anna" app public README.md REBRANDING.md
```

Review these areas in the browser:

- Navigation and mobile Industries menu
- Hero headline and primary CTA
- Services, systems, industries, process, results, and testimonials
- Founder story and quotation
- Booking section
- 24/7 chat identity, welcome message, and suggestions
- Contact form, phone links, footer, Privacy Policy, and Terms of Service
- Page titles, descriptions, Open Graph text, and X card text in `app/layout.tsx`

Replace sample claims and testimonials with approved client material. Do not present template results as a client’s real results.

## 5. Configure lead delivery

Create `.env.local` from `.env.example` and set:

```bash
LEAD_DELIVERY_WEBHOOK_URL=https://client-webhook.example/leads
OPENAI_API_KEY=client-or-managed-key
OPENAI_CHAT_MODEL=gpt-5.4-mini
```

Never commit `.env.local` or real credentials.

The chat route and contact route both deliver through `LEAD_DELIVERY_WEBHOOK_URL`. Confirm that the receiving workflow recognizes the new values of `chat.leadSource` and `contact.leadSource` before launch.

Keep SMS consent values set to `false` unless a separately reviewed consent flow is built. A phone number submitted in chat or the contact form is not SMS consent.

## 6. Verify before deployment

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Then verify on desktop and mobile:

- The header remains fixed while scrolling
- Mobile shows Industries in the header
- Every industry opens the correct `services.` subdomain
- Phone links dial the configured number
- Contact Us opens and submits the form
- The calendar displays the correct booking page
- Anna or the replacement assistant opens, replies, and sends qualified leads
- Chat and contact webhook deliveries arrive with the correct source and attribution
- No Example branding, placeholder phone number, or template founder copy remains
- Privacy Policy and Terms of Service use the correct legal identity and contact email

## 7. Deployment checklist

- Create or link the correct hosting project
- Add all three environment variables to the hosting environment
- Attach the primary domain
- Configure the `services.` subdomain in the separate services project
- Test production forms, chat, calendar, phone links, and industry destinations
- Confirm analytics and webhook attribution on the live domain
