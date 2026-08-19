import SEO from "../components/SEO";

const sections = [
  {
    title: "Educational Information Only",
    body: "The content on this website is provided for general information and financial education purposes only. It is not personalised investment advice, nor a solicitation or offer to buy or sell any security or insurance product.",
  },
  {
    title: "Investment Risk",
    body: "Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future results. Investment outcomes depend on market conditions and the selected product.",
  },
  {
    title: "Insurance Policy Terms",
    body: "Insurance is the subject matter of solicitation. Policies are issued by the respective insurer, not by Fortune U Group. Coverage, benefits and claim settlement are subject to policy terms, conditions, exclusions, documentation and the insurer's assessment.",
  },
  {
    title: "Insurer Underwriting",
    body: "Premium amounts and policy acceptance are subject to insurer underwriting. Final premium and coverage are determined by the insurer's quotation, and may vary based on age, location, coverage, medical history and other factors.",
  },
  {
    title: "Premium Variability",
    body: "Any premium figures shown on this website are indicative estimates only. They are not a guaranteed premium or a final quotation. Final premium is subject to insurer underwriting, policy terms and applicable conditions.",
  },
  {
    title: "Claim Assessment",
    body: "Claim settlement is subject to the insurer's assessment of the policy terms, conditions, exclusions and the documentation submitted. Fortune U Group does not guarantee claim approval or settlement.",
  },
  {
    title: "No Guarantee of Returns",
    body: "Nothing on this website constitutes a promise or guarantee of investment returns, profits, tax savings, or any specific future outcome.",
  },
  {
    title: "Third-Party Links",
    body: "This website may contain links to third-party websites, including official regulatory portals. Fortune U Group is not responsible for the content, accuracy or practices of external sites.",
  },
  {
    title: "Information May Change",
    body: "Product features, premiums, tax rules and regulatory requirements may change over time. Users should verify current product and policy documents directly with the relevant insurer, AMC or regulator.",
  },
  {
    title: "Regulatory Status",
    body: "Fortune U Group is not a SEBI-registered Investment Adviser, Research Analyst, Portfolio Manager, Stock Broker, or insurer. Fortune U Group does not provide personalised investment advice or stock recommendations.",
  },
];

export default function Disclaimer() {
  return (
    <div data-testid="disclaimer-page" className="bg-brand-bg">
      <SEO
        title="Disclaimer"
        description="Important disclaimers covering investment risk, insurance policy terms, underwriting, premium variability and claim assessment for the Fortune U Group website."
        path="/disclaimer"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D2A50] to-[#0A2540] text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-7 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">Legal</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">Disclaimer</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Please read the following disclaimers carefully before relying on the information on this website.
          </p>
        </div>
      </section>

      <section className="py-16 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-brand-navy mb-2">{s.title}</h2>
              <p className="text-sm text-brand-mute leading-relaxed">{s.body}</p>
            </div>
          ))}

          <div className="rounded-2xl border-l-4 border-[#D4AF37] bg-[#D4AF37]/5 p-6">
            <p className="text-sm text-brand-mute leading-relaxed">
              <strong className="text-brand-navy">Mutual fund risk disclosure:</strong> Mutual fund investments are
              subject to market risks. Read all scheme-related documents carefully before investing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
