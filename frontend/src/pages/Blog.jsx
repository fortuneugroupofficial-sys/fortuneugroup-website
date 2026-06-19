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
      <SEO title="Blog · Investor Education" description="Articles on Mutual Funds, SIP investing, Retirement Planning, Health & Term Insurance and Personal Finance — written for Indian investors." path="/blog" />
      <section className="bg-white border-b border-brand-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-24">
          <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">{t("blog.eyebrow")}</div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-brand-navy font-semibold leading-tight max-w-3xl">{t("blog.title")}</h1>
          <div className="mt-8 max-w-xl relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-brand-mute" />
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder={t("blog.search")} className="pl-9 bg-brand-soft/40 border-brand-line h-11 focus-visible:ring-brand-green" data-testid="blog-search" />
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
              <Card className="overflow-hidden border-brand-line bg-white grid lg:grid-cols-2">
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
                <Card className="overflow-hidden border-brand-line h-full bg-white hover:-translate-y-1 hover:shadow-soft transition-all">
                  <img src={p.cover_image || "https://images.unsplash.com/photo-1647510283846-ed174cc84a78?crop=entropy&cs=srgb&fm=jpg&q=85"} alt={p.title} className="w-full h-44 object-cover" />
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-green">{p.category}</span>
                    <h3 className="mt-2 font-display text-lg text-brand-navy font-semibold leading-snug">{p.title}</h3>
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
