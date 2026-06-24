import { useState, useEffect, useRef } from "react";
import {
  Shield, Heart, Car, Home, Briefcase, CreditCard, TrendingUp,
  PiggyBank, Phone, MessageCircle, ChevronRight, Star, Check,
  Users, Zap, Award, Eye, Handshake, HeadphonesIcon, Menu, X,
  ArrowRight, Building2, Landmark, BarChart3, FileText, Clock,
  MapPin, BadgeCheck, PhoneCall
} from "lucide-react";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const C = {
  navy:   "#0A1931",
  navy2:  "#0D2040",
  blue:   "#1E3A8A",
  blue2:  "#1a347d",
  gold:   "#D4AF37",
  gold2:  "#E8C55A",
  goldLt: "#FBF3D5",
  white:  "#FFFFFF",
  off:    "#F8F6F0",
  muted:  "#6B7280",
};

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */
const GoldDivider = () => (
  <div className="flex items-center gap-3 mb-3">
    <div style={{ width: 32, height: 2, background: C.gold }} />
  </div>
);

const SectionEyebrow = ({ text }) => (
  <div className="flex items-center gap-2 mb-3">
    <div style={{ width: 28, height: 2, background: C.gold }} />
    <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
      {text}
    </span>
  </div>
);

const SectionTitle = ({ children, light = false }) => (
  <h2 style={{
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(26px, 3.5vw, 38px)",
    fontWeight: 700,
    color: light ? C.white : C.navy,
    lineHeight: 1.2,
    marginBottom: 12,
  }}>
    {children}
  </h2>
);

const PrimaryBtn = ({ children, href = "#", onClick, style = {} }) => (
  <a
    href={href}
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
      color: C.navy, fontWeight: 700, fontSize: 14,
      padding: "12px 26px", borderRadius: 50,
      textDecoration: "none", transition: "all .25s ease",
      boxShadow: "0 4px 18px rgba(212,175,55,.35)",
      cursor: "pointer",
      ...style
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(212,175,55,.5)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(212,175,55,.35)"; }}
  >
    {children}
  </a>
);

const OutlineBtn = ({ children, href = "#", light = false, style = {} }) => (
  <a
    href={href}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      border: `2px solid ${light ? "rgba(255,255,255,.4)" : C.blue}`,
      color: light ? C.white : C.blue,
      fontWeight: 600, fontSize: 14,
      padding: "11px 24px", borderRadius: 50,
      textDecoration: "none", transition: "all .25s ease",
      cursor: "pointer",
      ...style
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; e.currentTarget.style.background = "rgba(212,175,55,.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = light ? "rgba(255,255,255,.4)" : C.blue; e.currentTarget.style.color = light ? C.white : C.blue; e.currentTarget.style.background = ""; }}
  >
    {children}
  </a>
);

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
const ProductCard = ({ icon: Icon, title, desc, highlights, tag, tagColor, iconBg }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: 16,
        padding: "30px 26px",
        border: "1px solid rgba(10,25,49,.08)",
        boxShadow: hovered ? "0 20px 48px rgba(10,25,49,.14)" : "0 2px 14px rgba(10,25,49,.06)",
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all .32s cubic-bezier(.34,1.56,.64,1)",
        display: "flex", flexDirection: "column", gap: 0,
        position: "relative", overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Gold sweep line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.gold}, ${C.gold2})`,
        transform: `scaleX(${hovered ? 1 : 0})`,
        transformOrigin: "left",
        transition: "transform .35s ease",
      }} />

      {/* Tag */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: tagColor.bg, color: tagColor.text,
        fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
        textTransform: "uppercase", padding: "3px 9px", borderRadius: 50,
      }}>
        {tag}
      </div>

      {/* Icon */}
      <div style={{
        width: 62, height: 62, borderRadius: 14,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20,
        transform: hovered ? "scale(1.08)" : "scale(1)",
        transition: "transform .3s ease",
      }}>
        <Icon size={28} style={{ color: C.blue }} />
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 10,
      }}>{title}</h3>

      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, flexGrow: 1, marginBottom: 20 }}>
        {desc}
      </p>

      {/* Highlights */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
        {highlights.map(h => (
          <span key={h} style={{
            fontSize: 11, fontWeight: 600, color: C.blue,
            background: "#EEF3FB", padding: "4px 10px", borderRadius: 50,
          }}>{h}</span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <a href="tel:+919533304441" style={{
          flex: 1, textAlign: "center", padding: "10px 14px",
          background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
          color: C.white, borderRadius: 9, fontSize: 13, fontWeight: 600,
          textDecoration: "none", transition: "all .25s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}, ${C.gold2})`; e.currentTarget.style.color = C.navy; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${C.navy}, ${C.blue})`; e.currentTarget.style.color = C.white; }}
        >
          Apply Now
        </a>
        <a href="#contact" style={{
          flex: 1, textAlign: "center", padding: "10px 14px",
          border: `1.5px solid #CBD5E8`, color: C.blue, borderRadius: 9,
          fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all .25s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E8"; e.currentTarget.style.color = C.blue; }}
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const INSURANCE = [
  {
    icon: Heart, title: "Health Insurance",
    tag: "Insurance", tagColor: { bg: "#E8F4FD", text: "#1565C0" },
    iconBg: "linear-gradient(135deg,#E8F4FD,#BFE0F9)",
    desc: "Comprehensive medical cover for you and your family. Cashless hospitalisation at 5,000+ network hospitals, OPD benefits, and critical illness riders.",
    highlights: ["Cashless Network", "Family Floater", "Critical Illness", "No Claim Bonus"],
  },
  {
    icon: Shield, title: "Term Insurance",
    tag: "Insurance", tagColor: { bg: "#E8F4FD", text: "#1565C0" },
    iconBg: "linear-gradient(135deg,#EDE9FE,#C4B5FD)",
    desc: "Pure life protection at the lowest premiums. Secure your family's financial independence with a high sum assured that stands firm, whatever life brings.",
    highlights: ["High Cover", "Low Premium", "Tax Benefit 80C", "Riders Available"],
  },
  {
    icon: Car, title: "Vehicle Insurance",
    tag: "Insurance", tagColor: { bg: "#E8F4FD", text: "#1565C0" },
    iconBg: "linear-gradient(135deg,#E8F4FD,#BFE0F9)",
    desc: "Protect your car, bike, or commercial vehicle from accidents, theft, and natural calamities. Mandatory third-party cover and comprehensive own-damage options.",
    highlights: ["Third-Party Cover", "Own Damage", "Zero Depreciation", "Instant Renewal"],
  },
];

const LOANS = [
  {
    icon: Home, title: "Home Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF3E0,#FFE0A3)",
    desc: "Turn your dream home into reality. Attractive interest rates, tenures up to 30 years, and minimal documentation. Balance transfer options available.",
    highlights: ["Up to ₹5 Cr", "Up to 30 Yrs", "Balance Transfer", "Tax Benefits"],
  },
  {
    icon: Briefcase, title: "Personal Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF8E1,#FFE082)",
    desc: "Instant funds for any purpose — travel, wedding, medical, or education. Unsecured and paperless, disbursed directly to your account within 24–48 hours.",
    highlights: ["No Collateral", "Quick Disbursal", "Flexible Tenure", "Minimal Docs"],
  },
  {
    icon: Building2, title: "Business Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF3E0,#FFE0A3)",
    desc: "Fuel your enterprise's growth with working capital, machinery finance, or expansion funding. Tailored for MSMEs, startups, and established businesses.",
    highlights: ["MSME Focused", "Collateral-Free", "Overdraft Option", "Govt Schemes"],
  },
  {
    icon: Car, title: "Vehicle Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF8E1,#FFE082)",
    desc: "Drive away in your dream vehicle with financing up to 100% on-road price. Competitive EMIs, flexible tenure, and doorstep documentation for new & used vehicles.",
    highlights: ["100% On-Road", "New & Used", "Fast Approval", "Low EMI"],
  },
];

const BANKING = [
  {
    icon: CreditCard, title: "Credit Cards",
    tag: "Banking", tagColor: { bg: "#E8F5E9", text: "#2E7D32" },
    iconBg: "linear-gradient(135deg,#E8F5E9,#B9E4BB)",
    desc: "Maximise every rupee. From cashback and reward points to travel miles — we match you with the right card from India's leading banks, instantly.",
    highlights: ["Cashback Cards", "Reward Points", "Travel Perks", "Zero Annual Fee"],
  },
  {
    icon: TrendingUp, title: "Demat Account",
    tag: "Investment", tagColor: { bg: "#E8F5E9", text: "#2E7D32" },
    iconBg: "linear-gradient(135deg,#E8F5E9,#B9E4BB)",
    desc: "Start your market journey with a linked demat + trading account. Invest in equities, mutual funds, IPOs, bonds, and ETFs — all from one seamless platform.",
    highlights: ["Stocks & ETFs", "IPO Access", "SIP Integration", "Low Brokerage"],
  },
  {
    icon: PiggyBank, title: "Savings & Investment Plans",
    tag: "Banking", tagColor: { bg: "#E8F5E9", text: "#2E7D32" },
    iconBg: "linear-gradient(135deg,#E8F5E9,#B9E4BB)",
    desc: "High-yield savings accounts, SIPs, FDs, and mutual fund plans that grow your wealth steadily. Let your money work harder while you focus on what matters.",
    highlights: ["High Interest", "Zero Balance", "SIP Planning", "Mutual Funds"],
  },
];

const WHY_US = [
  { icon: Users, title: "10,000+ Clients Served", desc: "A decade of trust across Andhra Pradesh and Telangana." },
  { icon: Zap, title: "Fast Processing", desc: "Same-day approvals and 24–48 hour disbursals on select products." },
  { icon: Award, title: "Expert Advisors", desc: "Certified financial planners dedicated to your goals." },
  { icon: Eye, title: "Transparent Service", desc: "No hidden charges. Clear terms. Full disclosure, always." },
  { icon: Handshake, title: "Multiple Bank Partnerships", desc: "Access to 20+ leading banks and insurers in one place." },
  { icon: HeadphonesIcon, title: "End-to-End Support", desc: "From application to approval — we're with you at every step." },
];

const PARTNERS = [
  { name: "HDFC Bank", abbr: "HDFC" },
  { name: "ICICI Bank", abbr: "ICICI" },
  { name: "State Bank of India", abbr: "SBI" },
  { name: "Axis Bank", abbr: "AXIS" },
  { name: "LIC", abbr: "LIC" },
  { name: "Care Health", abbr: "CARE" },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar", role: "Business Owner, Hyderabad",
    text: "Fortune U Group helped me secure a ₹50 lakh business loan within a week. Their team handled every document and the entire process was completely stress-free.",
    rating: 5,
  },
  {
    name: "Priya Lakshmi", role: "IT Professional, Vijayawada",
    text: "I was confused about which health insurance to choose. The advisor at Fortune U Group explained every plan clearly and helped me pick the perfect one for my family.",
    rating: 5,
  },
  {
    name: "Suresh Reddy", role: "Home Buyer, Guntur",
    text: "Got the best home loan interest rate through Fortune U Group. They compared offers from 8 banks and saved me lakhs over the tenure. Truly exceptional service.",
    rating: 5,
  },
];

const STATS = [
  { value: "10K+", label: "Clients Served" },
  { value: "₹50Cr+", label: "Loans Processed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "20+", label: "Bank Partners" },
];

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("insurance");
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "" });
  const [callbackSent, setCallbackSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#why" },
    { label: "Products", href: "#insurance" },
    { label: "Contact", href: "#contact" },
  ];

  const handleCallback = (e) => {
    e.preventDefault();
    setCallbackSent(true);
    setTimeout(() => setCallbackSent(false), 4000);
    setCallbackForm({ name: "", phone: "" });
  };

  /* ── STYLES ── */
  const headerBg = scrolled
    ? `linear-gradient(135deg, ${C.navy} 0%, ${C.blue2} 100%)`
    : `linear-gradient(135deg, ${C.navy}CC 0%, ${C.blue2}CC 100%)`;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F7F6F2", color: C.navy, overflowX: "hidden" }}>

      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.navy}; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 3px; }
        .scroll-mt { scroll-margin-top: 80px; }
      `}</style>

      {/* ════════════════════════════════════
          STICKY HEADER
      ════════════════════════════════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: headerBg,
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.35)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all .3s ease",
        borderBottom: scrolled ? `1px solid rgba(212,175,55,.15)` : "none",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Landmark size={22} style={{ color: C.navy }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.white, lineHeight: 1.1 }}>
                Fortune U Group
              </div>
              <div style={{ fontSize: 10, color: C.gold2, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>
                Financial Services
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} style={{
                color: "rgba(255,255,255,.75)", textDecoration: "none",
                fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 6,
                transition: "all .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = C.gold2; e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.75)"; e.currentTarget.style.background = ""; }}
              >
                {l.label}
              </a>
            ))}
            <a href="tel:+919533304441" style={{
              display: "flex", alignItems: "center", gap: 7,
              background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
              color: C.navy, fontWeight: 700, fontSize: 13,
              padding: "8px 18px", borderRadius: 50,
              textDecoration: "none", marginLeft: 8,
              boxShadow: "0 3px 12px rgba(212,175,55,.3)",
              transition: "all .25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(212,175,55,.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 3px 12px rgba(212,175,55,.3)"; }}
            >
              <Phone size={14} /> Call Now
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", color: C.white, cursor: "pointer" }} className="show-mobile">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: C.navy, padding: "16px 24px 24px",
            borderTop: `1px solid rgba(212,175,55,.15)`,
          }}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
                display: "block", color: "rgba(255,255,255,.8)", textDecoration: "none",
                padding: "12px 0", fontSize: 15, fontWeight: 500,
                borderBottom: "1px solid rgba(255,255,255,.06)",
              }}>{l.label}</a>
            ))}
            <a href="tel:+919000000000" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
              color: C.navy, fontWeight: 700, fontSize: 14,
              padding: "12px", borderRadius: 50, marginTop: 16,
              textDecoration: "none",
            }}>
              <Phone size={16} /> Call Now
            </a>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section id="home" style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navy2} 40%, ${C.blue} 100%)`,
        paddingTop: 144, paddingBottom: 88,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,175,55,.1) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, rgba(30,58,138,.5) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "25%", width: 2, height: 120, background: `linear-gradient(${C.gold}66, transparent)`, transform: "rotate(15deg)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(212,175,55,.12)", border: "1px solid rgba(212,175,55,.3)",
              color: C.gold2, fontSize: 11, fontWeight: 700, letterSpacing: "2px",
              textTransform: "uppercase", padding: "6px 18px", borderRadius: 50, marginBottom: 28,
            }}>
              ✦ AP & Telangana's Trusted Financial Partner
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 5.5vw, 60px)",
              fontWeight: 800, color: C.white,
              lineHeight: 1.1, marginBottom: 20,
            }}>
              Your Trusted{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Financial Growth
              </span>{" "}
              Partner
            </h1>

            <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", maxWidth: 540, margin: "0 auto 40px", fontWeight: 300, lineHeight: 1.7 }}>
              Insurance, loans, and banking solutions designed for your life — backed by 10,000+ satisfied families across Andhra Pradesh and Telangana.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
              <PrimaryBtn href="tel:+919533304441">
                <Phone size={16} /> Call Now
              </PrimaryBtn>
              <a href="https://wa.me/919533304441" target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#25D366", color: C.white,
                fontWeight: 700, fontSize: 14,
                padding: "12px 26px", borderRadius: 50,
                textDecoration: "none", transition: "all .25s",
                boxShadow: "0 4px 18px rgba(37,211,102,.3)",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,211,102,.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(37,211,102,.3)"; }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <OutlineBtn href="#contact" light>
                <FileText size={15} /> Request Callback
              </OutlineBtn>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {[
                { icon: Users, label: "1,000+ Clients" },
                { icon: MapPin, label: "AP & Telangana" },
                { icon: BadgeCheck, label: "IRDAI Assistance" },
                { icon: Landmark, label: "RBI Guided Products" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.82)",
                  fontSize: 12, fontWeight: 500,
                  padding: "8px 14px", borderRadius: 50,
                }}>
                  <Icon size={13} style={{ color: C.gold2 }} /> {label}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          INSURANCE
      ════════════════════════════════════ */}
      <section id="insurance" className="scroll-mt" style={{ padding: "80px 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Protection Plans" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
            <div>
              <SectionTitle>Insurance Products</SectionTitle>
              <p style={{ color: C.muted, fontSize: 15, maxWidth: 500 }}>
                Protect your health, life, and assets with industry-leading coverage at competitive premiums.
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {INSURANCE.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent)" }} />
      </div>

      {/* ════════════════════════════════════
          LOANS
      ════════════════════════════════════ */}
      <section id="loans" className="scroll-mt" style={{ padding: "72px 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Credit Solutions" />
          <div style={{ marginBottom: 40 }}>
            <SectionTitle>Loan Products</SectionTitle>
            <p style={{ color: C.muted, fontSize: 15, maxWidth: 500 }}>
              Flexible financing with competitive rates and fast approvals to help you achieve every goal.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {LOANS.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent)" }} />
      </div>

      {/* ════════════════════════════════════
          BANKING & INVESTMENT
      ════════════════════════════════════ */}
      <section id="banking" className="scroll-mt" style={{ padding: "72px 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Wealth Management" />
          <div style={{ marginBottom: 40 }}>
            <SectionTitle>Banking & Investment</SectionTitle>
            <p style={{ color: C.muted, fontSize: 15, maxWidth: 500 }}>
              Grow your wealth with the right savings, credit, and investment tools matched to your financial profile.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {BANKING.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY CHOOSE US
      ════════════════════════════════════ */}
      <section id="why" style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.blue} 100%)`,
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionEyebrow text="Our Edge" />
            <SectionTitle light>Why Choose Fortune U Group?</SectionTitle>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
              We're not just advisors — we're your long-term financial partners.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <WhyCard key={title} Icon={Icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          PARTNER LOGOS
      ════════════════════════════════════ */}
      <section style={{ padding: "64px 24px", background: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.muted, marginBottom: 32 }}>
            Partnered with India's Leading Institutions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center" }}>
            {PARTNERS.map(p => (
              <div key={p.abbr} style={{
                padding: "14px 28px", borderRadius: 12,
                border: "1.5px solid rgba(10,25,49,.1)",
                background: "#F8F6F2",
                transition: "all .25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldLt; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(10,25,49,.1)"; e.currentTarget.style.background = "#F8F6F2"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.navy }}>{p.abbr}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: "#F7F6F2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionEyebrow text="Client Stories" />
            <SectionTitle>What Our Clients Say</SectionTitle>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map(t => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS
      ════════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.blue} 100%)`,
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 40, textAlign: "center" }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, color: C.gold2, lineHeight: 1, marginBottom: 8 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════ */}
      <section id="contact" style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, #112240 50%, ${C.blue} 100%)`,
        padding: "88px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 50%, rgba(212,175,55,.08) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(30,58,138,.4) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.gold2, marginBottom: 20 }}>
            ✦ Take the First Step
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4.5vw, 48px)",
            fontWeight: 800, color: C.white, lineHeight: 1.15, marginBottom: 16,
          }}>
            Secure Your{" "}
            <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Financial Future
            </span>{" "}
            Today
          </h2>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,.62)", marginBottom: 12, fontWeight: 300 }}>
            Our advisors are ready to help you compare, choose, and get approved — quickly and without hassle.
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
            color: C.gold2, background: "rgba(212,175,55,.1)", border: "1px solid rgba(212,175,55,.25)",
            padding: "5px 14px", borderRadius: 50, marginBottom: 44, fontWeight: 600,
          }}>
            <MapPin size={12} /> Serving Andhra Pradesh & Telangana
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <PrimaryBtn href="tel:+919533304441">
              <Phone size={16} /> Call Now
            </PrimaryBtn>
            <a href="https://wa.me/919533304441" target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#25D366", color: C.white, fontWeight: 700, fontSize: 14,
              padding: "12px 26px", borderRadius: 50,
              textDecoration: "none", transition: "all .25s",
              boxShadow: "0 4px 18px rgba(37,211,102,.3)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
          </div>

          {/* Callback Form */}
          <div style={{
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 16, padding: "32px 28px", maxWidth: 480, margin: "0 auto",
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.white, marginBottom: 20, fontWeight: 700 }}>
              Request a Callback
            </h3>
            {callbackSent ? (
              <div style={{ color: C.gold2, fontSize: 15, fontWeight: 600, padding: "12px 0" }}>
                ✓ Thank you! We'll call you within 2 hours.
              </div>
            ) : (
              <form onSubmit={handleCallback} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="text" placeholder="Your Name" required
                  value={callbackForm.name}
                  onChange={e => setCallbackForm(f => ({ ...f, name: e.target.value }))}
                  style={{
                    padding: "12px 16px", borderRadius: 9, fontSize: 14,
                    border: "1.5px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)",
                    color: C.white, outline: "none",
                  }}
                />
                <input
                  type="tel" placeholder="Mobile Number" required
                  value={callbackForm.phone}
                  onChange={e => setCallbackForm(f => ({ ...f, phone: e.target.value }))}
                  style={{
                    padding: "12px 16px", borderRadius: 9, fontSize: 14,
                    border: "1.5px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)",
                    color: C.white, outline: "none",
                  }}
                />
                <button type="submit" style={{
                  background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
                  color: C.navy, fontWeight: 700, fontSize: 14,
                  padding: "13px", borderRadius: 9, border: "none", cursor: "pointer",
                  transition: "all .25s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  <PhoneCall size={15} style={{ display: "inline", marginRight: 7, verticalAlign: "middle" }} />
                  Request Callback
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SEO CONTENT
      ════════════════════════════════════ */}
      <section style={{ background: C.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionEyebrow text="About Our Services" />
          <SectionTitle>Comprehensive Financial Services in AP & Telangana</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginTop: 28 }}>
            {[
              {
                title: "Insurance Guidance",
                body: "Fortune U Group partners with India's top insurers to bring you health, term, and vehicle insurance plans that fit your life and budget. Our IRDAI-assisted advisors help you compare, evaluate, and select coverage without the complexity.",
              },
              {
                title: "Loan Facilitation",
                body: "From home loans to business finance, we work with 20+ banks and NBFCs to find you the best interest rates, flexible repayment structures, and fastest approval timelines — all from a single point of contact.",
              },
              {
                title: "Investments & Banking",
                body: "Open demat accounts, start SIPs, or choose the right credit card with expert guidance. Our financial planners align your savings and investment decisions to your long-term goals, not generic one-size-fits-all advice.",
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: "20px 24px", background: "#F7F6F2", borderRadius: 12, borderLeft: `4px solid ${C.gold}` }}>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
              <strong style={{ color: C.navy }}>Mutual Fund Distributor</strong> | SIP Planning | Financial Planning | Insurance Guidance | Credit Cards | Demat Accounts | Savings Accounts —
              Fortune U Group serves clients across Hyderabad, Vijayawada, Guntur, Visakhapatnam, and all major cities in Andhra Pradesh and Telangana.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer style={{ background: C.navy, padding: "40px 24px 28px", borderTop: `1px solid rgba(212,175,55,.18)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, marginBottom: 32 }}>

            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.white, fontWeight: 700, marginBottom: 8 }}>
                Fortune <span style={{ color: C.gold2 }}>U</span> Group
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.65 }}>
                Your trusted financial partner across Andhra Pradesh & Telangana. Building wealth, protecting futures.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <a href="tel:+919533304441" style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: `rgba(212,175,55,.12)`, border: `1px solid rgba(212,175,55,.25)`,
                  color: C.gold2, fontSize: 12, fontWeight: 600,
                  padding: "7px 14px", borderRadius: 50, textDecoration: "none",
                }}>
                  <Phone size={12} /> Call Us
                </a>
                <a href="https://wa.me/919533304441" target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(37,211,102,.12)", border: "1px solid rgba(37,211,102,.25)",
                  color: "#4ADE80", fontSize: 12, fontWeight: 600,
                  padding: "7px 14px", borderRadius: 50, textDecoration: "none",
                }}>
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Quick Links</div>
              {["Insurance", "Loans", "Banking & Investment", "About Us", "Contact"].map(l => (
                <div key={l} style={{ marginBottom: 9 }}>
                  <a href="#" style={{ color: "rgba(255,255,255,.5)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.gold2; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}
                  >
                    <ChevronRight size={12} /> {l}
                  </a>
                </div>
              ))}
            </div>

            {/* Services */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Services</div>
              {["Mutual Fund Distribution", "SIP Planning", "Financial Planning", "Insurance Guidance", "Demat Accounts", "Credit Cards"].map(s => (
                <div key={s} style={{ marginBottom: 9 }}>
                  <span style={{ color: "rgba(255,255,255,.45)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={11} style={{ color: C.gold }} /> {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Coverage */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Coverage</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                <MapPin size={14} style={{ color: C.gold2, marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,.55)", fontSize: 13, lineHeight: 1.6 }}>
                  Hyderabad, Vijayawada,<br />Guntur, Visakhapatnam,<br />and all major cities in<br />AP & Telangana
                </span>
              </div>
            </div>

          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,.06)", marginBottom: 20 }} />

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.28)" }}>
              © 2024 Fortune U Group. All rights reserved.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, fontSize: 11, color: "rgba(255,255,255,.3)" }}>
              {["Mutual Fund Distributor", "SIP Planning", "Financial Planning", "Insurance Guidance", "Credit Cards", "Demat Accounts"].map((s, i, arr) => (
                <span key={s}>{s}{i < arr.length - 1 && <span style={{ color: C.gold, margin: "0 4px" }}>|</span>}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════
          FLOATING WHATSAPP BUTTON
      ════════════════════════════════════ */}
      <a
        href="https://wa.me/919533304441"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed", bottom: 28, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: "50%",
          background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,.45)",
          textDecoration: "none",
          transition: "all .3s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,211,102,.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.45)"; }}
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} style={{ color: C.white }} />
        {/* Pulse ring */}
        <span style={{
          position: "absolute", inset: -4,
          borderRadius: "50%",
          border: "2px solid rgba(37,211,102,.4)",
          animation: "pulse 2s infinite",
        }} />
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.15);opacity:0} }`}</style>
      </a>

    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS (defined after main export)
───────────────────────────────────────── */
function WhyCard({ Icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.05)",
        border: `1px solid ${hovered ? "rgba(212,175,55,.4)" : "rgba(255,255,255,.1)"}`,
        borderRadius: 14, padding: "26px 24px",
        transition: "all .3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: hovered ? `linear-gradient(135deg, ${C.gold}, ${C.gold2})` : "rgba(212,175,55,.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, transition: "all .3s ease",
      }}>
        <Icon size={22} style={{ color: hovered ? C.navy : C.gold2 }} />
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, text, rating }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: 16, padding: "30px 26px",
        border: `1px solid ${hovered ? C.gold : "rgba(10,25,49,.08)"}`,
        boxShadow: hovered ? "0 16px 40px rgba(10,25,49,.12)" : "0 2px 14px rgba(10,25,49,.06)",
        transform: hovered ? "translateY(-5px)" : "none",
        transition: "all .3s ease",
        position: "relative",
      }}
    >
      {/* Quote mark */}
      <div style={{
        position: "absolute", top: 18, right: 22,
        fontFamily: "serif", fontSize: 72,
        color: "rgba(212,175,55,.12)", lineHeight: 1, userSelect: "none",
      }}>"</div>

      {/* Stars */}
      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={14} style={{ color: C.gold, fill: C.gold }} />
        ))}
      </div>

      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>
        "{text}"
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.white, fontWeight: 700, fontSize: 16,
          fontFamily: "'Playfair Display', serif",
        }}>
          {name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{role}</div>
        </div>
      </div>
    </div>
  );
}
