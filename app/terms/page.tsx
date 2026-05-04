import React from "react";
import { Gavel, CheckCircle, AlertTriangle, Scale } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | QuickCap AI",
  description: "Read the terms and conditions for using QuickCap AI services.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#080A11] relative overflow-hidden">
      <div className="bg-mesh" />
      
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Terms & <span className="text-gradient">Conditions</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-lg mb-12 max-w-2xl leading-relaxed">
            By accessing QuickCap AI, you agree to be bound by these terms. Please read them carefully to understand your rights and responsibilities.
          </p>

          <div className="space-y-12">
            <section className="glass-premium p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">1. Use of Service</h2>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  QuickCap AI provides AI-powered transcription and captioning tools. You are granted a non-exclusive, non-transferable, revocable license to access and use the service strictly in accordance with these terms.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must be at least 13 years of age to use this service.</li>
                  <li>You are responsible for any content you upload and must have the legal right to process said content.</li>
                  <li>The service is provided for individual or commercial use, subject to fair usage limits.</li>
                </ul>
              </div>
            </section>

            <section className="glass-premium p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">2. Prohibited Content</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                You agree not to use the service to process any content that:
                <br />- Is illegal, harmful, or promotes discrimination.
                <br />- Infringes upon any third-party intellectual property rights.
                <br />- Contains malware, viruses, or any other destructive code.
              </p>
            </section>

            <section className="glass-premium p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">3. Limitation of Liability</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                QuickCap AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We do not guarantee 100% accuracy in AI-generated captions.
              </p>
            </section>

            <section className="glass-premium p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                  <Gavel className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">4. Governing Law</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                These terms shall be governed and construed in accordance with the laws of the jurisdiction in which the service operator resides, without regard to its conflict of law provisions.
              </p>
              <p className="mt-4 text-slate-400 text-sm italic">Last Updated: May 4, 2026</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
