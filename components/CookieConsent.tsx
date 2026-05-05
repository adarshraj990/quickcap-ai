"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
      <div className="bg-[#121622]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col md:flex-row items-center gap-6 pointer-events-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
          <Cookie className="w-6 h-6 text-violet-400" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-white font-bold text-lg mb-1">Cookie Consent</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies in accordance with UK GDPR.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-8 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-500/20"
          >
            Accept
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="hidden md:flex p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
