import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, Send, Shield, X } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "./ui/button";

const WHATSAPP_URL = "https://wa.me/6738920773";

const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "TikTok Videos", href: "#tiktok" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 font-bold text-lg md:text-xl hover:opacity-80 transition-opacity"
          >
            <div className="size-9 md:size-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-black font-black text-sm md:text-base">
                MK
              </span>
            </div>
            <span className="hidden sm:inline tracking-tight">{APP_NAME}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {item.label}
              </button>
            ))}
            <div className="ml-3 flex items-center gap-2">
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi! I'm interested in MahaKarya Digital's services.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/50"
                >
                  <Phone className="size-3.5" />
                  WhatsApp
                </Button>
              </a>
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black shadow-lg shadow-amber-500/20 border-0 h-9 px-5 font-bold"
                onClick={() => scrollTo("#pricing")}
              >
                <Send className="size-3.5" />
                Get a Quote
              </Button>
            </div>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t mt-1 pt-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 text-left"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/login"
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 text-left flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="size-3.5" />
                Admin
              </Link>
              <div className="pt-2 px-3">
                <Button
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black border-0 font-bold"
                  onClick={() => scrollTo("#pricing")}
                >
                  <Send className="size-3.5" />
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
