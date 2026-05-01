"use client";

import React from "react";

interface ProgressBarProps {
  label: string;
  progress: number;
  color?: "primary" | "secondary" | "success";
  message?: string;
}

const colorMap = {
  primary: "from-violet-500 via-fuchsia-500 to-pink-500",
  secondary: "from-cyan-400 via-blue-500 to-indigo-500",
  success: "from-emerald-400 via-green-400 to-teal-400",
};

export function ProgressBar({ label, progress, color = "primary", message }: ProgressBarProps) {
  const gradient = colorMap[color];
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-slate-200 tracking-wide">
          {label}
        </span>
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          {clampedProgress}%
        </span>
      </div>

      <div className="w-full h-3 rounded-full overflow-hidden bg-slate-900/50 border border-white/5 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} progress-shimmer transition-all duration-500 ease-out relative`}
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>

      {message && (
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 animate-fade-up">
          {message}
        </p>
      )}
    </div>
  );
}
