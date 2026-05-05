import React from "react";
import { Clock, Calendar, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Simple Tips to Make Your Reels Go Viral with On-Screen Text | QuickCap",
  description: "Master the art of the 'visual hook' and keep your viewers glued to the screen with strategic text.",
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-[#02040A] text-white selection:bg-violet-500/30">
      <div className="bg-mesh" />
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
        <article className="animate-fade-up">
          <header className="mb-12">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-violet-400 mb-6">
              <span>Strategy</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>April 30, 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
              Simple Tips to Make Your Reels Go <span className="text-gradient">Viral</span> with On-Screen Text
            </h1>
          </header>

          <div className="prose prose-invert prose-lg max-w-none space-y-8 text-slate-300 leading-relaxed">
            <p>
              On-screen text is the secret weapon of the world's most successful short-form creators. In 2026, text isn't just for accessibility—it's for storytelling and hook-retention.
            </p>
            
            <h2 className="text-3xl font-black text-white pt-8 border-t border-white/5">The 3-Second Hook</h2>
            <p>
              You have exactly 3 seconds to catch a viewer's attention. Large, bold on-screen text that summarizes the video's value is the most effective way to stop the scroll.
            </p>

            <h2 className="text-3xl font-black text-white pt-8">Strategic Emphasis</h2>
            <p>
              Don't just show captions; emphasize key words. Using **AI captions** that automatically highlight important phrases helps guide the viewer's eye and reinforces your core message.
            </p>

            <h2 className="text-3xl font-black text-white pt-8">Color Contrast</h2>
            <p>
              Ensure your text pops. High-contrast colors (like yellow on dark backgrounds or white with black shadows) ensure that your **video transcription** is readable even on small, bright mobile screens.
            </p>

            <h2 className="text-3xl font-black text-white pt-8">Conclusion</h2>
            <p>
              On-screen text is the bridge between a casual viewer and a dedicated follower. By implementing these simple tips and using tools like QuickCap AI to automate the boring parts, you'll be well on your way to dominating the Reels and Shorts feeds in 2026.
            </p>
          </div>
          <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <Link href="/" className="btn-wow px-8 py-4 rounded-2xl font-black text-sm">Start Your Viral Journey</Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
