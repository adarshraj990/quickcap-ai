"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export async function getFFmpeg(onProgress?: (ratio: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const ffmpeg = new FFmpeg();
      
      if (onProgress) {
        ffmpeg.on("progress", ({ progress }) => {
          onProgress(Math.min(progress, 1));
        });
      }

      await ffmpeg.load({
        coreURL: await toBlobURL(`/ffmpeg/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`/ffmpeg/ffmpeg-core.wasm`, "application/wasm"),
      });

      ffmpegInstance = ffmpeg;
      return ffmpeg;
    } catch (error) {
      loadPromise = null; // Allow retry
      console.error("FFmpeg Load Error:", error);
      throw new Error("Failed to initialize video engine. Please refresh and try again.");
    }
  })();

  return loadPromise;
}

export interface ChunkResult {
  audioBlob: Blob;
  index: number;
}

export interface ExtractionResult {
  chunks: ChunkResult[];
  originalSize: number;
  compressedSize: number;
}

export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      resolve(0); // Fallback if format unsupported
    };
    video.src = URL.createObjectURL(file);
  });
}

/**
 * TOTAL REWRITE: High-Fidelity Audio Extraction
 * Prioritizes uncompressed WAV for maximum AI accuracy.
 */
export async function extractAudioDynamic(
  videoFile: File,
  onProgress: (stage: string, progress: number) => void
): Promise<ExtractionResult> {
  onProgress("Analyzing high-fidelity requirements...", 0);
  
  const duration = await getVideoDuration(videoFile);
  const MAX_BYTES = 24 * 1024 * 1024; // 24MB
  
  // WAV (pcm_s16le, 16k, mono) is ~32KB/sec.
  // 32KB * 60 = 1.92MB per minute.
  // 24MB / 1.92MB = ~12.5 minutes.
  
  let format = "wav";
  let codec = "pcm_s16le";
  let extension = "wav";
  let bitrate = "";

  if (duration > 750) { // > 12.5 minutes
    format = "flac"; // Lossless compression
    extension = "flac";
    codec = "flac";
  }
  
  if (duration > 1800) { // > 30 minutes (FLAC might exceed 25MB)
    format = "mp3";
    extension = "mp3";
    codec = "libmp3lame";
    bitrate = "192k"; // Still very high quality
  }

  console.log(`Video duration: ${duration}s. Strategy: ${format.toUpperCase()} ${bitrate}`);

  const ffmpeg = await getFFmpeg((progress) => {
    onProgress(`[2/3] Extracting ${format.toUpperCase()} Audio...`, Math.round(progress * 80));
  });

  const inputName = "input.mp4";
  const outputName = `output.${extension}`;
  await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

  const ffmpegArgs = [
    "-i", inputName,
    "-vn",                   
    "-ac", "1",              
    "-ar", "44100", // Increased to 44.1k for maximum fidelity
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", // Professional EBU R128 normalization
  ];

  if (bitrate) {
    ffmpegArgs.push("-b:a", bitrate);
  }
  
  ffmpegArgs.push("-f", format, outputName);

  onProgress(`Extracting Pristine Audio (${format.toUpperCase()})...`, 15);
  await ffmpeg.exec(ffmpegArgs);

  onProgress("Finalizing...", 90);

  const data = await ffmpeg.readFile(outputName);
  if (typeof data === "string") throw new Error("FFmpeg output was unexpectedly a string.");
  
  // Clean copy to regular ArrayBuffer
  const regularBuffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(regularBuffer).set(data);
  const audioBlob = new Blob([regularBuffer], { type: `audio/${extension}` });

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  onProgress("Done extracting!", 100);

  return {
    chunks: [{ audioBlob, index: 0 }],
    originalSize: videoFile.size,
    compressedSize: audioBlob.size,
  };
}
