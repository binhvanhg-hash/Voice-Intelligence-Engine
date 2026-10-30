import { Phrase, WordTiming } from "../types";

export type SegmentationConfig = {
  phrasePauseMs: number;
  strongPauseMs: number;
};

export const DEFAULT_CONFIG: SegmentationConfig = {
  phrasePauseMs: 320,
  strongPauseMs: 700,
};

export function addPauseMetrics(words: WordTiming[]): WordTiming[] {
  return words.map((w, i) => {
    const next = words[i + 1];
    const pauseAfterMs = next ? Math.max(0, Math.round((next.start - w.end) * 1000)) : 0;
    return { ...w, pauseAfterMs };
  });
}

export function segmentPhrases(inputWords: WordTiming[], cfg: SegmentationConfig = DEFAULT_CONFIG): Phrase[] {
  const words = addPauseMetrics(inputWords);
  const phrases: Phrase[] = [];
  let bucket: WordTiming[] = [];

  const flush = () => {
    if (!bucket.length) return;
    const start = bucket[0].start;
    const end = bucket[bucket.length - 1].end;
    const duration = Math.max(0.001, end - start);
    const pauseAfterMs = bucket[bucket.length - 1].pauseAfterMs ?? 0;
    phrases.push({
      id: `P${String(phrases.length + 1).padStart(3, "0")}`,
      start,
      end,
      text: bucket.map(w => w.text).join(" "),
      words: bucket,
      pauseAfterMs,
      wordsPerSecond: Number((bucket.length / duration).toFixed(2)),
    });
    bucket = [];
  };

  for (const word of words) {
    bucket.push(word);
    if ((word.pauseAfterMs ?? 0) >= cfg.phrasePauseMs) flush();
  }
  flush();
  return phrases;
}

export function classifyPause(ms: number) {
  if (ms >= 1000) return "dramatic";
  if (ms >= 700) return "strong";
  if (ms >= 320) return "phrase";
  if (ms >= 180) return "micro";
  return "none";
}
