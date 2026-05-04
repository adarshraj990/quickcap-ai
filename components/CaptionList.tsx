"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Download, Copy, Check, Clock, Music, Film, FileText } from "lucide-react";
import { type Segment, segmentsToSrt, downloadFile, secondsToSrtTimestamp, formatDuration } from "@/lib/utils";

interface CaptionListProps {
  segments: Segment[];
  mediaFile: File;
  onUpdateSegments: (segments: Segment[]) => void;
  onReset?: () => void;
}

export function CaptionList({ segments, mediaFile, onUpdateSegments, onReset }: CaptionListProps) {
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

  return (
    <>
      {/* Video Preview Card */}
      <div className="bg-[#121622] border border-white/5 rounded-2xl p-6 h-[320px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-semibold text-white">Video Preview</h2>
          </div>
          <button 
            onClick={onReset}
            className="text-xs font-medium px-4 py-2 bg-[#1E2335] hover:bg-[#282F45] rounded-lg text-slate-300 transition-colors"
          >
            Change Video
          </button>
        </div>
        
        <div className="flex-1 border border-white/5 rounded-xl bg-[#090C15] overflow-hidden flex items-center justify-center relative">
          {isAudio ? (
            <div className="flex flex-col items-center justify-center w-full h-full relative group">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-4 group-hover:scale-110 transition-transform duration-500">
                 <Music className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-sm font-bold text-white tracking-tight mb-4">{mediaFile.name}</p>
              <audio
                ref={videoRef as any}
                src={videoUrl}
                controls
                className="w-full max-w-sm h-10 opacity-80 hover:opacity-100 transition-opacity z-10"
                onTimeUpdate={handleTimeUpdate}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
            />
          )}
        </div>
      </div>

      {/* Generated Captions Card */}
      <div className="bg-[#121622] border border-white/5 rounded-2xl p-6 flex-1 min-h-[400px] flex flex-col max-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-semibold text-white">Generated Captions</h2>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={handleCopyAll} className="px-4 py-2 bg-[#1E2335] hover:bg-[#282F45] rounded-lg text-xs font-semibold text-slate-300 transition-colors">
               {copied ? "Copied" : "Copy All"}
             </button>
             <button onClick={handleDownloadSrt} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]">
               <Download className="w-4 h-4" /> Download
             </button>
          </div>
        </div>
        
        <div 
          ref={listRef}
          className="flex-1 border border-white/5 rounded-xl bg-[#090C15] overflow-y-auto"
        >
          {segments.map((segment, index) => {
            const isActive = index === activeSegmentIndex;
            return (
              <div
                key={segment.id ?? index}
                id={`caption-row-${index}`}
                className={`flex gap-4 px-5 py-4 items-start transition-all border-b border-white/5 last:border-b-0
                  ${isActive ? "bg-violet-500/20 shadow-inner" : "hover:bg-white/5"}
                `}
              >
                {/* Timestamp */}
                <div className="flex-shrink-0 pt-0.5">
                  <button
                    onClick={() => jumpToTime(segment.start)}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    title="Jump to time"
                  >
                    {secondsToSrtTimestamp(segment.start).split(",")[0].slice(0,8)} - {secondsToSrtTimestamp(segment.end).split(",")[0].slice(0,8)}
                  </button>
                </div>

                {/* Text (Editable) */}
                <textarea
                  className={`text-sm leading-relaxed flex-1 bg-transparent border-none focus:ring-0 resize-none p-0 focus:outline-none placeholder:opacity-50 transition-colors
                    ${isActive ? "text-white font-medium" : "text-slate-300"}
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
    </>
  );
}

