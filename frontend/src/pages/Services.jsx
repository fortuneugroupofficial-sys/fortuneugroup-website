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
    <SEO title="Services · Mutual Fund Distribution, SIP, Insurance & Retirement" description="Eight services: Mutual Fund Distribution, SIP Planning, Goal-Based Investing, Wealth Creation, Retirement Planning, Health & Term Insurance Guidance, Financial Education." path="/services" />
    <section className="bg-white border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-24">
        <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">{t("services.eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-brand-navy font-semibold leading-tight max-w-3xl">{t("services.title")}</h1>
        <p className="mt-5 text-brand-mute max-w-2xl leading-relaxed">{t("services.sub")}</p>
      </div>
    </section>

    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-5">
          {services.map((s, i) => {
            const colSpan = i % 3 === 0 ? "lg:col-span-6" : "lg:col-span-3";
            return (
              <Card key={i} className={`p-7 bg-white border-brand-line hover:-translate-y-1 hover:shadow-soft transition-all md:col-span-1 lg:col-span-6 ${i>=2 ? 'lg:col-span-4':''}`} data-testid={`service-card-${i}`}>
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 font-display text-xl text-brand-navy font-semibold">{s.title}</h3>
                <ul className="mt-4 space-y-2">
                  {s.points.map((p, j) => (
                    <li key={j} className="text-sm text-brand-mute flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2" /> {p}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12">
        <div className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
          <SectionHeader eyebrow="SIP Planning Request" title="Get your SIP plan in 24 hours" />
          <div className="mt-6"><SIPRequestForm /></div>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
          <SectionHeader eyebrow="Insurance Guidance" title="Protect your family. Free advisory." />
          <div className="mt-6"><InsuranceForm /></div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default Services;
