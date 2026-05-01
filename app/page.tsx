"use client";

import React, { useState, useCallback } from "react";
import {
  RotateCcw,
  AlertCircle,
  Globe,
  Languages,
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
  Video
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { ProgressBar } from "@/components/ProgressBar";
import { CaptionList } from "@/components/CaptionList";
import { extractAudioDynamic } from "@/lib/ffmpeg-utils";
import { type Segment, formatBytes } from "@/lib/utils";

type AppState = "idle" | "extracting" | "transcribing" | "done" | "error";

interface ProgressState {
  stage: string;
  extractProgress: number;
  transcribeProgress: number;
}

const LANGUAGES = [
  { code: "auto", name: "Auto-Detect (Any Language)" },
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
  const [selectedLanguage, setSelectedLanguage] = useState("hinglish");
  const [isTranslateEnabled, setIsTranslateEnabled] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState>({
    stage: "",
    extractProgress: 0,
    transcribeProgress: 0,
  });
  const [audioStats, setAudioStats] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setVideoFile(file);
    setError(null);
    setSegments([]);
    setAudioStats(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!videoFile) return;

    try {
      setError(null);
      if (typeof SharedArrayBuffer === "undefined") {
        throw new Error("SharedArrayBuffer is disabled. Please use a modern browser on a secure connection.");
      }

      setAppState("extracting");
      const { chunks, originalSize, compressedSize } = await extractAudioDynamic(
        videoFile,
        (stage, p) => setProgress((prev) => ({ ...prev, stage, extractProgress: p }))
      );
      setAudioStats({ originalSize, compressedSize });

      setAppState("transcribing");
      const allSegments: Segment[] = [];
      let globalIdCounter = 0;
      const CHUNK_DURATION = 2700;

      for (let i = 0; i < chunks.length; i++) {
        const { audioBlob, index } = chunks[i];
        setProgress((prev) => ({
          ...prev,
          stage: `AI Transcribing Part ${i + 1}/${chunks.length}...`,
          transcribeProgress: Math.round((i / chunks.length) * 100),
        }));

        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.mp3");
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
  }, [videoFile, selectedLanguage, isTranslateEnabled, targetLanguage]);

  const handleReset = useCallback(() => {
    setAppState("idle");
    setVideoFile(null);
    setSegments([]);
    setError(null);
    setAudioStats(null);
    setProgress({ stage: "", extractProgress: 0, transcribeProgress: 0 });
  }, []);

  const isProcessing = appState === "extracting" || appState === "transcribing";

  return (
    <main className="min-h-screen bg-mesh relative selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <div className="relative max-w-[1400px] mx-auto px-6 py-24 md:py-40 space-y-32 md:space-y-48 z-10">
        
        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-8 mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-premium text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4 animate-fade-up">
            <Sparkles className="w-4 h-4" /> Professional Suite
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl animate-fade-up leading-[0.9]" style={{ animationDelay: "0.1s" }}>
            QUICKCAP <span className="text-gradient">AI</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-300 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            The most stunning automatic caption engine. <br/> Zero server costs. Maximum privacy.
          </p>
        </header>

        {/* Main Layout Grid */}
        <div className={`flex flex-col ${appState === "done" ? "lg:grid lg:grid-cols-12 lg:items-start" : "items-center"} gap-24 md:gap-32 transition-all duration-700`}>
          
          {/* Controls Column / Upload Zone */}
          <div className={`${appState === "done" ? "lg:col-span-4 w-full" : "max-w-3xl w-full"} space-y-12 animate-fade-up`} style={{ animationDelay: "0.3s" }}>
            
            <div className="space-y-6">
              {/* Dropzone */}
              {(appState === "idle" || isProcessing || appState === "error") && (
                <div className="glass-premium rounded-3xl p-2 shadow-2xl">
                  <DropZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                </div>
              )}

              {/* Settings Block */}
              {videoFile && !isProcessing && appState !== "done" && (
                <div className="glass-premium p-8 rounded-3xl space-y-8 animate-fade-up shadow-[0_0_50px_rgba(139,92,246,0.1)] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-[50px] pointer-events-none rounded-full" />
                  
                  {/* Language Selector */}
                  <div className="space-y-3 relative z-10">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-violet-400" /> Video Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all cursor-pointer shadow-inner appearance-none"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-medium">{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="h-px bg-white/5 relative z-10" />

                  {/* Translation Toggle */}
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        <Languages className="w-4 h-4 text-pink-400" /> Translate Output
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">Powered by Llama 3 AI</p>
                    </div>
                    <button
                      onClick={() => setIsTranslateEnabled(!isTranslateEnabled)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${isTranslateEnabled ? 'bg-gradient-to-r from-pink-500 to-violet-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-white/10 border border-white/5'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${isTranslateEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Target Language Selector */}
                  {isTranslateEnabled && (
                    <div className="space-y-3 animate-fade-up relative z-10">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Target Language</label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all cursor-pointer shadow-inner appearance-none"
                      >
                        {LANGUAGES.filter(l => l.code !== 'auto' && l.code !== 'hinglish').map((lang) => (
                          <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-medium">{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleProcess}
                    className="w-full btn-wow py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] mt-4 relative z-10"
                  >
                    Generate Captions
                  </button>
                  
                  <div className="text-center mt-4 relative z-10">
                    <button onClick={handleReset} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                      Start Over
                    </button>
                  </div>
                </div>
              )}

              {/* Completed State Stats */}
              {appState === "done" && (
                <div className="glass-premium p-8 rounded-3xl space-y-8 animate-fade-up border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      Completed
                    </span>
                  </div>
                  
                  {audioStats && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Optimization Saved</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400">{formatBytes(audioStats.originalSize - audioStats.compressedSize)}</p>
                        <p className="text-sm font-bold text-slate-500 mb-1">Bandwidth</p>
                      </div>
                    </div>
                  )}
                  
                  <button onClick={handleReset} className="w-full btn-glass py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" /> New Project
                  </button>
                </div>
              )}

              {/* Progress Card */}
              {isProcessing && (
                <div className="glass-premium p-8 rounded-3xl space-y-10 animate-fade-up shadow-[0_0_50px_rgba(6,182,212,0.15)] border border-cyan-500/20">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                     <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg animate-pulse">
                        <Cpu className="w-5 h-5 text-white" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">AI Engine Running</p>
                        <p className="text-[10px] font-medium text-cyan-300 uppercase tracking-widest mt-0.5">Zero Server Data Transfer</p>
                     </div>
                  </div>
                  <ProgressBar
                    label="Local Audio Extraction"
                    progress={progress.extractProgress}
                    color={appState === "extracting" ? "secondary" : "success"}
                  />
                  <ProgressBar
                    label="Cloud AI Transcription"
                    progress={progress.transcribeProgress}
                    color="primary"
                    message={progress.stage}
                  />
                </div>
              )}

              {/* Error State */}
              {appState === "error" && (
                <div className="p-6 border border-red-500/30 rounded-3xl bg-red-950/40 backdrop-blur-md flex items-start gap-4 animate-fade-up shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <AlertCircle className="w-6 h-6 text-red-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-base font-bold text-white">Processing Error</p>
                    <p className="text-sm text-red-200 mt-2 leading-relaxed">{error}</p>
                    <button onClick={handleReset} className="mt-5 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-colors border border-red-500/30">
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editor Column (Split Screen) */}
          {appState === "done" && (
            <div className="lg:col-span-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <CaptionList 
                segments={segments} 
                videoFile={videoFile!} 
                onUpdateSegments={setSegments} 
              />
            </div>
          )}

        </div>

        {/* --- PREMIUM FEATURES SECTION --- */}
        {appState === "idle" && (
          <section className="mt-48 space-y-24 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-xl">
                Built for <span className="text-gradient">Creators</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                QuickCap AI is a high-performance powerhouse engineered for those who value speed, privacy, and flawless quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="glass-premium p-10 rounded-[2.5rem] space-y-6 border border-white/5 hover:border-violet-500/30 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-8 h-8 text-fuchsia-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">100% Private Engine</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    Unmatched privacy is at our core. Your video files never leave your device. We use cutting-edge WebAssembly to extract audio locally, ensuring your data is always yours.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-premium p-10 rounded-[2.5rem] space-y-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Blazing Fast AI</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    Powered by Whisper-large-v3 on Groq's high-speed LPUs. Generate hyper-accurate captions for 100+ languages in mere seconds, not minutes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="glass-premium p-10 rounded-[2.5rem] space-y-6 border border-white/5 hover:border-pink-500/30 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-pink-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Llama 3 Translation</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    Seamless global reach. Instantly translate your captions to any target language with advanced AI context awareness, expanding your audience globally.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="glass-premium p-10 rounded-[2.5rem] space-y-6 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Live Editor Suite</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    A professional studio built into your browser. Click timestamps to jump through your video and edit your captions in real-time with ease.
                  </p>
                </div>
              </div>
            </div>

            {/* --- TECHNOLOGY STACK --- */}
            <div className="pt-32 pb-12 border-t border-white/5 text-center space-y-12">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">The Powerhouse Technology</h3>
               <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center font-black text-orange-400">FF</div>
                    <span className="font-bold text-white text-lg">FFmpeg.wasm</span>
                  </div>
                  <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center font-black text-indigo-400 font-mono">G</div>
                    <span className="font-bold text-white text-lg">Groq Cloud</span>
                  </div>
                  <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center font-black text-pink-400">L3</div>
                    <span className="font-bold text-white text-lg">Llama 3.1</span>
                  </div>
               </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
