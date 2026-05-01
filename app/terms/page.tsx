import React from 'react';

export const metadata = {
  title: 'Terms of Service | QuickCap AI',
  description: 'Read the terms of service for using QuickCap AI.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-mesh relative py-24 px-6">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto z-10 glass-premium rounded-3xl p-10 md:p-16 animate-fade-up border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-8">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed text-base font-medium">
          <p>Last updated: May 2026</p>
          
          <p>
            By accessing and using <strong>QuickCap AI</strong>, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-bold text-white pt-4">1. Use of Service</h2>
          <p>
            QuickCap AI provides a browser-based tool for generating captions for video files. The service is provided "as is" and "as available". We do not guarantee that the service will be uninterrupted or error-free.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. User Responsibilities</h2>
          <p>
            You are solely responsible for the content you process using our tool. You agree not to use QuickCap AI to process illicit, illegal, or highly sensitive content. Although we do not store your videos, you must have the legal right to process the media you upload.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of QuickCap AI and its licensors.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Advertising and Third Links</h2>
          <p>
            Our service may contain links to third-party web sites or services that are not owned or controlled by QuickCap AI. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services. We may display advertisements on the platform to maintain the service.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">5. Limitation of Liability</h2>
          <p>
            In no event shall QuickCap AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </div>
      </div>
    </main>
  );
}
