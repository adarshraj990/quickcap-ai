import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 60; // Increase timeout to 60 seconds for long transcriptions

export async function POST(req: NextRequest) {
  const DEBUG_ID = "v2_HINGLISH_ACTIVE";
  try {
    console.log(`[${DEBUG_ID}] Transcription request received.`);
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API KEY MISSING IN ENV" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const formData = await req.formData();
    const audioFile = formData.get("file") as File | null;
    const selectedLanguage = formData.get("language") as string || "auto";

    if (!audioFile) {
      console.log(`[${DEBUG_ID}] Error: No audio file provided`);
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    console.log(`[${DEBUG_ID}] Sending to Groq (Whisper-large-v3). Size: ${audioFile.size} bytes. Language: ${selectedLanguage}`);

    let whisperParams: any = {
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
      temperature: 0, // Deterministic output for maximum accuracy
    };

    // Configure language and prompt dynamically based on user selection
    if (selectedLanguage === "hinglish") {
      whisperParams.language = "en"; 
      whisperParams.prompt = "This is a Hinglish video with frequent switching between Hindi and English. Transcribe Hindi parts in Roman script (e.g., 'Aap kaise hain?' instead of 'आप कैसे हैं?'). Capture English as is. Focus on natural conversational flow and correct Roman Hindi spellings.";
    } else if (selectedLanguage === "hi") {
      whisperParams.language = "hi";
      whisperParams.prompt = "यह एक हिंदी वीडियो है। कृपया इसे शुद्ध देवनागरी लिपि में ट्रांसक्राइब करें। विराम चिह्नों का सही प्रयोग करें।";
    } else if (selectedLanguage !== "auto") {
      whisperParams.language = selectedLanguage;
      whisperParams.prompt = `This is a clear, professional transcription in ${selectedLanguage}. Maintain all technical terms and proper nouns.`;
    } else {
      // TRUE AUTO-DETECT MODE
      whisperParams.prompt = "Transcribe the audio accurately. The speaker might use multiple languages (Code-switching), such as Hindi, English, or others in the same sentence. Capture all words as they are spoken, maintaining the original language of each word. Do not translate. Maintain punctuation and casing.";
    }

    const transcription = await groq.audio.transcriptions.create(whisperParams);

    let finalSegments = (transcription as any).segments || [];

    // ── Translation Pass (Optional) ──────────────────────────
    const isTranslateEnabled = formData.get("translate") === "true";
    const targetLanguage = formData.get("targetLanguage") as string || "en";

    if (isTranslateEnabled && finalSegments.length > 0) {
      console.log(`[${DEBUG_ID}] Translation enabled. Target: ${targetLanguage}`);
      
      const segmentsToTranslate = finalSegments.map((s: any) => ({
        id: s.id,
        text: s.text
      }));

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following transcription segments into the language with code: ${targetLanguage}. 
            Return ONLY a valid JSON array of objects with the keys "id" and "text". 
            Do not include any explanation or extra text. 
            Maintain the exact IDs.`,
          },
          {
            role: "user",
            content: JSON.stringify(segmentsToTranslate),
          },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      try {
        const responseText = chatCompletion.choices[0]?.message?.content || "{}";
        const translatedData = JSON.parse(responseText);
        const translatedSegments = Array.isArray(translatedData) ? translatedData : translatedData.segments || [];

        // Map translations back to original segments with timestamps
        finalSegments = finalSegments.map((original: any) => {
          const translation = translatedSegments.find((t: any) => t.id === original.id);
          return {
            ...original,
            text: translation ? translation.text : original.text
          };
        });
        
        console.log(`[${DEBUG_ID}] Translation complete.`);
      } catch (err) {
        console.error(`[${DEBUG_ID}] Translation parsing error:`, err);
      }
    }

    const firstWords = (transcription as any).text?.substring(0, 200) || "No text";
    console.log(`[${DEBUG_ID}] Returning results. Segments: ${finalSegments.length}. Text preview: ${firstWords}`);
    
    return NextResponse.json({ 
      transcription: { 
        ...transcription,
        segments: finalSegments 
      }, 
      debugId: DEBUG_ID 
    });
  } catch (error: any) {
    console.error(`[${DEBUG_ID}] Error:`, error);
    const msg = error.message || "Unknown error";
    const code = error.status || 500;
    
    // IF THE USER SEES THIS, THEY ARE ON THE NEW CODE
    return NextResponse.json({ 
      error: `QuickCap AI Error [${DEBUG_ID}]: ${msg}`, 
      status: code 
    }, { status: code });
  }
}
