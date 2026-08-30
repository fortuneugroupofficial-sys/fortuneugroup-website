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

const socialLinks = [
  { href: "https://www.instagram.com/fortuneugroup/?hl=en", icon: <Instagram className="w-5 h-5" style={{ color: "#E4405F" }} />, label: "Instagram", testid: "floating-instagram" },
  { href: "https://www.youtube.com/@FortuneUGroupOfficial", icon: <Youtube className="w-5 h-5" style={{ color: "#FF0000" }} />, label: "YouTube", testid: "floating-youtube" },
  { href: "https://www.facebook.com/profile.php?id=61589015788132", icon: <Facebook className="w-5 h-5" style={{ color: "#1877F2" }} />, label: "Facebook", testid: "floating-facebook" },
];

export const WhatsAppFab = () => (
  <div
    className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2.5"
    data-testid="floating-actions"
  >
    <span className="text-[9px] uppercase tracking-widest font-semibold text-white bg-[#0A2540] px-2 py-1 rounded-full shadow">
      Follow
    </span>
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
        className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300"
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
      className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300"
    >
      <MessageCircle className="w-5 h-5" style={{ color: "#25D366" }} />
    </a>
    <a
      href={`tel:+${WHATSAPP_NUMBER}`}
      aria-label="Call Now"
      title="Call Now"
      data-testid="floating-call-fab"
      onClick={() => trackEvent("call_click", { source: "fab" })}
      className="w-11 h-11 rounded-full bg-[#0A2540] text-white shadow-md flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 sm:hidden"
    >
      <Phone className="w-5 h-5" />
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
