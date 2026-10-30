# AVENAN Voice Intelligence Engine

VOICE IS THE MASTER TIMELINE.

Pipeline:
Audio -> Gemini word timestamps -> Pause/Rhythm Analysis -> Narrative Beats -> Visual Beats -> Shot Plan -> Image/Video Prompt JSON.

Core outputs:
- word_timestamps.json
- audio_metrics.json
- narrative_beats.json
- visual_timeline.json
- prompts.json
- transcript.txt
- subtitle.srt
- beat_sheet.csv

This repository is the source of truth for the standalone Voice Intelligence Engine.

MVP scope:
1. Upload MP3/WAV/M4A.
2. Transcribe in verbatim mode with word-level timestamps.
3. Compute pauses from adjacent word boundaries.
4. Compute speaking-rate windows.
5. Segment phrases and candidate beats.
6. Convert narrative beats into visual beats.
7. Export structured JSON for downstream Flow/Veo/Image systems.

Planned evolution:
- V0.2 browser waveform + RMS/peak envelope using Web Audio API
- V0.3 Gemini semantic/emotion pass
- V0.4 Visual Bible profiles per channel
- V0.5 direct handoff to Veo3go/Flow jobs
