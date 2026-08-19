import React from "react";
import { TrendingUp, Target, PiggyBank, BarChart3, Shield, Heart, GraduationCap, Briefcase } from "lucide-react";
import { Card } from "../components/ui/card";
import { SectionHeader } from "../components/SectionHeader";
import SEO from "../components/SEO";
import { SIPRequestForm, InsuranceForm } from "../components/LeadForms";
import { useLang } from "../context/LangContext";

const services = [
  { icon: TrendingUp, title: "Mutual Fund Distribution", points: ["SIP & Lumpsum Investments", "ELSS (Tax-Saving) Funds", "Equity, Hybrid, Debt Funds", "Goal-mapped portfolios"], color: "bg-brand-green/10 text-brand-deepgreen" },
  { icon: PiggyBank, title: "SIP Planning", points: ["Monthly investment design", "Goal-Oriented SIPs", "Step-up SIP strategy", "Family financial goals"], color: "bg-brand-navy/10 text-brand-navy" },
  { icon: Target, title: "Goal-Based Investment Planning", points: ["Child Education", "Home Purchase", "Vehicle Purchase", "Retirement Goals"], color: "bg-brand-green/10 text-brand-deepgreen" },
  { icon: BarChart3, title: "Wealth Creation Planning", points: ["Long-Term Wealth Building", "Disciplined SIP plans", "Portfolio monitoring", "Goal Tracking & Reviews"], color: "bg-brand-navy/10 text-brand-navy" },
  { icon: Briefcase, title: "Retirement Planning", points: ["Retirement Corpus Design", "Financial Independence Map", "Post-retirement income", "Periodic goal tracking"], color: "bg-brand-green/10 text-brand-deepgreen" },
  { icon: Heart, title: "Health Insurance Guidance", points: ["Family Health Protection", "Medical Expense Coverage", "Individual & Floater Plans", "Super top-up advice"], color: "bg-brand-navy/10 text-brand-navy" },
  { icon: Shield, title: "Term Insurance Guidance", points: ["Family financial protection", "Income replacement design", "Long-term security", "Right cover & tenure advice"], color: "bg-brand-green/10 text-brand-deepgreen" },
  { icon: GraduationCap, title: "Financial Awareness Education", points: ["Investing Basics", "Personal Finance", "Mutual Fund Awareness", "Smart Money Management"], color: "bg-brand-navy/10 text-brand-navy" },
];

const Services = () => {
  const { t } = useLang();
  return (
  <div data-testid="services-page" className="bg-brand-bg">
    <SEO
  title="Financial Services | Mutual Funds, SIP & Insurance | Fortune U Group"
  description="Explore our financial services including Mutual Funds, SIP Investments, Retirement Planning, Goal Based Investing, Health Insurance and Term Insurance solutions."
  path="/services"
  />
    <section className="relative overflow-hidden bg-gradient-to-br from-white 
    via-blue-50 to-yellow-50 border-b border-brand-line">

  <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 lg:py-10">

    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Left Content */}
      <div>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-yellow/20 text-brand-navy font-semibold text-sm uppercase tracking-wider mb-5">
          Financial Services
        </div>

        <h1 className="font-display text-5xl lg:text-6xl font-bold text-brand-navy leading-tight">
          Complete
          <span className="text-brand-yellow"> Financial </span>
          Solutions For Every Stage Of Life
        </h1>

        <p className="mt-6 text-lg text-brand-mute leading-8 max-w-xl">
          Mutual Funds, SIP Planning, Insurance, Loans and Financial
          Planning — everything you need under one trusted platform.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">

          <a
            href="/contact"
            className="bg-brand-navy text-white px-7 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Get Free Consultation
          </a>

          <a
            href="https://wa.me/919490237465"
           target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition"
            >
             WhatsApp Now
            </a>

        </div>

      </div>

      {/* Right Image */}

      <div>

        <img
          src="/images/services-hero.png"
          alt="Financial Services"
          className="w-full rounded-3xl shadow-2xl"
        />

      </div>

    </div>

  </div>

</section>

   {/*Services Grid*/}
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6">

    <div class="text-center mb-14">
      <h2 class="text-4xl font-bold text-[#0A1931]">
        Our Premium Services
      </h2>
      <p class="mt-4 text-gray-600">
        Complete Financial Solutions Under One Roof
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

      {/*Mutual Funds*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">💹</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Mutual Funds</h3>
        <p class="text-gray-600 mt-2">Grow your wealth with professionally managed investment plans.</p>
      </div>

      {/*SIP Planning*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">📈</div>
        <h3 class="text-xl font-bold text-[#0A1931]">SIP Planning</h3>
        <p class="text-gray-600 mt-2">Start small and build long-term wealth through SIP investments.</p>
      </div>

       {/*Wealth Creation*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">💰</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Wealth Creation</h3>
        <p class="text-gray-600 mt-2">Personalized investment strategies to create long-term wealth.</p>
      </div>

      {/*Retirement Planning*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">🌅</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Retirement Planning</h3>
        <p class="text-gray-600 mt-2">Build a secure and financially independent retirement.</p>
      </div>

      {/*Demat Account*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">📊</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Demat Account</h3>
        <p class="text-gray-600 mt-2">Open a Demat account and start investing in stocks with ease.</p>
      </div>

      {/*Health Insurance*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">🛡️</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Health Insurance</h3>
        <p class="text-gray-600 mt-2">Comprehensive protection for you and your family.</p>
      </div>

      {/*Term Insurance*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">❤️</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Term Insurance</h3>
        <p class="text-gray-600 mt-2">Secure your family's future with affordable life cover.</p>
      </div>

      {/*Home Loan*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">🏠</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Home Loan</h3>
        <p class="text-gray-600 mt-2">Easy financing solutions to own your dream home.</p>
      </div>

      {/*Business Loan*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">💼</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Business Loan</h3>
        <p class="text-gray-600 mt-2">Fuel your business growth with flexible loan options.</p>
      </div>

      {/*Credit Cards*/}
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 text-center border border-gray-100 hover:-translate-y-2">
        <div class="text-5xl mb-4">💳</div>
        <h3 class="text-xl font-bold text-[#0A1931]">Credit Cards</h3>
        <p class="text-gray-600 mt-2">Choose the right credit card with exclusive rewards.</p>
      </div>

    </div>

  </div>
</section>

<section className="py-20 bg-[#F8FAFC]">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <SectionHeader
      eyebrow="WHY CHOOSE US"
      title="Why Choose Fortune U Group"
      sub="Trusted financial guidance for your family's future."
    />

    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-6">

      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="font-bold text-lg text-brand-navy">
          Expert Financial Guidance
        </h3>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">📈</div>
        <h3 className="font-bold text-lg text-brand-navy">
          Goal-Based Planning
        </h3>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🤝</div>
        <h3 className="font-bold text-lg text-brand-navy">
          Transparent Advice
        </h3>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🛡️</div>
        <h3 className="font-bold text-lg text-brand-navy">
          SEBI-Compliant
        </h3>
      </Card>

      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="font-bold text-lg text-brand-navy">
          Dedicated Support
        </h3>
      </Card>

    </div>

  </div>
</section>

    {/* Benefits Section */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">
    <SectionHeader
      eyebrow="Benefits"
      title="Why Choose Our Financial Services?"
      sub="Helping you achieve your financial goals with confidence."
    />

    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

      <Card className="p-6">
        <h3 className="text-xl font-bold text-brand-navy">💰 Tax Saving</h3>
        <p className="mt-2 text-brand-mute">
          Save income tax through ELSS Mutual Funds and smart financial planning.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-brand-navy">📈 Wealth Creation</h3>
        <p className="mt-2 text-brand-mute">
          Build long-term wealth with disciplined SIP investments.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-brand-navy">🛡️ Family Protection</h3>
        <p className="mt-2 text-brand-mute">
          Protect your loved ones with Health and Term Insurance.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-brand-navy">🏖️ Retirement Planning</h3>
        <p className="mt-2 text-brand-mute">
          Create a strong retirement corpus for a financially secure future.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-brand-navy">🎓 Child Education Planning</h3>
        <p className="mt-2 text-brand-mute">
          Plan early for your children's higher education goals.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-brand-navy">🚨 Emergency Fund Planning</h3>
        <p className="mt-2 text-brand-mute">
          Stay financially prepared for unexpected life situations.
        </p>
      </Card>

    </div>
  </div>
</section>

    {/* Our Process */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">
    <SectionHeader
      eyebrow="OUR PROCESS"
      title="How We Work"
      sub="Simple, Transparent & Goal-Oriented Financial Planning"
    />

    <div className="mt-12 grid md:grid-cols-5 gap-6">

      {[
        "Understand Your Goals",
        "Analyze Financial Situation",
        "Recommend Best Products",
        "Complete Documentation",
        "Ongoing Portfolio Review",
      ].map((step, index) => (

        <div
          key={index}
          className="bg-white rounded-2xl shadow-soft border border-brand-line p-6 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-brand-navy text-white flex items-center justify-center text-xl font-bold mx-auto">
            {index + 1}
          </div>

          <h3 className="mt-5 text-lg font-semibold text-brand-navy">
            {step}
          </h3>

          {index < 4 && (
            <div className="hidden md:block mt-6 text-3xl text-brand-yellow">
              →
            </div>
          )}
        </div>

      ))}

    </div>
  </div>
</section>

{/* FAQ Section */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">
    <h2 className="text-4xl font-bold text-center text-brand-navy mb-12">
      Frequently Asked Questions
    </h2>

    <div className="space-y-6">

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-brand-navy">
          SIP అంటే ఏమిటి?
        </h3>
        <p className="mt-2 text-brand-mute">
          SIP (Systematic Investment Plan) ద్వారా ప్రతి నెల ఒక నిర్ణీత మొత్తాన్ని Mutual Funds లో పెట్టుబడి పెట్టవచ్చు.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-brand-navy">
          Mutual Funds Safe నా?
        </h3>
        <p className="mt-2 text-brand-mute">
          Mutual Funds మార్కెట్‌కు సంబంధించినవి. అయితే దీర్ఘకాల పెట్టుబడులకు మంచి అవకాశాలను అందిస్తాయి.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-brand-navy">
          Health Insurance ఎందుకు అవసరం?
        </h3>
        <p className="mt-2 text-brand-mute">
          Medical expenses నుండి మీ కుటుంబాన్ని రక్షించడానికి Health Insurance చాలా అవసరం.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-brand-navy">
          Term Insurance ఎంత తీసుకోవాలి?
        </h3>
        <p className="mt-2 text-brand-mute">
          సాధారణంగా మీ వార్షిక ఆదాయానికి 10–15 రెట్లు Term Insurance Cover తీసుకోవడం మంచిది.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-brand-navy">
          Home Loan ఎలా Apply చేయాలి?
        </h3>
        <p className="mt-2 text-brand-mute">
          మా బృందాన్ని సంప్రదించండి. మీ Documents verify చేసి, మీకు సరిపోయే Home Loan ఎంపికను సూచిస్తాము.
        </p>
      </Card>

    </div>
  </div>
</section>
  </div>
  );
};

export default Services;
