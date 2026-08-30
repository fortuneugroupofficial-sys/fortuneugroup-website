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
  { to: "/health", key: "health" },
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
            <img
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
                >
               {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              data-testid="lang-toggle"
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-line text-white hover:border-brand-green hover:text-brand-green transition-colors"
            >
              {lang === "en" ? "EN | TE" : "TE | EN"}
            </button>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              onClick={()=>trackEvent("call_click",{source:"header"})} data-testid="header-call-btn"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-full border border-brand-line text-white hover:border-white hover:bg-white hover:text-brand-navy transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href="https://wa.me/919490237465"
              target="_blank" rel="noreferrer"
              onClick={()=>trackEvent("whatsapp_click",{source:"header"})} data-testid="header-whatsapp-btn"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors"
            >
              <MessageCircle color="#FFFFFF" size={20} />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden inline-flex items-center justify-center p-2 text-white hover:text-brand-green transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              data-testid="mobile-menu-toggle"
            >
              {open ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
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
   href="https://wa.me/919490237465"
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
          <h4 className="font-display font-semibold mb-2 text-sm tracking-wide text-[#D4AF37]">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/services">Mutual Fund Distribution</Link></li>
            <li><Link to="/services">SIP Planning</Link></li>
            <li><Link to="/services">Goal-Based Investing</Link></li>
            <li><Link to="/services">Retirement Planning</Link></li>
            <li><Link to="/services">Tax Saving Planning</Link></li>
            <li><Link to="/services">Child Education Planning</Link></li>
            <li><Link to="/services">Wealth Creation Planning</Link></li>
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
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
            <li><Link to="/disclosure">Disclosure</Link></li>
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
       <Facebook className="w-5 h-5 text-blue-500 hover:scale-110 transition" />
     </a>

     <a
       href="https://www.instagram.com/fortuneugroup/?hl=en"
       target="_blank"
       rel="noreferrer"
     >
       <Instagram className="w-5 h-5 text-pink-500 hover:scale-110 transition" />
     </a>

     <a
       href="https://www.youtube.com/@FortuneUGroupOfficial"
       target="_blank"
       rel="noreferrer"
     >
       <Youtube className="w-5 h-5 text-red-500 hover:scale-110 transition" />
     </a>

     <a
        href="https://wa.me/919490237465"
       target="_blank"
       rel="noreferrer"
     >
       <MessageCircle className="w-5 h-5 text-green-500 hover:scale-110 transition" />
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
          <p data-testid="legal-disclaimer">
            <strong className="text-white">Disclaimer:</strong> Mutual Fund investments are subject to market risks. Read all scheme related documents carefully before investing.
          </p>
          <p>© {new Date().getFullYear()} Fortune U Group. All rights reserved.</p>
          <p className="mt-3 text-xs text-white/60 text-center">
            Mutual Fund Distributor in Andhra Pradesh & Telangana | SIP Planning | Financial Planning | Retirement Planning | Child Education Planning | Demat Accounts | Insurance Guidance | Credit Card Services
          </p>
        </div>
      </div>
    </footer>
  );
};

const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    {/* WHITE outer circle */}
    <circle cx="12" cy="12" r="11.7" fill="#FFFFFF" />
    <defs>
      <linearGradient id="igGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEDA75" />
        <stop offset="22%" stopColor="#FA7E1E" />
        <stop offset="48%" stopColor="#D62976" />
        <stop offset="76%" stopColor="#962FBF" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    {/* Official gradient Instagram camera brand mark */}
    <rect x="6.1" y="6.1" width="11.8" height="11.8" rx="3.2" fill="none" stroke="url(#igGrad)" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.4" fill="none" stroke="url(#igGrad)" strokeWidth="1.5" />
    <circle cx="15.4" cy="8.6" r="1.1" fill="url(#igGrad)" />
  </svg>
);

const YtIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    {/* WHITE outer circle */}
    <circle cx="12" cy="12" r="11.7" fill="#FFFFFF" />
    {/* Official red rounded-rectangle YouTube play button */}
    <path fill="#FF0000" d="M5.6 6.6h12.8a1.9 1.9 0 0 1 1.9 1.9v7a1.9 1.9 0 0 1-1.9 1.9H5.6a1.9 1.9 0 0 1-1.9-1.9v-7a1.9 1.9 0 0 1 1.9-1.9z" />
    {/* WHITE play triangle */}
    <path fill="#FFFFFF" d="M10.2 9.7v4.6l4.2-2.3z" />
  </svg>
);

const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    {/* WHITE outer circle */}
    <circle cx="12" cy="12" r="11.7" fill="#FFFFFF" />
    {/* BRIGHT BLUE inner circle */}
    <circle cx="12" cy="12" r="8.6" fill="#1877F2" />
    {/* SOLID WHITE "f" */}
    <path fill="#FFFFFF" d="M14.5 8.5V6.8c0-.7.5-1 1.1-1H17V3h-2.3C12.2 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.4l.4-2.8h-2.8z" />
  </svg>
);

const WaIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    {/* WHITE outer circle */}
    <circle cx="12" cy="12" r="11.7" fill="#FFFFFF" />
    {/* BRIGHT GREEN inner circle */}
    <circle cx="12" cy="12" r="8.6" fill="#25D366" />
    {/* SOLID WHITE WhatsApp glyph */}
    <path fill="#FFFFFF" d="M12 4.2a7.8 7.8 0 0 0-6.6 11.8l-1.2 3.8 3.9-1.1A7.8 7.8 0 1 0 12 4.2zm3.7 11c-.2.6-1.2 1.1-1.7 1.1-.4 0-1-.1-1.7-.3-2.6-.9-4.3-2.7-5-4.7-.3-.9-.1-1.7.3-2.3.2-.3.6-.5.9-.5.2 0 .4 0 .6 0 .2 0 .3 0 .5.4l.7 1.5c.1.3.1.4 0 .5-.2.5-.5.8-.4 1 .3.6 1.1 1.4 2 1.9.2.1.4.1.5-.1.2-.3.7-.8.9-1 .2-.2.3-.2.5-.1.2.1 1.4.7 1.7.9.2.1.4.2.4.4 0 .3-.1.8-.3 1.2z" />
  </svg>
);

const socialLinks = [
  { href: "https://www.instagram.com/fortuneugroup/?hl=en", icon: <IgIcon />, label: "Instagram", testid: "floating-instagram" },
  { href: "https://www.youtube.com/@FortuneUGroupOfficial", icon: <YtIcon />, label: "YouTube", testid: "floating-youtube" },
  { href: "https://www.facebook.com/profile.php?id=61589015788132", icon: <FbIcon />, label: "Facebook", testid: "floating-facebook" },
];

export const WhatsAppFab = () => (
  <div
    className="fixed right-3 md:right-4 bottom-[230px] z-50 flex flex-col items-center gap-2.5"
    data-testid="floating-actions"
  >
    {socialLinks.map((s) => (
      <a
        key={s.label}
        href={s.href}
        target="_blank"
        rel="noreferrer"
        aria-label={s.label}
        title={s.label}
        data-testid={s.testid}
        onClick={() => trackEvent("social_click", { network: s.label.toLowerCase(), source: "fab" })}
        className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.18)] hover:scale-110 hover:shadow-lg transition-all duration-300"
      >
        {s.icon}
      </a>
    ))}
    <a
      href="https://wa.me/919490237465"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      title="WhatsApp"
      data-testid="floating-whatsapp-fab"
      onClick={() => trackEvent("whatsapp_click", { source: "fab" })}
      className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.18)] hover:scale-110 hover:shadow-lg transition-all duration-300"
    >
      <WaIcon />
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
