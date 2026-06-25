import { useState } from "react";
import {
  Shield, Heart, Car, Home, Briefcase, CreditCard, TrendingUp,
  PiggyBank, Phone, MessageCircle, Star,
  Users, Zap, Award, Eye, Handshake, HeadphonesIcon,
  Building2, Landmark, FileText, MapPin, BadgeCheck, PhoneCall,
  ChevronDown, BarChart3,
} from "lucide-react";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const C = {
  navy:   "#0A1931",
  navy2:  "#0D2040",
  blue:   "#1E3A8A",
  gold:   "#D4AF37",
  gold2:  "#E8C55A",
  goldLt: "#FBF3D5",
  white:  "#FFFFFF",
  muted:  "#6B7280",
};

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */
const SectionEyebrow = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <div style={{ width: 28, height: 2, background: C.gold, flexShrink: 0 }} />
    <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
      {text}
    </span>
  </div>
);

const SectionTitle = ({ children, light = false }) => (
  <h2 style={{
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(24px, 3vw, 34px)",
    fontWeight: 700,
    color: light ? C.white : C.navy,
    lineHeight: 1.2,
    marginBottom: 10,
  }}>
    {children}
  </h2>
);

const PrimaryBtn = ({ children, href = "#", style = {} }) => (
  <a
    href={href}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
      color: C.navy, fontWeight: 700, fontSize: 14,
      padding: "11px 24px", borderRadius: 50,
      textDecoration: "none", transition: "all .25s ease",
      boxShadow: "0 4px 18px rgba(212,175,55,.35)",
      cursor: "pointer", ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(212,175,55,.5)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(212,175,55,.35)"; }}
  >
    {children}
  </a>
);

const OutlineBtn = ({ children, href = "#", light = false }) => (
  <a
    href={href}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      border: `2px solid ${light ? "rgba(255,255,255,.4)" : C.blue}`,
      color: light ? C.white : C.blue,
      fontWeight: 600, fontSize: 14,
      padding: "10px 22px", borderRadius: 50,
      textDecoration: "none", transition: "all .25s ease", cursor: "pointer",
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
        background: C.white, borderRadius: 16, padding: "28px 24px",
        border: "1px solid rgba(10,25,49,.08)",
        boxShadow: hovered ? "0 20px 48px rgba(10,25,49,.14)" : "0 2px 14px rgba(10,25,49,.06)",
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "all .32s cubic-bezier(.34,1.56,.64,1)",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden", cursor: "default",
      }}
    >
      {/* Gold sweep line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.gold}, ${C.gold2})`,
        transform: `scaleX(${hovered ? 1 : 0})`,
        transformOrigin: "left", transition: "transform .35s ease",
      }} />

      {/* Tag */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: tagColor.bg, color: tagColor.text,
        fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
        textTransform: "uppercase", padding: "3px 9px", borderRadius: 50,
      }}>{tag}</div>

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 12, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
        transform: hovered ? "scale(1.08)" : "scale(1)",
        transition: "transform .3s ease",
      }}>
        <Icon size={26} style={{ color: C.blue }} />
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 19, fontWeight: 700, color: C.navy, marginBottom: 8,
      }}>{title}</h3>

      <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, flexGrow: 1, marginBottom: 16 }}>
        {desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
        {highlights.map(h => (
          <span key={h} style={{
            fontSize: 11, fontWeight: 600, color: C.blue,
            background: "#EEF3FB", padding: "3px 9px", borderRadius: 50,
          }}>{h}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <a href="tel:+919000000000" style={{
          flex: 1, textAlign: "center", padding: "9px 12px",
          background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
          color: C.white, borderRadius: 8, fontSize: 13, fontWeight: 600,
          textDecoration: "none", transition: "all .25s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${C.gold}, ${C.gold2})`; e.currentTarget.style.color = C.navy; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${C.navy}, ${C.blue})`; e.currentTarget.style.color = C.white; }}
        >Apply Now</a>
        <a href="#contact" style={{
          flex: 1, textAlign: "center", padding: "9px 12px",
          border: "1.5px solid #CBD5E8", color: C.blue, borderRadius: 8,
          fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all .25s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#CBD5E8"; e.currentTarget.style.color = C.blue; }}
        >Learn More</a>
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
    desc: "Comprehensive medical cover for individuals and families. Cashless hospitalisation, OPD benefits, and critical illness add-ons available across leading insurers.",
    highlights: ["Cashless Network", "Family Floater", "Critical Illness", "No Claim Bonus"],
  },
  {
    icon: Shield, title: "Term Insurance",
    tag: "Insurance", tagColor: { bg: "#E8F4FD", text: "#1565C0" },
    iconBg: "linear-gradient(135deg,#EDE9FE,#C4B5FD)",
    desc: "Pure life protection at affordable premiums. Secure your family's financial independence with a high sum assured — we help you compare and choose the right plan.",
    highlights: ["High Cover", "Low Premium", "Tax Benefit 80C", "Riders Available"],
  },
  {
    icon: Car, title: "Vehicle Insurance",
    tag: "Insurance", tagColor: { bg: "#E8F4FD", text: "#1565C0" },
    iconBg: "linear-gradient(135deg,#E8F4FD,#BFE0F9)",
    desc: "Protect your car, bike, or commercial vehicle. We assist with third-party cover, own-damage policies, and renewals from top general insurance companies.",
    highlights: ["Third-Party Cover", "Own Damage", "Zero Depreciation", "Quick Renewal"],
  },
];

const LOANS = [
  {
    icon: Home, title: "Home Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF3E0,#FFE0A3)",
    desc: "We help you find the right home loan from multiple banks and NBFCs. Compare interest rates, tenure options, and documentation requirements — all in one place.",
    highlights: ["Multiple Lenders", "Long Tenure", "Balance Transfer", "Tax Benefits"],
  },
  {
    icon: Briefcase, title: "Personal Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF8E1,#FFE082)",
    desc: "Need funds quickly? We assist salaried and self-employed individuals in finding personal loan offers with minimal documentation and transparent terms.",
    highlights: ["No Collateral", "Multiple Banks", "Flexible Tenure", "Minimal Docs"],
  },
  {
    icon: Building2, title: "Business Loan",
    tag: "Loans", tagColor: { bg: "#FFF3E0", text: "#E65100" },
    iconBg: "linear-gradient(135deg,#FFF3E0,#FFE0A3)",
    desc: "Grow your business with the right financing. We connect MSMEs, startups, and established businesses with working capital and term loan options from leading lenders.",
    highlights: ["MSME Focused", "Collateral-Free Options", "Working Capital", "Govt Schemes"],
  },
];

const BANKING = [
  {
    icon: CreditCard, title: "Credit Cards",
    tag: "Banking", tagColor: { bg: "#E8F5E9", text: "#2E7D32" },
    iconBg: "linear-gradient(135deg,#E8F5E9,#B9E4BB)",
    desc: "We help you choose the right credit card based on your lifestyle and spending habits — from cashback and reward points to travel benefits, across major banks.",
    highlights: ["Cashback Cards", "Reward Points", "Travel Perks", "Lifetime Free Options"],
  },
  {
    icon: PiggyBank, title: "Zero Balance Account",
    tag: "Banking", tagColor: { bg: "#E8F5E9", text: "#2E7D32" },
    iconBg: "linear-gradient(135deg,#E8F5E9,#B9E4BB)",
    desc: "Open a zero balance savings account with premium banking features — instant digital access, free transfers, and high interest rates — through our bank partners.",
    highlights: ["Zero Balance", "Digital Banking", "Free Transfers", "High Interest"],
  },
  {
    icon: TrendingUp, title: "Demat Account",
    tag: "Investment", tagColor: { bg: "#E8F5E9", text: "#2E7D32" },
    iconBg: "linear-gradient(135deg,#E8F5E9,#B9E4BB)",
    desc: "Start investing in the stock market with a seamlessly linked demat and trading account. Access equities, IPOs, ETFs, and bonds through our trusted broker partners.",
    highlights: ["Stocks & ETFs", "IPO Access", "SIP Enabled", "Low Brokerage"],
  },
];

const INVESTMENTS = [
  {
    icon: BarChart3, title: "Mutual Fund Distribution",
    tag: "Investment", tagColor: { bg: "#F3E8FF", text: "#7E22CE" },
    iconBg: "linear-gradient(135deg,#F3E8FF,#DDD6FE)",
    desc: "SIP Planning, Lumpsum Investments, Goal-Based Investing, Retirement Planning, ELSS Tax Saving Funds, and Wealth Creation Solutions — guided by our registered advisors.",
    highlights: ["SIP Planning", "Lumpsum Investment", "ELSS Tax Saving", "Retirement Planning"],
  },
];

const WHY_US = [
  { icon: Users,          title: "Client-First Approach",     desc: "We prioritise your financial goals and offer unbiased guidance across all products." },
  { icon: Zap,            title: "Fast Turnaround",           desc: "Quick assistance with documentation, application, and follow-up at every step." },
  { icon: Award,          title: "Qualified Advisors",        desc: "Our team holds relevant registrations and is trained across insurance, loans, and investments." },
  { icon: Eye,            title: "Transparent Process",       desc: "No hidden charges. We clearly explain all terms before you commit to anything." },
  { icon: Handshake,      title: "Multiple Bank Tie-ups",     desc: "Access to a wide range of lenders, insurers, and investment platforms in one place." },
  { icon: HeadphonesIcon, title: "End-to-End Support",        desc: "From enquiry to final approval — we guide you through the entire process." },
];

const PARTNERS = [
  { name: "HDFC Bank",           abbr: "HDFC"  },
  { name: "ICICI Bank",          abbr: "ICICI" },
  { name: "State Bank of India", abbr: "SBI"   },
  { name: "Axis Bank",           abbr: "AXIS"  },
  { name: "LIC",                 abbr: "LIC"   },
  { name: "Star Health",         abbr: "STAR"  },
];

const FAQS = [
  {
    q: "What services does Fortune U Group provide?",
    a: "We provide assistance with insurance (health, term, vehicle), loans (home, personal, business), banking products (credit cards, zero balance accounts, demat), and mutual fund distribution including SIP planning and ELSS investments.",
  },
  {
    q: "Are you an insurance company or a bank?",
    a: "No. Fortune U Group is a financial services intermediary. We help clients compare and apply for products from leading banks, insurance companies, and investment platforms — we do not underwrite policies or disburse loans directly.",
  },
  {
    q: "Which areas do you serve?",
    a: "We currently serve clients across Andhra Pradesh and Telangana, including Hyderabad, Vijayawada, Guntur, Visakhapatnam, Tirupati, and surrounding regions.",
  },
  {
    q: "How do I get started?",
    a: "Simply call us, WhatsApp us, or fill the callback form below. One of our advisors will reach out to understand your requirement and recommend the most suitable options.",
  },
  {
    q: "Is there any fee for your advisory services?",
    a: "For most products, our services are free to the customer as we receive distributor commissions from product providers. Any applicable fees, if any, are disclosed upfront before you proceed.",
  },
];

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function ProductsPage() {
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", service: "" });
  const [callbackSent, setCallbackSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCallback = (e) => {
    e.preventDefault();
    setCallbackSent(true);
    setTimeout(() => setCallbackSent(false), 5000);
    setCallbackForm({ name: "", phone: "", service: "" });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F7F6F2", color: C.navy, overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.navy}; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 3px; }
        .scroll-mt { scroll-margin-top: 80px; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,.4); }
        select option { color: #000; background: #fff; }
      `}</style>

      {/* ════════════════════════════════════
          HERO  (compact — ~38% less height)
      ════════════════════════════════════ */}
      <section class="relative overflow-hidden bg-gradient-to-br from-[#0A1931] via-[#102A56] to-[#1E3A8A] text-white">

      {/* Background Blur Effects */}
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
       <div class="absolute bottom-0 right-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

       <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
       <div>
        <span className="inline-flex items-center bg-yellow-500/15 border border-yellow-400/30 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          ⭐ Trusted Financial Services
        </span>

        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
          Secure Your
          <span className="text-yellow-400">Future</span>
          With
          <br>
          Fortune U Group
        </h1>

        <p class="mt-6 text-lg text-gray-300 leading-relaxed">
          Health Insurance, Term Insurance, Home Loans, Personal Loans,
          Business Loans, Credit Cards, Demat Accounts, Zero Balance Accounts
          & Investment Solutions — All Under One Roof.
        </p>

        <div class="flex flex-wrap gap-4 mt-8">

          <a href="#products"
            class="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-xl transition duration-300">
            Explore Services
          </a>

          <a href="#contact"
            class="border border-white/40 hover:bg-white hover:text-[#0A1931] px-8 py-4 rounded-xl transition duration-300">
            Contact Us
          </a>

        </div>

      </div>

      {/* Right Side Image */}
      <div class="relative">

        <div class="rounded-3xl overflow-hidden shadow-2xl border border-white/10">

          <img
            src="/hero-finance.jpg"
            alt="Fortune U Group"
            class="w-full h-full object-cover">

        </div>

      </div>

    </div>

  </div>

</section>

      {/* ════════════════════════════════════
          INSURANCE
      ════════════════════════════════════ */}
      <section id="insurance" className="scroll-mt" style={{ padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Protection Plans" />
          <SectionTitle>Insurance Products</SectionTitle>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 480, marginBottom: 32 }}>
            We help you compare and select the right insurance cover from leading insurers.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
            {INSURANCE.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent)" }} />
      </div>

      {/* ════════════════════════════════════
          LOANS
      ════════════════════════════════════ */}
      <section id="loans" className="scroll-mt" style={{ padding: "52px 24px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Credit Solutions" />
          <SectionTitle>Loan Products</SectionTitle>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 480, marginBottom: 32 }}>
            We connect you with the best loan offers from multiple banks and NBFCs.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
            {LOANS.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent)" }} />
      </div>

      {/* ════════════════════════════════════
          BANKING
      ════════════════════════════════════ */}
      <section id="banking" className="scroll-mt" style={{ padding: "52px 24px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Banking Products" />
          <SectionTitle>Banking & Accounts</SectionTitle>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 480, marginBottom: 32 }}>
            Open the right account or card with guidance tailored to your profile.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
            {BANKING.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,.3), transparent)" }} />
      </div>

      {/* ════════════════════════════════════
          INVESTMENTS
      ════════════════════════════════════ */}
      <section id="investments" className="scroll-mt" style={{ padding: "52px 24px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionEyebrow text="Wealth Creation" />
          <SectionTitle>Mutual Fund Distribution</SectionTitle>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 480, marginBottom: 32 }}>
            AMFI-registered distribution services for SIPs, lumpsum, and goal-based investing.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22, maxWidth: 680 }}>
            {INVESTMENTS.map(p => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY CHOOSE US
      ════════════════════════════════════ */}
      <section id="why" style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.blue} 100%)`,
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <SectionEyebrow text="Our Edge" />
            <SectionTitle light>Why Choose Fortune U Group?</SectionTitle>
            <p style={{ color: "rgba(255,255,255,.58)", fontSize: 14, maxWidth: 460, margin: "0 auto" }}>
              We're not just advisors — we're your long-term financial partners.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <WhyCard key={title} Icon={Icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          PARTNER LOGOS
      ════════════════════════════════════ */}
      <section style={{ padding: "52px 24px", background: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.muted, marginBottom: 28 }}>
            Products from India's Leading Institutions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", alignItems: "center" }}>
            {PARTNERS.map(p => (
              <div key={p.abbr} style={{
                padding: "12px 24px", borderRadius: 10,
                border: "1.5px solid rgba(10,25,49,.1)",
                background: "#F8F6F2", transition: "all .25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldLt; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(10,25,49,.1)"; e.currentTarget.style.background = "#F8F6F2"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.navy }}>{p.abbr}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FAQ
      ════════════════════════════════════ */}
      <section id="faq" style={{ padding: "64px 24px", background: "#F7F6F2" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionEyebrow text="Common Questions" />
            <SectionTitle>Frequently Asked Questions</SectionTitle>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((item, i) => (
              <FaqItem key={i} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA + CALLBACK FORM
      ════════════════════════════════════ */}
      <section id="contact" style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, #112240 50%, ${C.blue} 100%)`,
        padding: "72px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 50%, rgba(212,175,55,.07) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(30,58,138,.4) 0%, transparent 50%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>

            {/* Left — CTA copy */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.gold2, marginBottom: 16 }}>
                ✦ Get in Touch
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(26px, 3.5vw, 42px)",
                fontWeight: 800, color: C.white, lineHeight: 1.15, marginBottom: 14,
              }}>
                Secure Your{" "}
                <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Financial Future
                </span>{" "}
                Today
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.6)", marginBottom: 10, fontWeight: 300, lineHeight: 1.65 }}>
                Our advisors are available to help you compare options and get started — with no pressure and no hidden fees.
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
                color: C.gold2, background: "rgba(212,175,55,.1)", border: "1px solid rgba(212,175,55,.25)",
                padding: "5px 13px", borderRadius: 50, marginBottom: 28, fontWeight: 600,
              }}>
                <MapPin size={12} /> Serving Andhra Pradesh & Telangana
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <PrimaryBtn href="tel:+919533304441">
                  <Phone size={15} /> Call Now
                </PrimaryBtn>
                <a href="https://wa.me/919533304441" target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#25D366", color: C.white, fontWeight: 700, fontSize: 14,
                  padding: "11px 22px", borderRadius: 50, textDecoration: "none",
                  transition: "all .25s", boxShadow: "0 4px 18px rgba(37,211,102,.28)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  <MessageCircle size={15} /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right — Callback Form */}
            <div style={{
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 18, padding: "32px 28px",
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.white, marginBottom: 6, fontWeight: 700 }}>
                Request a Callback
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 22 }}>We'll call you back within a few hours.</p>
              {callbackSent ? (
                <div style={{
                  background: "rgba(212,175,55,.12)", border: "1px solid rgba(212,175,55,.3)",
                  borderRadius: 10, padding: "20px", textAlign: "center",
                  color: C.gold2, fontSize: 15, fontWeight: 600,
                }}>
                  ✓ Thank you! We'll reach out to you shortly.
                </div>
              ) : (
                <form onSubmit={handleCallback} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { type: "text", placeholder: "Your Name",     key: "name",  req: true },
                    { type: "tel",  placeholder: "Mobile Number", key: "phone", req: true },
                  ].map(f => (
                    <input
                      key={f.key} type={f.type} placeholder={f.placeholder} required={f.req}
                      value={callbackForm[f.key]}
                      onChange={e => setCallbackForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{
                        padding: "11px 15px", borderRadius: 9, fontSize: 14,
                        border: "1.5px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.07)",
                        color: C.white, outline: "none",
                      }}
                    />
                  ))}
                  <select
                    value={callbackForm.service}
                    onChange={e => setCallbackForm(p => ({ ...p, service: e.target.value }))}
                    style={{
                      padding: "11px 15px", borderRadius: 9, fontSize: 14,
                      border: "1.5px solid rgba(255,255,255,.18)", background: "rgba(20,40,80,.85)",
                      color: callbackForm.service ? C.white : "rgba(255,255,255,.45)", outline: "none",
                    }}
                  >
                    <option value="">Service Interested In</option>
                    {["Health Insurance","Term Insurance","Vehicle Insurance","Home Loan","Personal Loan","Business Loan","Credit Card","Zero Balance Account","Demat Account","Mutual Fund / SIP"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button type="submit" style={{
                    background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`,
                    color: C.navy, fontWeight: 700, fontSize: 14,
                    padding: "13px", borderRadius: 9, border: "none", cursor: "pointer",
                    transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(212,175,55,.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <PhoneCall size={15} /> Request Callback
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SEO CONTENT
      ════════════════════════════════════ */}
      <section style={{ background: C.white, padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionEyebrow text="About Our Services" />
          <SectionTitle>Comprehensive Financial Services in AP & Telangana</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, marginTop: 24 }}>
            {[
              {
                title: "Insurance Guidance",
                body: "Fortune U Group works with leading insurers to help clients select health, term, and vehicle insurance plans. Our advisors help you compare coverage, understand terms, and complete the application process.",
              },
              {
                title: "Loan Facilitation",
                body: "We connect individuals and businesses with banks and NBFCs for home, personal, and business loans. Our role is to help you understand your options and navigate the documentation process.",
              },
              {
                title: "Investments & Banking",
                body: "From demat accounts and SIP plans to zero-balance savings accounts, we guide you toward banking and investment products that suit your goals and risk profile.",
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: "18px 22px", background: "#F7F6F2", borderRadius: 10, borderLeft: `4px solid ${C.gold}` }}>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
              <strong style={{ color: C.navy }}>Mutual Fund Distributor</strong> | SIP Planning | Financial Planning | Insurance Guidance | Credit Cards | Demat Accounts | Zero Balance Accounts —
              Fortune U Group assists clients across Hyderabad, Vijayawada, Guntur, Visakhapatnam, and all major cities in Andhra Pradesh and Telangana.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FLOATING WHATSAPP BUTTON
      ════════════════════════════════════ */}
      <a
        href="https://wa.me/919533304441"
        target="_blank" rel="noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: 28, right: 24, zIndex: 999,
          width: 54, height: 54, borderRadius: "50%",
          background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,.45)",
          textDecoration: "none", transition: "all .3s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,211,102,.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.45)"; }}
      >
        <MessageCircle size={24} style={{ color: C.white }} />
        <span style={{
          position: "absolute", inset: -4, borderRadius: "50%",
          border: "2px solid rgba(37,211,102,.35)",
          animation: "wapulse 2s infinite",
        }} />
        <style>{`@keyframes wapulse { 0%,100%{transform:scale(1);opacity:.55} 50%{transform:scale(1.16);opacity:0} }`}</style>
      </a>

    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
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
        borderRadius: 14, padding: "24px 22px",
        transition: "all .3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 11,
        background: hovered ? `linear-gradient(135deg, ${C.gold}, ${C.gold2})` : "rgba(212,175,55,.14)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14, transition: "all .3s ease",
      }}>
        <Icon size={20} style={{ color: hovered ? C.navy : C.gold2 }} />
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.52)", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12,
      border: `1px solid ${open ? C.gold : "rgba(10,25,49,.09)"}`,
      overflow: "hidden", transition: "border-color .25s",
      boxShadow: open ? "0 4px 20px rgba(10,25,49,.07)" : "0 1px 6px rgba(10,25,49,.04)",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", textAlign: "left",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 22px", background: "none", border: "none",
          cursor: "pointer", gap: 16,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15, color: C.navy, lineHeight: 1.4 }}>{item.q}</span>
        <ChevronDown size={18} style={{
          color: open ? C.gold : C.muted, flexShrink: 0,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform .25s ease",
        }} />
      </button>
      {open && (
        <div style={{ padding: "0 22px 18px", borderTop: "1px solid rgba(10,25,49,.06)" }}>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.72, paddingTop: 14 }}>{item.a}</p>
        </div>
      )}
    </div>
  );
}
