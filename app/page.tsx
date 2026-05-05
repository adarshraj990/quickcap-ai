"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  AlertCircle,
  Globe,
  Languages,
  Cpu,
  Sparkles,
  FileText,
  Settings,
  Moon,
  HelpCircle,
  UploadCloud,
  Film,
  Download,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Menu,
  ChevronRight,
  Plus,
  Play,
  Type,
  Palette,
  Layout,
  FileCode
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
  { code: "auto", name: "Auto-Detect (Global)" }, 
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

  const toolRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="min-h-screen bg-[#02040A] text-slate-200 selection:bg-violet-500/30 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6L24 16L10 26V6Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 4V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
             </div>
             <span className="text-xl font-bold text-white">QuickCap AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#why" className="hover:text-white transition-colors">Products</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#tool" className="hover:text-white transition-colors">Launch Tool</a>
          </div>
          <div className="flex items-center gap-4">
             {/* Login/Signup removed */}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section (Inspiration Top-Right) */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#02040A]">
          {/* Abstract Glowing Lines Background */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20">
                <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M0,500 Q250,400 500,500 T1000,500" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="animate-float" />
                  <path d="M0,550 Q250,450 500,550 T1000,550" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="animate-float" style={{ animationDelay: '1s' }} />
                  <path d="M0,450 Q250,350 500,450 T1000,450" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="animate-float" style={{ animationDelay: '2s' }} />
                  <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                      <stop offset="50%" stopColor="#EC4899" stopOpacity="1" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
             </div>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-up">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-6 tracking-tight leading-[1.05]">
              FAST, ACCURATE, PRIVATE <br />
              AI CAPTIONS
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Fastest easy-to-use video captions moving locally
            </p>
            <div className="flex justify-center">
              <button 
                onClick={scrollToTool}
                className="group relative px-12 py-4 rounded-xl font-bold text-lg text-white transition-all overflow-hidden"
              >
                {/* Glowing Border & Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 blur-xl bg-violet-600/50 group-hover:bg-violet-600/70 transition-all scale-110" />
                <span className="relative z-10 flex items-center gap-3">
                   Upload Video
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section (Inspiration Bottom-Left - Clean White Theme) */}
        <section id="how" className="py-32 px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">'How It Works' Section</h2>
              <p className="text-slate-500 font-medium tracking-tight uppercase text-sm">Simple a through Clean White Theme</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
               {/* Step 1 */}
               <div className="flex-1 flex flex-col items-center text-center max-w-[280px]">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-8">
                     <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <UploadCloud className="w-6 h-6 text-slate-400" />
                     </div>
                  </div>
                  <span className="text-slate-400 font-bold text-sm mb-2">Step 1:</span>
                  <h3 className="text-xl font-black text-slate-900 mb-3">Upload MP4/MOV</h3>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Upload what your file browser</p>
               </div>

               {/* Arrow */}
               <div className="hidden md:flex w-24 items-center justify-center pb-20">
                  <div className="w-full h-[2px] bg-slate-200 relative">
                     <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-200 rotate-45" />
                  </div>
               </div>

               {/* Step 2 */}
               <div className="flex-1 flex flex-col items-center text-center max-w-[280px]">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-8">
                     <span className="text-slate-900 font-black text-lg">Whisper</span>
                  </div>
                  <span className="text-slate-400 font-bold text-sm mb-2">Step 2:</span>
                  <h3 className="text-xl font-black text-slate-900 mb-3">AI Process</h3>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Extracting audio audio audio locally</p>
               </div>

               {/* Arrow */}
               <div className="hidden md:flex w-24 items-center justify-center pb-20">
                  <div className="w-full h-[2px] bg-slate-200 relative">
                     <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-200 rotate-45" />
                  </div>
               </div>

               {/* Step 3 */}
               <div className="flex-1 flex flex-col items-center text-center max-w-[280px]">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-8">
                     <div className="flex flex-col items-center">
                        <FileCode className="w-8 h-8 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">SRT</span>
                     </div>
                  </div>
                  <span className="text-slate-400 font-bold text-sm mb-2">Step 3:</span>
                  <h3 className="text-xl font-black text-slate-900 mb-3">Review & Export</h3>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Final video into your final video</p>
               </div>
            </div>
          </div>
        </section>

        {/* Editor Dashboard (Inspiration Top-Left) */}
        <section ref={toolRef} id="tool" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                     <Layout className="w-6 h-6 text-slate-900" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Main Editor Dashboard</h2>
               </div>
               <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
                  <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Settings</button>
                  <button className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-200">Dashboard</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Video Preview */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="bg-[#121418] rounded-3xl overflow-hidden aspect-video relative group border border-slate-800 shadow-2xl">
                  {appState === "idle" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <DropZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                       {/* Placeholder for video player or processing state */}
                       <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                          <Play className="w-16 h-16 opacity-20" />
                          <p className="font-bold text-sm">Processing Video...</p>
                       </div>
                    </div>
                  )}
                  {/* Fake UI Overlay like the image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between pointer-events-none">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                           <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full w-1/3 bg-white" />
                        </div>
                     </div>
                     <div className="text-white/60 text-[10px] font-mono">0:00 / 0:15</div>
                  </div>
                </div>

                {/* Subtitle Display Simulation */}
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                   <p className="text-slate-400 text-sm italic font-medium">The video plate misses his noshrangatily speed and love it to captine.</p>
                </div>
              </div>

              {/* Right Column: Style & Captions */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Style Controls Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-slate-900">Style</h3>
                   </div>
                   <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font</label>
                         <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 outline-none">
                            <option>Anton</option>
                            <option>Inter</option>
                            <option>Roboto</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">Color</label>
                         <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-200 flex items-center justify-center">
                               <Palette className="w-4 h-4 text-white" />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">Background</label>
                         <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900" />
                            <div className="flex flex-col gap-1">
                               <div className="w-3 h-3 bg-slate-200 rounded-sm" />
                               <div className="w-3 h-3 bg-slate-200 rounded-sm opacity-50" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Caption List/Settings */}
                <div className="flex-1 min-h-[400px] flex flex-col">
                   {appState === "done" ? (
                      <CaptionList 
                        segments={segments} 
                        mediaFile={mediaFile!} 
                        onUpdateSegments={setSegments} 
                        onReset={handleReset}
                      />
                   ) : (
                      <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col">
                         <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                               <Settings className="w-4 h-4 text-slate-400" />
                               <span className="font-bold text-slate-900 text-sm">Transcription Settings</span>
                            </div>
                         </div>

                         <div className="space-y-6 mb-8">
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500">Language</label>
                               <select
                                 value={selectedLanguage}
                                 onChange={(e) => setSelectedLanguage(e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none"
                               >
                                 {LANGUAGES.map((lang) => (
                                   <option key={lang.code} value={lang.code}>{lang.name}</option>
                                 ))}
                               </select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-bold text-slate-500">Translate Output</span>
                               <button
                                 onClick={() => setIsTranslateEnabled(!isTranslateEnabled)}
                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isTranslateEnabled ? 'bg-slate-900' : 'bg-slate-200'}`}
                               >
                                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTranslateEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                               </button>
                            </div>

                            {isTranslateEnabled && (
                               <div className="space-y-2 animate-fade-up">
                                  <label className="text-xs font-bold text-slate-500">Target Language</label>
                                  <select
                                    value={targetLanguage}
                                    onChange={(e) => setTargetLanguage(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none"
                                  >
                                    {LANGUAGES.filter(l => l.code !== 'auto' && l.code !== 'hinglish').map((lang) => (
                                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                                    ))}
                                  </select>
                               </div>
                            )}
                         </div>

                         <button
                           onClick={handleProcess}
                           disabled={!mediaFile || isProcessing}
                           className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-200 disabled:opacity-50 mt-auto"
                         >
                           {isProcessing ? "Processing..." : "Generate AI Captions"}
                         </button>

                         {isProcessing && (
                            <div className="mt-6 space-y-4">
                               <ProgressBar label="Extraction" progress={progress.extractProgress} color="secondary" />
                               <ProgressBar label="Transcription" progress={progress.transcribeProgress} color="primary" />
                            </div>
                         )}
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why QuickCap Section (Retaining for SEO) */}
        <section id="why" className="py-24 px-6 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: Shield, title: "Private", desc: "We process everything in your browser. Your videos never leave your local machine." },
                { icon: Zap, title: "Speed", desc: "By only uploading the audio track, we speed up the process by 10x." },
                { icon: CheckCircle2, title: "Accuracy", desc: "Groq's LPU technology combined with Whisper Large-v3 ensures accuracy." }
              ].map((card, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-slate-900">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
