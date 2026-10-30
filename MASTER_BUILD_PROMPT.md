# GOOGLE AI STUDIO BUILD PROMPT
## AVENAN VOICE INTELLIGENCE ENGINE V1.0

This repository already contains a working full-stack implementation. **Preserve working code and repair/complete it; do not replace it with a mock UI.**

## PRIMARY GOAL
Convert finished narration audio into an editable machine-readable production timeline.

**VOICE IS THE MASTER TIMELINE.**

## REQUIRED PIPELINE
1. Upload MP3/WAV/M4A/AAC/OGG/FLAC.
2. Render waveform locally with Web Audio API.
3. Transcribe real audio with word-level start/end timestamps.
4. Normalize every word to `{ text, start, end, pauseAfterMs }`.
5. Calculate pause/rhythm metrics and phrase segmentation.
6. Lock timing.
7. Run narrative intelligence without changing timing.
8. Run visual intelligence without changing timing.
9. Allow manual beat editing, split, merge and selected-beat regeneration.
10. Export JSON, CSV, SRT and one-prompt-per-line TXT.

## EXISTING IMPLEMENTATION — MUST USE
- `server.js`
- `src/main.jsx`
- `src/styles.css`
- `src/types.ts`
- `src/engine/geminiTranscribe.ts`
- `src/engine/pauseAnalyzer.ts`
- `src/engine/visualBeatPlanner.ts`
- `schemas/voice_visual_timeline.schema.json`
- `docs/ARCHITECTURE.md`
- `docs/TEST_PLAN.md`

## SECURITY
`GEMINI_API_KEY` is server-side only. Never expose it in React/client code.

## TIMING INVARIANT
Semantic/visual model output may classify or describe a beat but may never rewrite the master word timestamps.

Default pause thresholds:
- micro: 180 ms
- phrase: 320 ms
- strong: 700 ms
- dramatic: 1000 ms

## NARRATIVE INTELLIGENCE
Each beat supports:
- narrativeFunction: HOOK | SETUP | TENSION | QUESTION | EVIDENCE | REVEAL | REFLECTION | TRANSITION | CTA
- emotion
- intensity 0..1
- semanticShift
- majorShift

## VISUAL INTELLIGENCE
Visual actions:
- HOLD
- MICRO_MOTION
- COMPOSITION_CHANGE
- SHOT_CHANGE
- SCENE_CHANGE
- SILENCE_HOLD

Policy:
- continuity before novelty
- prefer HOLD/MICRO_MOTION when meaning continues
- do not use 1 sentence = 1 image
- use cuts only when narrative meaning warrants them

Every beat supports:
- subject
- environment
- action
- camera
- motion
- imagePrompt
- videoPrompt

## CHANNEL PROFILES
V1 must preserve:
- `THE_IRON_MIND`: minimal hand-drawn symbolic illustration, dark/black scene canvas, chalk/charcoal feel, subtle continuous movement, narration-led, low-cost production.
- `GENERIC_VOICE_FIRST`: simple symbolic/realistic visual essay, restrained movement, narration-led.

The architecture must allow EARTH_STORY, PERSONAL_FINANCE_VN and 3D_MEDICAL profiles later without changing the timing engine.

## UI REQUIREMENTS
White high-readability workspace with blue accents; responsive/mobile-friendly.

Required areas:
- project/profile/language/audio controls
- waveform
- transcript
- phrase lane
- visual beat lane
- beat sheet
- selected-beat inspector
- split / merge-next / regenerate
- JSON / CSV / SRT / TXT export

## EXPORT CONTRACT
- `visual_timeline.json`
- `beat_sheet.csv`
- `subtitle.srt`
- `prompts.txt`

JSON follows `schemas/voice_visual_timeline.schema.json` conceptually and preserves audio/word timing.

TXT contains exactly one production prompt per line, without headings/timestamps/metadata.

## ERROR HANDLING
Show clear errors for unsupported audio, upload failure, missing key, transcription failure, no timestamps, quota/rate limit, semantic failure and empty output.

## V1.0 DEFINITION OF DONE
PASS only when a user can:
1. upload real narration audio
2. see a local waveform
3. obtain word timestamps
4. see pauses/phrases
5. obtain narrative and visual beats
6. inspect/edit/split/merge/regenerate selected beats
7. export JSON/CSV/SRT/TXT
8. preserve voice timing throughout
9. use the app on desktop and mobile

Do not stop at static UI or mock data.
