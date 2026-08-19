import { useMemo, useState } from "react";
import {
  User, Users, HeartHandshake, HeartPulse, Layers, Baby, Building2, Shield,
  Hospital, CreditCard, ShieldCheck, Banknote, Percent, TrendingUp,
  ClipboardList, BarChart3, FileCheck, CheckCircle2,
  PhoneCall, FileText, ClipboardCheck, BadgeCheck, Wallet,
  MessageCircle, Phone, ChevronDown, ArrowRight, Sparkles, Check,
  Calculator, AlertCircle,
} from "lucide-react";
import SEO from "../components/SEO";
import { whatsappLink } from "../lib/api";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  n >= 10000000
    ? "₹" + (n / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Cr"
    : "₹" + (n / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 }) + " L";

/* ─────────────────────────────────────────
   SHARED UI
───────────────────────────────────────── */
const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="h-px w-7 bg-[#D4AF37]" />
    <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">{children}</span>
  </div>
);

const SectionTitle = ({ children, light = false, center = false }) => (
  <h2 className={`font-display text-3xl md:text-4xl font-semibold tracking-tight leading-tight ${
    light ? "text-white" : "text-brand-navy"} ${center ? "text-center" : ""}`}>
    {children}
  </h2>
);

const IconBadge = ({ icon: Icon, size = "md" }) => (
  <div className={`${size === "lg" ? "w-16 h-16" : "w-14 h-14"} rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0`}>
    <Icon className={`${size === "lg" ? "w-7 h-7" : "w-6 h-6"}`} strokeWidth={1.75} />
  </div>
);

const GoldBtn = ({ href, children, target }) => (
  <a
    href={href}
    target={target}
    rel={target ? "noopener noreferrer" : undefined}
    className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C49A2C] text-[#0A2540] font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(212,175,55,0.35)]"
  >
    {children}
  </a>
);

const OutlineBtn = ({ href, children, icon: Icon, target }) => (
  <a
    href={href}
    target={target}
    rel={target ? "noopener noreferrer" : undefined}
    className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5"
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </a>
);

const WhatsAppBtn = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_18px_rgba(37,211,102,0.3)]"
  >
    <MessageCircle className="w-4 h-4" />
    {children}
  </a>
);

const Chip = ({ on, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
      on
        ? "bg-[#D4AF37] text-[#0A2540] border-[#D4AF37]"
        : "bg-white text-brand-navy border-brand-line hover:border-[#D4AF37]"
    }`}
  >
    {children}
  </button>
);

/* ─────────────────────────────────────────
   SECTION COMPONENTS
───────────────────────────────────────── */
function ProductCard({ icon: Icon, name, desc, benefits, extra }) {
  const [open, setOpen] = useState(false);
  const wa = whatsappLink(`Hi Fortune U Group, I'd like a quote for ${name} health insurance.`);
  return (
    <div className="group relative flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-card hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#E8C55A] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between mb-4">
        <IconBadge icon={Icon} />
        <ArrowRight className="w-5 h-5 text-[#D4AF37]/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-display text-lg font-semibold text-brand-navy mb-2">{name}</h3>
      <p className="text-sm text-brand-mute leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {benefits.map((b) => (
          <span key={b} className="text-[11px] font-semibold text-brand-navy bg-brand-soft rounded-full px-2.5 py-1">{b}</span>
        ))}
      </div>
      {open && (
        <p className="text-[13px] text-brand-mute leading-relaxed bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] rounded-r-lg px-3 py-2 mb-5">
          {extra}
        </p>
      )}
      <div className="mt-auto flex gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-navy/20 text-brand-navy hover:border-brand-navy hover:bg-brand-navy hover:text-white text-sm font-semibold px-4 py-2.5 transition-colors"
        >
          {open ? "Hide Details" : "View Details"}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#D4AF37] hover:bg-[#C49A2C] text-[#0A2540] text-sm font-semibold px-4 py-2.5 transition-colors"
        >
          Get Quote
        </a>
      </div>
    </div>
  );
}

function WhyCard({ icon: Icon, title, desc }) {
  return (
    <div className="group rounded-2xl border border-brand-line bg-white p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4 group-hover:bg-[#D4AF37] group-hover:text-[#0A2540] transition-colors">
        <Icon className="w-6 h-6" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-base font-semibold text-brand-navy mb-2">{title}</h3>
      <p className="text-sm text-brand-mute leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ icon: Icon, step, title, desc }) {
  return (
    <div className="relative rounded-2xl border border-brand-line bg-white p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
      <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#D4AF37] text-[#0A2540] font-bold text-sm flex items-center justify-center shadow">
        {step}
      </span>
      <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-base font-semibold text-brand-navy mb-1.5">{title}</h3>
      <p className="text-sm text-brand-mute leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className={`rounded-xl border bg-white transition-colors ${open ? "border-[#D4AF37]" : "border-brand-line"}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-brand-navy text-[15px]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-brand-mute shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-[#D4AF37]" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-brand-mute leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PRODUCTS = [
  {
    icon: User,
    name: "Individual Health Insurance",
    desc: "Complete medical cover for a single person — hospitalisation, day-care procedures and pre & post-hospitalisation expenses.",
    benefits: ["Cashless hospitalisation", "Day-care cover", "No-claim bonus", "Tax benefit 80D"],
    extra: "Ideal for salaried individuals and young adults. Covers hospitalisation, ICU charges, ambulance and optional OPD benefits, with portability and lifelong renewability across leading insurers.",
  },
  {
    icon: Users,
    name: "Family Floater Health Insurance",
    desc: "One sum insured shared by the whole family — cost-effective protection for you, your spouse and children.",
    benefits: ["Single shared cover", "Spouse & children", "Lower premium", "Tax benefit 80D"],
    extra: "Covers the entire family under one policy at a lower premium than separate plans, with optional maternity add-on, newborn cover and restoration benefit.",
  },
  {
    icon: HeartHandshake,
    name: "Senior Citizen Health Insurance",
    desc: "Specialised health cover for parents and elders, with higher limits and dedicated features for the 60+ age group.",
    benefits: ["Entry up to 65+", "Pre-existing cover", "Domiciliary care", "Annual check-up"],
    extra: "Designed for the 60+ age group with higher sum insured options, coverage for pre-existing diseases after the waiting period, domiciliary hospitalisation and AYUSH treatment.",
  },
  {
    icon: HeartPulse,
    name: "Critical Illness Insurance",
    desc: "Lump-sum payout on diagnosis of listed critical illnesses like cancer, heart attack and stroke.",
    benefits: ["Lump-sum payout", "Cancer & heart cover", "No bills required", "Fixed benefit"],
    extra: "Pays a fixed lump sum on diagnosis of a covered critical illness, independent of hospital bills — helping with treatment, income loss and recovery costs.",
  },
  {
    icon: Layers,
    name: "Super Top-Up Health Insurance",
    desc: "Extra coverage that activates after your base policy's deductible is crossed — big cover at a small premium.",
    benefits: ["High cover, low cost", "Activates above deductible", "Covers single big bill", "Complements base plan"],
    extra: "A cost-effective way to increase your cover. It pays for hospitalisation once bills cross a deductible you choose, protecting you from very large claims.",
  },
  {
    icon: Baby,
    name: "Maternity Health Insurance",
    desc: "Covers pregnancy, delivery (normal & C-section) and newborn care — usually as an add-on with a waiting period.",
    benefits: ["Normal & C-section", "Newborn cover", "Pre/post-natal care", "Waiting period applies"],
    extra: "Covers maternity expenses including delivery, pre- and post-natal care and newborn medical costs, typically after a waiting period of 9 to 36 months depending on the plan.",
  },
  {
    icon: Building2,
    name: "Group Health Insurance",
    desc: "Custom health cover for employers, SMEs and associations, covering employees and their families.",
    benefits: ["Corporate plans", "Employees + dependents", "Maternity & OPD options", "Tax-efficient"],
    extra: "Tailored group medical cover for companies of any size, with options for maternity, OPD and pre-existing disease coverage for employees and their dependents.",
  },
  {
    icon: Shield,
    name: "Personal Accident Cover",
    desc: "Financial protection against accidental death, disability and injury — a low-cost essential add-on.",
    benefits: ["Accidental death cover", "Disability benefit", "Hospital cash option", "Low premium"],
    extra: "Pays a lump sum on accidental death or permanent disability, and can include weekly hospital cash and ambulance cover — protecting your family's income.",
  },
];

const WHY = [
  { icon: Hospital, title: "Hospitalization Protection", desc: "Covers hospital bills, ICU charges and treatment costs so a medical emergency never drains your savings." },
  { icon: CreditCard, title: "Cashless Treatment", desc: "Get treated at network hospitals without paying upfront — the insurer settles the bill directly." },
  { icon: ShieldCheck, title: "Family Protection", desc: "One policy protects your spouse, children and parents from rising healthcare costs." },
  { icon: Banknote, title: "Financial Security", desc: "Keeps your investments and long-term goals intact by absorbing unexpected medical expenses." },
  { icon: Percent, title: "Tax Benefits", desc: "Premiums are eligible for deduction under Section 80D of the Income Tax Act." },
  { icon: TrendingUp, title: "Protection Against Medical Inflation", desc: "Healthcare costs rise faster than general inflation — a health plan locks in affordable protection." },
];

const STEPS = [
  { icon: ClipboardList, title: "Choose Coverage", desc: "Pick a sum insured and plan type that fits your family's needs and budget." },
  { icon: BarChart3, title: "Compare Plans", desc: "We compare coverage, waiting periods and premiums across leading insurers." },
  { icon: FileCheck, title: "Buy Policy", desc: "Complete the proposal and medical checks (if any) — the policy is issued in your name." },
  { icon: CheckCircle2, title: "Claim When Needed", desc: "Get cashless or reimbursement treatment and file a claim when required." },
];

const CLAIM_STEPS = [
  { icon: PhoneCall, title: "Inform Insurer", desc: "Notify the insurer — cashless within 24 hrs, reimbursement within the set window." },
  { icon: FileText, title: "Submit Documents", desc: "Share bills, discharge summary, reports and ID / claim forms." },
  { icon: ClipboardCheck, title: "Claim Verification", desc: "The insurer verifies documents and treatment details." },
  { icon: BadgeCheck, title: "Approval", desc: "The claim is approved as per policy terms and conditions." },
  { icon: Wallet, title: "Settlement", desc: "Cashless bills are settled directly; reimbursement is credited to your account." },
];

const CHECKLIST = [
  { t: "Sum insured", d: "Choose adequate cover — ₹5–10L is a common starting point per family." },
  { t: "Waiting period", d: "Initial period before certain conditions (and pre-existing diseases) are covered." },
  { t: "Room rent limits", d: "Check the cap on room rent — exceeding it can reduce your claim amount." },
  { t: "Co-payment", d: "The share of each claim you pay out of pocket." },
  { t: "Deductibles", d: "The amount you bear before the insurer starts paying." },
  { t: "Disease sub-limits", d: "Caps on specific treatments like cataract or knee replacement." },
  { t: "Network hospitals", d: "More network hospitals mean easier cashless treatment." },
  { t: "Exclusions", d: "Treatments the policy does not cover — read them carefully." },
  { t: "Pre-existing disease coverage", d: "When and how pre-existing conditions get covered." },
  { t: "Restoration benefit", d: "Auto-restores the sum insured after it is used up." },
];

const COMPARE_PLANS = ["Individual", "Family Floater", "Senior Citizen", "Critical Illness"];

const COMPARE_ROWS = [
  { feature: "Coverage", values: ["Single person", "Whole family (shared)", "60+ age group", "Lump-sum on diagnosis"] },
  { feature: "Hospitalization", values: ["Yes", "Yes", "Yes", "Not linked to bills"] },
  { feature: "Room rent", values: ["Varies by plan", "Varies by plan", "Varies by plan", "N/A"] },
  { feature: "Pre-existing diseases", values: ["After waiting period", "After waiting period", "After waiting period", "Varies"] },
  { feature: "Waiting period", values: ["2–4 years", "2–4 years", "1–4 years", "90 days"] },
  { feature: "Maternity", values: ["Add-on", "Add-on", "Usually not", "Not covered"] },
  { feature: "Critical illness", values: ["Add-on", "Add-on", "Add-on", "Core benefit"] },
  { feature: "Cashless hospitals", values: ["Wide network", "Wide network", "Wide network", "N/A"] },
  { feature: "No-claim benefits", values: ["Yes (NCB)", "Yes (NCB)", "Yes", "Limited"] },
  { feature: "Tax benefits", values: ["80D", "80D", "80D", "80D"] },
];

const FAQS = [
  { q: "What is health insurance?", a: "Health insurance is a contract where the insurer covers your medical and hospitalisation expenses in exchange for a premium. It protects your savings from unexpected healthcare costs." },
  { q: "How much health insurance do I need?", a: "It depends on your family size, age, city and existing cover. ₹5–10 lakh per family is a common starting point, with higher amounts recommended in metro cities or for larger families." },
  { q: "What is a waiting period?", a: "A waiting period is the initial duration after buying a policy during which certain conditions or benefits (like pre-existing diseases or maternity) are not yet covered." },
  { q: "What is a cashless hospital?", a: "A cashless hospital is part of the insurer's network where the insurer settles your bill directly with the hospital, so you don't pay upfront (subject to policy terms)." },
  { q: "Can senior citizens get health insurance?", a: "Yes. Dedicated senior citizen plans are available, typically with entry up to 65+ years (some up to 75) and coverage for pre-existing diseases after a waiting period." },
  { q: "What is a family floater?", a: "A family floater is a single policy where one sum insured is shared by the entire family — you, your spouse and children — usually at a lower premium than separate plans." },
  { q: "What is a super top-up?", a: "A super top-up provides additional cover above a deductible threshold. It activates only after your bills cross that threshold, giving high coverage at a low premium." },
  { q: "Does health insurance cover pre-existing diseases?", a: "Yes, but typically after a waiting period of 2–4 years. Some senior citizen and specific plans offer a shorter waiting period for pre-existing conditions." },
  { q: "What is co-payment?", a: "Co-payment is the percentage of each claim that you pay yourself, with the insurer paying the rest. A higher co-payment usually lowers your premium." },
  { q: "Can I claim tax benefits?", a: "Yes. Health insurance premiums qualify for deduction under Section 80D of the Income Tax Act, subject to the limits in force." },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ProductsPage() {
  const [age, setAge] = useState(32);
  const [members, setMembers] = useState(4);
  const [city, setCity] = useState("tier2");
  const [income, setIncome] = useState("10-20");
  const [existing, setExisting] = useState(0);
  const [preferred, setPreferred] = useState(1000000);
  const [openFaq, setOpenFaq] = useState(null);

  const heroWa = whatsappLink("Hi Fortune U Group, I'd like to know more about health insurance.");
  const quoteWa = whatsappLink(
    `Hi Fortune U Group, I'd like a personalized health insurance quote.\nAge: ${age}\nFamily members: ${members}\nCity: ${city}\nAnnual income: ${income}\nExisting cover: ${existing === 0 ? "None" : fmt(existing)}\nPreferred cover: ${fmt(preferred)}`
  );

  const calc = useMemo(() => {
    const cityBase = { metro: 1000000, tier2: 750000, other: 500000 }[city] || 750000;
    let rec = cityBase + Math.max(0, members - 1) * 250000;
    if (age >= 45) rec += 250000;
    if (age >= 60) rec += 500000;
    const incomeAdj = { under5: 0, "5-10": 250000, "10-20": 500000, "20+": 750000 }[income] || 0;
    rec += incomeAdj;
    const low = rec;
    const high = rec + 500000;
    const required = Math.max(rec, preferred);
    const gap = Math.max(0, required - existing);
    return { low, high, required, gap };
  }, [age, members, city, income, existing, preferred]);

  return (
    <div data-testid="products-page" className="bg-brand-bg">
      <SEO
        title="Health Insurance"
        description="Compare and choose health insurance plans — individual, family floater, senior citizen, critical illness, super top-up and more. Get free guidance from Fortune U Group, Tirupati."
        path="/products"
      />

      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D2A50] to-[#0A2540] text-white">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E8C55A] text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" /> Health Insurance
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Protect Your Health. <span className="text-[#D4AF37]">Protect Your Family.</span> Choose the Right Health Insurance.
              </h1>
              <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-xl">
                Hospital bills rise every year. The right health insurance keeps a medical emergency from
                draining your savings and your financial goals. Compare plans across leading insurers with Fortune U Group.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <GoldBtn href="#calculator">Get a Free Quote <ArrowRight className="w-4 h-4" /></GoldBtn>
                <OutlineBtn href="#contact" icon={Phone}>Talk to an Advisor</OutlineBtn>
                <WhatsAppBtn href={heroWa}>WhatsApp</WhatsAppBtn>
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {["Care Health", "Niva Bupa", "Tata AIG", "ICICI Lombard"].map((t) => (
                  <span key={t} className="text-xs font-semibold border border-white/20 rounded-full px-3 py-1.5 bg-white/5 text-white/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#0A2540] flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Complete Health Cover</p>
                    <p className="text-white/60 text-sm">Individual · Family · Senior</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#0A2540]/60 border border-white/10 p-5">
                  <p className="text-xs text-[#D4AF37] font-bold tracking-widest uppercase mb-1">Coverage range</p>
                  <p className="text-3xl font-bold text-white">₹5L – ₹1Cr</p>
                  <p className="text-sm text-white/60 mt-1">Sum insured tailored to your family</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    ["10k+", "Cashless hospitals"],
                    ["80D", "Tax benefit"],
                    ["24×7", "Claim support"],
                  ].map(([v, l]) => (
                    <div key={l} className="text-center rounded-xl bg-white/5 border border-white/10 py-3">
                      <p className="text-lg font-bold text-[#D4AF37]">{v}</p>
                      <p className="text-[11px] text-white/60">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#25D366] text-white text-xs font-semibold rounded-full px-4 py-2 shadow-lg hidden sm:flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4" /> 24×7 Support
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-brand-navy text-xs font-semibold rounded-full px-4 py-2 shadow-lg hidden sm:flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-[#D4AF37]" /> Cashless Claims
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. PRODUCTS ═══════════ */}
      <section id="products" className="scroll-mt-24 py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Health Insurance Products</Eyebrow></div>
            <SectionTitle>Choose the Right Cover for Your Family</SectionTitle>
            <p className="mt-4 text-brand-mute">
              From individuals to senior citizens — explore health insurance plans that fit your needs and budget.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. CALCULATOR ═══════════ */}
      <section id="calculator" className="scroll-mt-24 bg-[#0A2540] py-20 px-5 lg:px-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Coverage Calculator</Eyebrow></div>
            <SectionTitle light>Health Insurance Coverage Calculator</SectionTitle>
            <p className="mt-4 text-white/60">
              Get an indicative estimate of the coverage you need. This is not an actual insurance premium quote.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Inputs */}
            <div className="bg-white text-brand-navy rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">Your Details</h3>
              </div>

              <label className="block font-semibold text-sm mb-2">Age of eldest member · <span className="text-[#D4AF37]">{age} yrs</span></label>
              <input type="range" min="18" max="80" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full accent-[#D4AF37]" />

              <label className="block font-semibold text-sm mt-5 mb-2">Number of family members · <span className="text-[#D4AF37]">{members}</span></label>
              <input type="range" min="1" max="8" value={members} onChange={(e) => setMembers(+e.target.value)} className="w-full accent-[#D4AF37]" />

              <p className="font-semibold text-sm mt-5 mb-2">City</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={city === "metro"} onClick={() => setCity("metro")}>Metro</Chip>
                <Chip on={city === "tier2"} onClick={() => setCity("tier2")}>Tier-2 (Tirupati)</Chip>
                <Chip on={city === "other"} onClick={() => setCity("other")}>Other</Chip>
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Annual income</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={income === "under5"} onClick={() => setIncome("under5")}>Under ₹5L</Chip>
                <Chip on={income === "5-10"} onClick={() => setIncome("5-10")}>₹5–10L</Chip>
                <Chip on={income === "10-20"} onClick={() => setIncome("10-20")}>₹10–20L</Chip>
                <Chip on={income === "20+"} onClick={() => setIncome("20+")}>₹20L+</Chip>
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Existing health insurance coverage</p>
              <div className="flex flex-wrap gap-2">
                {[0, 250000, 500000, 1000000, 1500000, 2500000].map((v) => (
                  <Chip key={v} on={existing === v} onClick={() => setExisting(v)}>{v === 0 ? "None" : fmt(v)}</Chip>
                ))}
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Preferred coverage amount</p>
              <div className="flex flex-wrap gap-2">
                {[500000, 750000, 1000000, 1500000, 2500000, 5000000, 10000000].map((v) => (
                  <Chip key={v} on={preferred === v} onClick={() => setPreferred(v)}>{fmt(v)}</Chip>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="flex flex-col">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex-1">
                <p className="text-xs text-[#D4AF37] font-bold tracking-widest uppercase mb-4">Your indicative coverage</p>
                <p className="text-sm text-white/60 mb-1">Recommended coverage range</p>
                <p className="font-display text-4xl font-bold text-[#D4AF37]">{fmt(calc.low)} – {fmt(calc.high)}</p>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/50 mb-1">Estimated requirement</p>
                    <p className="text-xl font-bold text-white">{fmt(calc.required)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/50 mb-1">Coverage gap</p>
                    <p className="text-xl font-bold text-white">{calc.gap > 0 ? fmt(calc.gap) : "Adequate"}</p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-white/70 leading-relaxed">
                  Your recommended cover of <strong className="text-white">{fmt(calc.low)}–{fmt(calc.high)}</strong> is based on
                  {" "}{members} family member{members > 1 ? "s" : ""}, age {age}, city tier and income level.
                  This is an indicative coverage estimate only — not an insurance premium quote.
                </p>

                <div className="flex items-start gap-2 mt-5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 p-3">
                  <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-xs text-white/70 leading-relaxed">
                    Actual premiums depend on the insurer, plan, age, medical history and other factors. This calculator
                    estimates coverage requirement only.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <GoldBtn href={quoteWa} target="_blank">Get Personalized Quote <ArrowRight className="w-4 h-4" /></GoldBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 4. COMPARE ═══════════ */}
      <section id="compare" className="scroll-mt-24 py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Compare Health Insurance</Eyebrow></div>
            <SectionTitle>Compare Plans at a Glance</SectionTitle>
            <p className="mt-4 text-brand-mute">
              Understand how different health insurance plans differ across the features that matter most.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-brand-line shadow-card">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-[#0A2540] text-white">
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  {COMPARE_PLANS.map((p) => (
                    <th key={p} className="text-left px-5 py-4 font-semibold">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-brand-soft/40"}>
                    <td className="px-5 py-3.5 font-semibold text-brand-navy">{row.feature}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className={`px-5 py-3.5 ${j === 0 ? "text-brand-mute" : "text-brand-mute"}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-brand-mute mt-3">
            * Indicative summary for general understanding. Actual features and waiting periods vary by insurer and plan.
          </p>
        </div>
      </section>

      {/* ═══════════ 5. WHY IMPORTANT ═══════════ */}
      <section id="why" className="scroll-mt-24 py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Why It Matters</Eyebrow></div>
            <SectionTitle>Why Health Insurance Is Important</SectionTitle>
            <p className="mt-4 text-brand-mute">
              One hospital stay can set your finances back years. Here's how health insurance protects you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w) => (
              <WhyCard key={w.title} {...w} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. HOW IT WORKS ═══════════ */}
      <section id="how" className="scroll-mt-24 py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Simple Process</Eyebrow></div>
            <SectionTitle>How Health Insurance Works</SectionTitle>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <StepCard key={s.title} step={i + 1} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 7. CLAIM PROCESS ═══════════ */}
      <section id="claims" className="scroll-mt-24 py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Claim Process</Eyebrow></div>
            <SectionTitle>How to Claim Your Health Insurance</SectionTitle>
            <p className="mt-4 text-brand-mute">
              A clear, step-by-step claim process so you know exactly what to do when it matters.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {CLAIM_STEPS.map((s, i) => (
              <StepCard key={s.title} step={i + 1} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 8. CHECKLIST ═══════════ */}
      <section id="checklist" className="scroll-mt-24 py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Buyer's Checklist</Eyebrow></div>
            <SectionTitle>Key Things to Check Before Buying</SectionTitle>
            <p className="mt-4 text-brand-mute">
              Read the fine print. These ten points can make a big difference at claim time.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CHECKLIST.map((item) => (
              <div key={item.t} className="flex gap-3 rounded-xl border border-brand-line bg-white p-4 hover:border-[#D4AF37]/50 transition-colors">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="font-semibold text-brand-navy text-[15px]">{item.t}</h3>
                  <p className="text-sm text-brand-mute leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 9. FAQ ═══════════ */}
      <section id="faq" className="scroll-mt-24 py-20 px-5 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center"><Eyebrow>Common Questions</Eyebrow></div>
            <SectionTitle>Health Insurance FAQs</SectionTitle>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 10. FINAL CTA ═══════════ */}
      <section id="contact" className="scroll-mt-24 relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D2A50] to-[#0A2540] text-white py-20 px-5 lg:px-8">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37] text-[#0A2540] flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Need Help Choosing the Right Health Insurance?
          </h2>
          <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
            Our experts can help you understand your options and choose suitable coverage for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <GoldBtn href="#calculator">Get Free Quote <ArrowRight className="w-4 h-4" /></GoldBtn>
            <WhatsAppBtn href={quoteWa}>WhatsApp Us</WhatsAppBtn>
            <OutlineBtn href="tel:+919490237465" icon={Phone}>Talk to an Advisor</OutlineBtn>
          </div>
          <p className="mt-8 text-xs text-white/40 leading-relaxed max-w-2xl mx-auto">
            Insurance is the subject matter of solicitation. Policies are issued by the insurer, not by Fortune U Group.
            Fortune U Group is not a SEBI-registered Investment Adviser. Premiums and coverage vary by insurer, plan and individual medical history.
          </p>
        </div>
      </section>
    </div>
  );
}
