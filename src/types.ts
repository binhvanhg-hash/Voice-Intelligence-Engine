export type WordTiming = {
  text: string;
  start: number;
  end: number;
  pauseAfterMs?: number;
};

export type Phrase = {
  id: string;
  start: number;
  end: number;
  text: string;
  words: WordTiming[];
  pauseAfterMs: number;
  wordsPerSecond: number;
};

export type VisualAction =
  | "HOLD"
  | "MICRO_MOTION"
  | "COMPOSITION_CHANGE"
  | "SHOT_CHANGE"
  | "SCENE_CHANGE"
  | "SILENCE_HOLD";

export type VisualBeat = {
  id: string;
  start: number;
  end: number;
  narration: string;
  narrativeFunction: string;
  emotion: string;
  intensity: number;
  visualAction: VisualAction;
  visual: {
    subject: string;
    environment: string;
    action: string;
    camera: string;
    motion: string;
    imagePrompt: string;
    videoPrompt: string;
  };
};
