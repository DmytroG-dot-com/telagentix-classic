"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Cog,
  FileCheck2,
  GitBranch,
  Headphones,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  PhoneCall,
  Puzzle,
  Route,
  Send,
  Sparkles,
  Sun,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { industryLinks } from "./industry-links";
import { siteConfig } from "./site-config";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  reply?: string;
  error?: string;
  leadSubmitted?: boolean;
};

type Attribution = {
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

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  website: string;
  software: string;
  bottleneck: string;
  goal: string;
};

const emptyAttribution: Attribution = {
  landingPage: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  utmPromo: "",
  utmIcp: "",
  gclid: "",
  fbclid: "",
};

const initialContactForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  website: "",
  software: "",
  bottleneck: "",
  goal: "",
};

const readAttribution = (): Attribution => {
  const params = new URLSearchParams(window.location.search);
  return {
    landingPage: window.location.href,
    referrer: document.referrer,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? "",
    utmPromo: params.get("utm_promo") ?? "",
    utmIcp: params.get("utm_icp") ?? "",
    gclid: params.get("gclid") ?? "",
    fbclid: params.get("fbclid") ?? "",
  };
};

const navItems = [
  ["Services", "#services"],
  ["How It Works", "#how-it-works"],
  ["ROI & Results", "#results"],
  ["Testimonials", "#testimonials"],
  ["About", "#about"],
] as const;

const services = [
  {
    icon: GitBranch,
    title: "AI Automation & Workflow Systems",
    copy: "We design and deploy automation that connects intake, scheduling, task routing, and follow-up — turning fragmented processes into streamlined systems.",
    bullets: [
      "Eliminate manual handoffs and bottlenecks",
      "Reduce response time from hours to seconds",
      "Scale operations without adding headcount",
    ],
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Voice, SMS & Chat",
    copy: "AI agents handle calls, messages, and conversations across voice, text, and chat — ensuring every lead, patient, or client is responded to instantly.",
    bullets: [
      "24/7 intelligent lead capture and qualification",
      "Automated appointment booking and confirmations",
      "Multi-channel communication on autopilot",
    ],
  },
  {
    icon: Puzzle,
    title: "Custom AI Integrations",
    copy: "We integrate AI directly into your existing CRM, scheduling, billing, and operational platforms — no rip-and-replace required.",
    bullets: [
      "Seamless integration with your current tech stack",
      "Custom-built to your exact workflow requirements",
      "Production-ready systems, not prototypes",
    ],
  },
];

const deployedSystems = [
  [Phone, "AI Voice Receptionists", "24/7 call handling, booking and routing"],
  [PhoneCall, "Outbound AI Callers", "Lead qualification and follow-up at scale"],
  [MessageCircle, "AI SMS and Chat", "Instant engagement across every channel"],
  [Route, "Smart Intake and Routing", "Right leads to the right people, automatically"],
  [Cog, "Workflow Automation", "CRM, renewals and reporting on autopilot"],
] as const;

const industries = [
  {
    title: "Home Services",
    eyebrow: "HVAC · Plumbing · Pest Control · Roofing · Solar · Electrical",
    copy: "We engineer high-velocity lead management systems for service contractors competing in fast-response markets.",
    tone: "sand",
  },
  {
    title: "Medical & Dental Practices",
    copy: "Automated patient acquisition, intelligent intake systems, and retention optimization. Lead nurturing, appointment recovery, and conversion optimization systems.",
    tone: "blue",
  },
  {
    title: "Real Estate Agencies",
    copy: "Listing acquisition intelligence, automated follow-up, and transaction pipeline automation.",
    tone: "mint",
  },
  {
    title: "Insurance Firms",
    copy: "Intent-based lead systems and automated prospect engagement infrastructure.",
    tone: "lilac",
  },
];

const automation = [
  [UsersRound, "Lead Capture and Qualification", "Inbound and outbound leads routed instantly"],
  [UserRoundPlus, "Client Onboarding", "Automated intake, documents and welcome sequences"],
  [CalendarCheck, "Scheduling and Booking", "AI managed calendars and confirmations"],
  [Headphones, "Follow-Up and Nurture", "SMS, email and voice touchpoints on autopilot"],
  [FileCheck2, "Renewals and Reporting", "Contract tracking and performance dashboards"],
] as const;

const process = [
  ["Systems Assessment", "We analyze your workflows, tools, and operational bottlenecks."],
  ["AI System Design", "We engineer automation tailored to how your business actually runs."],
  ["Deployment & Integration", "AI systems are deployed directly into your existing stack."],
  ["Optimization & Scale", "We refine performance and expand automation as your business grows."],
] as const;

const results = [
  ["< 60s", "Lead Response Time", "AI responds to every inbound inquiry instantly, day or night, weekends included"],
  ["3×", "More Leads Captured", "Never miss an after-hours or weekend inquiry. Every lead gets an immediate, intelligent reply"],
  ["60%", "Reduction in Admin Work", "Manual data entry, follow-ups, and scheduling eliminated through intelligent workflow automation"],
  ["80%", "Onboarding Automated", "From intake forms to welcome sequences, clients are onboarded without lifting a finger"],
  ["24/7", "Always-On Operations", "8,760 hours per year of consistent, reliable performance with no sick days and no overtime"],
  ["4–6×", "Avg. ROI in Year One", "Clients typically recover their full investment within 90 days and see 4–6× returns by year end"],
] as const;

const studies = [
  {
    label: "HOME SERVICES",
    challenge: "Missed calls and slow lead response during peak season",
    solution: "Deployed AI voice + SMS agents for instant lead capture and automated scheduling",
    result: "Response time dropped from 4 hours to under 60 seconds. 35% increase in booked appointments.",
  },
  {
    label: "MEDICAL PRACTICE",
    challenge: "High no-show rates and manual patient intake workflows",
    solution: "Implemented automated appointment reminders, intake forms, and follow-up sequences",
    result: "No-show rate reduced by 42%. Staff freed up 15+ hours per week on administrative tasks.",
  },
  {
    label: "INSURANCE AGENCY",
    challenge: "Leads going cold due to slow follow-up and manual CRM updates",
    solution: "Built intent-based lead routing and automated prospect engagement pipeline",
    result: "Lead-to-quote conversion increased by 28%. Average follow-up time reduced to under 2 minutes.",
  },
];

const testimonials = [
  [
    `${siteConfig.brandName} transformed how we handle incoming leads. We went from missing 40% of calls to capturing every single one — automatically.`,
    "Operations Director",
    "Regional HVAC Company",
  ],
  [
    "The AI intake system reduced our front desk workload dramatically. Patients love the seamless experience, and our team can finally focus on care.",
    "Practice Manager",
    "Multi-Location Dental Group",
  ],
  [
    `We were skeptical about AI, but ${siteConfig.brandName} delivered a system that actually works with our existing CRM. Follow-up times went from days to minutes.`,
    "Agency Principal",
    "Insurance Brokerage",
  ],
  [
    `The automation ${siteConfig.brandName} built for our listing pipeline saved us 20+ hours a week. It’s like adding two team members without the overhead.`,
    "Managing Broker",
    "Real Estate Agency",
  ],
] as const;

function BrandLogo() {
  const logo = siteConfig.logo;

  return (
    <Link href="/" className="brand-logo" aria-label={`${siteConfig.brandName} home`}>
      {logo.kind === "text" ? (
        <>
          <span className="brand-mark" aria-hidden="true">{logo.mark}</span>
          <span className="brand-wordmark">{siteConfig.brandName}</span>
        </>
      ) : logo.kind === "mark" ? (
        <>
          <span className="brand-symbol" aria-hidden="true">
            <Image className="brand-asset brand-asset-light" src={logo.lightSrc} alt="" width={logo.width} height={logo.height} />
            <Image className="brand-asset brand-asset-dark" src={logo.darkSrc} alt="" width={logo.width} height={logo.height} />
          </span>
          <span className="brand-wordmark">{siteConfig.brandName}</span>
        </>
      ) : (
        <span className="brand-lockup">
          <Image className="brand-asset brand-asset-light" src={logo.lightSrc} alt={siteConfig.brandName} width={logo.width} height={logo.height} priority />
          <Image className="brand-asset brand-asset-dark" src={logo.darkSrc} alt={siteConfig.brandName} width={logo.width} height={logo.height} priority />
        </span>
      )}
    </Link>
  );
}

function IndustryDropdown({
  mobile = false,
  detailsRef,
  onOpen,
  onSelect,
}: {
  mobile?: boolean;
  detailsRef?: RefObject<HTMLDetailsElement | null>;
  onOpen?: () => void;
  onSelect?: () => void;
}) {
  return (
    <details
      ref={detailsRef}
      className={`industry-dropdown ${mobile ? "mobile-industries" : "desktop-industries"}`}
      onToggle={(event) => {
        if (event.currentTarget.open) onOpen?.();
      }}
    >
      <summary className="outline-button compact">
        Industries <ChevronDown className="dropdown-chevron" size={15} />
      </summary>
      <div className="industry-dropdown-menu">
        {industryLinks.map(([label, slug]) => (
          <a key={slug} href={`${siteConfig.servicesUrl}/${slug}`} onClick={onSelect}>
            {label}
          </a>
        ))}
      </div>
    </details>
  );
}

function ContactUsButton({ className, children = "Contact Us" }: { className?: string; children?: ReactNode }) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ContactFormData>(initialContactForm);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const closeContact = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("contact-open");
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.classList.remove("contact-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeContact, open]);

  const openContact = () => {
    if (submitState === "success") {
      setForm(initialContactForm);
      setSubmitState("idle");
    }
    setSubmitError("");
    setOpen(true);
  };

  const updateContact = (field: keyof ContactFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("sending");
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attribution: readAttribution() }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "We couldn’t send your request just now.");
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setSubmitError(error instanceof Error ? error.message : "We couldn’t send your request just now.");
    }
  };

  return (
    <>
      <button ref={triggerRef} className={className} type="button" onClick={openContact} aria-haspopup="dialog">
        {children}
      </button>
      {open && createPortal(
        <div
          className="contact-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${fieldId}-title`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeContact();
          }}
        >
          <section className="contact-shell">
            <header className="contact-header">
              <div>
                <span className="contact-kicker">CONTACT US</span>
                <h2 id={`${fieldId}-title`}>Tell us what you want to improve.</h2>
                <p>Share a short business brief and our team will review the most practical first step.</p>
              </div>
              <button type="button" onClick={closeContact} aria-label="Close contact form"><X size={19} /></button>
            </header>

            {submitState === "success" ? (
              <div className="contact-success" role="status">
                <span><Check size={28} /></span>
                <h3>Your request was sent.</h3>
                <p>Thank you. Our team will review your brief and follow up using the contact details you provided.</p>
                <button type="button" onClick={closeContact}>Done</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={submitContact}>
                <div className="contact-field-grid">
                  <label htmlFor={`${fieldId}-name`}><span>Full name</span><input ref={firstFieldRef} id={`${fieldId}-name`} autoComplete="name" value={form.name} onChange={(event) => updateContact("name", event.target.value)} placeholder="Your name" /></label>
                  <label htmlFor={`${fieldId}-email`}><span>Work email <em>Required</em></span><input id={`${fieldId}-email`} required type="email" autoComplete="email" value={form.email} onChange={(event) => updateContact("email", event.target.value)} placeholder="you@organization.com" /></label>
                  <label htmlFor={`${fieldId}-phone`}><span>Phone</span><input id={`${fieldId}-phone`} type="tel" autoComplete="tel" value={form.phone} onChange={(event) => updateContact("phone", event.target.value)} placeholder="(555) 000-0000" /></label>
                  <label htmlFor={`${fieldId}-organization`}><span>Organization</span><input id={`${fieldId}-organization`} autoComplete="organization" value={form.organization} onChange={(event) => updateContact("organization", event.target.value)} placeholder="Organization name" /></label>
                  <label htmlFor={`${fieldId}-website`}><span>Website</span><input id={`${fieldId}-website`} inputMode="url" autoComplete="url" value={form.website} onChange={(event) => updateContact("website", event.target.value)} placeholder="organization.com" /></label>
                  <label htmlFor={`${fieldId}-bottleneck`}><span>Primary bottleneck</span><select id={`${fieldId}-bottleneck`} value={form.bottleneck} onChange={(event) => updateContact("bottleneck", event.target.value)}><option value="">Select an option</option>{siteConfig.contact.bottlenecks.map((option) => <option key={option}>{option}</option>)}</select></label>
                  <label className="wide" htmlFor={`${fieldId}-software`}><span>Current software</span><input id={`${fieldId}-software`} value={form.software} onChange={(event) => updateContact("software", event.target.value)} placeholder="CRM, scheduling, phone, billing, or other tools" /></label>
                  <label className="wide" htmlFor={`${fieldId}-goal`}><span>What should the first workflow improve?</span><textarea id={`${fieldId}-goal`} value={form.goal} onChange={(event) => updateContact("goal", event.target.value)} placeholder="Describe the repetitive task, missed opportunity, or handoff you want fixed." /></label>
                </div>
                <p className="contact-consent">Providing a phone number does not provide SMS consent. We will use these details only to respond to this request. <Link href="/privacy-policy">Privacy Policy</Link></p>
                {submitState === "error" && <p className="contact-error" role="alert">{submitError}</p>}
                <footer className="contact-actions">
                  {siteConfig.phone.display && <a href={siteConfig.phone.href}><PhoneCall size={16} /> Or call {siteConfig.phone.display}</a>}
                  <button type="submit" disabled={submitState === "sending"}>{submitState === "sending" ? "Sending…" : <><span>Send Request</span><Send size={16} /></>}</button>
                </footer>
              </form>
            )}
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

function handleBookingClick(event: MouseEvent<HTMLElement>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  ) {
    return;
  }

  const bookingLink = event.target.closest<HTMLAnchorElement>('a[href$="#booking"]');
  const bookingSection = document.getElementById("booking");
  if (!bookingLink || !bookingSection) {
    return;
  }

  event.preventDefault();
  bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#booking");
}

export function SiteHeader({ hero = false }: { hero?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileIndustriesRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <input id="theme-toggle" className="theme-toggle-input" type="checkbox" aria-label="Toggle dark mode" />
      <header className={`site-header ${hero ? "hero-header" : "solid-header"} ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <BrandLogo />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <Link key={href} href={`/${href}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <label className="icon-button theme-toggle header-theme-toggle" htmlFor="theme-toggle" title="Toggle color theme">
              <Moon className="theme-moon" size={18} aria-hidden="true" />
              <Sun className="theme-sun" size={18} aria-hidden="true" />
            </label>
            <IndustryDropdown />
            <IndustryDropdown
              mobile
              detailsRef={mobileIndustriesRef}
              onOpen={() => setMenuOpen(false)}
              onSelect={() => {
                if (mobileIndustriesRef.current) mobileIndustriesRef.current.open = false;
              }}
            />
            {siteConfig.phone.display && <a className="header-phone" href={siteConfig.phone.href}><PhoneCall size={14} /><span>{siteConfig.phone.display}</span></a>}
            <ContactUsButton className="contact-us-link" />
            <Link className="outline-button compact book-assessment-link" href="/#booking">Book Assessment</Link>
            <button
              className="mobile-menu-button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                if (mobileIndustriesRef.current) mobileIndustriesRef.current.open = false;
                setMenuOpen((value) => !value);
              }}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map(([label, href]) => (
              <Link key={href} href={`/${href}`} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <label className="mobile-theme-toggle" htmlFor="theme-toggle">
              <Moon className="mobile-theme-moon" size={17} aria-hidden="true" />
              <Sun className="mobile-theme-sun" size={17} aria-hidden="true" />
              <span>Switch appearance</span>
            </label>
            {siteConfig.phone.display && <a className="mobile-phone" href={siteConfig.phone.href}><PhoneCall size={17} /> Call {siteConfig.phone.display}</a>}
            <Link className="mobile-book" href="/#booking" onClick={() => setMenuOpen(false)}>Book Assessment</Link>
          </nav>
        )}
      </header>
    </>
  );
}

function SectionHeading({ label, title, copy, light = false }: { label?: string; title: string; copy?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      {label && <p className="section-label">{label}</p>}
      <h2>{title}</h2>
      {copy && <p className="section-intro">{copy}</p>}
    </div>
  );
}

function BookingEmbed() {
  return (
    <div className="booking-embed-shell">
      <iframe
        src={siteConfig.bookingEmbedUrl}
        title={`Book a ${siteConfig.brandName} systems assessment`}
        loading="lazy"
        allow="fullscreen"
      />
    </div>
  );
}

export function ClassicHome() {
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: siteConfig.chat.welcome },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [chatLeadCaptured, setChatLeadCaptured] = useState(false);
  const [attribution, setAttribution] = useState<Attribution>(emptyAttribution);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatLauncherRef = useRef<HTMLButtonElement>(null);
  const visibleTestimonials = testimonialPage === 0 ? testimonials.slice(0, 2) : testimonials.slice(2, 4);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    window.setTimeout(() => chatLauncherRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    setAttribution(readAttribution());
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    document.body.classList.add("chat-open");
    const focusTimer = window.setTimeout(() => chatInputRef.current?.focus(), 80);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.classList.remove("chat-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [chatOpen, closeChat]);

  useEffect(() => {
    if (!chatOpen) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen, chatSending]);

  const sendChat = async (messageOverride?: string) => {
    const content = (messageOverride ?? chatInput).trim();
    if (!content || chatSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
          leadCaptured: chatLeadCaptured,
          attribution,
        }),
      });
      const data = await response.json() as ChatResponse;
      if (!response.ok || !data.reply) {
        throw new Error(data.error || "The advisor is temporarily unavailable.");
      }

      setChatMessages((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, role: "assistant", content: data.reply! },
      ]);
      if (data.leadSubmitted) setChatLeadCaptured(true);
    } catch (error) {
      setChatMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: `${error instanceof Error ? error.message : "The advisor is temporarily unavailable."} You can still book a systems assessment on this page.`,
        },
      ]);
    } finally {
      setChatSending(false);
    }
  };

  return (
    <div className="site-shell" onClickCapture={handleBookingClick}>
      <SiteHeader hero />
      <main>
        <section className="hero-section">
          <Image className="hero-image" src="/example-hero.jpg" alt={`${siteConfig.brandName} AI infrastructure represented by an interconnected neural network`} fill priority unoptimized sizes="100vw" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-pill"><Sparkles size={15} /> AI AUTOMATION SYSTEMS</div>
            <h1>Efficiency,<br />Engineered<br /><strong>by AI</strong></h1>
            <p>We design AI-powered automation systems that make businesses operate faster,<br className="desktop-break" /> smarter, and more efficiently — without adding headcount.</p>
            <Link className="hero-button" href="#booking">Book a Systems Assessment</Link>
          </div>
          <div className="hero-proof">
            {["Built for real business workflows", "Seamless integration with existing tools", "Reliable, production-ready AI systems", "Focused on execution — not experimentation"].map((item) => <span key={item}><Check size={16} />{item}</span>)}
          </div>
        </section>

        <section className="what-section section-pad">
          <div className="container split-copy">
            <div><p className="section-label">WHAT WE DO</p><h2>Engineering Smarter,<br />More Efficient Businesses</h2></div>
            <div className="what-copy"><p className="lead-copy">{siteConfig.brandName} builds AI-powered automation systems that improve operational efficiency and execution.</p><p>We engineer intelligent workflows that eliminate manual work, reduce friction, and allow teams to scale output without increasing overhead.</p><p className="closing-copy">This isn’t experimental AI.<br /><strong>It’s practical, engineered systems designed for real operations.</strong></p></div>
          </div>
        </section>

        <section id="services" className="section-pad services-section">
          <div className="container">
            <SectionHeading label="CORE SERVICES" title="What We Build" copy="Practical AI systems engineered for measurable business impact." />
            <div className="service-grid">
              {services.map(({ icon: Icon, title, copy, bullets }) => <article className="service-card" key={title}><div className="icon-box"><Icon /></div><h3>{title}</h3><p>{copy}</p><ul>{bullets.map((item) => <li key={item}><span />{item}</li>)}</ul></article>)}
            </div>
            <h3 className="subsection-title">Systems We Deploy</h3>
            <div className="system-grid">
              {deployedSystems.map(([Icon, title, copy]) => <article className="system-card" key={title}><Icon /><h4>{title}</h4><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="efficiency-band section-pad">
          <div className="container compact-container">
            <h2>Built for Efficiency. Designed for Scale.</h2>
            <div className="efficiency-list">{["AI systems engineered around real workflows", "Designed to integrate with existing platforms", "Focused on efficiency, execution, and outcomes", "Built for reliability, not demos", "Automation that scales with your business"].map((item) => <p key={item}><Check />{item}</p>)}</div>
          </div>
        </section>

        <section id="industries" className="section-pad industries-section">
          <div className="container">
            <SectionHeading title="Built for Businesses Ready to Scale Smarter" copy={`${siteConfig.brandName} is built for growth-minded small to mid-sized businesses that want to scale efficiency — not headcount. If your team is overloaded, your systems feel disconnected, or operations are slowing growth, ${siteConfig.brandName} installs the intelligence layer your business needs.`} />
            <div className="industry-grid">{industries.map((item) => <article className={`industry-card ${item.tone}`} key={item.title}><h3>{item.title}</h3>{item.eyebrow && <p className="industry-eyebrow">{item.eyebrow}</p>}<p>{item.copy}</p></article>)}</div>
            <h3 className="subsection-title">End-to-End Automation</h3>
            <div className="system-grid automation-grid">{automation.map(([Icon, title, copy]) => <article className="system-card" key={title}><Icon /><h4>{title}</h4><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section id="how-it-works" className="section-pad process-section">
          <div className="container">
            <SectionHeading label="HOW IT WORKS" title="Our Process" />
            <div className="process-grid">{process.map(([title, copy], index) => <article className="process-card" key={title}><div className="process-number">{index + 1}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section id="results" className="section-pad results-section">
          <div className="container">
            <SectionHeading label="ROI & RESULTS" title="Real outcomes from clients who replaced manual effort with intelligent automation" />
            <div className="result-grid">{results.map(([number, title, copy]) => <article className="result-card" key={title}><strong>{number}</strong><h3>{title}</h3><p>{copy}</p></article>)}</div>
            <p className="results-note">Results vary based on business size, industry, and systems deployed. Figures reflect averages across active client engagements.</p>
            <h3 className="subsection-title studies-title">Client Case Studies</h3>
            <div className="study-grid">{studies.map((study) => <article className="study-card" key={study.label}><p className="study-label">{study.label}</p><dl><dt>Challenge</dt><dd>{study.challenge}</dd><dt>Solution</dt><dd>{study.solution}</dd><dt className="result-term">Result</dt><dd className="result-text">{study.result}</dd></dl></article>)}</div>
          </div>
        </section>

        <section id="testimonials" className="section-pad testimonials-section">
          <div className="container">
            <SectionHeading label="TESTIMONIALS" title="What Our Clients Say" copy={`Real feedback from businesses running on ${siteConfig.brandName} systems.`} />
            <div className="testimonial-wrap">
              <button className="carousel-button left" aria-label="Previous slide" onClick={() => setTestimonialPage((value) => value === 0 ? 1 : 0)}><ArrowLeft /></button>
              <div className="testimonial-grid">{visibleTestimonials.map(([quote, role, company]) => <article className="testimonial-card" key={role}><div className="quote-mark">“</div><blockquote>“{quote}”</blockquote><h3>{role}</h3><p>{company}</p></article>)}</div>
              <button className="carousel-button right" aria-label="Next slide" onClick={() => setTestimonialPage((value) => value === 0 ? 1 : 0)}><ArrowRight /></button>
            </div>
            <div className="carousel-dots"><button aria-label="Show first testimonials" className={testimonialPage === 0 ? "active" : ""} onClick={() => setTestimonialPage(0)} /><button aria-label="Show next testimonials" className={testimonialPage === 1 ? "active" : ""} onClick={() => setTestimonialPage(1)} /></div>
          </div>
        </section>

        <section id="about" className="section-pad about-section">
          <div className="container about-shell">
            <header className="about-header">
              <p className="section-label">WHO WE ARE</p>
              <h2>{siteConfig.about.title}</h2>
              <p className="about-lead">{siteConfig.about.lead}</p>
            </header>

            <div className="about-story">
              <div className="about-story-copy">
                {siteConfig.about.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p className="about-answer">{siteConfig.about.answer}</p>
              </div>
            </div>

            <div className="about-pillars">
              <article className="about-pillar">
                <p className="about-pillar-number" aria-hidden="true">01</p>
                <div>
                  <h3>What we do</h3>
                  <p>We build AI automation systems - the kind that are running inside your business before the engagement ends, not handed over as a recommendation document with a timeline attached.</p>
                  <p>Lead response that works at 9pm on a Friday. Intake systems that route the right information to the right place without anyone touching it. Workflows that pull work off your team&apos;s plate permanently. Every system integrates with what you already use and doesn&apos;t require a technical hire to keep it alive afterward.</p>
                </div>
              </article>

              <article className="about-pillar">
                <p className="about-pillar-number" aria-hidden="true">02</p>
                <div>
                  <h3>How we work</h3>
                  <p>We start by learning how your operation actually runs today: where work jams and what your team handles by hand because no one&apos;s gotten around to fixing it. That read on a business isn&apos;t something you pick up in a workshop. It comes from decades of active operator and consulting experience - sitting on the owner&apos;s side of the table, right now, with companies a lot like yours.</p>
                  <p>Then we build. Voice agents, CRM workflows, outbound sequences, intake routing, reporting pipelines - whatever the operation needs. We test against your real volume and stay in it until everything is working the way it should, without you having to manage it manually.</p>
                </div>
              </article>
            </div>

            <blockquote className="about-quote">
              <span aria-hidden="true">“</span>
              <p>{siteConfig.about.quote}</p>
            </blockquote>
          </div>
        </section>

        <section id="booking" className="section-pad booking-section">
          <div className="container"><SectionHeading light title="Book Your Free Systems Assessment" copy="Pick a time that works for you. We’ll discuss how AI automation can streamline your operations." /><BookingEmbed /></div>
        </section>

        <section id="cta" className="section-pad cta-section">
          <div className="cta-glow one" /><div className="cta-glow two" />
          <div className="container cta-inner"><div><h2>Ready to Engineer Efficiency Into Your Business?</h2><p>Discover how AI-powered automation can streamline operations and unlock scale.</p></div><Link className="hero-button" href="#booking">Schedule a Systems Assessment <ArrowRight size={19} /></Link></div>
        </section>
      </main>
      <button
        ref={chatLauncherRef}
        className="chat-launcher"
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label={`Open 24/7 chat with ${siteConfig.chat.assistantName}`}
        aria-expanded={chatOpen}
      >
        <span className="chat-launcher-icon"><Image src={siteConfig.chat.avatarSrc} alt="" width={42} height={42} /></span>
        <span><strong>{siteConfig.chat.assistantName} · 24/7 Chat</strong><small><i /> Online now</small></span>
      </button>

      {chatOpen && (
        <div
          className="chat-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`24/7 chat with ${siteConfig.chat.assistantName}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeChat();
          }}
        >
          <section className="classic-chat-shell">
            <header className="classic-chat-header">
              <div className="classic-chat-identity">
                <span className="classic-chat-brand-mark"><Image src={siteConfig.chat.avatarSrc} alt="" width={38} height={38} /></span>
                <span><strong>{siteConfig.chat.assistantName}</strong><small>{chatLeadCaptured ? "Your brief was sent" : "24/7 chat assistant"}</small></span>
              </div>
              <button type="button" onClick={closeChat} aria-label="Close chat"><X size={18} /></button>
            </header>

            <div className="classic-chat-intro">
              <p><i /> Available 24/7</p>
              <h2>Find your best first workflow.</h2>
              <span>Describe the bottleneck. {siteConfig.chat.assistantName} will help frame a practical starting point and can send a concise brief to our team.</span>
            </div>

            <div className="chat-messages" aria-live="polite" aria-busy={chatSending}>
              {chatMessages.map((message) => (
                <div key={message.id} className={`chat-message ${message.role}`}>
                  {message.role === "assistant" && <span className="message-avatar"><Image src={siteConfig.chat.avatarSrc} alt="" width={28} height={28} /></span>}
                  <p>{message.content}</p>
                </div>
              ))}
              {chatMessages.length === 1 && (
                <div className="chat-suggestions">
                  {siteConfig.chat.suggestions.map((suggestion) => (
                    <button type="button" key={suggestion} onClick={() => sendChat(suggestion)} disabled={chatSending}>
                      {suggestion}<ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              )}
              {chatSending && (
                <div className="chat-message assistant">
                  <span className="message-avatar"><Image src={siteConfig.chat.avatarSrc} alt="" width={28} height={28} /></span>
                  <div className="typing" aria-label={`${siteConfig.chat.assistantName} is typing`}><i /><i /><i /></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); void sendChat(); }}>
              <label className="sr-only" htmlFor="classic-chat-input">Your message</label>
              <input
                ref={chatInputRef}
                id="classic-chat-input"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Describe what you want to improve…"
                maxLength={1400}
                autoComplete="off"
                disabled={chatSending}
              />
              <button type="submit" disabled={!chatInput.trim() || chatSending} aria-label="Send message"><Send size={18} /></button>
            </form>
            <p className="chat-disclaimer">AI responses can be imperfect. By sharing contact details, you agree that we may contact you about this request. Chat does not provide SMS consent. <Link href="/privacy-policy">Privacy Policy</Link></p>
          </section>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand"><BrandLogo /><p>{siteConfig.tagline}</p></div>
        <div><h3>Explore</h3><Link href="/#services">Services</Link><Link href="/#industries">Industries</Link><Link href="/#how-it-works">How It Works</Link><Link href="/#results">ROI &amp; Results</Link></div>
        <div><h3>Company</h3><Link href="/#about">About</Link><Link href="/#testimonials">Testimonials</Link><Link href="/#booking">Book Assessment</Link><ContactUsButton className="footer-contact-button" /></div>
        <div><h3>Contact</h3>{siteConfig.phone.display && <a href={siteConfig.phone.href}>{siteConfig.phone.display}</a>}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-of-service">Terms of Service</Link></div>
      </div>
      <nav className="container footer-industries" aria-label="Industry solutions">
        <h3>Industry Solutions</h3>
        <div>
          {industryLinks.map(([label, slug]) => (
            <a key={slug} href={`${siteConfig.servicesUrl}/${slug}`}>{label}</a>
          ))}
        </div>
      </nav>
      <div className="container footer-bottom"><p>© 2026 {siteConfig.legalName}. All rights reserved.</p><p>AI systems. Real operations. Measurable impact.</p></div>
    </footer>
  );
}
