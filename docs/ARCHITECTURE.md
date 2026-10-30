# AVENAN Voice Intelligence Engine — Architecture V1.0

```text
Narration Audio
   |
   +-- Browser Web Audio API
   |     +-- decodeAudioData
   |     +-- local waveform rendering
   |     +-- duration cross-check
   |
   +-- POST /api/transcribe
   |     +-- Gemini Files API
   |     +-- word-level timestamps
   |     +-- pauseAfterMs
   |     +-- pause class
   |     +-- phrase segmentation
   |     +-- words per second
   |
   +-- POST /api/analyze-beats
   |     +-- timing is locked
   |     +-- narrative function
   |     +-- emotion/intensity
   |     +-- semantic shift
   |     +-- visual action
   |     +-- image/video prompt
   |
   +-- Editable Timeline UI
   |     +-- phrase lane
   |     +-- visual beat lane
   |     +-- beat inspector
   |     +-- manual split/merge
   |     +-- regenerate visual only
   |
   +-- Exports
         +-- visual_timeline.json
         +-- beat_sheet.csv
         +-- subtitle.srt
         +-- prompts.txt
```

## Invariants
1. Voice/audio timing is the source of truth.
2. Semantic analysis cannot mutate word timestamps.
3. Narrative beats and visual beats are separate layers.
4. One sentence does not automatically equal one visual.
5. Prefer HOLD/MICRO_MOTION before cutting.
6. API keys remain server-side.

## Channel profiles
V1 ships with:
- THE_IRON_MIND
- GENERIC_VOICE_FIRST

Additional profiles can be added without changing the timing engine.
