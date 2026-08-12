import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, TrendingUp, Target, Shield, BookOpen, Users, Award, CheckCircle2, BarChart3, Heart, PiggyBank, GraduationCap, ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useLang } from "../context/LangContext";
import { whatsappLink } from "../lib/api";
import { TESTIMONIALS, FAQS } from "../data/content";
import { SectionHeader } from "../components/SectionHeader";
import { ConsultationForm } from "../components/LeadForms";
import SEO from "../components/SEO";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const serviceCards = [
  { icon: TrendingUp, title: "Mutual Fund Distribution", desc: "SIP, Lumpsum, ELSS, Equity, Hybrid, Debt funds." },
  { icon: Target, title: "Goal-Based Investing", desc: "Map every rupee to a life goal — education, home, retirement." },
  { icon: PiggyBank, title: "SIP Planning", desc: "Disciplined monthly investing that compounds for decades." },
  { icon: GraduationCap, title: "Financial Education", desc: "Investor literacy, personal finance, smart money habits." },
  { icon: Shield, title: "Term & Health Insurance", desc: "Protect family income and shield savings from medical costs." },
  { icon: BarChart3, title: "Retirement Planning", desc: "Build a crorepati retirement corpus with steady SIPs." },
];

const seriesData = (() => {
  const arr = []; let invested = 0; let wealth = 0;
  for (let y = 1; y <= 20; y++) {
    invested += 10000 * 12;
    wealth = 10000 * 12 * ((Math.pow(1.12, y) - 1) / 0.12) * 1.12;
    arr.push({ year: `Y${y}`, invested: Math.round(invested / 100000), wealth: Math.round(wealth / 100000) });
  }
  return arr;
})();

const Home = () => {
  const { t } = useLang();
  const testimonials = TESTIMONIALS;
  const faqs = FAQS;

  return (
    <div data-testid="home-page">
      <SEO
  title="Mutual Fund Distributor in Tirupati | SIP Investment Advisor"
  description="Fortune U Group provides Mutual Fund Distribution, SIP Investments, Financial Planning, Retirement Planning and Insurance Solutions in Tirupati."
  path="/"
  schema={{
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Fortune U Group",
    areaServed: "IN",
    url: "https://www.fortuneugroup.in",
    description:
      "Mutual Fund Distribution, SIP, Goal-based Investing, Retirement, Insurance Guidance and Financial Education."
  }}
/>
      {/* HERO */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <section className="relative overflow-hidden bg-white"></section>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-8 lg:pt-10 pb-16 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-navy/10 text-brand-yellow
              text-xs font-semibold uppercase tracking-[0.18em] reveal reveal-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t("hero.eyebrow")}
              </div>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] 
               tracking-tight text-brand-navy font-semibold reveal reveal-2">
                <>
                 Achieve Your Financial Goals With
                <br />
                <span className="text-[#D4AF37]">Expert Planning</span>
                </>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-brand-mute leading-relaxed max-w-2xl reveal reveal-3">{t("hero.sub")}</p>
              <div className="mt-8 flex flex-wrap gap-3 reveal reveal-4">
                <Link to="/contact#contact-form">
                  <Button data-testid="hero-cta-start" className="h-12 px-6 rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white text-sm font-semibold">
                    {t("hero.ctaPrimary")} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="https://wa.me/919490237465" target="_blank" rel="noreferrer">
                  <Button data-testid="hero-cta-whatsapp" variant="outline" 
                  className="h-12 px-6 rounded-full bg-[#25D366] hover:bg-[#1DA851] 
                  text-white text-sm font-semibold transition duration-300">
                    <MessageCircle className="w-4 h-4 mr-2" /> {t("hero.ctaSecondary")}
                  </Button>
                </a>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
                {[{n:"100+", l:"Invesors Educated"}, {n:"6+ Yrs", l:"Market Experience"}, {n:"Goal Based", l:"Financial Planning"}].map((s, i)=>(
                  <div key={i} className="reveal reveal-4">
                    <div className="font-display text-2xl md:text-3xl font-semibold text-brand-navy">{s.n}</div>
                    <div className="text-xs text-brand-mute mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl 
                overflow-hidden border border-brand-line shadow-soft bg-white reveal reveal-3">
                <img src="/images/family-advisor.png"
                   alt="Family Advisor"
                    className="w-full h-full object-cover"
                   />
                <div className="p-5 grid grid-cols-2 gap-4 bg-white">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-brand-yellow font-bold">Wealth (20-Yr SIP)</div>
                    <div className="font-display text-2xl text-brand-navy font-semibold">₹98.9 L</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-brand-mute font-bold">Invested</div>
                    <div className="font-display text-2xl text-brand-navy/70 font-semibold">₹24 L</div>
                  </div>
                  <div className="col-span-2 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={seriesData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="wealth" stroke="#2563EB" strokeWidth={2} fill="url(#gw)" />
                        <Area type="monotone" dataKey="invested" stroke="#2563EB" strokeWidth={1.5} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden md:block bg-white rounded-xl border border-brand-line shadow-soft p-3 animate-float-y">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-yellow"><Award className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs font-semibold text-brand-navy">SEBI-aware</div>
                    <div className="text-[10px] text-brand-mute">Investor-first approach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 lg:py-28 bg-white" data-testid="home-services">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader eyebrow="What we do" title="Built for Indian families & first-time investors" sub="Everything you need to learn, plan and grow your wealth — under one trusted roof." />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCards.map((s, i) => (
              <Link to="/services" key={i} className="group">
                 <Card className="p-8 rounded-3xl border border-gray-200 bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-{#0A2540}">{s.title}</h3>
                  <p className="mt-3 text-gray-600 leading-7">{s.desc}</p>
                  <div className="mt-6 inline-flex items-center text-sm font-semibold text-[#0A2540] hover:text-[#D4AF37] transition-colors">
                   Learn more
                   <ArrowUpRight className="w-4 h-4 ml-2" />
                     </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">

       <div className="text-center mb-14">

      <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">
        WHY CHOOSE FORTUNE U GROUP
      </span>

      <h2 className="text-4xl font-bold mt-3 text-gray-900">
        Your Trusted Financial Planning Partner
      </h2>

      <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
        We help individuals and families achieve their financial goals through
        disciplined investing, SIP planning and long-term wealth creation.
      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      <Card className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <Target className="w-12 h-12 text-blue-700 mb-5" />
        <h3 className="text-xl font-bold mb-3">Goal Based Planning</h3>
        <p className="text-[#D4AF37]">
          Every investment is linked to your life goals like retirement,
          children's education and wealth creation.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <TrendingUp className="w-12 h-12 text-[#D4AF37] mb-5" />
        <h3 className="text-xl font-bold mb-3">Long Term Wealth</h3>
        <p className="text-gray-600">
          SIP investments designed to build wealth consistently over
          10–30 years.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <Shield className="w-12 h-12 text-yellow-500 mb-5" />
        <h3 className="text-xl font-bold mb-3">Risk Protection</h3>
        <p className="text-gray-600">
          Protect your family with Term Insurance and Health Insurance
          recommendations.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <Users className="w-12 h-12 text-purple-600 mb-5" />
        <h3 className="text-xl font-bold mb-3">Personal Guidance</h3>
        <p className="text-gray-600">
          One-to-one financial planning and continuous portfolio review
          for every client.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <BookOpen className="w-12 h-12 text-indigo-600 mb-5" />
        <h3 className="text-xl font-bold mb-3">Financial Education</h3>
        <p className="text-[#D4AF37]">
          Learn how money works, avoid common mistakes and make informed financial decisions.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <Award className="w-12 h-12 text-orange-500 mb-5" />
       <h3 className="text-xl font-bold mb-3">Trusted Advisor</h3>
       <p className="text-gray-600">
       Transparent guidance with regular reviews to keep you on track towards your financial goals.
       </p>
     </Card>

    </div>

  </div>
</section>

   {/* FINANCIAL PLANNING PROCESS */}
      <section className="py-20 bg-slate-50">
       <div className="max-w-7xl mx-auto px-5">

       <div className="text-center mb-14">
       <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">
        OUR PROCESS
       </span>

      <h2 className="text-4xl font-bold mt-3 text-gray-900">
        Your Financial Planning Journey
      </h2>

      <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
        A simple step-by-step process designed to help you achieve your
        financial goals with confidence.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      <Card className="p-8 rounded-3xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-5">
          1
        </div>
        <h3 className="text-xl font-bold mb-3">
          Free Consultation
        </h3>
        <p className="text-gray-600">
          Understand your current financial situation and future goals.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-5">
          2
        </div>
        <h3 className="text-xl font-bold mb-3">
          Goal Analysis
        </h3>
        <p className="text-gray-600">
          Identify retirement, child education, wealth creation and tax-saving goals.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700 mb-5">
          3
        </div>
        <h3 className="text-xl font-bold mb-3">
          Personalized Plan
        </h3>
        <p className="text-gray-600">
          Create a customized investment and protection strategy.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-5">
          4
        </div>
        <h3 className="text-xl font-bold mb-3">
          Investment Started
        </h3>
        <p className="text-gray-600">
          Begin SIPs or investments in suitable mutual funds.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700 mb-5">
          5
        </div>
        <h3 className="text-xl font-bold mb-3">
          Portfolio Review
        </h3>
        <p className="text-gray-600">
          Regular monitoring and portfolio rebalancing for better performance.
        </p>
      </Card>

      <Card className="p-8 rounded-3xl shadow-lg">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-5">
          6
        </div>
        <h3 className="text-xl font-bold mb-3">
          Long-Term Wealth
        </h3>
        <p className="text-gray-600">
          Stay disciplined and achieve long-term financial freedom.
        </p>
      </Card>

    </div>

  </div>
</section>

 {/* CONSULT FORM */}
      <section className="py-20 lg:py-28 bg-white" data-testid="home-consult-section">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <div>
          <SectionHeader eyebrow={t("home.consultEyebrow")} title={t("home.consultTitle")} sub={t("home.consultSub")} />
            <ul className="mt-8 space-y-3 text-sm text-brand-mute">
              {["Personalised goal-mapping","Tax-efficient SIP mix","Insurance gap analysis","Lifetime advisor relationship"].map((s,i)=>(
                <li key={i} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-g mt-0.5" /> <span>{s}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
            <ConsultationForm />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}

<section className="py-20 bg-white-50">
  <div className="max-w-7xl mx-auto px-5">

    <div className="text-center mb-14">
      <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">
        CLIENT SUCCESS STORIES
      </span>

      <h2 className="text-4xl font-bold mt-3 text-gray-900">
        Trusted By Happy Families
      </h2>

      <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
        Hundreds of investors trust Fortune U Group for SIP Planning,
        Mutual Funds, Insurance and Goal-Based Financial Planning.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">

      <Card className="p-8 rounded-3xl">
        <div className="text-yellow-500 text-xl">★★★★★</div>

        <p className="mt-5 text-gray-600">
          Started SIP planning for my daughter's education.
          Excellent guidance and regular portfolio reviews.
        </p>

        <h4 className="mt-6 font-bold">
          Ramesh Kumar
        </h4>

        <span className="text-sm text-gray-500">
          Tirupati
        </span>
      </Card>

      <Card className="p-8 rounded-3xl">
        <div className="text-yellow-500 text-xl">★★★★★</div>

        <p className="mt-5 text-gray-600">
          Very transparent financial planning.
          Helped us build a long-term wealth creation strategy.
        </p>

        <h4 className="mt-6 font-bold">
          Suresh Babu
        </h4>

        <span className="text-sm text-gray-500">
          Visakhapatnam
        </span>
      </Card>

      <Card className="p-8 rounded-3xl">
        <div className="text-yellow-500 text-xl">★★★★★</div>

        <p className="mt-5 text-gray-600">
          Best Mutual Fund and Insurance consultation.
          Highly recommended for families.
        </p>

        <h4 className="mt-6 font-bold">
          Lakshmi Devi
        </h4>

        <span className="text-sm text-gray-500">
          Hyderabad
        </span>
      </Card>

    </div>

  </div>
</section>

       {/* SIP CALCULATOR */}
       <section className="py-20 bg-gradient-to-r from-blue-50 to-white">
       <div className="max-w-7xl mx-auto px-5">

       <div className="text-center mb-14">
      <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">
        SIP CALCULATOR
      </span>

      <h2 className="text-4xl font-bold mt-3 text-gray-900">
        Plan Your Future With SIP
      </h2>

      <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
        Calculate how your monthly investment can grow over time.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-10">

      <Card className="p-8 rounded-2xl shadow-lg">
        <div className="space-y-6">

          <div>
            <label className="font-semibold">
              Monthly SIP (₹)
            </label>
            <input
              type="number"
              placeholder="5000"
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="font-semibold">
              Investment Period (Years)
            </label>
            <input
              type="number"
              placeholder="20"
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="font-semibold">
              Expected Return (%)
            </label>
            <input
              type="number"
              placeholder="12"
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          <Button className="w-full">
            Calculate SIP
          </Button>

        </div>
      </Card>

      <Card className="p-8 rounded-2xl shadow-lg">

        <h3 className="text-2xl font-bold mb-8">
          Estimated Result
        </h3>

        <div className="space-y-5">

          <div className="flex justify-between">
            <span>Total Investment</span>
            <strong>₹12,00,000</strong>
          </div>

          <div className="flex justify-between">
            <span>Estimated Returns</span>
            <strong className="text-">
              ₹22,50,000
            </strong>
          </div>

          <div className="border-t pt-5 flex justify-between text-xl font-bold">
            <span>Total Wealth</span>
            <span className="text-blue-700">
              ₹34,50,000
            </span>
          </div>

        </div>

      </Card>

    </div>

  </div>
</section>

     {/* FAQ SECTION */}

      <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">

      <div className="text-center mb-14">
      <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">
        FREQUENTLY ASKED QUESTIONS
      </span>

      <h2 className="text-4xl font-bold mt-3 text-gray-900">
        Have Questions? We Have Answers
      </h2>

      <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
        Find answers to the most common questions about Mutual Funds,
        SIPs and Financial Planning.
      </p>
    </div>

    <div className="space-y-6">

      <Card className="p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          What is a SIP?
        </h3>
        <p className="text-gray-600 mt-2">
          SIP (Systematic Investment Plan) allows you to invest a fixed amount
          regularly in Mutual Funds and build wealth over time.
        </p>
      </Card>

      <Card className="p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          How much should I invest every month?
        </h3>
        <p className="text-gray-600 mt-2">
          You can start from ₹500 per month based on your financial goals.
        </p>
      </Card>

      <Card className="p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          Are Mutual Funds safe?
        </h3>
        <p className="text-gray-600 mt-2">
          Mutual Funds are market-linked investments. Choosing suitable funds
          based on your goals and risk profile is important.
        </p>
      </Card>

      <Card className="p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          Do you provide financial planning?
        </h3>
        <p className="text-gray-600 mt-2">
          Yes. We help you create personalized financial plans for retirement,
          child education, wealth creation and protection.
        </p>
      </Card>

      <Card className="p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          How can I start?
        </h3>
        <p className="text-gray-600 mt-2">
          Click "Get Free Consultation" or contact us on WhatsApp. We'll help
          you choose the right investment strategy.
        </p>
      </Card>

    </div>

    </div>
   </section> 

   {/* FINAL CTA */}

<section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
  <div className="max-w-6xl mx-auto px-5 text-center">

    <span className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-semibold mb-6">
      START YOUR FINANCIAL JOURNEY TODAY
    </span>

    <h2 className="text-4xl lg:text-5xl font-bold">
      Build Wealth With Smart Financial Planning
    </h2>

    <p className="mt-6 text-lg text-blue-100 max-w-3xl mx-auto">
      Whether you're planning for retirement, your child's education,
      or long-term wealth creation, Fortune U Group is here to guide you.
    </p>

    <div className="flex flex-wrap justify-center gap-5 mt-10">

      <a
        href="/contact"
        className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
      >
        Get Free Consultation
      </a>

      <a
          href="https://wa.me/919490237465"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] border-2 border-[#25D366] text-white px-8 py-4 rounded-xl font-bold 
        hover:bg-[#1DA851] hover:border-[#1DA851] transition duration-300"
      >
        WhatsApp Now
      </a>

    </div>

  </div>
   </section>
    </div>
  );
};

export default Home;
