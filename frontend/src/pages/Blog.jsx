import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BLOGS } from "../data/content";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Search, ArrowUpRight } from "lucide-react";
import SEO from "../components/SEO";
import { useLang } from "../context/LangContext";

const categories = ["All", "Mutual Funds", "SIP Investing", "Retirement Planning", "Personal Finance", "Health Insurance", "Term Insurance", "Financial Education"];

const Blog = () => {
  const [posts] = useState(BLOGS);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { t } = useLang();

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (cat !== "All" && p.category !== cat) return false;
      if (q && !(p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [posts, cat, q]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div data-testid="blog-page" className="bg-brand-bg">
      <SEO
  title="Investment & Financial Planning Blog | Fortune U Group"
  description="Read expert articles on Mutual Funds, SIP Investments, Retirement Planning, Tax Saving, Insurance and Wealth Creation strategies."
  path="/blog"
   />
      {/* ================= HERO SECTION ================= */}

<section className="relative overflow-hidden bg-gradient-to-r from-[#0A1931] via-[#123B6D] to-[#0A1931] py-20">

  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/images/blog-hero.webp"
      alt="Financial Advisor"
      className="w-full h-full object-cover opacity-20"
    />
  </div>

  <div className="relative max-w-7xl mx-auto px-6">

    <div className="max-w-3xl">

      <span className="inline-block bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-5">
        Fortune U Group Blog
      </span>

      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-yellow-300 via-yellow-400 to-white bg-clip-text text-transparent">
        Learn.
        <span className="animate-pulse"> Invest.</span>
        <span className="animate-bounce inline-block"> Grow.</span>
      </h1>

      <p className="text-gray-200 text-xl mt-6 leading-relaxed">
        Financial Education, Mutual Funds, Insurance,
        Credit Cards, Loans & Wealth Creation Tips.
      </p>

      {/* Search Bar */}

      <div className="mt-10 flex bg-white rounded-full overflow-hidden shadow-2xl max-w-xl">

        <input
          type="text"
          placeholder="Search articles..."
          className="flex-1 px-6 py-4 outline-none text-gray-700"
        />

        <button className="bg-yellow-500 hover:bg-yellow-600 px-6 text-white text-xl">
          🔍
        </button>

      </div>

      {/* Popular Topics */}

      <div className="flex flex-wrap gap-3 mt-8">

        {[
          "SIP",
          "Mutual Funds",
          "Insurance",
          "Credit Cards",
          "Home Loan",
          "Personal Loan",
          "Tax Saving",
          "Investment"
        ].map((topic) => (

          <span
            key={topic}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition duration-300 cursor-pointer"
          >
            #{topic}
          </span>

        ))}

      </div>

    </div>

  </div>

</section>

       {/* ================= FEATURED BLOGS ================= */}

<section className="py-20 bg-gray-50">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-14">

      <h2 className="text-4xl font-bold text-[#0A1931]">
        Featured Articles
      </h2>

      <p className="text-gray-600 mt-4">
        Learn Smart. Invest Better. Build Wealth.
      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        {
          title: "Beginner's Guide to SIP",
          image: "/images/blog1.png",
          category: "Investment",
          date: "June 2026"
        },
        {
          title: "Best Health Insurance Plans",
          image: "/images/blog2.png",
          category: "Insurance",
          date: "June 2026"
        },
        {
          title: "How to Choose a Credit Card",
          image: "/images/blog3.png",
          category: "Banking",
          date: "June 2026"
        }
      ].map((post, index) => (

        <div
          key={index}
          className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >

          <img
            src={post.image}
            alt={post.title}
            className="w-full h-56 object-cover"
          />

          <div className="p-6">

            <span className="text-sm text-yellow-600 font-semibold">
              {post.category}
            </span>

            <div className="flex items-center justify-between text-sm text-gray-500 mt-4">

            <span>📅 June 2026</span>

            <span>⏱️ 5 min read</span>

             </div>

            <p className="text-gray-500 mt-3">
              {post.date}
            </p>

            <button className="mt-6 text-yellow-600 font-semibold hover:text-yellow-700">
              Read More →
              <div className="flex gap-3 mt-5">

  <button className="w-10 h-10 rounded-full bg-blue-600 text-white hover:scale-110 transition">
    f
  </button>

  <button className="w-10 h-10 rounded-full bg-sky-500 text-white hover:scale-110 transition">
    X
  </button>

  <button className="w-10 h-10 rounded-full bg-green-500 text-white hover:scale-110 transition">
    WA
  </button>

  <button className="w-10 h-10 rounded-full bg-blue-500 text-white hover:scale-110 transition">
    in
  </button>

</div>
            </button>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

     {/* ================= TRENDING + NEWSLETTER ================= */}

<section className="py-20 bg-white">

  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">

    {/* Trending Articles */}

    <div className="lg:col-span-2">

      <h2 className="text-3xl font-bold text-[#0A1931] mb-8">
        🔥 Trending Articles
      </h2>

      {[
        "Top 10 Mutual Fund Investment Tips",
        "Best Term Insurance Plans 2026",
        "How to Improve Your Credit Score",
        "Personal Loan vs Home Loan",
        "Tax Saving Investment Guide"
      ].map((item, index) => (

        <div
          key={index}
          className="mb-5 bg-gray-50 rounded-2xl p-5 hover:bg-yellow-50 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <h3 className="font-semibold text-lg text-[#0A1931]">
            {item}
          </h3>
        </div>

      ))}

    </div>

    {/* Sidebar */}

    <div className="space-y-8">

      {/* Categories */}

      <div className="bg-[#0A1931] text-white rounded-3xl p-8">

        <h3 className="text-2xl font-bold mb-6">
          Categories
        </h3>

        <div className="flex flex-wrap gap-3">

          {[
            "SIP",
            "Mutual Funds",
            "Insurance",
            "Loans",
            "Credit Cards",
            "Tax Saving",
            "Investment",
            "Financial Planning"
          ].map((cat) => (

            <span
              key={cat}
              className="bg-white/10 hover:bg-yellow-500 hover:text-black px-4 py-2 rounded-full transition cursor-pointer"
            >
              {cat}
            </span>

          ))}

        </div>

      </div>

      {/* Newsletter */}

      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8">

        <h3 className="text-2xl font-bold text-[#0A1931]">
          Subscribe Newsletter
        </h3>

        <p className="mt-3 text-gray-800">
          Get the latest financial tips directly to your inbox.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="mt-6 w-full rounded-xl px-4 py-3 outline-none"
        />

        <button className="mt-5 w-full bg-[#0A1931] text-white py-3 rounded-xl hover:bg-[#123B6D] transition">
          Subscribe
        </button>

      </div>

    </div>

  </div>

</section>

       {/* ================= STATS + CTA ================= */}

<section className="py-20 bg-gradient-to-r from-[#0A1931] via-[#123B6D] to-[#0A1931]">

  <div className="max-w-7xl mx-auto px-6">

    {/* Statistics */}

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">

      {[
        { number: "100+", label: "Happy Clients" },
        { number: "50+", label: "Financial Articles" },
        { number: "₹10+ Cr", label: "Assets Guided" },
        { number: "98%", label: "Client Satisfaction" },
      ].map((item, index) => (

        <div
          key={index}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 transition duration-300"
        >

          <h3 className="text-4xl font-bold text-yellow-400">
            {item.number}
          </h3>

          <p className="text-white mt-3">
            {item.label}
          </p>

        </div>

      ))}

    </div>

    {/* CTA */}

    <div className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-2xl">

      <h2 className="text-4xl font-bold text-[#0A1931]">
        Ready to Start Your Financial Journey?
      </h2>

      <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
        Get personalized guidance on Mutual Funds, Insurance,
        Loans, Credit Cards and Wealth Creation from Fortune U Group.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

        <a
          href="/contact"
          className="bg-[#0A1931] hover:bg-[#123B6D] text-white px-8 py-4 rounded-full font-semibold transition"
        >
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

       {/* ================= FAQ + TESTIMONIALS ================= */}

<section className="py-20 bg-gray-50">

  <div className="max-w-7xl mx-auto px-6">

    {/* Testimonials */}

    <div className="text-center mb-16">

      <h2 className="text-4xl font-bold text-[#0A1931]">
        What Our Clients Say
      </h2>

      <p className="text-gray-600 mt-3">
        Trusted by thousands of families across India.
      </p>

    </div>

    <div className="grid md:grid-cols-3 gap-8">

      {[
        {
          name: "Ramesh Kumar",
          text: "Excellent financial guidance. Highly recommended."
        },
        {
          name: "Priya Sharma",
          text: "Helped me choose the best SIP and insurance plan."
        },
        {
          name: "Suresh Reddy",
          text: "Professional service with quick support."
        }
      ].map((item, index) => (

        <div
          key={index}
          className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition"
        >

          <div className="text-yellow-500 text-2xl mb-3">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="text-gray-600">
            "{item.text}"
          </p>

          <h4 className="mt-6 font-bold text-[#0A1931]">
            {item.name}
          </h4>

        </div>

      ))}

    </div>

    {/* FAQ */}

    <div className="mt-24">

      <h2 className="text-4xl font-bold text-center text-[#0A1931] mb-12">
        Frequently Asked Questions
      </h2>

      <div className="space-y-5">

        {[
          {
            q: "What is SIP?",
            a: "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds."
          },
          {
            q: "Why is Health Insurance important?",
            a: "It protects you from high medical expenses and provides financial security."
          },
          {
            q: "Can I apply for loans online?",
            a: "Yes. Fortune U Group helps you with Home, Personal and Business Loan applications."
          },
          {
            q: "How do I contact Fortune U Group?",
            a: "You can reach us through the Contact page or WhatsApp."
          }
        ].map((faq, index) => (

          <details
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 group"
          >

            <summary className="cursor-pointer font-semibold text-lg text-[#0A1931]">
              {faq.q}
            </summary>

            <p className="mt-4 text-gray-600">
              {faq.a}
            </p>

          </details>

        ))}

      </div>

    </div>

  </div>

</section>

{/* ================= SCROLL TO TOP ================= */}

<button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white w-14 h-14 rounded-full shadow-xl text-2xl transition"
>
  ↑
</button>

       {/* ================= BLOG FILTERS ================= */}

<section className="py-10 bg-white border-b">

  <div className="max-w-7xl mx-auto px-6">

    <div className="flex flex-wrap justify-center gap-4">

      {[
        "All",
        "Investment",
        "Mutual Funds",
        "Insurance",
        "Loans",
        "Credit Cards",
        "Tax Saving",
      ].map((item) => (

        <button
          key={item}
          className="px-6 py-3 rounded-full border border-[#0A1931] text-[#0A1931] hover:bg-[#0A1931] hover:text-white transition duration-300"
        >
          {item}
        </button>

      ))}

    </div>

  </div>

</section>
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap gap-2" data-testid="blog-categories">
            {categories.map((c) => (
              <button key={c} onClick={()=>setCat(c)} data-testid={`cat-${c}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${cat===c ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-brand-mute border-brand-line hover:border-brand-green hover:text-brand-deepgreen"}`}>
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
                    <h3 className="mt-3 text-xl font-bold text-[#0A2540] leading-snug hover:text-[#D4AF37] transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-brand-mute leading-relaxed line-clamp-3">{p.excerpt}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-brand-mute" data-testid="blog-empty">No articles yet. Check back soon.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
