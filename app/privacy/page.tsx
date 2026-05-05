import React from "react";
import { Sparkles, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | QuickCap AI",
  description: "Learn how QuickCap AI handles your data with privacy-first audio extraction and transcription.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#02040A] relative overflow-hidden selection:bg-violet-500/30">
      <div className="bg-mesh" />
      
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-lg mb-12 max-w-2xl leading-relaxed">
            At QuickCap AI, your privacy is our core priority. We've built our tools to be "Private by Design," ensuring your media stays under your control.
          </p>

          <div className="space-y-12">
            <section className="glass-premium p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Data Handling & Processing</h2>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  QuickCap AI employs a hybrid processing model to maximize privacy and efficiency:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Local Extraction:</strong> Video files never leave your device. Audio extraction is performed locally in your browser using FFmpeg.wasm.</li>
                  <li><strong className="text-white">Transcription:</strong> Only the extracted audio track is sent to our secure transcription partners (Groq/Whisper) to generate captions.</li>
                  <li><strong className="text-white">No Video Storage:</strong> We do not store, view, or process your original video files on our servers.</li>
                </ul>
              </div>
            </section>

            <section className="glass-premium p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Google AdSense Compliance</h2>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  To keep our service free, we use Google AdSense to serve advertisements. Google uses cookies to serve ads based on a user's prior visits to our website or other websites.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</li>
                  <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Ads Settings</a>.</li>
                </ul>
              </div>
            </section>

            <section className="glass-premium p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                We collect minimal data necessary for the operation of the service, including basic usage statistics (pages visited, processing time) which are anonymized and used solely to improve our AI models and user experience. We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="glass-premium p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Changes to This Policy</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              <p className="mt-4 text-slate-400 text-sm italic">Last Updated: May 4, 2026</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
