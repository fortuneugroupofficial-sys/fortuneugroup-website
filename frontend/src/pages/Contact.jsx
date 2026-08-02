import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
    <Input
  {...props}
  className="h-14 rounded-xl border border-gray-300 bg-gray-50 px-4 text-base placeholder:text-gray-400 
  focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-300"
/>
  </div>
);

const Contact = () => {
  const [f, setF] = useState({ name: "", mobile: "", email: "", city:"", financial_goal:"", message: "" });
  const [loading, setLoading] = useState(false);
   const { t } = useLang();
  const location = useLocation();



   const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await submitLead("contact", f);
      trackEvent("generate_lead", { form_type: "contact" });
      toast.success("Thanks! We'll reach out shortly.");
      setF({ name: "", mobile: "", email: "", city: "", financial_goal: "", message: "" });
    } catch { toast.error("Could not send. Please try again."); }
    finally { setLoading(false); }
  };
  return (
  <>
    <SEO
      title="Contact Fortune U Group | Mutual Fund Advisor in Tirupati"
      description="Contact Fortune U Group for expert guidance on Mutual Funds, SIP Investments, 
      Financial Planning, Retirement Planning and Insurance solutions."
      path="/contact"
    />

    <div data-testid="contact-page" className="bg-brand-bg">
      <section className="bg-gradient-to-r from-[#0A2540] to-[#12385B] text-white py-20">
  <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">

    <span className="text-[#D4AF37] font-semibold uppercase tracking-widest">
      CONTACT US
    </span>

    <h1 className="text-5xl font-bold mt-4 leading-tight">
      Let's Build Your <span className="text-[#D4AF37]">Financial Future</span>
    </h1>

    <p className="mt-6 text-lg text-gray-200 max-w-3xl mx-auto">
      Get expert guidance on Mutual Funds, SIP Planning, Insurance,
      Retirement Planning and Wealth Creation.
    </p>

    <div className="mt-10 flex flex-wrap justify-center gap-5">

      <button
  onClick={() => {
    const form = document.getElementById("contact-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  }}
  className="bg-[#D4AF37] text-[#0A2540] px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
>
  Book Free Consultation
</button>

      <a
        href="tel:+919490237465"
        className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#0A2540] transition"
      >
        📞 Call Now
      </a>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">

      <div className="bg-white text-[#0A2540] rounded-2xl p-6 shadow-lg">
        <h3 className="text-3xl">⚡</h3>
        <h4 className="font-bold mt-3">1 Hr</h4>
        <p>Response Time</p>
      </div>

      <div className="bg-white text-[#0A2540] rounded-2xl p-6 shadow-lg">
        <h3 className="text-3xl">💬</h3>
        <h4 className="font-bold mt-3">Free</h4>
        <p>Consultation</p>
      </div>

      <div className="bg-white text-[#0A2540] rounded-2xl p-6 shadow-lg">
        <h3 className="text-3xl">👨‍💼</h3>
        <h4 className="font-bold mt-3">100+</h4>
        <p>Investors Guided</p>
      </div>

      <div className="bg-white text-[#0A2540] rounded-2xl p-6 shadow-lg">
        <h3 className="text-3xl">⭐</h3>
        <h4 className="font-bold mt-3">Trusted</h4>
        <p>Financial Partner</p>
      </div>

    </div>

  </div>
</section>

      {/* Why Choose Fortune U Group */}
<section className="py-16">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <div className="text-center mb-12">
      <span className="text-[#D4AF37] uppercase tracking-widest font-semibold text-sm">
        WHY CHOOSE US
      </span>

      <h2 className="mt-3 text-4xl font-bold text-[#0A2540]">
        Why Choose Fortune U Group?
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        We help individuals and families build wealth with disciplined investing,
        financial education and personalized guidance.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all">
        <div className="text-5xl mb-5">🎯</div>
        <h3 className="text-xl font-bold text-[#0A2540]">
          Personalized Planning
        </h3>
        <p className="mt-3 text-gray-600">
          Financial plans tailored to your goals and life stage.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all">
        <div className="text-5xl mb-5">📈</div>
        <h3 className="text-xl font-bold text-[#0A2540]">
          Goal-Based Investing
        </h3>
        <p className="mt-3 text-gray-600">
          SIP and investment strategies designed for long-term wealth creation.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all">
        <div className="text-5xl mb-5">🤝</div>
        <h3 className="text-xl font-bold text-[#0A2540]">
          Trusted Guidance
        </h3>
        <p className="mt-3 text-gray-600">
          Transparent advice with an investor-first approach.
        </p>
      </div>

    </div>
  </div>
</section>

      {/* Business Hours & Quick Actions */}
<section className="py-16 bg-[#F8FAFC]">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <div className="grid lg:grid-cols-2 gap-8">

      {/* Business Hours */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">

        <h2 className="text-2xl font-bold text-[#0A2540] mb-6">
          🕒 Business Hours
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-3">
            <span className="font-medium">Monday - Saturday</span>
            <span className="font-semibold text-[#0A2540]">
              9:30 AM - 7:00 PM
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-medium">Sunday</span>
            <span className="text-[#D4AF37] font-semibold">
              By Appointment
            </span>
          </div>

          <div className="mt-6 bg-[#FFF8E7] rounded-xl p-4 border border-[#D4AF37]">
            <p className="text-sm text-gray-700">
              📞 Need urgent assistance? Contact us on WhatsApp for a faster response.
            </p>
          </div>

        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">

        <h2 className="text-2xl font-bold text-[#0A2540] mb-6">
          🚀 Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <a
            href="tel:+919490237465"
            className="bg-[#0A2540] text-white rounded-2xl py-5 text-center font-semibold hover:bg-[#163B65] transition"
          >
            📞 Call Now
          </a>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 text-white rounded-2xl py-5 text-center font-semibold hover:bg-green-700 transition"
          >
            💬 WhatsApp
          </a>

          <a
            href="mailto:fortuneugroupofficial@gmail.com"
            className="bg-[#D4AF37] text-[#0A2540] rounded-2xl py-5 text-center font-semibold hover:opacity-90 transition"
          >
            ✉️ Email
          </a>

          <a
            href="https://maps.google.com/?q=Tirupati"
            target="_blank"
            rel="noreferrer"
            className="bg-gray-100 text-[#0A2540] rounded-2xl py-5 text-center font-semibold hover:bg-gray-200 transition"
          >
            📍 Directions
          </a>

        </div>

      </div>

    </div>

  </div>
</section>

       {/* Consultation Process */}
<section className="py-20 bg-gradient-to-b from-white to-[#F8FAFC]">
  <div className="max-w-7xl mx-auto px-5 lg:px-8">

    <div className="text-center mb-14">
      <span className="text-[#D4AF37] font-semibold uppercase tracking-widest">
        HOW IT WORKS
      </span>

      <h2 className="mt-3 text-4xl font-bold text-[#0A2540]">
        Your Financial Journey Starts Here
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        A simple 4-step process to help you achieve your financial goals.
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-6">

      {/* Step 1 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#0A2540] text-white flex items-center justify-center text-2xl font-bold">
          1
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Submit Your Details
        </h3>

        <p className="mt-3 text-gray-600">
          Fill out the contact form or connect through WhatsApp.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37] text-[#0A2540] flex items-center justify-center text-2xl font-bold">
          2
        </div>

        <p className="mt-3 text-gray-600">
          We understand your financial goals and requirements.
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#0A2540] text-white flex items-center justify-center text-2xl font-bold">
          3
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Personalized Plan
        </h3>

        <p className="mt-3 text-gray-600">
          Get an investment strategy designed for your future.
        </p>
      </div>

      {/* Step 4 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37] text-[#0A2540] flex items-center justify-center text-2xl font-bold">
          4
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Start Investing
        </h3>

        <p className="mt-3 text-gray-600">
          Begin your journey towards financial freedom with confidence.
        </p>
      </div>

    </div>

  </div>
</section>

    {/* Final CTA Section */}

<section className="py-20 bg-[#0A2540]">
  <div className="max-w-6xl mx-auto px-5">

    <div className="bg-gradient-to-r from-[#0A2540] to-[#163B65] rounded-3xl p-12 text-center shadow-2xl border border-[#D4AF37]/20">

      <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37] text-[#0A2540] text-sm font-bold uppercase tracking-wider">
        Start Your Financial Journey
      </span>

      <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-white">
        Ready to Build Your Financial Future?
      </h2>

      <p className="mt-5 text-lg text-gray-300 max-w-3xl mx-auto">
        Whether you're planning for wealth creation, retirement,
        child education or financial protection, we're here to help
        you make confident financial decisions.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-5">

        <a
          href="/contact"
          className="px-8 py-4 rounded-2xl bg-[#D4AF37] text-[#0A2540] font-bold hover:opacity-90 transition"
        >
          📅 Book Free Consultation
        </a>

        <a
          href="https://wa.me/919490237465"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-2xl bg-brand-green text-white font-bold 
          hover:bg-brand-deepgreen transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          💬 Chat on WhatsApp
        </a>

      </div>

    </div>

  </div>
</section>

      {/* Trust & Security */}

<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-5">

    <div className="bg-[#F8FAFC] border border-gray-200 rounded-3xl p-10">

      <div className="grid md:grid-cols-3 gap-8">

        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>

          <h3 className="text-xl font-bold text-[#0A2540]">
            Secure & Confidential
          </h3>

          <p className="mt-3 text-gray-600">
            Your personal information is kept secure and confidential.
          </p>
        </div>

        <div className="text-center">
          <div className="text-5xl mb-4">🤝</div>

          <h3 className="text-xl font-bold text-[#0A2540]">
            Trusted Guidance
          </h3>

          <p className="mt-3 text-gray-600">
            We focus on helping you make informed financial decisions.
          </p>
        </div>

        <div className="text-center">
          <div className="text-5xl mb-4">⭐</div>

          <h3 className="text-xl font-bold text-[#0A2540]">
            Long-Term Support
          </h3>

          <p className="mt-3 text-gray-600">
            We aim to support your financial journey with ongoing guidance.
          </p>
        </div>

      </div>

    </div>

  </div>
</section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHeader eyebrow="Reach us" title="Multiple ways to connect" />
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <a href={`mailto:${BUSINESS_EMAIL}`} className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-2xl 
              hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300" data-testid="contact-email">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
                <Mail className="w-6 h-6" /></div>
                <div className="mt-3 text-xs uppercase tracking-wider text-brand-mute font-semibold">Email</div>
                <div className="font-display font-semibold text-brand-navy mt-1 break-all">{BUSINESS_EMAIL}</div>
              </a>
              <a
  href={whatsappLink()}
  target="_blank"
  rel="noreferrer"
  className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300"
>
  <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
    <MessageCircle className="w-6 h-6" />
  </div>

  <div className="mt-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
    WhatsApp
  </div>

  <div className="text-lg font-bold text-[#0A2540] mt-2">
    {WHATSAPP_NUMBER}
  </div>
</a>
              <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">

  <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
    <Phone className="w-6 h-6" />
  </div>

  <div className="mt-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
    Phone
  </div>

  <div className="text-lg font-bold text-[#0A2540] mt-2">
    {WHATSAPP_NUMBER}
  </div>

</div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
    <MapPin className="w-6 h-6" />
  </div>

  <div className="mt-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
    Office
  </div>

  <div className="text-lg font-bold text-[#0A2540] mt-2">
    Tirupati, Andhra Pradesh, India
  </div>

</div>
          
            <div className="mb-4">
  <h3 className="text-xl font-bold text-[#0A2540]">
    📍 Visit Our Office
  </h3>
  <p className="text-gray-600 mt-1">
    Tirupati, Andhra Pradesh, India
  </p>
</div>
            <div className="mt-8 rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
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

          <div 
          id="contact-form"
          className="rounded-3xl bg-white border border-gray-100 p-10 shadow-2xl 
            hover:shadow-3xl transition-all duration-500">
            <SectionHeader
  eyebrow="Get In Touch"
  title="Get Your Free Financial Consultation"
  description="Fill out the form and our financial planner will contact you within 1 hour."
  />
            <form
            onSubmit={submit}
            className="mt-8 grid gap-5"
            data-testid="contact-form"
            >
              <Field label="Name" required value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} 
              data-testid="contact-name" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Mobile" required value={f.mobile} onChange={(e)=>setF({...f, mobile:e.target.value})} data-testid="contact-mobile" />
                <Field label="Email" type="email" required value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} data-testid="contact-emailfield" />
                <Field
  label="City"
  required
  value={f.city}
  onChange={(e) => setF({ ...f, city: e.target.value })}
/>  
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Financial Goal</Label>
               
                <select
               value={f.financial_goal}
               onChange={(e) => setF({ ...f, financial_goal: e.target.value })}
               required
               className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 
               text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
              >
              <option value="">Select Your Financial Goal</option>
              <option value="Retirement Planning">Retirement Planning</option>
              <option value="Child Education">Child Education</option>
              <option value="Home Purchase">Home Purchase</option>
              <option value="Wealth Creation">Wealth Creation</option>
             <option value="Tax Saving">Tax Saving</option>
            <option value="Other">Other</option>
            </select>
              </div>
              <Button type="submit" disabled={loading} data-testid="contact-submit" 
              className="w-full h-14 rounded-xl bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 
              text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02]">
                {loading ? "Sending…" : "Book Free Consultation"}</Button>
            </form>
          </div>
        </div>
        </section>
        </div>
        </>
        );
        };

        export default Contact;
