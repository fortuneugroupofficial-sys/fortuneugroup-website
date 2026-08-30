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
    <defs>
      <linearGradient id="igGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEDA75" />
        <stop offset="18%" stopColor="#FA7E1E" />
        <stop offset="45%" stopColor="#E4405F" />
        <stop offset="70%" stopColor="#D62976" />
        <stop offset="100%" stopColor="#BC1888" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11.5" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="8.6" fill="url(#igGrad)" />
    <g transform="translate(12,12) scale(0.72) translate(-12,-12)">
      <path fill="#FFFFFF" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </g>
  </svg>
);

const YtIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    <circle cx="12" cy="12" r="11.5" fill="#FFFFFF" />
    <path fill="#FF0000" d="M4.6 7.3h14.8a1.7 1.7 0 0 1 1.7 1.7v6a1.7 1.7 0 0 1-1.7 1.7H4.6a1.7 1.7 0 0 1-1.7-1.7V9a1.7 1.7 0 0 1 1.7-1.7z" />
    <path fill="#FFFFFF" d="M9.9 9.3v5.4l4.6-2.7z" />
  </svg>
);

const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    <circle cx="12" cy="12" r="11.5" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="8.6" fill="#1877F2" />
    {/* OFFICIAL SIMPLE ICONS FACEBOOK PATH, scaled smaller and centered */}
    <g transform="translate(12,11.8) scale(0.55) translate(-13.5,-11.8)">
      <path fill="#FFFFFF" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </g>
  </svg>
);

const WaIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ opacity: 1, filter: "none", display: "block" }}>
    <circle cx="12" cy="12" r="11.5" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="8.6" fill="#25D366" />
    <g transform="translate(12,12) scale(0.70) translate(-12,-12)">
      <path fill="#FFFFFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </g>
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
