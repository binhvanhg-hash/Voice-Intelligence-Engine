import { Phrase, VisualAction, VisualBeat } from "../types";
import { classifyPause } from "./pauseAnalyzer";

export function chooseVisualAction(phrase: Phrase, semanticShift = false, majorShift = false): VisualAction {
  const pauseClass = classifyPause(phrase.pauseAfterMs);
  if (majorShift) return "SCENE_CHANGE";
  if (semanticShift && phrase.pauseAfterMs >= 700) return "SHOT_CHANGE";
  if (semanticShift) return "COMPOSITION_CHANGE";
  if (pauseClass === "dramatic") return "SILENCE_HOLD";
  if (pauseClass === "strong") return "SHOT_CHANGE";
  if (pauseClass === "phrase") return "MICRO_MOTION";
  return "HOLD";
}

export function makeDraftBeat(phrase: Phrase): VisualBeat {
  const action = chooseVisualAction(phrase);
  return {
    id: phrase.id.replace("P", "V"),
    start: phrase.start,
    end: phrase.end,
    narration: phrase.text,
    narrativeFunction: "UNCLASSIFIED",
    emotion: "neutral",
    intensity: 0.5,
    visualAction: action,
    visual: {
      subject: "",
      environment: "",
      action: "",
      camera: action === "HOLD" ? "locked" : "subtle push-in",
      motion: action === "HOLD" ? "minimal" : "subtle continuous motion",
      imagePrompt: "",
      videoPrompt: ""
    }
  };
}
