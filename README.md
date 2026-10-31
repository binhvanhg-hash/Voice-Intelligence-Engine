# AVENAN Voice Intelligence Engine V1.2

**VOICE IS THE MASTER TIMELINE. BRAND DNA IS THE PROJECT STANDARD.**

Standalone engine for converting finished narration audio into an editable production timeline while preserving a reusable channel/brand standard.

## Pipeline

```text
Project Workspace
→ Brand Kit / Channel Files
→ Brand DNA Lock
→ Voice Audio + Voice Text
→ local waveform
→ word-level timestamps
→ pause/rhythm metrics
→ phrase segmentation
→ Style Reference Images
→ Visual DNA
→ narrative intelligence
→ visual intelligence
→ editable beat timeline
→ JSON / CSV / SRT / KEYFRAME TXT / MOTION TXT
```

## Project Workspace
- `+ TẠO DỰ ÁN` creates an independent channel/project workspace.
- Each project keeps its own profile, language and Brand DNA.
- Project metadata and extracted Brand DNA are stored in browser localStorage.
- Switching projects clears episode-level audio/script/timeline data to prevent cross-project contamination.

## Brand Kit / Brand DNA
Upload up to 20 brand/channel files per analysis:
- images / logo / visual references
- PDF
- DOCX
- TXT / Markdown / JSON / CSV

`ANALYZE & LOCK BRAND DNA` extracts a durable project standard including positioning, audience, promise, tone, content pillars, narrative rules, visual identity, hard rules, forbidden traits, keyframe prompt prefix and motion rules.

Priority order during prompt generation:

```text
BRAND DNA
  ↓ governs
STYLE DNA
  ↓ guides current video
CHANNEL PROFILE
  ↓ fallback only
VOICE / BEAT CONTENT
```

## Voice + Visual Intelligence
- MP3/WAV/M4A/AAC/OGG/FLAC upload
- browser-side waveform rendering with Web Audio API
- Gemini word-level transcription timestamps
- pauseAfterMs + pause classes
- phrase duration + words-per-second
- narrativeFunction / emotion / intensity
- visual actions: HOLD, MICRO_MOTION, COMPOSITION_CHANGE, SHOT_CHANGE, SCENE_CHANGE, SILENCE_HOLD
- editable Beat Inspector
- manual split / merge-next
- regenerate selected visual beat only
- imagePrompt + videoPrompt
- server-side Gemini API key

## Exports
- `<PROJECT>_visual_timeline.json` includes Brand DNA + Visual DNA + timing + beats
- `<PROJECT>_beat_sheet.csv`
- `<PROJECT>_subtitle.srt`
- `<PROJECT>_01_keyframe_prompts.txt`
- `<PROJECT>_02_video_motion_prompts.txt`

TXT prompt files contain one numbered prompt per line.

## Architecture rule
Timing is locked before semantic analysis. Gemini may classify meaning and propose visuals, but it must not rewrite master word timestamps. Brand DNA governs project identity; Style DNA is a per-production visual reference layer.

## Run locally

```bash
npm install
# provide GEMINI_API_KEY through your runtime/secrets system
npm run dev
```

Server/app: `http://localhost:3000`

## Google AI Studio
Import this repository directly. Keep `GEMINI_API_KEY` server-side. Repository source of truth:
`binhvanhg-hash/Voice-Intelligence-Engine`
