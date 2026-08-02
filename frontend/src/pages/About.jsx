import React from "react";
import { CheckCircle2, Target, Eye, Heart } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import SEO from "../components/SEO";
import { Card } from "../components/ui/card";
import { useLang } from "../context/LangContext";

const values = [
  { icon: "Trust", desc: "Investor-first conversations, always." },
  { icon: "Transparency", desc: "Clear costs, clear advice, clear outcomes." },
  { icon: "Long-Term Thinking", desc: "Decades, not days. Compounding does the magic." },
  { icon: "Investor Education", desc: "We teach you the 'why', not just the 'what'." },
  { icon: "Client-Centric", desc: "Your goals lead our recommendations." },
];

const About = () => {
  const { t } = useLang();
  return (
  <div data-testid="about-page" className="bg-brand-bg">
    <SEO
  title="About Fortune U Group | Financial Planning & Investment Advisory"
  description="Learn about Fortune U Group, your trusted partner for Mutual Funds, SIP Investments, Financial Planning, Retirement Planning and Wealth Creation solutions."
  path="/about"
  />
    <section className="pt-4 md:pt-6 pb-20 bg-white">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Left Content */}
      <div>

        <span className="uppercase tracking-[0.2em] text-sm font-semibold text-[#D4AF37]">
          ABOUT FORTUNE U GROUP
        </span>

        <h1 className="mt-5 text-5xl font-bold leading-tight text-[#0A2540]">
          Your Trusted Partner for
          <span className="text-[#D4AF37]"> Financial Freedom</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-8">
          Fortune U Group helps individuals and families achieve their
          financial goals through Mutual Funds, SIPs, Insurance, Loans and
          personalized financial planning with complete transparency.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">

          <a
            href="/contact"
            className="bg-[#0A2540] text-white px-8 py-4 rounded-full hover:bg-[#D4AF37] transition"
          >
            Get Free Consultation
          </a>

          <a
            href="https://wa.me/919490237465"
            className="bg-[#25D366] text-white px-8 py-4 rounded-full hover:bg-[#1DA851] transition duration-300"
          >
            WhatsApp Now
          </a>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-6 mt-12">

          <div>
            <h3 className="text-3xl font-bold text-[#0A2540]">100+</h3>
            <p className="text-gray-500">Families Guided</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#0A2540]">6+</h3>
            <p className="text-gray-500">Years Experience</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#0A2540]">Goal Based</h3>
            <p className="text-gray-500">Financial Planning</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#0A2540]">100%</h3>
            <p className="text-gray-500">Investor First</p>
          </div>

        </div>

      </div>

      {/* Right Image */}

      <div>

        <img
          src="/images/about-advisor.jpg"
          alt="Financial Advisor"
          className="rounded-3xl shadow-2xl w-full"
        />

      </div>

    </div>
  </div>
</section>

     {/* ================= OUR STORY ================= */}

       <section className="py-20 bg-[#F8FAFC]">
       <div className="max-w-7xl mx-auto px-5 lg:px-8">

        <div className="text-center mb-14">
        <p className="uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
        OUR STORY
       </p>

      <h2 className="mt-4 text-4xl font-bold text-[#0A2540]">
        Building Financial Confidence for Every Family
      </h2>

      <p className="mt-5 text-gray-600 max-w-3xl mx-auto leading-8">
        Fortune U Group was established with a simple vision — to help
        Indian families make informed financial decisions through education,
        disciplined investing and transparent financial guidance.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Left Image */}

      <div>
        <img
          src="/images/about-story.jpg"
          alt="Our Story"
          className="rounded-3xl shadow-xl w-full"
        />
      </div>

      {/* Right Content */}

      <div>

        <h3 className="text-3xl font-bold text-[#0A2540] mb-6">
          Why We Started
        </h3>

        <p className="text-gray-600 leading-8 mb-5">
          We believe financial freedom should be available to everyone—not
          just experienced investors. Many families struggle because of
          confusing financial products and a lack of trusted guidance.
        </p>

        <p className="text-gray-600 leading-8 mb-5">
          Our mission is to simplify investing, insurance, loans and wealth
          planning through honest advice, goal-based planning and long-term
          relationships.
        </p>

        <p className="text-gray-600 leading-8">
          Whether you're planning for your child's education, buying a home,
          protecting your family or preparing for retirement, Fortune U Group
          is committed to supporting you every step of the way.
        </p>

      </div>

    </div>

    </div>
   </section>

        {/* ================= MISSION & VISION ================= */}

     <section className="py-20 bg-white">
       <div className="max-w-7xl mx-auto px-5 lg:px-8">

       <div className="text-center mb-14">
        <p className="uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
        OUR PURPOSE
       </p>

      <h2 className="mt-4 text-4xl font-bold text-[#0A2540]">
        Mission & Vision
      </h2>

      <p className="mt-5 text-gray-600 max-w-3xl mx-auto">
        We are committed to helping Indian families achieve financial
        independence through trusted advice and disciplined planning.
      </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

      {/* Mission */}

      <div className="bg-[#F8FAFC] rounded-3xl p-10 border border-gray-200 hover:shadow-xl transition">

        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-3xl">
          🎯
        </div>

        <h3 className="mt-6 text-3xl font-bold text-[#0A2540]">
          Our Mission
        </h3>

        <p className="mt-5 text-gray-600 leading-8">
          To simplify financial planning and empower individuals and families
          with expert guidance in Mutual Funds, SIPs, Insurance, Loans and
          Wealth Creation. We believe every family deserves honest,
          transparent and goal-based financial advice.
        </p>

      </div>

      {/* Vision */}

      <div className="bg-[#F8FAFC] rounded-3xl p-10 border border-gray-200 hover:shadow-xl transition">

        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-3xl">
          👁️
        </div>

        <h3 className="mt-6 text-3xl font-bold text-[#0A2540]">
          Our Vision
        </h3>

        <p className="mt-5 text-gray-600 leading-8">
          To become one of India's most trusted financial planning companies,
          helping thousands of families achieve financial freedom through
          education, disciplined investing and long-term wealth management.
        </p>

      </div>

    </div>

    </div>
   </section>

     {/* ================= OUR VALUES ================= */}

<section className="py-20 bg-[#F8FAFC]">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <div className="text-center mb-14">

      <p className="uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
        OUR VALUES
      </p>

      <h2 className="mt-4 text-4xl font-bold text-[#0A2540]">
        Principles That Guide Every Financial Decision
      </h2>

      <p className="mt-5 text-gray-600 max-w-3xl mx-auto leading-8">
        Everything we do is built on trust, transparency and a long-term
        commitment to helping our clients achieve financial success.
      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Card 1 */}

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          🤝
        </div>

        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Trust
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          We build long-term relationships through honesty, transparency and ethical financial guidance.
        </p>

      </div>

      {/* Card 2 */}

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          🎯
        </div>

        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Goal-Based Planning
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          Every recommendation is designed around your life goals, not short-term market movements.
        </p>

      </div>

      {/* Card 3 */}

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          📚
        </div>

        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Investor Education
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          We educate our clients so they can make informed and confident financial decisions.
        </p>

      </div>

      {/* Card 4 */}

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          📈
        </div>

        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Long-Term Wealth
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          We focus on disciplined investing strategies that help create sustainable wealth over time.
        </p>

      </div>

      {/* Card 5 */}

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          🛡️
        </div>

        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Client First
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          Every financial solution is recommended based on your needs, priorities and long-term interests.
        </p>

      </div>

      {/* Card 6 */}

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          💡
        </div>

        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Continuous Support
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          Financial planning is an ongoing journey. We provide continuous guidance as your goals evolve.
        </p>

      </div>

    </div>

  </div>
</section>

    {/* ================= HOW WE WORK ================= */}

<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <div className="text-center mb-16">
      <p className="uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
        HOW WE WORK
      </p>

      <h2 className="mt-4 text-4xl font-bold text-[#0A2540]">
        A Simple Process For Your Financial Success
      </h2>

      <p className="mt-5 text-gray-600 max-w-3xl mx-auto leading-8">
        Our structured approach helps you achieve your financial goals with
        confidence and clarity.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Step 1 */}
      <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center border border-gray-200 shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 mx-auto rounded-full bg-[#0A2540] text-white flex items-center justify-center text-2xl font-bold">
          1
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Understand Your Goals
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          We understand your income, financial goals, family needs and future aspirations.
        </p>

      </div>

      {/* Step 2 */}
      <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center border border-gray-200 shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 mx-auto rounded-full bg-[#0A2540] text-white flex items-center justify-center text-2xl font-bold">
          2
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Create a Financial Plan
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          We prepare a personalized roadmap based on your goals, budget and risk profile.
        </p>

      </div>

      {/* Step 3 */}
      <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center border border-gray-200 shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 mx-auto rounded-full bg-[#0A2540] text-white flex items-center justify-center text-2xl font-bold">
          3
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Implement the Strategy
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          Start investing through SIPs, Mutual Funds, Insurance and other suitable financial solutions.
        </p>

      </div>

      {/* Step 4 */}
      <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center border border-gray-200 shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300">

        <div className="w-16 h-16 mx-auto rounded-full bg-[#0A2540] text-white flex items-center justify-center text-2xl font-bold">
          4
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Review & Grow
        </h3>

        <p className="mt-4 text-gray-600 leading-7">
          We regularly review your portfolio and help you stay on track toward your financial goals.
        </p>

      </div>

    </div>

  </div>
</section>

    {/* ================= WHY CHOOSE FORTUNE U GROUP ================= */}

<section className="py-24 bg-[#F8FAFC]">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <div className="text-center mb-16">
      <p className="uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
        WHY CHOOSE FORTUNE U GROUP
      </p>

      <h2 className="mt-4 text-4xl font-bold text-[#0A2540]">
        Your Trusted Financial Planning Partner
      </h2>

      <p className="mt-5 text-gray-600 max-w-3xl mx-auto leading-8">
        We combine financial expertise, transparent guidance and long-term
        relationships to help you build, protect and grow your wealth.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">🎯</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">Goal-Based Planning</h3>
        <p className="mt-4 text-gray-600 leading-7">
          Every recommendation is aligned with your life goals and financial priorities.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">📈</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">Mutual Fund Expertise</h3>
        <p className="mt-4 text-gray-600 leading-7">
          SIPs, ELSS, Equity, Hybrid and Debt Funds selected to suit your goals.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">🛡️</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">Insurance Guidance</h3>
        <p className="mt-4 text-gray-600 leading-7">
          Protect your family's future with suitable health and term insurance solutions.
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">🤝</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">Transparent Advice</h3>
        <p className="mt-4 text-gray-600 leading-7">
          Honest recommendations with complete transparency and no unnecessary complexity.
        </p>
      </div>

      {/* Card 5 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">👨‍👩‍👧</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">Personalized Service</h3>
        <p className="mt-4 text-gray-600 leading-7">
          Every financial plan is customized to your family's unique needs and aspirations.
        </p>
      </div>

      {/* Card 6 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">🏆</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">Long-Term Partnership</h3>
        <p className="mt-4 text-gray-600 leading-7">
          We stay with you through every stage of your financial journey and portfolio reviews.
        </p>
      </div>

    </div>

  </div>
</section>

  {/* ================= FINAL CTA ================= */}

<section className="py-24 bg-[#0A2540]">
  <div className="max-w-6xl mx-auto px-5 lg:px-8 text-center">

    <span className="inline-block px-5 py-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-semibold uppercase tracking-[0.18em] text-sm">
      START YOUR FINANCIAL JOURNEY TODAY
    </span>

    <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-white leading-tight">
      Ready to Build Your
      <span className="text-[#D4AF37]"> Financial Future?</span>
    </h2>

    <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto leading-8">
      Whether you're planning for retirement, your child's education,
      wealth creation or financial protection, Fortune U Group is here
      to guide you every step of the way.
    </p>

    <div className="mt-10 flex flex-wrap justify-center gap-5">

      <a
        href="/contact"
        className="px-8 py-4 rounded-full bg-[#D4AF37] text-[#0A2540] font-bold hover:bg-yellow-400 transition duration-300"
      >
        Get Free Consultation
      </a>
      
      <a
          href="https://wa.me/919490237465"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 rounded-full bg-[#25D366] border-2 border-[#25D366] 
        text-white font-bold hover:bg-[#1DA851] transition duration-300"
      >
        WhatsApp Now
      </a>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">

      <div>
        <h3 className="text-3xl font-bold text-[#D4AF37]">100+</h3>
        <p className="text-gray-300 mt-2">Families Guided</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#D4AF37]">6+</h3>
        <p className="text-gray-300 mt-2">Years Experience</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#D4AF37]">Goal-Based</h3>
        <p className="text-gray-300 mt-2">Financial Planning</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#D4AF37]">100%</h3>
        <p className="text-gray-300 mt-2">Client Focused</p>
      </div>

    </div>

  </div>
</section>
  </div>
  );
};

export default About;
