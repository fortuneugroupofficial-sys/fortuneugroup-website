import SEO from "../components/SEO";

const Section = ({ title, children }) => (
  <div className="py-6 border-b border-brand-line last:border-b-0">
    <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-navy mb-3">{title}</h2>
    <div className="text-brand-mute leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <div className="bg-brand-bg" data-testid="privacy-page">
      <SEO
        title="Privacy Policy | Fortune U Group"
        description="How Fortune U Group collects, uses and protects your personal information."
        path="/privacy-policy"
      />
      <section className="bg-gradient-to-br from-[#0A2540] to-[#123B5B] text-white py-16">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">Privacy Policy</h1>
          <p className="mt-4 text-white/70">How we handle your information.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 bg-white rounded-2xl border border-brand-line p-6 md:p-10 shadow-soft">
          <Section title="What we collect">
            <p>
              We collect name, mobile, email, city and the product or goal you selected when you use the contact
              form, insurance/SIP request forms or WhatsApp. We do not collect payment card details on this website.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              Your details are used only to call you back and to complete insurance (and, after ARN, mutual fund)
              paperwork with the insurer or AMC. Form submissions may be delivered through our n8n webhook.
            </p>
            <p>We do not sell lead lists. KYC documents required by an insurer or AMC are shared only with that company.</p>
          </Section>

          <Section title="Analytics">
            <p>
              This site uses basic analytics (Google Analytics) to understand which pages are visited. Analytics
              data does not include your name or mobile number.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can write to{" "}
              <a className="text-brand-deepgreen font-semibold" href="mailto:fortuneugroupofficial@gmail.com">
                fortuneugroupofficial@gmail.com
              </a>{" "}
              to ask what information we hold about you, to correct it, or to ask us to delete it.
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
}
