import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Film,
  Globe,
  Layers,
  Loader2,
  MessageCircle,
  Monitor,
  Palette,
  Phone,
  Rocket,
  Search,
  Send,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Video,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "+6738920773";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`;

/* ─── WhatsApp Button ─── */
function WhatsAppButton({
  children,
  className = "",
  message = "",
}: {
  children: React.ReactNode;
  className?: string;
  message?: string;
}) {
  const url = message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${className}`}
    >
      {children}
    </a>
  );
}

/* ─── Contact Modal ─── */
function ContactModal({
  open,
  onClose,
  defaultPackage,
}: {
  open: boolean;
  onClose: () => void;
  defaultPackage?: string;
}) {
  const submitInquiry = useMutation(api.inquiries.submit);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    package: defaultPackage || "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Reset when defaultPackage changes
  useState(() => {
    if (defaultPackage) setForm((f) => ({ ...f, package: defaultPackage }));
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        business: form.business || undefined,
        package: form.package || undefined,
        message: form.message,
      });
      fetch("/api/notify", {
        method: "POST",
        body: JSON.stringify(form),
      }).catch(() => {});
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setForm({ name: "", email: "", business: "", package: "", message: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-lg">
            {sent ? "Thank You!" : "Start Your Project"}
          </h3>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-amber-500/10 mb-4">
              <CheckCircle2 className="size-8 text-amber-400" />
            </div>
            <h4 className="font-bold text-xl mb-2">Inquiry Received!</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We've received your inquiry and will get back to you within a few
              hours. Check your email at{" "}
              <span className="font-medium text-foreground">{form.email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
              >
                Close
              </Button>
              <WhatsAppButton
                className="h-10 px-6 text-sm bg-[#25D366] hover:bg-[#20BD5A] text-white"
                message="Hi! I just submitted an inquiry on MahaKarya Digital."
              >
                <Phone className="size-4" />
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={form.business}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, business: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                  placeholder="Your business (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Package Interest
                </label>
                <select
                  value={form.package}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, package: e.target.value }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all appearance-none"
                >
                  <option value="">Select a package</option>
                  <optgroup label="Web Development">
                    <option value="Web — Starter (BND 499)">
                      Starter — Landing Page (BND 499)
                    </option>
                    <option value="Web — Business (BND 999)">
                      Business — Multi-Page (BND 999)
                    </option>
                    <option value="Web — Premium (BND 1,999)">
                      Premium — Full App (BND 1,999)
                    </option>
                    <option value="Web — Enterprise (Custom)">
                      Enterprise — Custom (Contact Us)
                    </option>
                  </optgroup>
                  <optgroup label="TikTok Promo Videos">
                    <option value="Video — Single (BND 149)">
                      Single Video (BND 149)
                    </option>
                    <option value="Video — Starter (BND 399/mo)">
                      Starter 4/mo (BND 399/mo)
                    </option>
                    <option value="Video — Growth (BND 799/mo)">
                      Growth 8/mo (BND 799/mo)
                    </option>
                    <option value="Video — Viral (BND 1,499/mo)">
                      Viral 16/mo (BND 1,499/mo)
                    </option>
                  </optgroup>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Tell us about your project{" "}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all resize-none"
                placeholder="What do you need? Tell us about your website project or TikTok promo video goals..."
              />
            </div>

            <Button
              type="submit"
              disabled={sending || !form.name || !form.email || !form.message}
              className="w-full h-11 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl font-semibold disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Submit Inquiry
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Or reach out directly on{" "}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:underline font-medium"
              >
                WhatsApp
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── CTA Button ─── */
function CTAButton({
  children,
  className = "",
  variant = "primary",
  size = "default",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  size?: "default" | "lg";
  onClick: () => void;
}) {
  const base =
    variant === "primary"
      ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/25 border-0"
      : "border-2 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/50";
  const sizeClass =
    size === "lg" ? "h-12 px-8 text-base" : "h-10 px-6 text-sm";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${base} ${sizeClass} ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── FAQ Accordion ─── */
function FAQItem({
  q,
  a,
  open,
  toggle,
}: {
  q: string;
  a: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden transition-colors hover:border-amber-500/30">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left"
      >
        <span className="font-semibold text-sm md:text-base pr-4">{q}</span>
        <ChevronDown
          className={`size-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 -mt-1">
          <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Pricing Tab Switcher ─── */
function PricingTabs({
  active,
  onChange,
}: {
  active: "web" | "video";
  onChange: (tab: "web" | "video") => void;
}) {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex rounded-2xl border border-border/60 bg-muted/30 p-1.5">
        <button
          onClick={() => onChange("web")}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            active === "web"
              ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Monitor className="size-4 inline mr-2" />
          Web Development
        </button>
        <button
          onClick={() => onChange("video")}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            active === "video"
              ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="size-4 inline mr-2" />
          TikTok Promo Videos
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [pricingTab, setPricingTab] = useState<"web" | "video">("web");
  const contactRef = useRef<HTMLDivElement>(null);

  const openContact = (pkg?: string) => {
    setSelectedPackage(pkg || "");
    setContactOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultPackage={selectedPackage}
      />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.12),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)]" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-medium text-amber-400">
            <Zap className="size-3" />
            🇧🇳 Proudly Made in Brunei Darussalam
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
            Your Website & Videos,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              Powered by AI
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Brunei's AI-powered digital agency. Professional websites and TikTok promotional videos — designed, built, and delivered at lightning speed. From Negara Brunei Darussalam to the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <CTAButton size="lg" onClick={() => openContact()}>
              <MessageCircle className="size-5" />
              Start Your Project
              <ArrowRight className="size-4" />
            </CTAButton>
            <WhatsAppButton
              className="h-12 px-8 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg shadow-[#25D366]/25"
              message="Hi! I'm interested in MahaKarya Digital's services."
            >
              <Phone className="size-5" />
              WhatsApp Us
            </WhatsAppButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-amber-400" />
              <span>Delivered in days, not months</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-amber-400" />
              <span>Affordable pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-amber-400" />
              <span>Free revisions included</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-20 md:py-28 border-t bg-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 mb-3 tracking-wide uppercase">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything Your Business Needs Online
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              From websites to TikTok promos — we handle it all with AI-powered
              precision and speed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: Monitor,
                title: "Landing Pages",
                desc: "High-converting single-page sites that capture attention and drive action. Perfect for launches and campaigns.",
              },
              {
                icon: Globe,
                title: "Business Websites",
                desc: "Professional multi-page websites that establish credibility and showcase your brand story.",
              },
              {
                icon: ShoppingCart,
                title: "E-Commerce",
                desc: "Online stores with product catalogs, shopping carts, and secure payment integration.",
              },
              {
                icon: Code2,
                title: "Web Applications",
                desc: "Custom tools, dashboards, and interactive apps with databases and user accounts.",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                desc: "Every site we build looks stunning on phones, tablets, and desktops. Fully responsive by default.",
              },
              {
                icon: Search,
                title: "SEO Optimization",
                desc: "Built-in search engine optimization so your site ranks well on Google from day one.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/40 border border-border/60 p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:border-amber-500/20 hover:-translate-y-0.5"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 rounded-full bg-amber-500/5 blur-2xl transition-all group-hover:bg-amber-500/15" />
                <div className="relative">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 mb-5">
                    <service.icon className="size-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIKTOK VIDEO SERVICE ─── */}
      <section id="tiktok" className="py-20 md:py-28 border-t">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 text-xs font-medium text-pink-500 mb-6">
                  <Film className="size-3" />
                  NEW SERVICE
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  TikTok Promotional
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-red-400">
                    Videos That Convert
                  </span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Get scroll-stopping TikTok promo videos that boost your brand's visibility
                  and drive real engagement. Our AI creates trending, high-quality short-form
                  content tailored to your business — from product showcases to brand stories.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "AI-generated scripts, voiceovers & editing",
                    "Trending sounds, effects & hashtag strategy",
                    "Optimized for TikTok algorithm & engagement",
                    "Product demos, brand stories & promotional content",
                    "Vertical 9:16 format, ready to post",
                    "Revisions included in every package",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <Check className="size-4 text-pink-500 shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      openContact("Video — Starter (BND 399/mo)")
                    }
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all duration-200 text-sm"
                  >
                    <Video className="size-4" />
                    Get TikTok Videos
                    <ArrowRight className="size-4" />
                  </button>
                  <WhatsAppButton
                    className="h-11 px-6 text-sm border-2 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/50"
                    message="Hi! I'm interested in TikTok promotional video services."
                  >
                    <Phone className="size-4" />
                    Ask on WhatsApp
                  </WhatsAppButton>
                </div>
              </div>

              {/* Video showcase visual */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Product Demo", color: "from-pink-500/20 to-rose-500/10" },
                    { label: "Brand Story", color: "from-purple-500/20 to-pink-500/10" },
                    { label: "Testimonial", color: "from-rose-500/20 to-red-500/10" },
                    { label: "Launch Promo", color: "from-orange-500/20 to-pink-500/10" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`aspect-[9/14] rounded-2xl bg-gradient-to-br ${item.color} border border-border/60 flex flex-col items-center justify-center p-4 transition-all hover:scale-[1.02] hover:shadow-lg`}
                    >
                      <Video className="size-8 text-pink-500/40 mb-3" />
                      <div className="w-full space-y-1.5">
                        <div className="h-1.5 rounded-full bg-pink-500/15 w-3/4 mx-auto" />
                        <div className="h-1.5 rounded-full bg-pink-500/10 w-1/2 mx-auto" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground/60 mt-3 uppercase tracking-wider">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[11px] font-bold shadow-lg">
                  🔥 Trending
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="process" className="py-20 md:py-28 border-t bg-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 mb-3 tracking-wide uppercase">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              From Idea to Launch in 4 Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Whether it's a website or TikTok videos — our streamlined process
              gets you results fast.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:gap-0">
              {[
                {
                  step: "01",
                  title: "Tell Us Your Vision",
                  desc: "Submit an inquiry or message us on WhatsApp. Tell us what your business does and what you need — a website, TikTok videos, or both!",
                  icon: MessageCircle,
                },
                {
                  step: "02",
                  title: "We Design & Create",
                  desc: "Our AI gets to work — designing layouts, scripting videos, editing content. You'll receive previews to review within days.",
                  icon: Palette,
                },
                {
                  step: "03",
                  title: "Review & Refine",
                  desc: "Check out the work and tell us what you think. We'll make revisions until you're 100% happy.",
                  icon: Wrench,
                },
                {
                  step: "04",
                  title: "Launch & Grow",
                  desc: "Your website goes live or your videos get posted. We provide post-launch support to ensure everything runs smoothly.",
                  icon: Rocket,
                },
              ].map((item, i) => (
                <div key={item.step} className="relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute left-[2.25rem] top-[5rem] h-[calc(100%-1rem)] w-px bg-gradient-to-b from-amber-500/40 to-transparent" />
                  )}
                  <div className="flex gap-5 md:gap-8 p-4 md:p-6 rounded-2xl transition-colors hover:bg-muted/30">
                    <div className="shrink-0">
                      <div className="size-[4.5rem] rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/10 border border-amber-500/20 flex flex-col items-center justify-center">
                        <item.icon className="size-5 text-amber-400 mb-0.5" />
                        <span className="text-[10px] font-bold text-amber-400/70 tracking-wider">
                          {item.step}
                        </span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO ─── */}
      <section id="portfolio" className="py-20 md:py-28 border-t">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 mb-3 tracking-wide uppercase">
              Our Work
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Projects We've Built
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Real websites, web apps, desktop software, mobile apps, and
              security tools — designed, built, and deployed.
            </p>
          </div>

          {/* Featured Projects — Large Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            {[
              {
                title: "INVINCIBLE AI",
                type: "AI Assistant — Web + Desktop + Android",
                desc: "Personal AI companion with unrestricted intelligence. Features persistent memory, deep research, voice chat (TTS/STT), image generation, screen analysis, and gaming tips. Available as web app, Electron desktop app with full PC access (files, terminal, screenshots), and Android APK with native phone access.",
                tags: [
                  "Artificial Intelligence",
                  "Cross-Platform",
                  "Voice Chat",
                  "Desktop App",
                  "Android",
                ],
                url: "https://invincible-ai-426db556.viktor.space",
                image: "/portfolio-invincible.png",
                featured: true,
              },
              {
                title: "PROJECT OVERLORD",
                type: "Cybersecurity Toolkit — Desktop GUI",
                desc: "Professional-grade security reconnaissance suite with cyberpunk GUI. Integrates Nmap scanning, Shodan intelligence, subdomain enumeration, CVE vulnerability mapping, OSINT engine, web scanner, and AI-powered orchestration. Generates full HTML and JSON reports.",
                tags: [
                  "Cybersecurity",
                  "Nmap",
                  "Shodan",
                  "OSINT",
                  "Desktop App",
                ],
                url: "#",
                image: "/portfolio-overlord.png",
                featured: true,
              },
            ].map((project) => (
              <div
                key={project.title}
                className="group rounded-2xl border border-border/60 overflow-hidden bg-gradient-to-b from-background to-muted/30 transition-all duration-300 hover:shadow-xl hover:border-amber-500/20 hover:-translate-y-0.5"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500 text-black uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-xs font-medium text-amber-400/70 mb-1 uppercase tracking-wider">
                    {project.type}
                  </p>
                  <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.url !== "#" && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Visit Live App
                      <ArrowRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Other Projects — Standard Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "CryptoPulse",
                type: "Real-Time Dashboard",
                desc: "Live crypto dashboard with real-time prices, interactive charts, Fear & Greed gauge, and MIDAS Confluence Score. Track market trends and make informed trading decisions.",
                tags: ["Crypto", "Dashboard", "Real-Time", "Finance"],
                url: "https://preview-maha-crypto-dash-6a1545e5.viktor.space",
                image: null,
              },
              {
                title: "BruneiGPT",
                type: "AI Chatbot",
                desc: "AI chatbot specialized in Brunei Darussalam — government services, halal business, property, culture, and daily life. Powered by AI search for accurate, up-to-date answers.",
                tags: ["Artificial Intelligence", "Chatbot", "Brunei"],
                url: "https://preview-brunei-ai-chat-22d42006.viktor.space",
                image: null,
              },
              {
                title: "NEPHILIM v2.0",
                type: "Cybersecurity Suite — Web App",
                desc: "Full cybersecurity reconnaissance platform with network scanning, OSINT intelligence, vulnerability assessment, and real-time threat monitoring. Upgraded from Android to a full web interface.",
                tags: ["Cybersecurity", "Web App", "OSINT", "Scanning"],
                url: "https://preview-maha-nephilim-v2-758656b5.viktor.space",
                image: null,
              },
              {
                title: "NEPHILIM v1.0",
                type: "Android Security Tool",
                desc: "Signal awareness radar for Android. Passively scans Wi-Fi networks and Bluetooth devices in real time, classifies threats, and renders an animated tactical HUD. Runs locally via Termux — no cloud, no accounts.",
                tags: ["Cybersecurity", "Android", "Signal Intelligence"],
                url: "#",
                image: null,
              },
              {
                title: "PROJECT MIDAS",
                type: "Algorithmic Trading Bot",
                desc: "Automated crypto trading bot using confluence scoring — RSI, MACD, EMA200, ATR, ADX & volume confirmation. Backtested strategy with risk management and real-time signal generation.",
                tags: ["Trading", "Algorithm", "Crypto", "Python"],
                url: "https://preview-midas-aa0bce1f.viktor.space",
                image: null,
              },
              {
                title: "HalalCalc",
                type: "Web Application",
                desc: "Islamic finance calculator suite with Zakat, mortgage comparison, investment projector, and gold/silver calculators. Shariah-compliant. Optimized for SEO with integrated blog. Proudly built from Brunei.",
                tags: ["Finance", "Calculator", "SEO", "Islamic"],
                url: "https://halalcalc-b4ee51bd.viktor.space",
                image: "/portfolio-halalcalc.png",
              },
              {
                title: "EVE Universe Tracker",
                type: "Real-Time Dashboard",
                desc: "Live tracking dashboard for the EVE Online gaming universe. Real-time server status, market data, PvP kill feeds, incursion tracking, interactive maps, and daily intel briefings. 20+ live modules.",
                tags: ["Gaming", "Real-Time", "Dashboard", "API"],
                url: "https://eve-tracker-c1ec7286.viktor.space",
                image: "/portfolio-eve.png",
              },
              {
                title: "Taman Rahmat Properties",
                type: "Property Website",
                desc: "Community property listing and management site for a residential estate in Brunei. Photo galleries, property details, pricing, and WhatsApp contact integration.",
                tags: ["Property", "Community", "Brunei"],
                url: "https://taman-rahmat-f854dbc6.viktor.space",
                image: "/portfolio-taman.png",
              },
              {
                title: "Taman Rahmat AR",
                type: "Augmented Reality — Property",
                desc: "Augmented reality property viewer for Taman Rahmat estate. View 3D property models, floor plans, and virtual tours overlaid on real-world locations using your phone's camera.",
                tags: ["AR", "Property", "3D", "Mobile"],
                url: "https://preview-maha-ar-property-cf4960a0.viktor.space",
                image: null,
              },
              {
                title: "Kira",
                type: "Finance App",
                desc: "Personal finance tracker with multi-currency support (BND, MYR, SGD, USD). Track cash expenses, bank accounts, and wallets. Smart budgets, category breakdowns, and digital receipt storage.",
                tags: ["Finance", "Budgeting", "Multi-Currency"],
                url: "https://preview-kira-213ba25f.viktor.space",
                image: null,
              },
              {
                title: "Pool House Booking",
                type: "Booking System + Tournaments",
                desc: "Full-featured pool house management system with real-time table booking, membership tiers, tournament brackets with leaderboards, member profiles with achievements, admin dashboard, and email auth. 14,500+ lines of code.",
                tags: ["Booking", "SaaS", "Real-Time", "Tournaments"],
                url: "https://preview-maha-booking-8a4aa877.viktor.space",
                image: "/pkg-premium.webp",
              },
              {
                title: "UVC SteriBox",
                type: "Product Website",
                desc: "Product landing page for UVC ultraviolet-C disinfection chambers. Three sizes for personal, household, and commercial use. Showcases technology, specifications, and ordering.",
                tags: ["Product", "E-Commerce", "Health"],
                url: "https://preview-uvc-disinfect-8a44c48f.viktor.space",
                image: null,
              },
            ].map((project) => (
              <div
                key={project.title}
                className="group rounded-2xl border border-border/60 overflow-hidden bg-gradient-to-b from-background to-muted/30 transition-all duration-300 hover:shadow-xl hover:border-amber-500/20 hover:-translate-y-0.5"
              >
                {project.image ? (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-44 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--border)/0.15)_25%,hsl(var(--border)/0.15)_50%,transparent_50%,transparent_75%,hsl(var(--border)/0.15)_75%)] bg-[size:16px_16px] opacity-50" />
                    <div className="relative text-center">
                      <Layers className="size-8 text-amber-400/50 mx-auto mb-2" />
                      <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {project.type}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <h3 className="font-bold text-lg mb-1.5">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.url !== "#" && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Visit Site
                      <ArrowRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-amber-400">14+</p>
              <p className="text-sm text-muted-foreground mt-1">Projects Shipped</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-amber-400">3</p>
              <p className="text-sm text-muted-foreground mt-1">Platforms (Web, Desktop, Mobile)</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-amber-400">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 md:py-28 border-t bg-muted/20">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-amber-400 mb-3 tracking-wide uppercase">
              Pricing
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Transparent, Honest Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              No hidden fees. No surprises. Pick the package that fits your
              needs, or reach out for a custom quote.
            </p>
          </div>

          <PricingTabs active={pricingTab} onChange={setPricingTab} />

          {/* Web Development Pricing */}
          {pricingTab === "web" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto animate-in fade-in duration-300">
              {[
                {
                  name: "Starter",
                  price: "499",
                  desc: "Professional online presence to showcase your business.",
                  turnaround: "3–5 days",
                  image: "/pkg-starter.webp",
                  features: [
                    "Beautiful landing page",
                    "Mobile responsive design",
                    "Menu / services showcase",
                    "Photo gallery",
                    "Contact form & WhatsApp",
                    "Basic SEO setup",
                    "1 round of revisions",
                    "14-day post-launch support",
                  ],
                  popular: false,
                },
                {
                  name: "Business",
                  price: "999",
                  desc: "Multi-page site with forms, gallery, and content management.",
                  turnaround: "7–14 days",
                  image: "/pkg-business.webp",
                  features: [
                    "Up to 5 pages",
                    "Admin panel (manage content)",
                    "Events & promotions",
                    "Newsletter signup",
                    "Testimonials section",
                    "SEO optimization",
                    "Google Analytics",
                    "3 rounds of revisions",
                    "30-day post-launch support",
                  ],
                  popular: true,
                },
                {
                  name: "Premium",
                  price: "1,999",
                  desc: "Full-featured app with booking, memberships, and real-time data.",
                  turnaround: "14–21 days",
                  image: "/pkg-premium.webp",
                  features: [
                    "Up to 10 pages",
                    "User signup & login system",
                    "Real-time booking engine",
                    "Membership system",
                    "Tournament / leaderboard",
                    "Member profiles & stats",
                    "Full admin dashboard",
                    "Push notifications",
                    "Unlimited revisions",
                    "60-day post-launch support",
                  ],
                  popular: false,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  desc: "Complex web apps, SaaS, and large-scale custom projects.",
                  turnaround: "Discussed per project",
                  image: "/pkg-enterprise.webp",
                  features: [
                    "Custom web application",
                    "Database & user auth",
                    "API integrations",
                    "Admin dashboard",
                    "Payment gateway",
                    "Multi-language support",
                    "Full-stack development",
                    "Unlimited revisions",
                    "90-day post-launch support",
                  ],
                  popular: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-gradient-to-b from-amber-500/10 to-background border-2 border-amber-500/30 shadow-xl shadow-amber-500/5"
                      : "bg-gradient-to-b from-background to-background border border-border/60 hover:border-amber-500/20 hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-3 right-3 z-10 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[11px] font-bold tracking-wide uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>
                  <div className="p-6 md:p-7 pt-3">
                    <div className="mb-5">
                      <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                        {plan.desc}
                      </p>
                      <div className="flex items-baseline gap-1">
                        {plan.price !== "Custom" && (
                          <span className="text-sm text-muted-foreground">
                            BND
                          </span>
                        )}
                        <span className="text-3xl md:text-4xl font-black tracking-tight">
                          {plan.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {plan.turnaround}
                      </div>
                    </div>
                    <div className="space-y-2.5 mb-6">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-start gap-2.5">
                          <Check className="size-4 text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                    <CTAButton
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full justify-center rounded-xl"
                      onClick={() =>
                        openContact(
                          plan.price === "Custom"
                            ? "Web — Enterprise (Custom)"
                            : `Web — ${plan.name} (BND ${plan.price})`
                        )
                      }
                    >
                      {plan.price === "Custom" ? "Contact Us" : "Get Started"}
                      <ArrowRight className="size-4" />
                    </CTAButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TikTok Video Pricing */}
          {pricingTab === "video" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto animate-in fade-in duration-300">
              {[
                {
                  name: "Single Video",
                  price: "149",
                  period: "",
                  desc: "Perfect for testing the waters with one professional promo video.",
                  turnaround: "2–3 days",
                  features: [
                    "1 promotional video (15–30s)",
                    "AI-generated script",
                    "Professional editing & effects",
                    "Trending sounds & music",
                    "1 round of revisions",
                    "Ready-to-post format (9:16)",
                  ],
                  popular: false,
                  accent: "pink",
                },
                {
                  name: "Starter",
                  price: "399",
                  period: "/month",
                  desc: "Consistent TikTok presence to build your brand.",
                  turnaround: "Ongoing",
                  features: [
                    "4 videos per month",
                    "AI-generated scripts",
                    "Professional editing",
                    "Trending sounds & hashtags",
                    "Content calendar",
                    "2 revision rounds per video",
                  ],
                  popular: false,
                  accent: "pink",
                },
                {
                  name: "Growth",
                  price: "799",
                  period: "/month",
                  desc: "Accelerate your reach with more content and strategy.",
                  turnaround: "Ongoing",
                  features: [
                    "8 videos per month",
                    "Custom scripts & storyboards",
                    "Premium editing & effects",
                    "Hashtag & trend research",
                    "Posting schedule optimization",
                    "Unlimited revisions",
                    "Monthly performance insights",
                  ],
                  popular: true,
                  accent: "pink",
                },
                {
                  name: "Viral",
                  price: "1,499",
                  period: "/month",
                  desc: "Full-service TikTok content strategy & production.",
                  turnaround: "Ongoing",
                  features: [
                    "16 videos per month",
                    "Full creative strategy",
                    "A/B tested content",
                    "Voiceover & sound design",
                    "Competitor analysis",
                    "Unlimited revisions",
                    "Weekly analytics report",
                    "Priority turnaround",
                  ],
                  popular: false,
                  accent: "pink",
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-gradient-to-b from-pink-500/10 to-background border-2 border-pink-500/30 shadow-xl shadow-pink-500/5"
                      : "bg-gradient-to-b from-background to-background border border-border/60 hover:border-pink-500/20 hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[11px] font-bold tracking-wide uppercase">
                      Best Value
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                      {plan.desc}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">
                        BND
                      </span>
                      <span className="text-3xl md:text-4xl font-black tracking-tight">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {plan.turnaround}
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check className="size-4 text-pink-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      openContact(
                        plan.period
                          ? `Video — ${plan.name} (BND ${plan.price}/mo)`
                          : `Video — ${plan.name} (BND ${plan.price})`
                      )
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl font-semibold transition-all duration-200 text-sm ${
                      plan.popular
                        ? "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25"
                        : "border-2 border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/50"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Payment info */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border/60 bg-background p-6 md:p-8 text-center">
              <h3 className="font-bold text-base mb-3">Payment Methods</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We accept bank transfers to the following accounts. Payment is
                split — 50% upfront to start, 50% on completion.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                <div className="px-5 py-3 rounded-xl bg-muted/30 border border-border/60">
                  <span className="font-semibold block mb-0.5">BIBD</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    00017020010553
                  </span>
                </div>
                <div className="px-5 py-3 rounded-xl bg-muted/30 border border-border/60">
                  <span className="font-semibold block mb-0.5">
                    Baiduri Bank
                  </span>
                  <span className="text-muted-foreground font-mono text-xs">
                    0200740732166
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="py-20 md:py-28 border-t">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold text-amber-400 mb-3 tracking-wide uppercase">
                  Why MahaKarya Digital
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  AI Speed.
                  <br />
                  Human Quality.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We combine cutting-edge AI technology with human oversight to
                  deliver websites and videos faster and more affordably than
                  traditional agencies — without compromising on quality.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Based in Brunei Darussalam, we serve clients locally and
                  globally. Every project gets our full attention, from initial
                  concept to final delivery.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <CTAButton onClick={() => openContact()}>
                    <MessageCircle className="size-4" />
                    Get in Touch
                  </CTAButton>
                  <WhatsAppButton
                    className="h-10 px-6 text-sm bg-[#25D366] hover:bg-[#20BD5A] text-white"
                    message="Hi! I want to learn more about MahaKarya Digital."
                  >
                    <Phone className="size-4" />
                    WhatsApp Us
                  </WhatsAppButton>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    desc: "Days, not months. AI accelerates every step of the process.",
                  },
                  {
                    icon: Sparkles,
                    title: "Modern Design",
                    desc: "Clean, professional designs that work on every device.",
                  },
                  {
                    icon: Globe,
                    title: "SEO Ready",
                    desc: "Built to rank. Every site is optimized for search engines.",
                  },
                  {
                    icon: Video,
                    title: "Video + Web",
                    desc: "Full digital presence — websites and TikTok promos in one place.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl border border-border/60 bg-muted/20 hover:border-amber-500/20 transition-colors"
                  >
                    <item.icon className="size-5 text-amber-400 mb-3" />
                    <h3 className="font-bold text-sm mb-1.5">{item.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 md:py-28 border-t bg-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 mb-3 tracking-wide uppercase">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Questions? We've Got Answers
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {[
              {
                q: "How does AI-powered web development work?",
                a: "Our AI handles the heavy lifting — designing layouts, writing clean code, and optimizing performance. Every project is reviewed by our team to ensure quality. You get the speed of AI with the reliability of human oversight.",
              },
              {
                q: "How long does it take to get my website?",
                a: "It depends on the package. Starter sites are delivered in 3–5 business days, Business sites in 7–14 days, and Premium projects in 14–21 days. We'll give you an accurate timeline during your initial consultation.",
              },
              {
                q: "What are the TikTok promo video packages?",
                a: "We offer four tiers: Single Video (BND 149) for a one-off promo, Starter (BND 399/mo) for 4 videos, Growth (BND 799/mo) for 8 videos with full strategy, and Viral (BND 1,499/mo) for 16 videos with analytics and priority turnaround. All include professional editing, trending sounds, and revisions.",
              },
              {
                q: "What kind of TikTok videos do you create?",
                a: "Product demos, brand stories, testimonials, launch promos, trending content, and more. Our AI generates scripts, selects trending sounds, and produces scroll-stopping edits optimized for the TikTok algorithm. All videos are delivered in 9:16 vertical format, ready to post.",
              },
              {
                q: "What do I need to provide?",
                a: "Just your vision! For websites, tell us about your business and preferences. For TikTok videos, share your product/service info, brand style, and any specific goals. We'll handle the rest.",
              },
              {
                q: "Can I request changes after seeing the design?",
                a: "Absolutely. Every package includes revision rounds (unlimited for Premium and Enterprise). We'll refine until you're completely happy.",
              },
              {
                q: "Do you provide hosting?",
                a: "Yes! Your website is hosted on high-performance cloud infrastructure with fast global delivery. Hosting is included for the first year with Business and Premium packages.",
              },
              {
                q: "How do I pay?",
                a: "We accept bank transfers to BIBD and Baiduri Bank. Payment is split 50/50 — half upfront to start work, and half upon completion. You can also reach out on WhatsApp to discuss payment.",
              },
              {
                q: "Can I get both a website and TikTok videos?",
                a: "Yes! We offer both services and can create a bundled package tailored to your needs. Contact us for a custom quote combining web development and video production.",
              },
              {
                q: "Do you work with clients outside Brunei?",
                a: "Absolutely! While we're based in Brunei, we work with clients worldwide. Reach us through the website, WhatsApp, or our AI chat assistant which is available 24/7.",
              },
            ].map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                toggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-28 border-t" ref={contactRef}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/20 p-8 md:p-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Grow Your Business?
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto">
                Whether you need a stunning website or viral TikTok videos —
                we've got you covered. Get in touch today!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <CTAButton size="lg" onClick={() => openContact()}>
                  <Send className="size-5" />
                  Start Your Project
                  <ArrowRight className="size-4" />
                </CTAButton>
                <WhatsAppButton
                  className="h-12 px-8 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg shadow-[#25D366]/25"
                  message="Hi! I'd like to start a project with MahaKarya Digital."
                >
                  <Phone className="size-5" />
                  WhatsApp Us
                </WhatsAppButton>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We typically respond within a few hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t py-10 md:py-14 bg-muted/20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <span className="text-black font-black text-xs">MK</span>
                  </div>
                  <span className="font-bold">MahaKarya Digital</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">
                  AI-powered web development & TikTok video production from
                  Brunei Darussalam.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3">
                <WhatsAppButton
                  className="text-sm text-muted-foreground hover:text-[#25D366] transition-colors"
                  message="Hi! I'm reaching out from the MahaKarya Digital website."
                >
                  <Phone className="size-4" />
                  {WHATSAPP_NUMBER}
                </WhatsAppButton>
                <button
                  onClick={() => openContact()}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors"
                >
                  <Send className="size-4" />
                  Submit Inquiry
                </button>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-amber-400 transition-colors"
                >
                  Admin Login
                </a>
                <div className="text-xs text-muted-foreground">
                  🇧🇳 Made in Brunei Darussalam
                </div>
                <div className="text-xs text-muted-foreground/60">
                  © {new Date().getFullYear()} MahaKarya Digital. All rights
                  reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
