import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MessageCircle,
  ArrowUpRight,
  Phone,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";
import { useLang } from "../context/LangContext";
import { whatsappLink, BUSINESS_EMAIL, WHATSAPP_NUMBER } from "../lib/api";
import { trackEvent } from "./Analytics";
import { Button } from "./ui/button";

const navItems = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/services", key: "services" },
  { to: "/tools", key: "tools" },
  { to: "/blog", key: "blog" },
  { to: "/contact", key: "contact" },
];

export const Header = () => {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  React.useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1F3A] border-b border-brand-line" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" 
          data-testid="nav-logo">
     ;f/
            ][<img
             src="/fortune-logo.png"
             alt="Fortune U Group"
             className="h-32 md:h-36 w-auto"
            />
            
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.key}`}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                    ? "text-yellow-400"
                    : "text-white hover:text-yellow-400"
                  }`
                }
              >{t(`nav.${item.key}`)}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              data-testid="lang-toggle"
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-line text-white hover:border-brand-green hover:text-brand-green transition"
            >
              {lang === "en" ? "EN · తె" : "తె · EN"}
            </button>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              onClick={()=>trackEvent("call_click",{source:"header"})} data-testid="header-call-btn"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-full border border-brand-line text-white hover:border-white hover:bg-white hover:text-[#0B1F3A] transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href={whatsappLink()}
              target="_blank" rel="noreferrer"
              onClick={()=>trackEvent("whatsapp_click",{source:"header"})} data-testid="header-whatsapp-btn"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-brand-green text-white hover:bg-brand-deepgreen transition-colors"
            >
              <MessageCircle color="#FFFFFF" size={20} />
              <span>WhatsApp</span>
            </a>

          </div>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-brand-line bg-white" data-testid="mobile-menu">
          <div className="px-5 py-4 grid gap-1">
            {navItems.map((it) => (
              <NavLink key={it.to} to={it.to} className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-brand-soft" data-testid={`mobile-nav-${it.key}`}>
                {t(`nav.${it.key}`)}
              </NavLink>
            ))}
           <a
  href={whatsappLink()}
  target="_blank"
  rel="noreferrer"
  className="mt-2 px-3 py-2.5 rounded-md text-sm font-semibold"
>
  WhatsApp
</a>

<a
  href={`tel:+${WHATSAPP_NUMBER}`}
  className="px-3 py-2.5 rounded-md text-sm font-semibold"
>
  Call Now
</a>

<Link
  to="/contact"
  className="px-3 py-2.5 rounded-md text-sm font-semibold"
>
  Contact
</Link> 
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-md bg-white text-brand-navy flex items-center justify-center font-display font-bold">F</div>
            <div className="font-display font-semibold">Fortune U Group</div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">Financial Education → Financial Planning → Financial Freedom. Helping Indian families build long-term wealth.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-sm tracking-wide">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/services">Mutual Fund Distribution</Link></li>
            <li><Link to="/services">SIP Planning</Link></li>
            <li><Link to="/services">Goal-Based Investing</Link></li>
            <li><Link to="/services">Retirement Planning</Link></li>
            <li><Link to="/services">Health & Term Insurance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-sm tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/tools">Calculators</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-sm tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Email: <a className="hover:text-brand-green" href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a></li>
            <li>WhatsApp: +{WHATSAPP_NUMBER}</li>
            <li>Domain: www.fortuneugroup.in</li>
            <li className="mt-4">
  <div className="flex gap-4">

    <a
      href="https://www.facebook.com/profile.php?id=61589015788132"
      target="_blank"
      rel="noreferrer"
    >
      <Facebook className="w-5 h-5" />
    </a>

    <a
      href="https://www.instagram.com/fortuneugroup/?hl=en"
      target="_blank"
      rel="noreferrer"
    >
      <Instagram className="w-5 h-5" />
    </a>

    <a
      href="https://www.youtube.com/@FortuneUGroupOfficial"
      target="_blank"
      rel="noreferrer"
    >
      <Youtube className="w-5 h-5" />
    </a>

    <a
      href="https://wa.me/919533304441"
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle className="w-5 h-5" />
    </a>

  </div>
</li>

<li>
  <a
    href="https://www.instagram.com/fortuneugroup/?hl=en"
    target="_blank"
    rel="noreferrer"
  >
    Instagram
  </a>
</li>

<li>
  <a
    href="https://www.youtube.com/@FortuneUGroupOfficial"
    target="_blank"
    rel="noreferrer"
  >
    YouTube
  </a>
</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 text-xs text-white/60 leading-relaxed space-y-2">
          <p data-testid="legal-disclaimer"><strong className="text-white">Disclaimer:</strong> Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. Fortune U Group provides investor education, mutual fund distribution support, and financial awareness services. Investment decisions should be taken after evaluating individual financial goals and risk profile.</p>
          <p>© {new Date().getFullYear()} Fortune U Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const WhatsAppFab = () => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end" data-testid="floating-actions">
    <a
      href={`tel:+${WHATSAPP_NUMBER}`}
      onClick={()=>trackEvent("call_click",{source:"fab"})} data-testid="floating-call-fab"
      className="rounded-full shadow-2xl bg-brand-navy text-white p-4 hover:scale-110 transition-transform sm:hidden"
      aria-label="Call Now"
    >
      <Phone className="w-6 h-6" />
    </a>
    <a
      href={whatsappLink()}
      target="_blank" rel="noreferrer"
      onClick={()=>trackEvent("whatsapp_click",{source:"fab"})} data-testid="floating-whatsapp-fab"
      className="rounded-full shadow-2xl bg-[#25D366] text-white p-4 hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  </div>
);

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-brand-bg">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <WhatsAppFab />
  </div>
);

export default Layout;
