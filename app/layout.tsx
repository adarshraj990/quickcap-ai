import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickCap AI — Professional Hinglish Video Captions",
  description:
    "Generate accurate Hinglish subtitles for your videos with zero server costs. Browser-based audio extraction + Groq Whisper AI.",
  keywords: "QuickCap AI, Hinglish captions, automatic subtitles, Groq Whisper, video transcription",
  openGraph: {
    title: "QuickCap AI",
    description: "Accurate Hinglish subtitles for any video in seconds.",
    type: "website",
  },
  themeColor: "#02040A",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
