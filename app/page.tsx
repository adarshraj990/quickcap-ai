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
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toolRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    setIsMobileMenuOpen(false);
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#02040A]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6L24 16L10 26V6Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 4V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
             </div>
             <span className="text-lg md:text-xl font-bold text-white">QuickCap AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#why" className="hover:text-white transition-colors">Products</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#tool" className="hover:text-white transition-colors">Launch Tool</a>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#02040A] border-b border-white/5 py-6 px-6 space-y-6 animate-in slide-in-from-top duration-300">
            <a href="#why" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-slate-400">Products</a>
            <a href="#how" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-slate-400">How it Works</a>
            <a href="#tool" onClick={scrollToTool} className="block text-lg font-medium text-white font-bold">Launch Tool</a>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#02040A]">
          {/* Abstract Glowing Lines Background */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-20">
                <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M0,500 Q250,400 500,500 T1000,500" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="animate-pulse" />
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

          <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-up px-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-6 tracking-tight leading-[1.1] sm:leading-[1.05]">
              FAST, ACCURATE, <br className="hidden sm:block" /> PRIVATE AI CAPTIONS
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Fastest easy-to-use video captions moving locally
            </p>
            <div className="flex justify-center">
              <button 
                onClick={scrollToTool}
                className="group relative w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg text-white transition-all overflow-hidden active:scale-95 touch-manipulation"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-90" />
                <div className="absolute inset-0 blur-xl bg-violet-600/50 group-hover:bg-violet-600/70 transition-all scale-110" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                   Upload Video
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="py-24 md:py-32 px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">'How It Works' Section</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest">Simple a through Clean White Theme</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
               {/* Step 1 */}
               <div className="flex-1 flex flex-col items-center text-center w-full max-w-[280px]">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-6 md:mb-8">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <UploadCloud className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                     </div>
                  </div>
                  <span className="text-slate-400 font-bold text-xs mb-2">Step 1:</span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3">Upload MP4/MOV</h3>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Upload via your file browser</p>
               </div>

               {/* Arrow Mobile */}
               <div className="md:hidden">
                  <ArrowRight className="w-6 h-6 text-slate-200 rotate-90" />
               </div>

               {/* Step 2 */}
               <div className="flex-1 flex flex-col items-center text-center w-full max-w-[280px]">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-6 md:mb-8">
                     <span className="text-slate-900 font-black text-base md:text-lg">Whisper</span>
                  </div>
                  <span className="text-slate-400 font-bold text-xs mb-2">Step 2:</span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3">AI Process</h3>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Extracting audio locally</p>
               </div>

               {/* Arrow Mobile */}
               <div className="md:hidden">
                  <ArrowRight className="w-6 h-6 text-slate-200 rotate-90" />
               </div>

               {/* Step 3 */}
               <div className="flex-1 flex flex-col items-center text-center w-full max-w-[280px]">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center mb-6 md:mb-8">
                     <div className="flex flex-col items-center">
                        <FileCode className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase">SRT</span>
                     </div>
                  </div>
                  <span className="text-slate-400 font-bold text-xs mb-2">Step 3:</span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3">Review & Export</h3>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">Export your final video</p>
               </div>
            </div>
          </div>
        </section>

        {/* Editor Dashboard */}
        <section ref={toolRef} id="tool" className="py-16 md:py-24 px-4 md:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                     <Layout className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Main Editor Dashboard</h2>
               </div>
               <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg text-sm font-bold text-slate-500">Settings</button>
                  <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold">Dashboard</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Video Preview */}
              <div className="lg:col-span-7 flex flex-col order-1">
                <div className="bg-[#121418] rounded-2xl md:rounded-[2rem] overflow-hidden aspect-video relative border border-slate-800 shadow-xl">
                  {appState === "idle" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <DropZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                       <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                          <Play className="w-12 h-12 md:w-16 md:h-16 opacity-20" />
                          <p className="font-bold text-xs md:text-sm">Processing Video...</p>
                       </div>
                    </div>
                  )}
                  {/* Fake UI Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between pointer-events-none">
                     <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                           <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
                        </div>
                        <div className="h-1 w-24 md:w-32 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full w-1/3 bg-white" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Style & Captions */}
              <div className="lg:col-span-5 flex flex-col gap-6 order-2">
                {/* Style Controls */}
                <div className="bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-5 md:p-6 shadow-sm">
                   <h3 className="font-black text-slate-900 mb-6">Style</h3>
                   <div className="grid grid-cols-3 gap-4 md:gap-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Font</label>
                         <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] md:text-xs font-bold text-slate-900 outline-none">
                            <option>Anton</option>
                            <option>Inter</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Color</label>
                         <div className="flex justify-center">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                               <Palette className="w-4 h-4 text-white" />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">BG</label>
                         <div className="flex items-center justify-center">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-900" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 min-h-[350px] flex flex-col">
                   {appState === "done" ? (
                      <CaptionList 
                        segments={segments} 
                        mediaFile={mediaFile!} 
                        onUpdateSegments={setSegments} 
                        onReset={handleReset}
                      />
                   ) : (
                      <div className="flex-1 bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-5 md:p-6 flex flex-col">
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
                               <span className="text-xs font-bold text-slate-500">Translate</span>
                               <button
                                 onClick={() => setIsTranslateEnabled(!isTranslateEnabled)}
                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isTranslateEnabled ? 'bg-slate-900' : 'bg-slate-200'}`}
                               >
                                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTranslateEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                               </button>
                            </div>
                         </div>

                         <button
                           onClick={handleProcess}
                           disabled={!mediaFile || isProcessing}
                           className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-black text-base md:text-lg transition-all active:scale-[0.98] mt-auto"
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

        {/* Features Section */}
        <section id="why" className="py-20 px-6 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Shield, title: "Private", desc: "Your videos never leave your local machine." },
                { icon: Zap, title: "Speed", desc: "10x faster by only processing audio tracks." },
                { icon: CheckCircle2, title: "Accuracy", desc: "Powered by Groq-accelerated Whisper AI." }
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
