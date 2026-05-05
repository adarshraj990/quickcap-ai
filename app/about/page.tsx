import React from "react";
import { Sparkles, ShieldCheck, Zap, Globe, Film, ChevronDown, HelpCircle, MessageSquare } from "lucide-react";

export const metadata = {
  title: "About Us | QuickCap AI",
  description: "Learn how QuickCap AI is revolutionizing subtitle generation for Reels and Shorts creators.",
};

const FAQS = [
  {
    q: "Is QuickCap AI free to use?",
    a: "Yes! QuickCap AI is currently free for all creators. We believe in providing accessible tools to help everyone create better content without high monthly fees."
  },
  {
    q: "How does the AI generate subtitles so fast?",
    a: "We use a hybrid approach: FFmpeg.wasm extracts audio directly in your browser, and Groq's high-speed Whisper AI transcribes it in milliseconds. This combination makes it faster than traditional cloud-only tools."
  },
  {
    q: "Is my video data safe?",
    a: "Absolutely. Your video files never leave your device. We only extract the audio track locally in your browser and send that small audio footprint for transcription. We never see or store your original video."
  },
  {
    q: "Which languages are supported?",
    a: "We support over 100 languages, including English, Hindi, Spanish, French, German, and specialized Hinglish (Romanized Hindi) for Indian creators."
  },
  {
    q: "Can I use it for YouTube Shorts and Instagram Reels?",
    a: "Yes! QuickCap is specifically designed with vertical content creators in mind. It's the perfect tool for 60-second high-engagement videos."
  },
  {
    q: "Do I need to download any software?",
    a: "Nope. QuickCap AI runs entirely in your web browser. No installation, no heavy software, and no system overhead."
  },
  {
    q: "Can I edit the generated captions?",
    a: "Yes, our interactive caption editor allows you to fix typos, adjust timing, and refine the text before you download the final file."
  },
  {
    q: "What file formats can I download?",
    a: "You can download your captions in industry-standard formats like .SRT and .VTT, which are compatible with Instagram, TikTok, YouTube, and Premiere Pro."
  },
  {
    q: "Is there a limit on video length?",
    a: "Currently, we are optimized for short-form content (under 2 minutes) to ensure the fastest processing speeds and best user experience."
  },
  {
    q: "How accurate is the transcription?",
    a: "Our AI model (Whisper) is state-of-the-art and offers over 95% accuracy for clear audio. It even understands different accents and slang commonly used in social media."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#02040A] relative overflow-hidden text-white selection:bg-violet-500/30">
      <div className="bg-mesh" />
      
      <main className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            Empowering Creators
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            The Future of <span className="text-gradient">Social Captions</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            QuickCap was born from a simple observation: manual subtitling for Reels and Shorts is slow, boring, and expensive. We built an AI engine that does it in seconds, for free.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
          <div className="glass-premium p-10 rounded-[2.5rem] animate-fade-up">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
              Our <span className="text-violet-400">Mission</span>
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                In the age of short-form video, captions aren't just an option—they're a requirement. Over 80% of users watch social videos on mute.
              </p>
              <p>
                QuickCap AI is designed to help creators bridge that gap. We focus on speed, privacy, and precision, allowing you to spend more time filming and less time typing.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Zap, title: "Instant", desc: "Captions in seconds" },
              { icon: ShieldCheck, title: "Private", desc: "Local processing" },
              { icon: Globe, title: "Global", desc: "100+ Languages" },
              { icon: Film, title: "Social", desc: "Optimized for Reels" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-violet-500/50 transition-colors group">
                <item.icon className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-4xl font-black">Got <span className="text-gradient">Questions?</span></h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="glass-premium p-8 rounded-3xl group hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                  <span className="text-violet-500 font-black">0{index + 1}.</span>
                  {faq.q}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-[3rem] p-12 border border-white/5">
          <h2 className="text-3xl font-black mb-4">Ready to reach more viewers?</h2>
          <p className="text-slate-400 mb-8">Join thousands of creators using QuickCap AI today.</p>
          <a href="/" className="btn-wow px-8 py-4 rounded-2xl font-black inline-flex items-center gap-2">
            Start Generating Now
            <Zap className="w-5 h-5 fill-white" />
          </a>
        </div>
      </main>
    </div>
  );
}
