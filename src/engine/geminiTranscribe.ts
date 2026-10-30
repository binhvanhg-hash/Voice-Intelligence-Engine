import { GoogleGenAI } from "@google/genai";

export async function transcribeWithWordTimestamps(filePath: string, mimeType = "audio/mp3") {
  const client = new GoogleGenAI({});
  const audioFile = await client.files.upload({
    file: filePath,
    config: { mime_type: mimeType },
  });

  const interaction = await client.interactions.create({
    model: "gemini-3.5-transcribe",
    input: [
      {
        type: "audio",
        uri: audioFile.uri,
        mime_type: audioFile.mimeType,
      },
    ],
    generation_config: {
      transcription_config: {
        mode: {
          type: "verbatim",
          timestamp_granularities: ["word"],
        },
      },
    },
  });

  const words: any[] = [];
  for (const step of interaction.steps ?? []) {
    for (const content of step.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        if (annotation.type === "word_info") words.push(annotation);
      }
    }
  }

  return {
    transcript: interaction.output_text,
    words,
  };
}
