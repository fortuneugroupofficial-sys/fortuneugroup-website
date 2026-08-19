import { useMemo, useState } from "react";
import {
  User, Users, HeartHandshake, HeartPulse, Layers, Baby, Building2, Shield,
  Hospital, CreditCard, ShieldCheck, Percent, TrendingUp,
  ClipboardList, CheckCircle2, FileText, ClipboardCheck,
  BadgeCheck, Wallet, MessageCircle, Phone, ChevronDown, ArrowRight, Sparkles,
  Check, Calculator, AlertCircle, PiggyBank, Target, Clock,
  Ambulance, ExternalLink, Search, Landmark, LifeBuoy,
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

const fmtMoney = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

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
    <div className="group rounded-2xl border border-brand-line bg-white p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4 group-hover:bg-[#D4AF37] group-hover:text-[#0A2540] transition-colors">
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

function Flow({ steps }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="min-w-[120px] flex-1 rounded-xl border border-brand-line bg-white px-4 py-3 text-center shadow-card">
            <span className="block text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">Step {i + 1}</span>
            <span className="block text-sm font-semibold text-brand-navy mt-1">{s}</span>
          </div>
          {i < steps.length - 1 && <ArrowRight className="w-5 h-5 text-[#D4AF37] shrink-0" />}
        </div>
      ))}
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
  { icon: TrendingUp, title: "Rising Medical Costs", desc: "Hospitalisation and treatment costs rise every year — often faster than general inflation — making quality care harder to afford without cover." },
  { icon: PiggyBank, title: "Protection of Savings", desc: "A single hospital stay can wipe out years of savings. Health insurance keeps your emergency fund and investments intact." },
  { icon: Users, title: "Family Financial Security", desc: "One well-chosen policy protects your spouse, children and parents from unexpected medical bills." },
  { icon: Ambulance, title: "Emergency Hospitalisation", desc: "Accidents and critical conditions strike without warning. Cover ensures you get treatment without financial panic." },
  { icon: CreditCard, title: "Cashless Treatment", desc: "Get treated at network hospitals without paying large bills upfront — the insurer settles directly." },
  { icon: HeartHandshake, title: "Senior Citizen Protection", desc: "Dedicated plans for elders offer higher cover and age-specific benefits when care is needed most." },
  { icon: ClipboardList, title: "Financial Planning", desc: "Health cover is the foundation of a sound financial plan — it protects the income and goals everything else depends on." },
  { icon: Target, title: "Protection of Long-Term Goals", desc: "Prevents your education, home and retirement goals from being derailed by a medical emergency." },
  { icon: Percent, title: "Tax Treatment", desc: "Premiums are eligible for deduction under Section 80D of the Income Tax Act, subject to applicable limits." },
];

const STEPS = [
  { icon: ClipboardList, title: "Choose a Policy", desc: "Pick a plan type — individual, family floater or senior citizen — and a suitable sum insured." },
  { icon: CreditCard, title: "Pay Premium", desc: "Pay the premium (annually or in instalments) to activate your policy." },
  { icon: CheckCircle2, title: "Policy Becomes Active", desc: "Cover begins as per the policy terms, subject to any applicable waiting periods." },
  { icon: Clock, title: "Understand Waiting Periods", desc: "Certain conditions and benefits start only after the specified waiting period is over." },
  { icon: Hospital, title: "Hospitalisation", desc: "In a planned or emergency admission, receive treatment at a hospital." },
  { icon: FileText, title: "Cashless or Reimbursement", desc: "Choose cashless at a network hospital, or pay and file a reimbursement claim." },
  { icon: ClipboardCheck, title: "Claim Assessment", desc: "The insurer verifies the treatment, bills and documents you submit." },
  { icon: BadgeCheck, title: "Approval / Rejection", desc: "The claim is approved or rejected as per the policy terms and conditions." },
  { icon: Wallet, title: "Settlement", desc: "Cashless bills are settled with the hospital, or reimbursement is credited to you." },
];

const KEY_TERMS = [
  { t: "Sum Insured", d: "The maximum amount the insurer pays for covered treatment in a policy year." },
  { t: "Premium", d: "The amount you pay to keep the policy active — yearly or in instalments." },
  { t: "Waiting Period", d: "The initial period before certain conditions or benefits are covered." },
  { t: "PED", d: "Pre-existing Disease — a condition you had before buying the policy, covered after a waiting period." },
  { t: "Co-pay", d: "The share of each claim you pay yourself; the insurer pays the rest." },
  { t: "Deductible", d: "The amount you bear before the insurer starts paying on a claim." },
  { t: "Sub-limit", d: "A cap on specific treatments (e.g. cataract, knee replacement) within the sum insured." },
  { t: "Room Rent", d: "The limit on hospital room charges; exceeding it can reduce your claim." },
  { t: "Exclusions", d: "Treatments or conditions the policy does not cover." },
  { t: "Network Hospital", d: "A hospital tied up with the insurer where cashless treatment is available." },
  { t: "TPA", d: "Third Party Administrator — an intermediary that helps process claims for insurers." },
  { t: "Restoration", d: "Auto-restores the sum insured after it is used up in a policy year." },
  { t: "No Claim Bonus", d: "A reward (extra cover or discount) for not claiming in a policy year." },
];

const CASHLESS_FLOW = ["Hospitalisation", "Insurance / TPA Desk", "Pre-authorisation", "Assessment", "Approval", "Treatment", "Discharge", "Settlement as per policy terms"];

const REIMBURSEMENT_FLOW = ["Treatment", "Pay Hospital", "Collect Documents", "Submit Claim", "Assessment", "Approval", "Reimbursement"];

const CLAIM_DOCS = [
  "Claim form (duly filled & signed)",
  "Policy details / card",
  "Discharge summary",
  "Hospital bills (itemised)",
  "Payment receipts",
  "Prescriptions",
  "Diagnostic reports",
  "Investigation reports",
  "KYC / ID where applicable",
  "Bank details where required",
];

const GRIEVANCE_STEPS = [
  { t: "Check the Rejection Reason", d: "Read the insurer's rejection letter carefully to understand exactly why the claim was not paid." },
  { t: "Contact Insurer / Customer Support", d: "Raise your concern with the insurer's customer support and ask for a review with supporting documents." },
  { t: "Raise a Grievance with the Insurer", d: "File a formal grievance with the insurer's grievance redressal cell and note the reference number." },
  { t: "Track the Grievance", d: "Follow up and track the status until you receive a written response within the insurer's timeline." },
  { t: "Escalate Through Official Mechanism", d: "If unsatisfied, escalate through the applicable official grievance mechanism as per IRDAI guidelines." },
  { t: "Use the IRDAI Grievance Platform", d: "Register your complaint on the official IRDAI Bima Bharosa portal where applicable." },
  { t: "Insurance Ombudsman Route", d: "Approach the Insurance Ombudsman in your jurisdiction where the complaint meets the applicable criteria." },
];

const PORTALS = [
  {
    icon: Search,
    title: "Insurer Grievance",
    desc: "Every insurer has a grievance redressal cell. Start by raising your grievance directly with your insurer and keep the reference number.",
    label: "Learn More",
    href: "https://irdai.gov.in/grievance-redressal-mechanism1",
    official: true,
  },
  {
    icon: ShieldCheck,
    title: "IRDAI Bima Bharosa",
    desc: "IRDAI's official online portal to register and track insurance complaints and escalate them to IRDAI grievance cells.",
    label: "Open Official Portal",
    href: "https://bimabharosa.irdai.gov.in/",
    official: true,
  },
  {
    icon: Landmark,
    title: "Insurance Ombudsman",
    desc: "An alternate grievance redressal platform under the Council for Insurance Ombudsmen for eligible complaints against insurers.",
    label: "Open Official Portal",
    href: "https://cioins.co.in/",
    official: true,
  },
  {
    icon: LifeBuoy,
    title: "Policy / Claim Support",
    desc: "Need help understanding your policy or a claim? Our team can guide you on the correct steps and documentation.",
    label: "Contact Our Team",
    href: "/contact",
    official: false,
  },
];

const GLOSSARY = [
  { t: "Premium", d: "The amount you pay to the insurer to keep the policy active. It can be paid yearly, half-yearly or monthly." },
  { t: "Sum Insured", d: "The maximum amount the insurer will pay for covered medical expenses in a policy year." },
  { t: "Waiting Period", d: "The initial duration after buying a policy during which certain benefits are not yet payable." },
  { t: "PED (Pre-existing Disease)", d: "Any condition you had before buying the policy. It is covered after the PED waiting period." },
  { t: "Co-pay", d: "The percentage of each claim that you pay yourself, with the insurer paying the remaining amount." },
  { t: "Deductible", d: "A fixed amount you bear before the insurer starts paying. Higher deductible usually means lower premium." },
  { t: "Sub-limit", d: "A cap on specific treatments or expenses within the overall sum insured (e.g. room rent, cataract)." },
  { t: "Room Rent", d: "The daily limit on hospital room charges. Choosing a higher category than allowed reduces your claim." },
  { t: "Cashless", d: "Treatment where the insurer settles the bill directly with a network hospital, subject to approval." },
  { t: "Reimbursement", d: "You pay the hospital first and later claim the amount back from the insurer." },
  { t: "Network Hospital", d: "A hospital empanelled by the insurer where cashless treatment can be availed." },
  { t: "TPA", d: "Third Party Administrator — a service provider that helps insurers process and manage claims." },
  { t: "No Claim Bonus", d: "A reward for claim-free years, usually as an increase in sum insured or a premium discount." },
  { t: "Restoration", d: "A benefit that restores the exhausted sum insured so you remain covered in the same year." },
  { t: "Exclusion", d: "A treatment, condition or circumstance that the policy does not cover." },
  { t: "Day Care", d: "Procedures that need less than 24 hours of hospitalisation but are still covered." },
  { t: "Pre-Hospitalisation", d: "Medical expenses incurred before admission, covered for a specified number of days." },
  { t: "Post-Hospitalisation", d: "Follow-up expenses after discharge, covered for a specified number of days." },
];

const FAQS = [
  { q: "How much health insurance coverage do I need?", a: "It depends on your age, family size, city and existing cover. ₹5–10 lakh per family is a common starting point, with higher cover recommended in metro cities, for larger families, or for senior citizens." },
  { q: "Is ₹5 lakh enough?", a: "₹5 lakh can be a reasonable starting point for a young couple in a tier-2 city. In a metro city, or with growing children, medical costs can quickly exceed this — a higher sum insured or a top-up is worth considering." },
  { q: "Is ₹10 lakh better than ₹5 lakh?", a: "Generally yes, because it offers more headroom for large hospitalisation and ICU stays. Higher cover costs more, so balance your budget against your risk — a super top-up can bridge the gap cost-effectively." },
  { q: "Should parents have separate health insurance?", a: "Often yes. Senior citizens have higher claim risk and age-related needs, so a dedicated senior citizen plan usually gives better, more appropriate cover than adding them to a family floater." },
  { q: "What is a waiting period?", a: "It is the initial period after buying a policy during which certain conditions or benefits (like pre-existing diseases or maternity) are not yet covered." },
  { q: "What is a pre-existing disease?", a: "A pre-existing disease (PED) is any illness or condition you already had before buying the policy. PEDs are covered after the specified waiting period, which varies by plan." },
  { q: "What is cashless treatment?", a: "Cashless treatment means the insurer settles the bill directly with a network hospital after pre-authorisation, so you don't pay large amounts upfront." },
  { q: "What happens if a claim is rejected?", a: "Check the rejection reason, then contact the insurer and raise a grievance. If unresolved, you can escalate through IRDAI Bima Bharosa or the Insurance Ombudsman as applicable." },
  { q: "What is co-pay?", a: "Co-pay is the percentage of each claim that you pay out of pocket. A higher co-pay reduces your premium but increases your share at claim time." },
  { q: "What is a deductible?", a: "A deductible is the fixed amount you bear before the insurer starts paying. Higher deductibles usually mean lower premiums." },
  { q: "What is room-rent limit?", a: "It is the cap on hospital room charges your policy will cover. If you choose a room above this limit, your overall claim is reduced proportionately." },
  { q: "What is a network hospital?", a: "A network hospital is empanelled with the insurer for cashless treatment. More network hospitals near you means easier cashless claims." },
  { q: "Can I claim reimbursement?", a: "Yes. If you pay the hospital yourself (at a non-network hospital, or without cashless approval), you can submit the bills and documents and claim reimbursement." },
  { q: "How does policy renewal work?", a: "Renew before the expiry date to keep cover continuous and retain benefits like waiting-period credits and no-claim bonus. Health policies offer lifelong renewability in most cases." },
];

const COMPARE_PLANS = ["Individual", "Family Floater", "Senior Citizen", "Critical Illness"];

const COMPARE_ROWS = [
  { feature: "Sum Insured", values: ["₹5L – ₹1Cr", "₹5L – ₹1Cr (shared)", "₹5L – ₹50L", "₹5L – ₹1Cr"] },
  { feature: "Premium", values: ["Lower", "Moderate", "Higher", "Moderate"] },
  { feature: "Network Hospitals", values: ["Wide network", "Wide network", "Wide network", "N/A (fixed benefit)"] },
  { feature: "Room Rent", values: ["Varies by plan", "Varies by plan", "Varies by plan", "N/A"] },
  { feature: "ICU Coverage", values: ["Yes", "Yes", "Yes", "Not applicable"] },
  { feature: "Pre-Hospitalisation", values: ["30–60 days", "30–60 days", "30 days", "Not applicable"] },
  { feature: "Post-Hospitalisation", values: ["60–90 days", "60–90 days", "60 days", "Not applicable"] },
  { feature: "Waiting Period", values: ["2–4 years", "2–4 years", "1–4 years", "90 days"] },
  { feature: "PED Waiting Period", values: ["2–4 years", "2–4 years", "1–4 years", "Varies"] },
  { feature: "Day Care", values: ["Yes", "Yes", "Yes", "No"] },
  { feature: "No Claim Bonus", values: ["Yes", "Yes", "Yes", "Limited"] },
  { feature: "Restoration", values: ["Optional / Yes", "Optional / Yes", "Optional / Yes", "No"] },
  { feature: "Co-pay", values: ["Optional", "Optional", "Often mandatory", "No"] },
  { feature: "Deductible", values: ["Optional", "Optional", "Optional", "No"] },
  { feature: "Sub-limits", values: ["Varies", "Varies", "Varies", "No"] },
  { feature: "Major Exclusions", values: ["Cosmetic, self-inflicted", "Same", "Same", "Non-listed illnesses"] },
  { feature: "Claim Process", values: ["Cashless / reimbursement", "Cashless / reimbursement", "Cashless / reimbursement", "Lump-sum on diagnosis"] },
  { feature: "Suitable For", values: ["Single adults", "Couples & families", "Parents 60+", "Cancer, heart, stroke cover"] },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function HealthInsurancePage() {
  const [age, setAge] = useState(32);
  const [planType, setPlanType] = useState("family");
  const [members, setMembers] = useState(4);
  const [city, setCity] = useState("tier2");
  const [sumInsured, setSumInsured] = useState(1000000);
  const [existing, setExisting] = useState(0);
  const [ped, setPed] = useState("no");
  const [deductible, setDeductible] = useState(0);
  const [coPay, setCoPay] = useState(0);
  const [roomRent, setRoomRent] = useState("any");
  const [openFaq, setOpenFaq] = useState(null);

  const heroWa = whatsappLink("Hi Fortune U Group, I'd like to know more about health insurance.");
  const quoteWa = whatsappLink(
    `Hi Fortune U Group, I'd like a personalised health insurance quote.\nPlan: ${planType}\nAge: ${age}\nFamily members: ${members}\nCity: ${city}\nSum insured: ${fmt(sumInsured)}\nExisting cover: ${existing === 0 ? "None" : fmt(existing)}\nPre-existing disease: ${ped}\nDeductible: ${deductible === 0 ? "None" : fmtMoney(deductible)}\nCo-pay: ${coPay}%\nRoom rent: ${roomRent}`
  );

  const calc = useMemo(() => {
    const cityBase = { metro: 1000000, tier2: 750000, other: 500000 }[city] || 750000;
    let rec = cityBase;
    if (planType === "family") rec += Math.max(0, members - 1) * 250000;
    if (planType === "senior") rec += 500000;
    if (age >= 45) rec += 250000;
    if (age >= 60) rec += 500000;
    const low = rec;
    const high = rec + 500000;
    const required = Math.max(rec, sumInsured);
    const gap = Math.max(0, required - existing);

    let ageF = 0.78;
    if (age >= 26) ageF = 1;
    if (age >= 36) ageF = 1.48;
    if (age >= 46) ageF = 2.25;
    if (age >= 56) ageF = 3.45;
    if (age >= 66) ageF = 5.1;

    let siF = 0.62;
    if (sumInsured >= 1000000) siF = 1;
    if (sumInsured >= 1500000) siF = 1.28;
    if (sumInsured >= 2500000) siF = 1.72;
    if (sumInsured >= 5000000) siF = 2.45;
    if (sumInsured >= 10000000) siF = 3.35;

    const cityF = { metro: 1.18, tier2: 1.05, other: 1 }[city] || 1;
    const memberF = planType === "family" ? 1 + Math.max(0, members - 1) * 0.52 : 1;
    const typeF = planType === "senior" ? 1.7 : memberF;
    const pedF = ped === "yes" ? 1.25 : 1;
    const copayF = coPay === 10 ? 0.9 : coPay === 20 ? 0.82 : coPay === 30 ? 0.75 : 1;
    const dedF = deductible === 25000 ? 0.95 : deductible === 50000 ? 0.9 : deductible === 100000 ? 0.82 : 1;
    const roomF = roomRent === "single" ? 0.95 : roomRent === "singleAc" ? 0.98 : 1;

    const mid = 8500 * ageF * siF * cityF * typeF * pedF * copayF * dedF * roomF;
    const pLow = mid * 0.84;
    const pHigh = mid * 1.26;

    return { low, high, required, gap, pLow, pHigh, monthly: (pLow + pHigh) / 24 };
  }, [age, planType, members, city, sumInsured, existing, ped, deductible, coPay, roomRent]);

  return (
    <div data-testid="health-insurance-page" className="bg-brand-bg">
      <SEO
        title="Health Insurance | Fortune U Group"
        description="Health insurance guidance covering coverage, policy features, claims and support."
        path="/health-insurance"
      />

      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D2A50] to-[#0A2540] text-white">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E8C55A] text-xs font-bold tracking-[0.18em] uppercase mb-4">
                <Sparkles className="w-4 h-4" /> Health Insurance
              </div>
              <p className="text-[#E8C55A] font-semibold text-base md:text-lg mb-5">
                Comprehensive Health Insurance Guidance, Coverage &amp; Claims Support
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Protect Your Health. <span className="text-[#D4AF37]">Protect Your Family.</span> Choose the Right Health Insurance.
              </h1>
              <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-xl">
                Hospital bills rise every year. The right health insurance keeps a medical emergency from
                draining your savings and your financial goals. Compare plans across leading insurers with Fortune U Group.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <GoldBtn href="#calculator">Get a Free Quote <ArrowRight className="w-4 h-4" /></GoldBtn>
                <OutlineBtn href="#contact" icon={Phone}>Talk to Our Team</OutlineBtn>
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
      <section id="health-insurance-products" className="scroll-mt-24 py-20 px-5 lg:px-8">
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
              Get an indicative estimate of the coverage you need and an indicative premium range. This is not an actual insurance quote.
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

              <p className="font-semibold text-sm mb-2">Plan type</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={planType === "individual"} onClick={() => { setPlanType("individual"); setMembers(1); }}>Individual</Chip>
                <Chip on={planType === "family"} onClick={() => { setPlanType("family"); setMembers(Math.max(2, members)); }}>Family</Chip>
                <Chip on={planType === "senior"} onClick={() => { setPlanType("senior"); setMembers(1); }}>Senior Citizen</Chip>
              </div>

              <label className="block font-semibold text-sm mt-5 mb-2">Age of eldest member · <span className="text-[#D4AF37]">{age} yrs</span></label>
              <input type="range" min="18" max="80" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full accent-[#D4AF37]" />

              {planType === "family" && (
                <>
                  <label className="block font-semibold text-sm mt-5 mb-2">Number of family members · <span className="text-[#D4AF37]">{members}</span></label>
                  <input type="range" min="2" max="8" value={members} onChange={(e) => setMembers(+e.target.value)} className="w-full accent-[#D4AF37]" />
                </>
              )}

              <p className="font-semibold text-sm mt-5 mb-2">City / location</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={city === "metro"} onClick={() => setCity("metro")}>Metro</Chip>
                <Chip on={city === "tier2"} onClick={() => setCity("tier2")}>Tier-2 (Tirupati)</Chip>
                <Chip on={city === "other"} onClick={() => setCity("other")}>Other</Chip>
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Desired sum insured</p>
              <div className="flex flex-wrap gap-2">
                {[500000, 750000, 1000000, 1500000, 2500000, 5000000, 10000000].map((v) => (
                  <Chip key={v} on={sumInsured === v} onClick={() => setSumInsured(v)}>{fmt(v)}</Chip>
                ))}
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Existing health insurance</p>
              <div className="flex flex-wrap gap-2">
                {[0, 250000, 500000, 1000000, 1500000, 2500000].map((v) => (
                  <Chip key={v} on={existing === v} onClick={() => setExisting(v)}>{v === 0 ? "None" : fmt(v)}</Chip>
                ))}
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Pre-existing disease</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={ped === "no"} onClick={() => setPed("no")}>No</Chip>
                <Chip on={ped === "yes"} onClick={() => setPed("yes")}>Yes</Chip>
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Deductible</p>
              <div className="flex flex-wrap gap-2">
                {[0, 25000, 50000, 100000].map((v) => (
                  <Chip key={v} on={deductible === v} onClick={() => setDeductible(v)}>{v === 0 ? "None" : fmtMoney(v)}</Chip>
                ))}
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Co-pay</p>
              <div className="flex flex-wrap gap-2">
                {[0, 10, 20, 30].map((v) => (
                  <Chip key={v} on={coPay === v} onClick={() => setCoPay(v)}>{v === 0 ? "None" : `${v}%`}</Chip>
                ))}
              </div>

              <p className="font-semibold text-sm mt-5 mb-2">Room-rent preference</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={roomRent === "single"} onClick={() => setRoomRent("single")}>Single</Chip>
                <Chip on={roomRent === "singleAc"} onClick={() => setRoomRent("singleAc")}>Single AC</Chip>
                <Chip on={roomRent === "any"} onClick={() => setRoomRent("any")}>Any</Chip>
              </div>
            </div>

            {/* Result */}
            <div className="flex flex-col">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex-1">
                <p className="text-xs text-[#D4AF37] font-bold tracking-widest uppercase mb-4">Your indicative result</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/50 mb-1">Suggested coverage range</p>
                    <p className="text-xl font-bold text-[#D4AF37]">{fmt(calc.low)} – {fmt(calc.high)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/50 mb-1">Coverage gap</p>
                    <p className="text-xl font-bold text-white">{calc.gap > 0 ? fmt(calc.gap) : "Adequate"}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 p-5 mt-4">
                  <p className="text-xs text-white/60 mb-1">Indicative premium range (per year)</p>
                  <p className="font-display text-3xl font-bold text-[#D4AF37]">{fmtMoney(calc.pLow)} – {fmtMoney(calc.pHigh)}</p>
                  <p className="text-sm text-white/70 mt-1">≈ {fmtMoney(calc.monthly)} per month</p>
                </div>

                <p className="mt-5 text-sm text-white/70 leading-relaxed">
                  Your suggested cover of <strong className="text-white">{fmt(calc.low)}–{fmt(calc.high)}</strong> reflects
                  a {planType} plan, {members} member{members > 1 ? "s" : ""}, age {age}, city tier and your chosen sum insured.
                </p>

                <div className="mt-5">
                  <p className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-2">Factors affecting premium</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Age", "Sum insured", "City", "Family size", "Pre-existing disease", "Co-pay", "Deductible", "Room rent"].map((f) => (
                      <span key={f} className="text-[11px] font-semibold text-white/80 bg-white/10 rounded-full px-2.5 py-1">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-5 rounded-xl bg-white/5 border border-white/10 p-3">
                  <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60 leading-relaxed">
                    Indicative estimate only. Final premium is subject to insurer underwriting, policy terms and applicable conditions.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <GoldBtn href={quoteWa} target="_blank">Get Personalised Quote <ArrowRight className="w-4 h-4" /></GoldBtn>
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
            <table className="w-full text-sm min-w-[860px]">
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
                      <td key={j} className="px-5 py-3.5 text-brand-mute">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-brand-mute mt-3">
            * Indicative summary for general understanding. Actual features, waiting periods and premiums vary by insurer and plan.
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
              One hospital stay can set your finances back years. Here's how health insurance protects you and your family.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <StepCard key={s.title} step={i + 1} {...s} />
            ))}
          </div>

          <div className="mt-14">
            <h3 className="font-display text-xl font-semibold text-brand-navy mb-6 text-center">Key Terms You Should Know</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {KEY_TERMS.map((t) => (
                <div key={t.t} className="rounded-xl border border-brand-line bg-brand-soft/40 p-4">
                  <h4 className="font-semibold text-brand-navy text-[15px]">{t.t}</h4>
                  <p className="text-sm text-brand-mute leading-relaxed mt-1">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. CLAIM PROCESS ═══════════ */}
      <section id="claims" className="scroll-mt-24 py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Claim Process</Eyebrow></div>
            <SectionTitle>How to Claim Health Insurance</SectionTitle>
            <p className="mt-4 text-brand-mute">
              A clear, step-by-step guide for both cashless and reimbursement claims.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
                <h3 className="font-display text-lg font-semibold text-brand-navy">Cashless Claim</h3>
              </div>
              <Flow steps={CASHLESS_FLOW} />
              <p className="text-xs text-brand-mute mt-4 leading-relaxed">
                Cashless claims are settled directly with network hospitals after pre-authorisation, subject to policy terms.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center"><Wallet className="w-5 h-5" /></div>
                <h3 className="font-display text-lg font-semibold text-brand-navy">Reimbursement Claim</h3>
              </div>
              <Flow steps={REIMBURSEMENT_FLOW} />
              <p className="text-xs text-brand-mute mt-4 leading-relaxed">
                For reimbursement, pay the hospital first, keep every bill and document, then submit the claim for review.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-brand-line bg-white p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold text-brand-navy mb-5">Document Checklist</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CLAIM_DOCS.map((d) => (
                <div key={d} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-brand-mute">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. GRIEVANCE ═══════════ */}
      <section id="grievance" className="scroll-mt-24 py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center"><Eyebrow>Claim Support</Eyebrow></div>
            <SectionTitle>Claim Rejected? What Can You Do?</SectionTitle>
            <p className="mt-4 text-brand-mute">
              A rejected claim is not always the final word. Follow these steps to review and escalate your case.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {GRIEVANCE_STEPS.map((s, i) => (
              <div key={s.t} className="flex gap-4 rounded-xl border border-brand-line bg-white p-5 shadow-card">
                <span className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#0A2540] font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-brand-navy text-[15px]">{s.t}</h3>
                  <p className="text-sm text-brand-mute leading-relaxed mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 9. IRDAI / PORTALS ═══════════ */}
      <section id="portals" className="scroll-mt-24 py-20 px-5 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Regulatory Support</Eyebrow></div>
            <SectionTitle>Insurance Help &amp; Grievance Support</SectionTitle>
            <p className="mt-4 text-brand-mute">
              Official channels and support resources for policyholders. Fortune U Group is a distributor, not the regulator.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {PORTALS.map((p) => (
              <div key={p.title} className="flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4">
                  <p.icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-semibold text-brand-navy mb-2">{p.title}</h3>
                <p className="text-sm text-brand-mute leading-relaxed mb-5 flex-1">{p.desc}</p>
                <a
                  href={p.href}
                  target={p.official ? "_blank" : undefined}
                  rel={p.official ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 self-start rounded-full bg-[#0A2540] hover:bg-[#D4AF37] hover:text-[#0A2540] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
                >
                  {p.label} {p.official && <ExternalLink className="w-4 h-4" />}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 10. GLOSSARY ═══════════ */}
      <section id="glossary" className="scroll-mt-24 py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center"><Eyebrow>Learn the Basics</Eyebrow></div>
            <SectionTitle>Health Insurance Glossary</SectionTitle>
            <p className="mt-4 text-brand-mute">
              Plain-language definitions of the terms you'll see in health insurance policies.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOSSARY.map((g) => (
              <div key={g.t} className="rounded-xl border border-brand-line bg-brand-soft/40 p-4">
                <h3 className="font-semibold text-brand-navy text-[15px]">{g.t}</h3>
                <p className="text-sm text-brand-mute leading-relaxed mt-1">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 11. FAQ ═══════════ */}
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

      {/* ═══════════ 12. FINAL CTA ═══════════ */}
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
            Our team can help you understand your options and choose suitable coverage for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <GoldBtn href="#calculator">Get Free Quote <ArrowRight className="w-4 h-4" /></GoldBtn>
            <WhatsAppBtn href={quoteWa}>WhatsApp Us</WhatsAppBtn>
            <OutlineBtn href="tel:+919490237465" icon={Phone}>Talk to Our Team</OutlineBtn>
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
