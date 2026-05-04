import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Blog | QuickCap AI",
  description: "Stay ahead of the curve with latest tips on video marketing, AI captions, and creator growth.",
};

const POSTS = [
  {
    slug: "importance-of-captions-2026",
    title: "The Importance of Captions in Social Media Marketing 2026",
    excerpt: "Why captions are no longer optional for brands and creators looking to dominate the 2026 social landscape.",
    date: "May 4, 2026",
    readTime: "6 min read",
    category: "Marketing"
  },
  {
    slug: "short-form-content-accessibility",
    title: "How to Make Your Short-Form Content Accessible with AI Subtitles",
    excerpt: "Inclusion is the new viral strategy. Learn how to reach every viewer with automated accessibility.",
    date: "May 3, 2026",
    readTime: "5 min read",
    category: "Accessibility"
  },
  {
    slug: "top-7-tools-mobile-creators",
    title: "Top 7 Tools Every Mobile Content Creator Needs",
    excerpt: "From lighting to AI captioning, here are the essential tools to level up your mobile production.",
    date: "May 2, 2026",
    readTime: "7 min read",
    category: "Tools"
  },
  {
    slug: "audio-to-text-ai-revolution",
    title: "Why Audio-to-Text AI is Revolutionizing Video Editing",
    excerpt: "Discover how lightning-fast transcription is changing the way we edit video forever.",
    date: "May 1, 2026",
    readTime: "6 min read",
    category: "Technology"
  },
  {
    slug: "viral-reels-on-screen-text",
    title: "Simple Tips to Make Your Reels Go Viral with On-Screen Text",
    excerpt: "Master the art of the 'visual hook' and keep your viewers glued to the screen with strategic text.",
    date: "April 30, 2026",
    readTime: "5 min read",
    category: "Strategy"
  }
];

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-[#080A11] relative overflow-hidden text-white">
      <div className="bg-mesh" />
      
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <header className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" />
            QuickCap Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">The Creator <span className="text-gradient">Blog</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Master the art of video creation with our latest insights on AI captions, marketing trends, and production tools.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post, i) => (
            <article key={i} className="glass-premium rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col group hover:border-violet-500/30 transition-all">
              <div className="p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">{post.category}</span>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 leading-tight group-hover:text-violet-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>
              <div className="px-8 pb-8 mt-auto">
                 <Link 
                   href={`/blog/${post.slug}`}
                   className="flex items-center gap-2 text-white font-bold text-sm group/btn"
                 >
                   Read Full Article 
                   <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </article>
          ))}
        </div>

        {/* AdSense Placement Reminder */}
        <div className="mt-20 p-8 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center text-slate-500 text-sm">
          [ AdSense Placement - Automatic Ads ]
        </div>
      </main>
    </div>
  );
}
