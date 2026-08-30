import SEO from "../components/SEO";

const Section = ({ title, children }) => (
  <div className="py-6 border-b border-brand-line last:border-b-0">
    <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-navy mb-3">{title}</h2>
    <div className="text-brand-mute leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TermsConditions() {
  return (
    <div className="bg-brand-bg" data-testid="terms-page">
      <SEO
        title="Terms & Conditions | Fortune U Group"
        description="Terms of use for the Fortune U Group website."
        path="/terms-and-conditions"
      />
      <section className="bg-gradient-to-br from-[#0A2540] to-[#123B5B] text-white py-16">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">Terms of Use</h1>
          <p className="mt-4 text-white/70">Please read before using this website.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 bg-white rounded-2xl border border-brand-line p-6 md:p-10 shadow-soft">
          <Section title="Purpose of this website">
            <p>
              This website is an information and contact channel for Fortune U Group, Tirupati. Nothing here is a
              prospectus, policy document or SEBI-registered investment advice.
            </p>
          </Section>

          <Section title="Products">
            <p>
              Insurance contracts are between you and the insurer. Mutual fund units (after ARN) are allotted by
              the AMC / RTA. Calculators on this website are illustrations only and are not quotes, forecasts or
              guarantees.
            </p>
          </Section>

          <Section title="No advisory relationship">
            <p>
              Fortune U Group is not a SEBI-registered Investment Adviser and does not charge an advisory fee.
              Commission is paid by insurers and (after ARN) AMCs.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              Indian law applies. For product terms, read the insurer policy wording or the mutual fund scheme
              information document.
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
}
