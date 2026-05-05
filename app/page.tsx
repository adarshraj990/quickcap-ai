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
  Plus
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
    <div className="min-h-screen bg-[#080A11] text-slate-200 selection:bg-violet-500/30">
      <div className="bg-mesh" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080A11]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">QuickCap AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#why" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Why QuickCap?</a>
            <a href="#how" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it Works</a>
            <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</a>
            <button 
              onClick={scrollToTool}
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              Launch Tool
            </button>
          </div>
          <button className="md:hidden p-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-48 md:pt-60 pb-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              Revolutionizing Video Content
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.1] py-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Your Content, <br />
              <span className="text-gradient">Fully Subtitled.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              The fastest way to generate accurate, high-engagement captions for your Reels, Shorts, and TikToks using state-of-the-art Whisper AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={scrollToTool}
                className="btn-wow w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
              >
                Upload Video
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[150px] rounded-full -z-10 animate-pulse" />
        </section>

        {/* Welcome Section */}
        <section className="py-32 px-6 border-y border-white/5 bg-[#0A0D16]/50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-16 tracking-tight leading-tight">
              Congratulations! You've found the <span className="text-violet-400">fastest way</span> to add AI Captions.
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Privacy-First</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your videos never leave your browser. We only process audio tracks, ensuring 100% data security.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-fuchsia-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Audio-Only</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We extract audio locally, saving 90% bandwidth compared to traditional cloud-based captioning tools.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">99% Accuracy</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Powered by Groq-accelerated Whisper AI, delivering near-perfect transcription in record time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Tool Section */}
        <section ref={toolRef} id="tool" className="py-24 px-6 bg-[#080A11]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">AI Captioning <span className="text-gradient">Dashboard</span></h2>
              <p className="text-slate-400">Upload your video and watch the magic happen in seconds.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
              {/* Left Column: Input */}
              <div className="space-y-6 flex flex-col">
                {/* Upload Video Card */}
                <div className="glass-premium rounded-[2rem] p-8 flex flex-col min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <UploadCloud className="w-5 h-5 text-violet-400" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Upload Media</h2>
                  </div>
                  <div className="flex-1">
                    <DropZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                  </div>
                </div>

                {/* Settings Card */}
                <div className="glass-premium rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-fuchsia-500/10">
                      <Settings className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Settings</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <label className="text-sm font-bold text-slate-300">Input Language</label>
                        <p className="text-xs text-slate-500">Language spoken in the video</p>
                      </div>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full sm:w-64 bg-[#090C15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code} className="bg-[#0D111C]">{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-t border-white/5">
                      <div>
                        <label className="text-sm font-bold text-slate-300">Translate Subtitles</label>
                        <p className="text-xs text-slate-500">Automatically translate output</p>
                      </div>
                      <button
                        onClick={() => setIsTranslateEnabled(!isTranslateEnabled)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none ${isTranslateEnabled ? 'bg-violet-500' : 'bg-white/10'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${isTranslateEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {isTranslateEnabled && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5 animate-fade-up">
                        <div>
                          <label className="text-sm font-bold text-slate-300">Target Language</label>
                        </div>
                        <select
                          value={targetLanguage}
                          onChange={(e) => setTargetLanguage(e.target.value)}
                          className="w-full sm:w-64 bg-[#090C15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none"
                        >
                          {LANGUAGES.filter(l => l.code !== 'auto' && l.code !== 'hinglish').map((lang) => (
                            <option key={lang.code} value={lang.code} className="bg-[#0D111C]">{lang.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/5">
                      <button
                        onClick={handleProcess}
                        disabled={!mediaFile || isProcessing || appState === "done"}
                        className="btn-wow w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        {isProcessing ? "Processing..." : "Generate Captions"}
                      </button>
                    </div>

                    {isProcessing && (
                      <div className="mt-6 p-6 rounded-2xl bg-violet-500/5 border border-violet-500/10 space-y-6">
                        <ProgressBar
                          label="Local Extraction"
                          progress={progress.extractProgress}
                          color={appState === "extracting" ? "secondary" : "success"}
                        />
                        <ProgressBar
                          label="AI Transcription"
                          progress={progress.transcribeProgress}
                          color="primary"
                          message={progress.stage}
                        />
                      </div>
                    )}
                    
                    {appState === "error" && (
                      <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{error}</span>
                        </div>
                        <button onClick={handleReset} className="font-bold underline hover:text-red-300">Reset</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Output */}
              <div className="flex flex-col">
                {appState === "done" && mediaFile ? (
                  <CaptionList 
                    segments={segments} 
                    mediaFile={mediaFile} 
                    onUpdateSegments={setSegments} 
                    onReset={handleReset}
                  />
                ) : (
                  <div className="glass-premium rounded-[2rem] p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10">
                          <Film className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Preview & Output</h2>
                      </div>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-white/5 rounded-[1.5rem] bg-[#090C15]/50 flex flex-col items-center justify-center text-slate-500 gap-4 min-h-[500px]">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                        <FileText className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-sm font-medium">Your captions will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why QuickCap Section */}
        <section id="why" className="py-24 px-6 bg-gradient-to-b from-[#080A11] to-[#0A0D16]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Why <span className="text-gradient">QuickCap?</span></h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">The ultimate tool for modern creators who value speed, privacy, and quality.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Shield, 
                  title: "Privacy", 
                  color: "violet",
                  desc: "We process everything in your browser. Your private videos never leave your local machine, ever." 
                },
                { 
                  icon: Zap, 
                  title: "Speed", 
                  color: "fuchsia",
                  desc: "By only uploading the audio track, we speed up the process by 10x compared to traditional tools." 
                },
                { 
                  icon: CheckCircle2, 
                  title: "Accuracy", 
                  color: "cyan",
                  desc: "Groq's LPU technology combined with Whisper Large-v3 ensures industry-leading transcription accuracy." 
                }
              ].map((card, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <card.icon className={`w-8 h-8 text-${card.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{card.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how" className="py-24 px-6 bg-[#0A0D16]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                  From Video to <br />
                  <span className="text-gradient">Viral in 3 Steps.</span>
                </h2>
                <p className="text-slate-400 text-lg mb-12">We've simplified the captioning workflow so you can focus on creating content, not editing subtitles.</p>
                
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Upload Video", desc: "Select your MP4 or MOV file. Our engine extracts the audio locally in milliseconds." },
                    { step: "02", title: "AI Magic", desc: "Groq's lightning-fast AI generates accurate transcriptions and handles translations." },
                    { step: "03", title: "Review & Export", desc: "Download professional .SRT or .VTT files ready for any social platform." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="shrink-0 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                        <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/5 flex items-center justify-center overflow-hidden animate-float">
                   <div className="text-center p-12">
                      <div className="relative inline-block mb-8">
                        <Sparkles className="w-24 h-24 text-violet-400 opacity-50" />
                        <div className="absolute inset-0 blur-2xl bg-violet-500/20 rounded-full" />
                      </div>
                      <p className="text-2xl font-black text-slate-300 italic max-w-sm">"The fastest captioning experience on the web."</p>
                   </div>
                </div>
                {/* Background Glows */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-fuchsia-600/20 blur-[120px] rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* About Section: SEO Content */}
        <section id="about" className="py-24 px-6 bg-gradient-to-b from-[#0A0D16] to-[#080A11] border-t border-white/5">
          <div className="max-w-4xl mx-auto prose prose-invert prose-violet">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center tracking-tighter">
              The Power of <span className="text-gradient">AI Captioning</span>
            </h2>
            
            <div className="space-y-8 text-slate-400 leading-relaxed">
              <p className="text-lg">
                In the fast-paced world of short-form video, capturing attention in the first three seconds is the difference between a viral hit and a forgotten post. As platforms like Instagram Reels, YouTube Shorts, and TikTok continue to dominate the digital landscape, creators are constantly searching for ways to boost engagement and reach wider audiences. One of the most effective, yet often overlooked, strategies is the implementation of high-quality, accurate AI captions.
              </p>

              <h3 className="text-2xl font-bold text-white pt-4">The Silent Scroll Phenomenon</h3>
              <p>
                Statistics show that up to 80% of social media users browse their feeds with the sound turned off. Whether they are in a quiet office, on public transport, or simply prefer a silent experience, these users rely entirely on visual cues to understand your content. If your video doesn't have subtitles, you are essentially excluding a massive portion of your potential audience. AI captioning bridge this gap, ensuring your message is delivered clearly, regardless of whether the audio is playing.
              </p>

              <h3 className="text-2xl font-bold text-white pt-4">Boosting Engagement and Retention</h3>
              <p>
                Captions don't just help people understand your video; they keep them watching longer. Subtitles create a multi-sensory experience where the viewer is both hearing (if the sound is on) and reading your words. This dual-channel processing has been proven to increase information retention and viewer satisfaction. When users can follow along easily, they are more likely to watch the video until the end, which signals to the platform's algorithm that your content is high-value, leading to more organic reach.
              </p>

              <h3 className="text-2xl font-bold text-white pt-4">SEO Benefits of Video Transcription</h3>
              <p>
                While search engines can't "watch" your video in the traditional sense, they can index text. By generating captions and transcriptions, you are providing search engines with rich metadata about your content. This improves your visibility in search results for specific keywords related to your niche. AI captioning tools like QuickCap AI use advanced Whisper models to provide near-perfect accuracy, ensuring that your SEO keywords are captured correctly and contribute to your growth.
              </p>

              <h3 className="text-2xl font-bold text-white pt-4">Accessibility and Global Reach</h3>
              <p>
                Inclusion is a vital part of modern content creation. Captions make your videos accessible to the deaf and hard-of-hearing community, showing that you value all members of your audience. Furthermore, for creators targeting a global audience, subtitles are essential. Many viewers may speak your language as a second or third language; having text to accompany the speech helps them grasp nuances and follow complex topics more easily.
              </p>

              <h3 className="text-2xl font-bold text-white pt-4">Speed and Efficiency for Creators</h3>
              <p>
                Traditionally, captioning a video was a tedious, manual process that took hours of painstaking work. For a creator posting daily Reels or Shorts, this was unsustainable. QuickCap AI revolutionizes this workflow by leveraging cutting-edge AI to generate captions in seconds. Our privacy-first, browser-based approach means your videos are processed locally, saving you time and bandwidth while maintaining the highest levels of data security.
              </p>

              <div className="mt-16 p-10 rounded-[2.5rem] bg-violet-600/10 border border-violet-500/20 text-center">
                <h4 className="text-2xl font-black text-white mb-4">Start Trending with QuickCap AI</h4>
                <p className="mb-8">In the competitive arena of social media, every advantage counts. AI captions are no longer a "nice-to-have" feature; they are a fundamental requirement for growth.</p>
                <button 
                  onClick={scrollToTool}
                  className="btn-wow px-10 py-4 rounded-2xl font-bold text-lg"
                >
                  Generate Free AI Captions Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
