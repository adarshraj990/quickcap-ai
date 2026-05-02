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

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
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

export async function getMediaDuration(file: File): Promise<number> {
  const isAudio = file.type.startsWith("audio/");
  return new Promise((resolve) => {
    const media = document.createElement(isAudio ? "audio" : "video");
    media.preload = "metadata";
    media.onloadedmetadata = () => {
      window.URL.revokeObjectURL(media.src);
      resolve(media.duration);
    };
    media.onerror = () => {
      resolve(0); // Fallback if format unsupported
    };
    media.src = URL.createObjectURL(file);
  });
}

export const CHUNK_DURATION = 600; // 10 minutes segments for stability

/**
 * TOTAL REWRITE: High-Fidelity Audio Extraction with Chunking
 * Ensures we stay under Groq's 25MB limit by splitting long audio.
 */
export async function extractAudioDynamic(
  mediaFile: File,
  onProgress: (stage: string, progress: number) => void
): Promise<ExtractionResult> {
  onProgress("Analyzing requirements...", 0);
  
  const duration = await getMediaDuration(mediaFile);
  const isAudioInput = mediaFile.type.startsWith("audio/");
  
  let extension = "wav";
  let codec = "pcm_s16le";
  let format = "wav";

  if (duration > CHUNK_DURATION) {
    extension = "mp3";
    codec = "libmp3lame";
    format = "mp3";
  }

  console.log(`Media duration: ${duration}s. Strategy: ${format.toUpperCase()} Chunking`);

  const ffmpeg = await getFFmpeg((progress) => {
    onProgress(`[2/3] Processing ${isAudioInput ? 'Audio' : 'Video'}...`, Math.round(progress * 80));
  });

  const inputName = "input_file";
  await ffmpeg.writeFile(inputName, await fetchFile(mediaFile));

  // Use segment muxer for automatic chunking
  const ffmpegArgs = [
    "-i", inputName,
    "-vn",                   
    "-ac", "1",              
    "-ar", "16000", // Standard for AI transcription
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", // Normalization
    "-c:a", codec,
  ];

  if (format === "mp3") {
    ffmpegArgs.push("-b:a", "128k");
  }

  ffmpegArgs.push(
    "-f", "segment",
    "-segment_time", CHUNK_DURATION.toString(),
    `output_%03d.${extension}`
  );

  onProgress(`${isAudioInput ? 'Optimizing' : 'Extracting'} Audio (${format.toUpperCase()})...`, 15);
  await ffmpeg.exec(ffmpegArgs);

  onProgress("Reading chunks...", 90);

  const chunks: ChunkResult[] = [];
  const numChunks = Math.ceil(duration / CHUNK_DURATION);
  let totalCompressedSize = 0;

  for (let i = 0; i < numChunks; i++) {
    const chunkName = `output_${i.toString().padStart(3, "0")}.${extension}`;
    try {
      const data = await ffmpeg.readFile(chunkName);
      if (typeof data === "string") continue;
      
      const regularBuffer = new ArrayBuffer(data.byteLength);
      new Uint8Array(regularBuffer).set(data);
      const audioBlob = new Blob([regularBuffer], { type: `audio/${extension}` });
      
      chunks.push({ audioBlob, index: i });
      totalCompressedSize += audioBlob.size;
      
      await ffmpeg.deleteFile(chunkName);
    } catch (e) {
      console.warn(`Could not read chunk ${i}, might be empty or duration mismatch.`);
    }
  }

  await ffmpeg.deleteFile(inputName);

  onProgress("Done processing!", 100);

  return {
    chunks,
    originalSize: mediaFile.size,
    compressedSize: totalCompressedSize,
  };
}
