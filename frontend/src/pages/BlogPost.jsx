import React from "react";
import { Link, useParams } from "react-router-dom";
import { BLOGS } from "../data/content";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

const BlogPost = () => {
  const { slug } = useParams();
  const post = BLOGS.find((b) => b.slug === slug);
  if (!post) return <div className="max-w-3xl mx-auto px-5 py-24 text-center text-brand-mute">Article not found. <Link to="/blog" className="text-brand-deepgreen font-semibold">Back to blog</Link></div>;
  return (
    <article className="bg-white" data-testid="blog-post-page">
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover_image}
        schema={{ "@context":"https://schema.org","@type":"BlogPosting","headline":post.title,"description":post.excerpt,"image":post.cover_image,"author":{"@type":"Organization","name":post.author||"Fortune U Team"},"datePublished":post.created_at,"dateModified":post.updated_at||post.created_at }}
      />
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
        <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-brand-deepgreen hover:underline"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        <div className="mt-6 text-xs tracking-[0.2em] uppercase font-bold text-brand-green">{post.category}</div>
        <h1 className="mt-3 font-display text-3xl md:text-5xl text-brand-navy font-semibold leading-tight">{post.title}</h1>
        <div className="mt-4 text-sm text-brand-mute">By {post.author} · {new Date(post.created_at).toLocaleDateString()}</div>
        {post.cover_image && <img src={post.cover_image} alt={post.title} className="mt-8 w-full rounded-2xl border border-brand-line" />}
        <div className="mt-8 prose prose-sm md:prose-base max-w-none [&_img]:rounded-xl [&_img]:my-4 [&_h2]:font-display [&_h2]:text-brand-navy [&_h3]:font-display [&_blockquote]:border-l-4 [&_blockquote]:border-brand-green [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-brand-deepgreen [&_a]:underline whitespace-pre-line text-brand-ink leading-relaxed text-[15px]" dangerouslySetInnerHTML={{__html: post.content}} />
      </div>
    </article>
  );
};
export default BlogPost;
