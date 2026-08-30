import SEO from "../components/SEO";

const Section = ({ title, children }) => (
  <div className="py-6 border-b border-brand-line last:border-b-0">
    <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-navy mb-3">{title}</h2>
    <div className="text-brand-mute leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function Disclosure() {
  return (
    <div className="bg-brand-bg" data-testid="disclosure-page">
      <SEO
        title="Regulatory Disclosures | Fortune U Group"
        description="IRDAI, AMFI and SEBI-related disclosures for Fortune U Group, Tirupati."
        path="/disclosure"
      />
      <section className="bg-gradient-to-br from-[#0A2540] to-[#123B5B] text-white py-16">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <div className="kicker text-[#D4AF37] font-semibold uppercase tracking-widest text-sm">Disclosures</div>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">How we are paid, and what we are not.</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 bg-white rounded-2xl border border-brand-line p-6 md:p-10 shadow-soft">
          <div className="rounded-xl bg-brand-soft p-5 text-sm text-brand-ink leading-relaxed">
            <strong className="text-brand-navy">Fortune U Group</strong> · Tirupati, Andhra Pradesh
            <br />
            <strong className="text-brand-navy">IRDAI licensed appointments · Ref. LIC0159665T</strong>
            <br />
            Life: LIC, HDFC Life · Health: Care Health, Niva Bupa, Tata AIG, ICICI Lombard
            <br />
            Insurance is the subject matter of solicitation. Policies are issued by the insurer, not by Fortune U Group.
            <br />
            Mutual fund distribution: AMFI ARN not yet allotted. We do not currently distribute mutual fund units. SIP figures on this website are educational illustrations only.
            <br />
            Fortune U Group is not a SEBI-registered Investment Adviser. Commission is paid by insurers. No advisory fee is charged.
          </div>

          <Section title="Insurance">
            <p>
              Fortune U Group solicits insurance only for insurers where a valid appointment / code exists —
              life: LIC, HDFC Life; health: Care Health, Niva Bupa, Tata AIG, ICICI Lombard. We are not a broker
              for the whole market. Product advertisements that name a policy, benefit or premium need that
              insurer's written approval.
            </p>
            <p>Policy issuance, claims and servicing are the insurer's responsibility.</p>
          </Section>

          <Section title="Mutual funds">
            <p>
              Distribution requires a valid AMFI ARN after NISM Series V-A. Until the ARN is displayed on this
              website, we do not solicit or distribute mutual fund units. After the ARN, we will sell regular
              plans only and display "AMFI-registered Mutual Fund Distributor" with the ARN.
            </p>
            <p>
              Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
              We do not publish projected or guaranteed returns.
            </p>
          </Section>

          <Section title="Not a SEBI-registered Investment Adviser">
            <p>
              We do not charge a fee for investment advice, and we do not use the words adviser, advisor, IFA or
              wealth manager for this business. Goal conversations are part of product solicitation / distribution,
              not SEBI RIA services.
            </p>
          </Section>

          <Section title="Commission">
            <p>
              Insurers and (after ARN) AMCs pay us commission. If you ask, we will tell you the commission scale
              for the product being discussed. You can buy the same insurance policy or a direct-plan mutual fund
              without us.
            </p>
          </Section>

          <Section title="Complaints">
            <p>
              Insurance grievances: the insurer's grievance cell, then Bima Bharosa / IGMS on
              <a className="text-brand-deepgreen font-semibold" href="https://irdai.gov.in" target="_blank" rel="noreferrer"> irdai.gov.in</a>.
            </p>
            <p>
              Mutual fund grievances: the AMC, then AMFI / SCORES after an ARN is allotted.
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
}
