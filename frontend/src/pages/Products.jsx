import React, { useState } from "react";

const WHATSAPP_NUMBER = "919533304441";

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const IMAGES = {
  heroAdvisor: "/images/hero-advisor.jpg",
  healthInsurance: "/images/health-insurance.jpg",
  termInsurance: "/images/term-insurance.jpg",
  vehicleInsurance: "/images/vehicle-insurance.jpg",
  personalLoan: "/images/personal-loan.jpg",
  homeLoan: "/images/home-loan.jpg",
  businessLoan: "/images/business-loan.jpg",
  vehicleLoan: "/images/vehicle-loan.jpg",
  creditCards: "/images/credit-cards.jpg",
  dematAccount: "/images/demat-account.jpg",
};

const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconShieldHeart(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M12 14.2s-2.6-1.5-2.6-3.4c0-1 .8-1.8 1.8-1.8.6 0 1.1.3 1.4.8.3-.5.8-.8 1.4-.8 1 0 1.8.8 1.8 1.8 0 1.9-2.8 3.4-2.8 3.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFamilyShield(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <circle cx="12" cy="9.4" r="1.6" />
      <path d="M8.6 14.4c0-1.4 1.5-2.3 3.4-2.3s3.4.9 3.4 2.3" />
    </svg>
  );
}

function IconCarShield(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M4 16l1.2-4.4A2 2 0 0 1 7.1 10h9.8a2 2 0 0 1 1.9 1.6L20 16" />
      <path d="M4 16h16v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H7.5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" />
      <circle cx="7.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9.5 7.2l1-1.7a1.5 1.5 0 0 1 1.3-.7h.4a1.5 1.5 0 0 1 1.3.7l1 1.7" />
    </svg>
  );
}

function IconWallet(props) {
  return (
    <svg {...iconBase} {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 14.2h2.5" />
      <path d="M7 7V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V7" />
    </svg>
  );
}

function IconHome(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function IconBuilding(props) {
  return (
    <svg {...iconBase} {...props}>
      <rect x="5" y="3.5" width="9" height="17" rx="0.5" />
      <rect x="14" y="9" width="5" height="11.5" rx="0.5" />
      <path d="M8 7h1.4M8 10.2h1.4M8 13.4h1.4M11 7h1.4M11 10.2h1.4M11 13.4h1.4" />
      <path d="M16.2 12h0.8M16.2 14.8h0.8M16.2 17.6h0.8" />
    </svg>
  );
}

function IconCar(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M4 16l1.2-4.4A2 2 0 0 1 7.1 10h9.8a2 2 0 0 1 1.9 1.6L20 16" />
      <path d="M4 16h16v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H7.5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" />
      <circle cx="7.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <path d="M6 10l1-2.6h10L18 10" />
    </svg>
  );
}

function IconCreditCard(props) {
  return (
    <svg {...iconBase} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M6.5 14.2h4" />
    </svg>
  );
}

function IconTrendingUp(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M4 16l5-5 3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </svg>
  );
}

function IconArrowRight(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.13-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.43-1.71-1.6-2-.17-.29-.02-.45.13-.6.15-.15.34-.39.5-.58.17-.19.22-.34.34-.56.11-.22.06-.41-.03-.56-.1-.15-.6-1.45-.82-1.99-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.53-.01-.19 0-.49.07-.75.34-.26.27-1 1-1 2.4 0 1.4 1.02 2.76 1.16 2.95.15.19 2.02 3.08 4.9 4.2 2.88 1.11 2.88.74 3.4.69.53-.05 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z" />
      <path d="M12.04 2.5a9.5 9.5 0 0 0-8.1 14.46L2.5 21.5l4.7-1.4a9.5 9.5 0 1 0 4.84-17.6zm0 17.3a7.8 7.8 0 0 1-3.98-1.09l-.28-.17-3.05.9.9-2.96-.18-.3a7.8 7.8 0 1 1 6.59 3.62z" />
    </svg>
  );
}

function IconPhone(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M5.5 4h3l1.3 4-2 1.4a11.6 11.6 0 0 0 5.8 5.8l1.4-2 4 1.3v3a1.5 1.5 0 0 1-1.6 1.5C10.6 18.5 5.5 13.4 4 6.6 3.86 5.7 4.6 4 5.5 4z" />
    </svg>
  );
}

function IconChevronRight(props) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const CATEGORIES = [
  {
    id: "insurance",
    index: "01",
    label: "Protect",
    title: "Insurance Solutions",
    blurb:
      "Cover what matters before life asks you to. Health, life, and vehicle protection built around your family.",
    products: [
      {
        icon: IconShieldHeart,
        image: IMAGES.healthInsurance,
        title: "Health Insurance",
        description:
          "Cashless hospitalisation, wide network coverage, and plans that scale with your family's needs.",
      },
      {
        icon: IconFamilyShield,
        image: IMAGES.termInsurance,
        title: "Term Insurance",
        description:
          "High life cover at low premiums — pure protection so your family's future stays secure.",
      },
      {
        icon: IconCarShield,
        image: IMAGES.vehicleInsurance,
        title: "Vehicle Insurance",
        description:
          "Comprehensive coverage for your car or bike, with fast claims and zero-paperwork renewals.",
      },
    ],
  },
  {
    id: "loans",
    index: "02",
    label: "Fund",
    title: "Loan Solutions",
    blurb:
      "Capital when you need it — for life's milestones and your business's next move, with rates that respect your credit.",
    products: [
      {
        icon: IconWallet,
        image: IMAGES.personalLoan,
        title: "Personal Loan",
        description:
          "Quick-approval funding for any need, with flexible tenures and minimal documentation.",
      },
      {
        icon: IconHome,
        image: IMAGES.homeLoan,
        title: "Home Loan",
        description:
          "Low interest rates and long tenures to help you own your home, sooner than you planned.",
      },
      {
        icon: IconBuilding,
        image: IMAGES.businessLoan,
        title: "Business Loan",
        description:
          "Working capital and growth funding for businesses, disbursed fast with collateral-light options.",
      },
      {
        icon: IconCar,
        image: IMAGES.vehicleLoan,
        title: "Vehicle Loan",
        description:
          "Drive home your next car or bike with up to 100% on-road funding and same-day approval.",
      },
    ],
  },
  {
    id: "banking",
    index: "03",
    label: "Grow",
    title: "Banking & Investment Solutions",
    blurb:
      "Everyday banking and market access, designed to turn your income into long-term wealth.",
    products: [
      {
        icon: IconCreditCard,
        image: IMAGES.creditCards,
        title: "Credit Cards",
        description:
          "Reward-rich cards with lounge access, cashback, and zero-cost EMI on your everyday spends.",
      },
      {
        icon: IconTrendingUp,
        image: IMAGES.dematAccount,
        title: "Demat Account",
        description:
          "Open a free Demat & Trading account and start investing in stocks, IPOs, and mutual funds.",
      },
    ],
  },
];

function ProductCard({ icon: Icon, image, title, description }) {
  return (
    <article
      className="
        group relative flex flex-col h-full overflow-hidden rounded-[20px]
        bg-white/60 backdrop-blur-xl
        border border-[#0B2A4A]/10
        shadow-[0_8px_30px_rgba(11,42,74,0.08)]
        transition-all duration-300 ease-out
        hover:-translate-y-2
        hover:border-[#D4AF37]
        hover:shadow-[0_20px_45px_rgba(11,42,74,0.18)]
      "
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#07203A]/70 via-transparent to-[#07203A]/85"
        />
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-bl from-[#D4AF37]/0 via-transparent to-transparent
            opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-[#D4AF37]/20
          "
        />
        <div
          className="
            absolute -bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-2xl
            bg-gradient-to-br from-[#0B2A4A] to-[#0F3A63]
            shadow-[0_6px_16px_rgba(11,42,74,0.4)] ring-4 ring-white/80
            transition-transform duration-300 group-hover:scale-105
          "
        >
          <Icon className="h-7 w-7 text-[#D4AF37]" />
        </div>
      </div>

      <div className="flex flex-grow flex-col p-7 pt-9">
        <h3 className="font-poppins text-lg font-semibold text-[#0B2A4A] tracking-tight">
          {title}
        </h3>
        <p className="font-inter mt-2 text-[14.5px] leading-relaxed text-[#14222F]/70 flex-grow">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className="
              inline-flex items-center gap-1.5 rounded-full px-4 py-2.5
              bg-[#0B2A4A] text-white text-[13px] font-semibold font-inter
              transition-all duration-200
              hover:bg-[#0F3A63]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2
            "
          >
            Learn More
            <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          <a
            href={waLink(`Hi Fortune U Group, I'd like to know more about ${title}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1.5 rounded-full px-4 py-2.5
              border border-[#0B2A4A]/15 text-[#0B2A4A] text-[13px] font-semibold font-inter
              transition-all duration-200
              hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#128C3E]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2
            "
          >
            <IconWhatsApp className="h-3.5 w-3.5" />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}

function CategorySection({ index, label, title, blurb, products, id }) {
  return (
    <section id={id} className="py-16 md:py-20 scroll-mt-20" aria-labelledby={`${id}-heading`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#0B2A4A]/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="font-poppins text-sm font-semibold tracking-[0.2em] text-[#D4AF37]">
                {index}
              </span>
              <span className="h-px w-10 bg-[#D4AF37]" />
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2A4A]/50">
                {label}
              </span>
            </div>
            <h2
              id={`${id}-heading`}
              className="font-poppins text-3xl md:text-[2.25rem] font-bold tracking-tight text-[#0B2A4A]"
            >
              {title}
            </h2>
          </div>
          <p className="font-inter max-w-md text-[15px] leading-relaxed text-[#14222F]/65 md:text-right">
            {blurb}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#07203A] via-[#0B2A4A] to-[#0F3A63]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="ledger" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M0 32 H64" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M32 0 V64" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ledger)" />
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#D4AF37] opacity-20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10rem] left-[-6%] h-80 w-80 rounded-full bg-[#D4AF37] opacity-10 blur-[100px]"
      />

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block lg:w-[42%]">
        <img
          src={IMAGES.heroAdvisor}
          alt="Fortune U Group financial advisor"
          className="h-full w-full object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#07203A] via-[#07203A]/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#07203A] via-transparent to-[#07203A]/30"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            <span className="font-inter text-xs font-medium uppercase tracking-[0.16em] text-[#F4C95D]">
              Fortune U Group · Financial Services
            </span>
          </div>

          <h1 className="font-poppins text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Financial Products{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4C95D] bg-clip-text text-transparent">
              Designed For Your Future
            </span>
          </h1>

          <p className="font-inter mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Insurance, loans, and investment solutions — built on trust and
            engineered for long-term wealth creation. One partner for every
            stage of your financial journey.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#insurance"
              className="
                font-inter inline-flex items-center gap-2 rounded-full
                bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-[#0B2A4A]
                transition-all duration-200 hover:bg-[#F4C95D] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white
              "
            >
              Explore Products
              <IconChevronRight className="h-4 w-4" />
              
            </a>
              href={waLink("Hi Fortune U Group, I'd like to know more about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-inter inline-flex items-center gap-2 rounded-full
                border border-white/25 px-6 py-3.5 text-sm font-semibold text-white
                transition-all duration-200 hover:border-white/60 hover:bg-white/5
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white
              "
            >
              <IconWhatsApp className="h-4 w-4" />
              Talk on WhatsApp
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {[
              ["9", "Product Lines"],
              ["50K+", "Families Served"],
              ["15+", "Years of Trust"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-poppins text-2xl font-bold text-[#D4AF37]">{value}</dd>
                <dd className="font-inter mt-1 text-xs uppercase tracking-wide text-white/50">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B2A4A] py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(212,175,55,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(212,175,55,0.18), transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-poppins text-3xl font-bold tracking-tight text-white md:text-4xl">
          Need Financial Guidance?
        </h2>
        <p className="font-inter mx-auto mt-4 max-w-xl text-white/65">
          Our advisors help you pick the right mix of protection, funding, and
          investment for where you are in life — at no extra cost.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          
            href="tel:+919533304441"
            className="
              font-inter inline-flex items-center gap-2 rounded-full
              bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-[#0B2A4A]
              transition-all duration-200 hover:bg-[#F4C95D] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white
            "
          >
            <IconPhone className="h-4 w-4" />
            Talk To Advisor
          </a>
          
            href={waLink("Hi Fortune U Group, I need financial guidance.")}
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-inter inline-flex items-center gap-2 rounded-full
              border border-white/25 px-7 py-3.5 text-sm font-semibold text-white
              transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366]/10
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white
            "
          >
            <IconWhatsApp className="h-4 w-4" />
            WhatsApp Now
          </a>
        </div>
      </div>
    </section>
  );
}

function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);

  return (
    
      href={waLink("Hi Fortune U Group, I have a query.")}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Chat with us on WhatsApp"
      className="
        fixed bottom-6 right-6 z-50 flex items-center gap-2
        rounded-full bg-[#25D366] px-4 py-4
        shadow-[0_8px_24px_rgba(37,211,102,0.45)]
        transition-all duration-300 hover:shadow-[0_10px_30px_rgba(37,211,102,0.6)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white
      "
      style={{ paddingRight: hovered ? "1.25rem" : "1rem" }}
    >
      <IconWhatsApp className="h-6 w-6 flex-shrink-0 text-white" />
      <span
        className={`
          font-inter overflow-hidden whitespace-nowrap text-sm font-semibold text-white
          transition-all duration-300
          ${hovered ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"}
        `}
      >
        Chat with us
      </span>
      <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </a>
  );
}

export default function ProductsPage() {
  return (
    <div className="font-inter min-h-screen bg-[#F8F6F1] text-[#14222F]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <Hero />

      <main>
        {CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} {...cat} />
        ))}
      </main>

      <CtaSection />
      <FloatingWhatsApp />
    </div>
  );
}
