import React from 'react';

export const metadata = {
  title: 'Privacy Policy | QuickCap AI',
  description: 'Read the privacy policy for QuickCap AI. We prioritize your data security by processing videos locally.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen relative py-24 px-6">
      <div className="bg-mesh" />
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />
      <div className="relative max-w-4xl mx-auto z-10 glass-premium rounded-3xl p-10 md:p-16 animate-fade-up border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-8">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed text-base font-medium">
          <p>Last updated: May 2026</p>
          
          <p>
            At <strong>QuickCap AI</strong>, your privacy is our highest priority. This Privacy Policy outlines how we handle information when you use our website and services.
          </p>
          
          <h2 className="text-2xl font-bold text-white pt-4">1. Local Processing (Privacy First)</h2>
          <p>
            QuickCap AI is designed from the ground up to protect your data. When you upload a video for captioning, the video file <strong>never leaves your device</strong>. We use WebAssembly (FFmpeg) to extract the audio track entirely within your browser. Only the compressed audio track is sent to our AI service (Groq Cloud) for transcription. We do not store, view, or retain your video or audio files.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. Data Collection</h2>
          <p>
            We collect minimal information necessary to operate the service. This may include basic web analytics (such as IP address, browser type, and usage patterns) to improve our platform. If you contact us, we may retain your email address for correspondence.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Third-Party Services</h2>
          <p>
            We use third-party APIs (such as Groq for AI transcription) to power our service. The audio data sent to these APIs is used strictly for generating captions and is not used for model training or retained permanently by us. We may also use third-party advertising networks to support our platform, which may use cookies to serve personalized ads based on your browsing history.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Cookies</h2>
          <p>
            Our website may use "cookies" to enhance user experience and serve relevant advertisements. You can choose to set your web browser to refuse cookies or to alert you when cookies are being sent.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">5. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </div>
      </div>
    </main>
  );
}
