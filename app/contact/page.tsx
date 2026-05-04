import React from "react";
import { Mail, MessageSquare, Globe, Send, Sparkles } from "lucide-react";

export const metadata = {
  title: "Contact Us | QuickCap AI",
  description: "Get in touch with the QuickCap AI team for support, feedback, or business inquiries.",
};

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#080A11] relative overflow-hidden text-white">
      <div className="bg-mesh" />
      
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 animate-fade-up">
          
          {/* Left Column: Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Get in <span className="text-gradient">Touch</span>
              </h1>
            </div>
            
            <p className="text-slate-400 text-lg mb-12 max-w-md leading-relaxed">
              Have questions about QuickCap AI? Whether it's a technical issue, feedback, or a business proposal, we're here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-violet-500/50 transition-colors">
                  <Mail className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Email Support</h3>
                  <p className="text-slate-400 mb-2">Typically responds within 24 hours.</p>
                  <a href="mailto:support@quickcap.ai" className="text-violet-400 font-medium hover:underline text-lg">
                    support@quickcap.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-pink-500/50 transition-colors">
                  <MessageSquare className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Social Media</h3>
                  <p className="text-slate-400 mb-2">Follow us for updates and tips.</p>
                  <div className="flex gap-4">
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">LinkedIn</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                  <Globe className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Global Presence</h3>
                  <p className="text-slate-400">Available worldwide, powered by decentralized AI processing.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="glass-premium p-8 md:p-10 rounded-[2.5rem]">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              Send a Message <Sparkles className="w-5 h-5 text-violet-400" />
            </h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              <button 
                type="submit"
                onClick={(e) => e.preventDefault()}
                className="w-full btn-wow py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
