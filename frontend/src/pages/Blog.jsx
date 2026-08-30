import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BLOGS } from "../data/content";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Search, ArrowUpRight, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";
import { useLang } from "../context/LangContext";

const categories = ["All", "Mutual Funds", "SIP Investing", "Retirement Planning", "Personal Finance", "Health Insurance", "Term Insurance", "Financial Education"];

const faqs = [
  { q: "What is SIP?", a: "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds. It uses compounding and rupee-cost averaging to build long-term wealth." },
  { q: "Why is Health Insurance important?", a: "It protects your family from high medical expenses and keeps your savings and long-term goals safe." },
  { q: "Do you charge a planning fee?", a: "No. We are paid commission by insurers and (after ARN) AMCs. We do not charge a fee for advisory services and we are not a SEBI-registered Investment Adviser." },
  { q: "How do I contact Fortune U Group?", a: "You can reach us through the Contact page, WhatsApp or a phone call. Most queries are answered within 4 working hours." },
];

const testimonials = [
  { name: "Ramesh Kumar", location: "Tirupati", text: "Started SIP planning for my daughter's education. Excellent guidance and regular portfolio reviews." },
  { name: "Suresh Babu", location: "Visakhapatnam", text: "Very transparent financial planning. Helped us build a long-term wealth creation strategy." },
  { name: "Lakshmi Devi", location: "Hyderabad", text: "Best Mutual Fund and Insurance consultation. Highly recommended for families." },
];

const Blog = () => {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLang();

  const filtered = useMemo(() => {
    return BLOGS.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (q && !(p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [cat, q]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
  };

  return (
    <div data-testid="blog-page" className="bg-brand-bg">
      <SEO
        title="Investment & Financial Planning Blog | Fortune U Group"
        description="Read articles on SIP investments, mutual funds, retirement planning, tax saving and insurance from Fortune U Group."
        path="/blog"
      />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0A1931] via-[#123B6D] to-[#0A1931] py-20">
        <div className="absolute inset-0">
          <img
            src="/images/blog-hero.webp"
            alt="Financial planning"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              Fortune U Group Blog
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-yellow-300 via-yellow-400 to-white bg-clip-text text-transparent">
              Learn. Invest. Grow.
            </h1>

            <p className="text-gray-200 text-lg md:text-xl mt-6 leading-relaxed">
              Financial education, mutual funds, SIP planning, retirement and
              insurance — written in plain language for Indian families.
            </p>

            <div className="mt-10 flex items-center gap-2 bg-white rounded-full overflow-hidden shadow-2xl max-w-xl px-4">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("blog.search")}
                className="flex-1 py-4 outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTERS + ARTICLES ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap gap-2" data-testid="blog-categories">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} data-testid={`cat-${c}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${cat === c ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-brand-mute border-brand-line hover:border-brand-green hover:text-brand-deepgreen"}`}>
                {c}
              </button>
            ))}
          </div>

          {featured && (
            <Link to={`/blog/${featured.slug}`} className="block mt-10 group" data-testid="blog-featured">
              <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 grid lg:grid-cols-2">
                <img src={featured.cover_image || "https://images.unsplash.com/photo-1647510283846-ed174cc84a78?crop=entropy&cs=srgb&fm=jpg&q=85"} alt={featured.title} className="w-full h-72 lg:h-full object-cover" />
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-green">{featured.category}</span>
                  <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold text-brand-navy group-hover:text-brand-deepgreen transition">{featured.title}</h2>
                  <p className="mt-3 text-brand-mute leading-relaxed">{featured.excerpt}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-brand-deepgreen">Read article <ArrowUpRight className="w-4 h-4 ml-1" /></span>
                </div>
              </Card>
            </Link>
          )}

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} data-testid={`blog-post-${p.id}`}>
                <Card className="overflow-hidden rounded-3xl border border-gray-200 h-full bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] transition-all duration-300">
                  <img src={p.cover_image || "https://images.unsplash.com/photo-1647510283846-ed174cc84a78?crop=entropy&cs=srgb&fm=jpg&q=85"} alt={p.title} className="w-full h-44 object-cover" />
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-green">{p.category}</span>
                    <h3 className="mt-3 text-xl font-bold text-[#0A2540] leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-brand-mute leading-relaxed line-clamp-3">{p.excerpt}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-brand-mute" data-testid="blog-empty">No articles match your search. Try another keyword.</div>
          )}
        </div>
      </section>

      {/* ================= STATS + CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-[#0A1931] via-[#123B6D] to-[#0A1931]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { number: "100+", label: "Families Guided" },
              { number: "6+", label: "Years Experience" },
              { number: "Goal-Based", label: "Financial Planning" },
              { number: "100%", label: "Transparent Guidance" },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 transition duration-300">
                <h3 className="text-4xl font-bold text-yellow-400">{item.number}</h3>
                <p className="text-white mt-3">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-[#0A1931]">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
              Get personalized guidance on SIP planning, financial planning,
              insurance and wealth creation from Fortune U Group.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">
              <a href="/contact" className="bg-[#0A1931] hover:bg-[#123B6D] text-white px-8 py-4 rounded-full font-semibold transition">
                Contact Us
              </a>
              <a
                href="https://wa.me/919490237465"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold transition"
              >
                WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS + FAQ ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A1931]">What Our Families Say</h2>
            <p className="text-gray-600 mt-3">Real feedback from families we work with.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
                <div className="text-yellow-500 text-2xl mb-3">★★★★★</div>
                <p className="text-gray-600">"{item.text}"</p>
                <div className="mt-6">
                  <h4 className="font-bold text-[#0A1931]">{item.name}</h4>
                  <span className="text-sm text-gray-500">{item.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-[#0A1931] mb-12">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-white rounded-2xl shadow-md p-6 group">
                  <summary className="cursor-pointer font-semibold text-lg text-[#0A1931]">{faq.q}</summary>
                  <p className="mt-4 text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-24 max-w-2xl mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-[#0A1931]">Subscribe to our newsletter</h3>
            <p className="mt-2 text-gray-800">Get plain-language financial tips in your inbox.</p>
            {subscribed ? (
              <p className="mt-6 flex items-center gap-2 font-semibold text-[#0A1931]">
                <CheckCircle2 className="w-5 h-5" /> Thank you! You're on the list.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-6 flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl px-4 py-3"
                />
                <button className="bg-[#0A1931] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#123B6D] transition">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
