"use client";

import React, { useCallback, useState, useRef } from "react";
import { UploadCloud, Film, X } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/mpeg"];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|avi|mkv|mpeg|ogv)$/i)) {
        setError("Unsupported format. Please upload MP4, WebM, MOV, or AVI.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large (${formatBytes(file.size)}). Max size is 500MB.`);
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [disabled, validateAndSelect]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-4">
      <div
        role="button"
        tabIndex={0}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
        className={`
          relative w-full rounded-3xl border-2 border-dashed p-10 
          flex flex-col items-center justify-center gap-5 cursor-pointer
          transition-all duration-500 overflow-hidden group
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01]"}
        `}
        style={{
          minHeight: "260px",
          borderColor: isDragging ? "var(--primary)" : "rgba(255,255,255,0.1)",
          background: isDragging ? "rgba(139, 92, 246, 0.05)" : "rgba(15, 23, 42, 0.3)",
          boxShadow: isDragging ? "0 0 40px rgba(139, 92, 246, 0.2) inset" : "none"
        }}
      >
        {/* Glowing background blob on hover */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4 animate-fade-up z-10">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-float">
              <Film className="w-10 h-10 text-fuchsia-400" />
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-white truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-sm text-slate-400 font-medium mt-1">{formatBytes(selectedFile.size)}</p>
            </div>
            {!disabled && (
              <button
                onClick={clearFile}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors mt-2"
              >
                <X className="w-3.5 h-3.5" /> REMOVE
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center z-10">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-white/5 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_rgba(6,182,212,0.2)]">
              <UploadCloud className="w-10 h-10 text-cyan-400 transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-2">Drop your video here</p>
              <p className="text-slate-400">or <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-bold hover:underline">browse files</span></p>
            </div>
            <div className="flex gap-2">
              {["MP4", "MOV", "WEBM"].map((fmt) => (
                <span key={fmt} className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}

        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={onInputChange} disabled={disabled} />
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-fade-up">
          <X className="w-5 h-5" /> {error}
        </div>
      )}
    </div>
  );
}
