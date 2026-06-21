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
    <section className="bg-white border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">{t("about.eyebrow")}</div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-brand-navy font-semibold leading-tight">{t("about.title")}</h1>
          <p className="mt-5 text-brand-mute leading-relaxed">{t("about.lead")}</p>
        </div>
        <img src="https://images.unsplash.com/photo-1758518729841-308509f69a7f?crop=entropy&cs=srgb&fm=jpg&q=85" alt="Team" className="w-full rounded-2xl border border-brand-line shadow-soft" />
      </div>
    </section>

    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid md:grid-cols-2 gap-6">
        <Card className="p-8 bg-white border-brand-line">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-deepgreen flex items-center justify-center"><Target className="w-6 h-6" /></div>
          <h3 className="mt-5 font-display text-xl text-brand-navy font-semibold">{t("about.mission")}</h3>
          <p className="mt-3 text-brand-mute leading-relaxed">{t("about.missionT")}</p>
        </Card>
        <Card className="p-8 bg-white border-brand-line">
          <div className="w-12 h-12 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center"><Eye className="w-6 h-6" /></div>
          <h3 className="mt-5 font-display text-xl text-brand-navy font-semibold">{t("about.vision")}</h3>
          <p className="mt-3 text-brand-mute leading-relaxed">{t("about.visionT")}</p>
        </Card>
      </div>
    </section>

    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader eyebrow={t("about.valuesEyebrow")} title={t("about.valuesTitle")} align="center" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {values.map((v, i)=>(
            <Card key={i} className="p-6 border-brand-line text-left" data-testid={`value-${i}`}>
              <Heart className="w-5 h-5 text-brand-green" />
              <h4 className="mt-4 font-display font-semibold text-brand-navy">{v.icon}</h4>
              <p className="mt-2 text-sm text-brand-mute leading-relaxed">{v.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </div>
  );
};

export default About;
