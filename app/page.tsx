"use client";

import React, { useState, useCallback } from "react";
import {
  AlertCircle,
  Globe,
  Languages,
  Cpu,
  Sparkles,
  LayoutDashboard,
  FileText,
  Settings,
  Moon,
  HelpCircle,
  UploadCloud,
  Film,
  Download
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { ProgressBar } from "@/components/ProgressBar";
import { CaptionList } from "@/components/CaptionList";
import { extractAudioDynamic, CHUNK_DURATION } from "@/lib/ffmpeg-utils";
import { type Segment } from "@/lib/utils";

type AppState = "idle" | "extracting" | "transcribing" | "done" | "error";

interface ProgressState {
  stage: string;
  extractProgress: number;
  transcribeProgress: number;
}

const LANGUAGES = [
  { code: "auto", name: "English (Auto)" }, // matched from image default
  { code: "hinglish", name: "Hinglish (Romanized)" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (Devanagari)" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [isTranslateEnabled, setIsTranslateEnabled] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState>({
    stage: "",
    extractProgress: 0,
    transcribeProgress: 0,
  });

  const handleFileSelect = useCallback((file: File) => {
    setMediaFile(file);
    setError(null);
    setSegments([]);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!mediaFile) return;

    try {
      setError(null);
      if (typeof SharedArrayBuffer === "undefined") {
        throw new Error("SharedArrayBuffer is disabled. Please use a modern browser on a secure connection.");
      }

      setAppState("extracting");
      setProgress({ stage: "Loading processing engine...", extractProgress: 10, transcribeProgress: 0 });

      const { chunks } = await extractAudioDynamic(
        mediaFile,
        (stage, p) => setProgress((prev) => ({ 
          ...prev, 
          stage: `Extracting audio... ${p}%`, 
          extractProgress: p 
        }))
      );

      setAppState("transcribing");
      const allSegments: Segment[] = [];
      let globalIdCounter = 0;

      for (let i = 0; i < chunks.length; i++) {
        const { audioBlob, index } = chunks[i];
        
        if (i > 0) {
          await new Promise(r => setTimeout(r, 1000));
        }

        setProgress((prev) => ({
          ...prev,
          stage: `Uploading audio... (Part ${i + 1}/${chunks.length})`,
          transcribeProgress: Math.round((i / chunks.length) * 100),
        }));

        const formData = new FormData();
        formData.append("file", audioBlob, "audio.mp3");
        formData.append("language", selectedLanguage);
        formData.append("translate", isTranslateEnabled.toString());
        formData.append("targetLanguage", targetLanguage);

        const response = await fetch("/api/transcribe", { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Transcription failed");

        const chunkOffset = index * CHUNK_DURATION;
        const rawSegments = data.transcription?.segments ?? [];
        
        rawSegments.forEach((seg: any) => {
          allSegments.push({
            id: globalIdCounter++,
            start: seg.start + chunkOffset,
            end: seg.end + chunkOffset,
            text: seg.text,
          });
        });
      }

      setSegments(allSegments);
      setAppState("done");
    } catch (err: any) {
      setError(err.message);
      setAppState("error");
    }
  }, [mediaFile, selectedLanguage, isTranslateEnabled, targetLanguage]);

  const handleReset = useCallback(() => {
    setAppState("idle");
    setMediaFile(null);
    setSegments([]);
    setError(null);
    setProgress({ stage: "", extractProgress: 0, transcribeProgress: 0 });
  }, []);

  const isProcessing = appState === "extracting" || appState === "transcribing";

  return (
    <div className="h-screen bg-[#080A11] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D111C] border-r border-white/5 flex-col hidden lg:flex shrink-0 z-20">
        <div className="flex items-center gap-3 p-6 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CaptiAI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 text-violet-400 font-medium text-sm border border-violet-500/20">
            <Film className="w-5 h-5" />
            <span>Generate Captions</span>
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Help & Support</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-end px-8 py-4 border-b border-white/5 bg-[#0D111C]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 flex-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              AI Captions for Your Videos <Sparkles className="w-5 h-5 text-violet-400" />
            </h1>
            <p className="text-sm text-slate-400">
              Upload a video, and let AI generate accurate captions for you.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
            
            {/* Left Column */}
            <div className="space-y-6 flex flex-col">
              {/* Upload Video Card */}
              <div className="bg-[#121622] border border-white/5 rounded-2xl p-6 flex flex-col relative shrink-0">
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <UploadCloud className="w-5 h-5 text-slate-400" />
                  <h2 className="text-base font-semibold text-white">Upload Video</h2>
                </div>
                <div className="flex-1 relative z-10 min-h-[280px]">
                  <DropZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                </div>
              </div>

              {/* Caption Settings Card */}
              <div className="bg-[#121622] border border-white/5 rounded-2xl p-6 flex flex-col shrink-0">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <h2 className="text-base font-semibold text-white">Caption Settings</h2>
                </div>
                
                <div className="space-y-5 flex-1">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-48 bg-[#090C15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-[#0D111C]">{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      Translate Output
                    </label>
                    <button
                      onClick={() => setIsTranslateEnabled(!isTranslateEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isTranslateEnabled ? 'bg-violet-500' : 'bg-white/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTranslateEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {isTranslateEnabled && (
                    <div className="flex items-center justify-between animate-fade-up">
                      <label className="text-sm font-medium text-slate-300">Target Language</label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-48 bg-[#090C15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none appearance-none"
                      >
                        {LANGUAGES.filter(l => l.code !== 'auto' && l.code !== 'hinglish').map((lang) => (
                          <option key={lang.code} value={lang.code} className="bg-[#0D111C]">{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 mt-2">
                    <button
                      onClick={handleProcess}
                      disabled={!mediaFile || isProcessing || appState === "done"}
                      className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Generate Captions"}
                    </button>
                  </div>

                  {isProcessing && (
                    <div className="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-4">
                      <ProgressBar
                        label="Local Audio Extraction"
                        progress={progress.extractProgress}
                        color={appState === "extracting" ? "secondary" : "success"}
                      />
                      <ProgressBar
                        label="Cloud AI Processing"
                        progress={progress.transcribeProgress}
                        color="primary"
                        message={progress.stage}
                      />
                    </div>
                  )}
                  
                  {appState === "error" && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {error}
                      <button onClick={handleReset} className="ml-2 underline hover:text-red-300">Reset</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 flex flex-col">
              {appState === "done" && mediaFile ? (
                <CaptionList 
                  segments={segments} 
                  mediaFile={mediaFile} 
                  onUpdateSegments={setSegments} 
                  onReset={handleReset}
                />
              ) : (
                <>
                  {/* Empty States */}
                  <div className="bg-[#121622] border border-white/5 rounded-2xl p-6 h-[320px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Film className="w-5 h-5 text-slate-400" />
                        <h2 className="text-base font-semibold text-white">Video Preview</h2>
                      </div>
                      <button className="text-xs font-medium px-4 py-2 bg-[#1E2335] hover:bg-[#282F45] rounded-lg text-slate-300 transition-colors pointer-events-none opacity-50">
                        Change Video
                      </button>
                    </div>
                    <div className="flex-1 border border-white/5 rounded-xl bg-[#090C15] flex flex-col items-center justify-center text-slate-500 gap-3">
                      <Film className="w-8 h-8 opacity-20" />
                      <p className="text-sm">Video preview will appear here</p>
                    </div>
                  </div>

                  <div className="bg-[#121622] border border-white/5 rounded-2xl p-6 flex-1 min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <h2 className="text-base font-semibold text-white">Generated Captions</h2>
                      </div>
                      <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                         <button className="px-4 py-2 bg-[#1E2335] rounded-lg text-xs font-semibold text-slate-300">
                           Edit Captions
                         </button>
                         <button className="px-4 py-2 bg-violet-600 rounded-lg text-xs font-semibold text-white flex items-center gap-2">
                           <Download className="w-4 h-4" /> Download
                         </button>
                      </div>
                    </div>
                    <div className="flex-1 border border-white/5 rounded-xl bg-[#090C15] flex flex-col items-center justify-center text-slate-500 gap-3">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p className="text-sm">Captions list will appear here</p>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

