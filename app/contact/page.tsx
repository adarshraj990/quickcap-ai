"use client";

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-mesh relative py-24 px-6">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="relative max-w-2xl mx-auto z-10 glass-premium rounded-3xl p-10 md:p-16 animate-fade-up border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-8">
          Contact Us
        </h1>
        
        <p className="text-slate-300 leading-relaxed text-lg font-medium mb-8">
          Have a question, feedback, or need support with QuickCap AI? Drop us a message below and we'll get back to you as soon as possible.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Name</label>
            <input 
              required
              type="text" 
              placeholder="Your name"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all shadow-inner placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Email</label>
            <input 
              required
              type="email" 
              placeholder="you@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all shadow-inner placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Message</label>
            <textarea 
              required
              rows={5}
              placeholder="How can we help?"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all shadow-inner resize-none placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-wow py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] mt-4 relative z-10"
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </button>
        </form>
      </div>
    </main>
  );
}
