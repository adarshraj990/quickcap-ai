import React from 'react';

export const metadata = {
  title: 'About Us | QuickCap AI',
  description: 'Learn more about QuickCap AI, the blazing-fast auto-captioning engine running right in your browser.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-mesh relative py-24 px-6">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto z-10 glass-premium rounded-3xl p-10 md:p-16 animate-fade-up border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-8">
          About QuickCap AI
        </h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed text-lg font-medium">
          <p>
            Welcome to <strong className="text-white">QuickCap AI</strong>, the world's most accessible, privacy-first video captioning tool. We believe that professional-grade video captions shouldn't require expensive subscriptions or uploading your private data to cloud servers.
          </p>
          
          <h2 className="text-2xl font-bold text-white pt-4">Our Mission</h2>
          <p>
            Our mission is simple: To provide creators, businesses, and educators with lightning-fast, highly accurate video captions in multiple languages—completely free of server costs. We leverage cutting-edge WebAssembly technology to process your videos directly inside your browser.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">How It Works</h2>
          <p>
            We use <strong className="text-cyan-400">FFmpeg.wasm</strong> to extract audio from your video locally. Only this tiny, compressed audio footprint is securely passed to our powerful <strong className="text-pink-400">Llama 3 AI Engine</strong> for lightning-fast transcription and translation. Your video file never leaves your computer.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Privacy First:</strong> Your video files stay on your device.</li>
            <li><strong>Zero Server Costs:</strong> By processing locally, we eliminate massive cloud compute bills.</li>
            <li><strong>Global Reach:</strong> Over 100 languages supported, including native Hinglish Romanization.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
