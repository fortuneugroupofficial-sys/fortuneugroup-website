import React, { useState } from "react";
import { whatsappLink, WHATSAPP_NUMBER, BUSINESS_EMAIL, submitLead } from "../lib/api";
import { trackEvent } from "../components/Analytics";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import SEO from "../components/SEO";
import { useLang } from "../context/LangContext";

const Field = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">{label}</Label>
    <Input {...props} className="bg-brand-soft/40 border-brand-line focus-visible:ring-brand-green" />
  </div>
);

const Contact = () => {
  const [f, setF] = useState({ name: "", mobile: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { t } = useLang();
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await submitLead("contact", f);
      trackEvent("generate_lead", { form_type: "contact" });
      toast.success("Thanks! We'll reach out shortly.");
      setF({ name: "", mobile: "", email: "", message: "" });
    } catch { toast.error("Could not send. Please try again."); }
    finally { setLoading(false); }
  };
  return (
  <>
    <SEO
      title="Contact Fortune U Group | Mutual Fund Advisor in Srikakulam"
      description="Contact Fortune U Group for expert guidance on Mutual Funds, SIP Investments, Financial Planning, Retirement Planning and Insurance solutions."
      path="/contact"
    />

    <div data-testid="contact-page" className="bg-brand-bg">
      ...
    </div>
    </>
    );
    <div data-testid="contact-page" className="bg-brand-bg">
      <section className="bg-white border-b border-brand-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-24">
          <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">Get in touch</div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-brand-navy font-semibold leading-tight max-w-3xl">Let's design your financial roadmap.</h1>
          <p className="mt-5 text-brand-mute max-w-2xl leading-relaxed">Reach us via form, WhatsApp or email. Most queries are answered within 4 working hours.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHeader eyebrow="Reach us" title="Multiple ways to connect" />
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <a href={`mailto:${BUSINESS_EMAIL}`} className="rounded-xl border border-brand-line bg-white p-5 hover:border-brand-green transition" data-testid="contact-email">
                <Mail className="w-5 h-5 text-brand-deepgreen" />
                <div className="mt-3 text-xs uppercase tracking-wider text-brand-mute font-semibold">Email</div>
                <div className="font-display font-semibold text-brand-navy mt-1 break-all">{BUSINESS_EMAIL}</div>
              </a>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="rounded-xl border border-brand-line bg-white p-5 hover:border-brand-green transition" data-testid="contact-whatsapp">
                <MessageCircle className="w-5 h-5 text-brand-deepgreen" />
                <div className="mt-3 text-xs uppercase tracking-wider text-brand-mute font-semibold">WhatsApp</div>
                <div className="font-display font-semibold text-brand-navy mt-1">+{WHATSAPP_NUMBER}</div>
              </a>
              <div className="rounded-xl border border-brand-line bg-white p-5">
                <Phone className="w-5 h-5 text-brand-deepgreen" />
                <div className="mt-3 text-xs uppercase tracking-wider text-brand-mute font-semibold">Phone</div>
                <div className="font-display font-semibold text-brand-navy mt-1">+{WHATSAPP_NUMBER}</div>
              </div>
              <div className="rounded-xl border border-brand-line bg-white p-5">
                <MapPin className="w-5 h-5 text-brand-deepgreen" />
                <div className="mt-3 text-xs uppercase tracking-wider text-brand-mute font-semibold">Office</div>
                <div className="font-display font-semibold text-brand-navy mt-1">Tirupati,Andhra Pradesh India</div>
              </div>
            </div>
            <div className="mt-8 rounded-xl overflow-hidden border border-brand-line">
              </div>
              
              <iframe
               title="map"

             src="https://www.google.com/maps?q=Tirupati,Andhra%20Pradesh,India&output=embed"
             width="100%"
             height="400"
             style={{ border: 0 }}
             allowFullScreen=""
             loading="lazy"
            ></iframe>
          </div>

          <div className="rounded-2xl bg-white border border-brand-line p-7 shadow-soft">
            <SectionHeader eyebrow="Send message" title="We respond within 4 hours" />
            <form onSubmit={submit} className="mt-6 grid gap-4" data-testid="contact-form">
              <Field label="Name" required value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} data-testid="contact-name" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Mobile" required value={f.mobile} onChange={(e)=>setF({...f, mobile:e.target.value})} data-testid="contact-mobile" />
                <Field label="Email" type="email" required value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} data-testid="contact-emailfield" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Message</Label>
                <Textarea required rows={5} value={f.message} onChange={(e)=>setF({...f, message:e.target.value})} className="bg-brand-soft/40 border-brand-line focus-visible:ring-brand-green" data-testid="contact-message" />
              </div>
              <Button type="submit" disabled={loading} data-testid="contact-submit" className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-full h-11 font-semibold">{loading ? "Sending…" : "Send Message"}</Button>
            </form>
          </div>
        </div>
        </section>
        </div>
        );
        };

export default Contact;
