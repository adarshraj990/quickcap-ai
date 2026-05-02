"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Download, Copy, Check, Clock, Music } from "lucide-react";
import { type Segment, segmentsToSrt, downloadFile, secondsToSrtTimestamp, formatDuration } from "@/lib/utils";

interface CaptionListProps {
  segments: Segment[];
  mediaFile: File;
  onUpdateSegments: (segments: Segment[]) => void;
}

export function CaptionList({ segments, mediaFile, onUpdateSegments }: CaptionListProps) {
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const videoUrl = useMemo(() => URL.createObjectURL(mediaFile), [mediaFile]);
  const isAudio = mediaFile.type.startsWith("audio/");

  useEffect(() => {
    return () => URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  const activeSegmentIndex = segments.findIndex(
    (s) => currentTime >= s.start && currentTime <= s.end
  );

  useEffect(() => {
    if (activeSegmentIndex !== -1 && listRef.current) {
      const activeEl = document.getElementById(`caption-row-${activeSegmentIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeSegmentIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDownloadSrt = () => {
    const srtContent = segmentsToSrt(segments);
    const cleanBaseName = mediaFile.name.replace(/\.[^/.]+$/, "").replace(/[\\/:*?"<>|]/g, "_");
    downloadFile(srtContent, `${cleanBaseName}.srt`, "text/srt");
  };

  const handleCopyAll = async () => {
    const text = segments.map((s) => s.text.trim()).join(" ");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextChange = (id: number, newText: string) => {
    const updated = segments.map((s) => (s.id === id ? { ...s, text: newText } : s));
    onUpdateSegments(updated);
  };

  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play().catch(() => {});
    }
  };

  const totalDuration = segments.length > 0 ? segments[segments.length - 1].end : 0;

  return (
    <div className="w-full space-y-6">
      
      {/* Media Player */}
      <div className="rounded-3xl overflow-hidden bg-slate-900 border border-white/10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {isAudio ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-float mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
               <Music className="w-12 h-12 text-cyan-400" />
            </div>
            <div className="text-center mb-10 relative z-10">
              <p className="text-lg font-black text-white tracking-tight">{mediaFile.name}</p>
              <p className="text-xs font-bold text-cyan-400/70 uppercase tracking-[0.3em] mt-2">Audio Processing Mode</p>
            </div>
            <audio
              ref={videoRef as any}
              src={videoUrl}
              controls
              className="w-full max-w-xl h-10 opacity-80 hover:opacity-100 transition-opacity z-10"
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-auto max-h-[400px] object-contain"
            onTimeUpdate={handleTimeUpdate}
          />
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-2xl font-black text-white">
            QuickCap AI Results
          </h2>
          <div className="flex items-center gap-3 mt-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span>{segments.length} segments</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              {formatDuration(totalDuration)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAll}
            className="btn-glass flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Text
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSrt}
            className="btn-wow flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider"
          >
            <Download className="w-4 h-4" /> Download .srt
          </button>
        </div>
      </div>

      {/* Caption rows */}
      <div
        ref={listRef}
        className="glass-premium rounded-3xl overflow-y-auto max-h-[450px] scroll-smooth"
      >
        <div className="sticky top-0 z-10 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" /> Live Editor Enabled
        </div>
        
        {segments.map((segment, index) => {
          const isActive = index === activeSegmentIndex;
          
          return (
            <div
              key={segment.id ?? index}
              id={`caption-row-${index}`}
              className={`flex gap-5 px-6 py-5 items-start transition-all duration-300 border-b border-white/5 last:border-b-0
                ${isActive ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 shadow-inner" : "hover:bg-white/5"}
              `}
            >
              {/* Index */}
              <span className={`text-xs font-black w-6 pt-1.5 flex-shrink-0 text-right ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400" : "text-slate-600"}`}>
                {index + 1}
              </span>

              {/* Timestamp */}
              <div className="flex-shrink-0 pt-1">
                <button
                  onClick={() => jumpToTime(segment.start)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all border
                    ${isActive 
                      ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]" 
                      : "bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700"}
                  `}
                  title="Jump to time"
                >
                  {secondsToSrtTimestamp(segment.start).split(",")[0]}
                </button>
              </div>

              {/* Text (Editable) */}
              <textarea
                className={`text-base leading-relaxed flex-1 bg-transparent border-none focus:ring-0 resize-none p-0 focus:outline-none placeholder:opacity-50 transition-colors
                  ${isActive ? "text-white font-bold" : "text-slate-300 font-medium"}
                `}
                value={segment.text}
                onChange={(e) => handleTextChange(segment.id, e.target.value)}
                rows={Math.max(1, Math.ceil(segment.text.length / 50))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
