import React from "react";
import { CheckCircle2, Target, Eye, Heart } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { Card } from "../components/ui/card";

const values = [
  { icon: "Trust", desc: "Investor-first conversations, always." },
  { icon: "Transparency", desc: "Clear costs, clear advice, clear outcomes." },
  { icon: "Long-Term Thinking", desc: "Decades, not days. Compounding does the magic." },
  { icon: "Investor Education", desc: "We teach you the 'why', not just the 'what'." },
  { icon: "Client-Centric", desc: "Your goals lead our recommendations." },
];

const About = () => (
  <div data-testid="about-page" className="bg-brand-bg">
    <section className="bg-white border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">About Fortune U Group</div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-brand-navy font-semibold leading-tight">A trusted financial education & wealth planning partner for Indian families.</h1>
          <p className="mt-5 text-brand-mute leading-relaxed">Fortune U Group was founded on a simple belief: financial freedom is built through education, planning and disciplined investing — not by chasing markets. We work with salaried employees, business owners, professionals, families and retirement planners to design goal-based portfolios that compound for decades.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1758518729841-308509f69a7f?crop=entropy&cs=srgb&fm=jpg&q=85" alt="Team" className="w-full rounded-2xl border border-brand-line shadow-soft" />
      </div>
    </section>

    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid md:grid-cols-2 gap-6">
        <Card className="p-8 bg-white border-brand-line">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-deepgreen flex items-center justify-center"><Target className="w-6 h-6" /></div>
          <h3 className="mt-5 font-display text-xl text-brand-navy font-semibold">Our Mission</h3>
          <p className="mt-3 text-brand-mute leading-relaxed">Helping Indian families achieve Financial Freedom through Education, Planning, and Disciplined Investing.</p>
        </Card>
        <Card className="p-8 bg-white border-brand-line">
          <div className="w-12 h-12 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center"><Eye className="w-6 h-6" /></div>
          <h3 className="mt-5 font-display text-xl text-brand-navy font-semibold">Our Vision</h3>
          <p className="mt-3 text-brand-mute leading-relaxed">To become India's most trusted Financial Education and Wealth Planning platform — known for transparency, depth and long-term client outcomes.</p>
        </Card>
      </div>
    </section>

    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeader eyebrow="Our Values" title="What we stand for" align="center" />
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

export default About;
