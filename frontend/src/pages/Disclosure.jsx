import SEO from "../components/SEO";

const disclosures = [
  {
    title: "Business Status",
    body: "Fortune U Group provides financial education, mutual fund distribution support and insurance distribution support. Fortune U Group is not a SEBI-registered Investment Adviser, Research Analyst, Portfolio Manager, Stock Broker or insurer.",
  },
  {
    title: "Mutual Fund Distribution",
    body: "Mutual fund distribution services are offered only after the applicable ARN (AMFI Registration Number) is in force. Until then, SIP figures and illustrations on this website are educational only. Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.",
  },
  {
    title: "Insurance Distribution",
    body: "Insurance is the subject matter of solicitation. Fortune U Group distributes insurance products of insurers it is appointed with. Policies are issued by the respective insurer, not by Fortune U Group.",
  },
  {
    title: "No Personalised Investment Advice",
    body: "Fortune U Group does not provide personalised investment advice or stock recommendations. Any information provided is educational and general in nature.",
  },
];

const regulators = [
  {
    title: "SEBI (Securities and Exchange Board of India)",
    desc: "Regulator for securities and mutual funds in India.",
    href: "https://www.sebi.gov.in/",
    label: "Open Official Portal",
  },
  {
    title: "IRDAI (Insurance Regulatory and Development Authority of India)",
    desc: "Regulator for insurance in India.",
    href: "https://irdai.gov.in/",
    label: "Open Official Portal",
  },
  {
    title: "IRDAI Bima Bharosa",
    desc: "Official portal to register and track insurance complaints.",
    href: "https://bimabharosa.irdai.gov.in/",
    label: "Open Official Portal",
  },
  {
    title: "Insurance Ombudsman",
    desc: "Alternate grievance redressal platform for eligible complaints.",
    href: "https://www.cioins.co.in/",
    label: "Open Official Portal",
  },
];

export default function Disclosure() {
  return (
    <div data-testid="disclosure-page" className="bg-brand-bg">
      <SEO
        title="Regulatory & Disclosures"
        description="Regulatory status, disclosures and official regulator links for Fortune U Group — mutual fund distribution, insurance distribution and financial education."
        path="/disclosure"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D2A50] to-[#0A2540] text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-7 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">Transparency</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">Regulatory &amp; Disclosures</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            A transparent summary of Fortune U Group's business status and the official regulatory channels available to consumers.
          </p>
        </div>
      </section>

      <section className="py-16 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {disclosures.map((d) => (
            <div key={d.title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-brand-navy mb-2">{d.title}</h2>
              <p className="text-sm text-brand-mute leading-relaxed">{d.body}</p>
            </div>
          ))}

          <div className="rounded-2xl border-l-4 border-[#D4AF37] bg-[#D4AF37]/5 p-6">
            <p className="text-sm text-brand-mute leading-relaxed">
              <strong className="text-brand-navy">Note:</strong> Fortune U Group may receive referral, distribution or
              affiliate commissions from product providers for the products it distributes.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-brand-navy mb-6">Official Regulatory Portals</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {regulators.map((r) => (
              <div key={r.title} className="flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-card">
                <h3 className="font-display text-base font-semibold text-brand-navy mb-2">{r.title}</h3>
                <p className="text-sm text-brand-mute leading-relaxed mb-4 flex-1">{r.desc}</p>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-[#0A2540] hover:bg-[#D4AF37] hover:text-[#0A2540] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
                >
                  {r.label}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-brand-mute leading-relaxed">
            Fortune U Group is not affiliated with, nor endorsed by, SEBI or IRDAI. These links are provided for consumer reference only.
          </p>
        </div>
      </section>
    </div>
  );
}
