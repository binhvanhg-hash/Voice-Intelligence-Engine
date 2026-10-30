# AVENAN Voice Intelligence Engine V1.0

**VOICE IS THE MASTER TIMELINE.**

Standalone engine for converting finished narration audio into an editable, machine-readable production timeline.

## Pipeline

```text
Audio
→ local waveform
→ word-level timestamps
→ pause/rhythm metrics
→ phrase segmentation
→ narrative intelligence
→ visual intelligence
→ editable beat timeline
→ JSON / CSV / SRT / TXT
```

## Implemented V1.0
- MP3/WAV/M4A/AAC/OGG/FLAC upload
- browser-side waveform rendering with Web Audio API
- Gemini word-level transcription timestamps
- pauseAfterMs + pause classes
- phrase duration + words-per-second
- narrativeFunction / emotion / intensity
- semanticShift / majorShift
- visual actions: HOLD, MICRO_MOTION, COMPOSITION_CHANGE, SHOT_CHANGE, SCENE_CHANGE, SILENCE_HOLD
- channel profiles: THE_IRON_MIND and GENERIC_VOICE_FIRST
- editable Beat Inspector
- manual split / merge-next
- regenerate selected visual beat only
- imagePrompt + videoPrompt
- exports: visual_timeline.json, beat_sheet.csv, subtitle.srt, prompts.txt
- server-side Gemini API key
- responsive desktop/mobile UI
- GitHub Actions build validation

## Architecture rule
Timing is locked before semantic analysis. Gemini may classify meaning and propose visuals, but it must not rewrite the master word timestamps.

## Run locally

```bash
npm install
cp .env.example .env
# add GEMINI_API_KEY to your environment
npm run dev
```

Frontend: `http://localhost:5173`
Server: `http://localhost:3001`

> Node does not automatically load `.env` in this repo. Set `GEMINI_API_KEY` in your shell/runtime or use the secret/environment system provided by Google AI Studio/deployment host.

## Google AI Studio
Import this repository directly and read `docs/AI_STUDIO_IMPORT.md` plus `MASTER_BUILD_PROMPT.md`.

Repository source of truth:
`binhvanhg-hash/Voice-Intelligence-Engine`

## Key files
- `server.js` — transcription + semantic/visual API
- `src/main.jsx` — waveform/timeline/editor/export UI
- `src/engine/` — reusable timing/visual policy modules
- `schemas/voice_visual_timeline.schema.json` — canonical timeline contract
- `docs/ARCHITECTURE.md` — system architecture
- `docs/TEST_PLAN.md` — validation gates

## First production test
Use a 20–40 second THE IRON MIND narration before long-form audio.
