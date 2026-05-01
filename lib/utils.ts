/**
 * Converts seconds (float) to SRT timestamp format: HH:MM:SS,mmm
 */
export function secondsToSrtTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  return [
    h.toString().padStart(2, "0"),
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0"),
  ].join(":") + `,${ms.toString().padStart(3, "0")}`;
}

export interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
}

/**
 * Converts an array of Whisper segments into a valid .srt file string
 */
export function segmentsToSrt(segments: Segment[]): string {
  return segments
    .map((seg, i) => {
      return [
        (i + 1).toString(),
        `${secondsToSrtTimestamp(seg.start)} --> ${secondsToSrtTimestamp(seg.end)}`,
        seg.text.trim(),
        "",
      ].join("\r\n");
    })
    .join("\r\n");
}

/**
 * Triggers a browser download of a file
 */
export function downloadFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  // Delay revocation to ensure browser handles the download request
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Formats bytes into human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats seconds into MM:SS display
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
