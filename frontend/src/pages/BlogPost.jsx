import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => { api.get(`/blogs/${slug}`).then(r => setPost(r.data)).catch(()=>setErr(true)); }, [slug]);
  if (err) return <div className="max-w-3xl mx-auto px-5 py-24 text-center text-brand-mute">Article not found. <Link to="/blog" className="text-brand-deepgreen font-semibold">Back to blog</Link></div>;
  if (!post) return <div className="max-w-3xl mx-auto px-5 py-24 text-center text-brand-mute">Loading…</div>;
  return (
    <article className="bg-white" data-testid="blog-post-page">
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
        <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-brand-deepgreen hover:underline"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        <div className="mt-6 text-xs tracking-[0.2em] uppercase font-bold text-brand-green">{post.category}</div>
        <h1 className="mt-3 font-display text-3xl md:text-5xl text-brand-navy font-semibold leading-tight">{post.title}</h1>
        <div className="mt-4 text-sm text-brand-mute">By {post.author} · {new Date(post.created_at).toLocaleDateString()}</div>
        {post.cover_image && <img src={post.cover_image} alt={post.title} className="mt-8 w-full rounded-2xl border border-brand-line" />}
        <div className="mt-8 whitespace-pre-line text-brand-ink leading-relaxed text-[15px]">{post.content}</div>
      </div>
    </article>
  );
};
export default BlogPost;
