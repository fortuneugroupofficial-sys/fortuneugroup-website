import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, TrendingUp, Target, Shield, BookOpen, Users, Award, CheckCircle2, BarChart3, Heart, PiggyBank, GraduationCap, ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useLang } from "../context/LangContext";
import { whatsappLink } from "../lib/api";
import api from "../lib/api";
import { SectionHeader } from "../components/SectionHeader";
import { ConsultationForm } from "../components/LeadForms";
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
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api.get("/testimonials").then((r) => setTestimonials(r.data)).catch(()=>{});
    api.get("/faqs").then((r) => setFaqs(r.data)).catch(()=>{});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 lg:pt-24 pb-16 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-deepgreen text-xs font-semibold uppercase tracking-[0.18em] reveal reveal-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t("hero.eyebrow")}
              </div>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-brand-navy font-semibold reveal reveal-2">
                {t("hero.title")}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-brand-mute leading-relaxed max-w-2xl reveal reveal-3">{t("hero.sub")}</p>
              <div className="mt-8 flex flex-wrap gap-3 reveal reveal-4">
                <Link to="/contact">
                  <Button data-testid="hero-cta-start" className="h-12 px-6 rounded-full bg-brand-navy hover:bg-brand-navy/90 text-white text-sm font-semibold">
                    {t("hero.ctaPrimary")} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  <Button data-testid="hero-cta-whatsapp" variant="outline" className="h-12 px-6 rounded-full border-brand-green text-brand-deepgreen hover:bg-brand-green hover:text-white text-sm font-semibold">
                    <MessageCircle className="w-4 h-4 mr-2" /> {t("hero.ctaSecondary")}
                  </Button>
                </a>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
                {[{n:"5,000+", l:"Families Educated"}, {n:"₹120Cr+", l:"AUM Guided"}, {n:"15+ Yrs", l:"Combined Experience"}].map((s, i)=>(
                  <div key={i} className="reveal reveal-4">
                    <div className="font-display text-2xl md:text-3xl font-semibold text-brand-navy">{s.n}</div>
                    <div className="text-xs text-brand-mute mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-brand-line shadow-soft bg-white reveal reveal-3">
                <img src="https://images.pexels.com/photos/5402587/pexels-photo-5402587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Indian family planning future" className="w-full h-72 object-cover" />
                <div className="p-5 grid grid-cols-2 gap-4 bg-white">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-brand-green font-bold">Wealth (20-Yr SIP)</div>
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
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="wealth" stroke="#10B981" strokeWidth={2} fill="url(#gw)" />
                        <Area type="monotone" dataKey="invested" stroke="#0A2540" strokeWidth={1.5} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden md:block bg-white rounded-xl border border-brand-line shadow-soft p-3 animate-float-y">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-deepgreen"><Award className="w-5 h-5" /></div>
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
                <Card className="p-7 border-brand-line shadow-card hover:-translate-y-1 hover:shadow-soft transition-all duration-300 h-full bg-white" data-testid={`home-service-card-${i}`}>
                  <div className="w-11 h-11 rounded-lg bg-brand-soft text-brand-navy flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-brand-navy font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-brand-mute leading-relaxed">{s.desc}</p>
                  <div className="mt-5 inline-flex items-center text-xs font-semibold text-brand-deepgreen">Learn more <ArrowUpRight className="w-3.5 h-3.5 ml-1" /></div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 lg:py-28 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-grid" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">Why Fortune U</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">Education-first. Goal-driven. Built for the long haul.</h2>
              <p className="mt-4 text-white/70 leading-relaxed">We don't sell schemes. We teach families how money works, design a goal-based plan, and stay with you for the journey.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  ["Transparent advice", "No hidden agendas. We educate before we recommend."],
                  ["Goal-mapped portfolios", "Every SIP linked to a specific life goal."],
                  ["Behavioural coaching", "We coach you through market cycles."],
                  ["Long-term thinking", "Built for 10-30 year wealth journeys, not quick wins."],
                ].map(([t,d], i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-5 bg-white/[0.03] backdrop-blur">
                    <div className="font-display font-semibold">{t}</div>
                    <div className="text-sm text-white/70 mt-1">{d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1758518729841-308509f69a7f?crop=entropy&cs=srgb&fm=jpg&q=85" alt="Professionals discussing charts" className="rounded-2xl border border-white/10 w-full" />
              <div className="absolute -bottom-6 -right-6 bg-white text-brand-navy rounded-xl p-4 shadow-soft hidden md:block">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-deepgreen" />
                  <div>
                    <div className="font-semibold text-sm">5,000+ Indian families</div>
                    <div className="text-xs text-brand-mute">trust Fortune U</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULT FORM */}
      <section className="py-20 lg:py-28 bg-white" data-testid="home-consult-section">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeader eyebrow="Free Consultation" title="Tell us your goal. We'll build the plan." sub="A no-obligation, 30-minute conversation. Get clarity on where your money should go — for the next 5, 10 and 30 years." />
            <ul className="mt-8 space-y-3 text-sm text-brand-mute">
              {["Personalised goal-mapping","Tax-efficient SIP mix","Insurance gap analysis","Lifetime advisor relationship"].map((s,i)=>(
                <li key={i} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-brand-green mt-0.5" /> <span>{s}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
            <ConsultationForm />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-brand-soft/40" data-testid="home-testimonials">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader eyebrow="Investor stories" title="Real families. Real journeys." align="center" />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0,6).map((tst) => (
              <Card key={tst.id} className="p-6 bg-white border-brand-line shadow-card" data-testid={`testimonial-${tst.id}`}>
                <div className="flex gap-0.5 mb-3 text-brand-green">
                  {Array.from({length: tst.rating || 5}).map((_, i)=>(<span key={i}>★</span>))}
                </div>
                <p className="text-sm text-brand-ink leading-relaxed">"{tst.content}"</p>
                <div className="mt-5 pt-4 border-t border-brand-line">
                  <div className="font-semibold text-sm text-brand-navy">{tst.name}</div>
                  <div className="text-xs text-brand-mute">{tst.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white" data-testid="home-faq">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <SectionHeader eyebrow="Common questions" title="Investing FAQs" align="center" />
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id} data-testid={`faq-${f.id}`}>
                <AccordionTrigger className="text-left font-display font-medium text-brand-navy hover:no-underline">{f.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-brand-mute leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Home;
