# GOOGLE AI STUDIO BUILD PROMPT
## AVENAN VOICE INTELLIGENCE ENGINE V0.1

Build a full-stack web application named **AVENAN Voice Intelligence Engine**.

## PRIMARY GOAL
Upload narration audio and convert it into a machine-readable visual production timeline.

VOICE IS THE MASTER TIMELINE.

## TECH
- React frontend
- Node server runtime
- `@google/genai` on server only
- `GEMINI_API_KEY` must remain server-side
- Gemini transcription model: `gemini-3.5-transcribe`
- transcription mode: `verbatim`
- timestamp granularities: `["word"]`

## CORE PIPELINE
1. Upload MP3/WAV/M4A.
2. Transcribe with word-level start/end timestamps.
3. Normalize to `{ text, start, end, pauseAfterMs }`.
4. Compute pauseAfterMs = next.start - current.end.
5. Segment phrases with default thresholds:
   - micro = 180 ms
   - phrase = 320 ms
   - strong = 700 ms
   - dramatic = 1000 ms
6. Compute phrase duration and words/sec.
7. Create draft visual beats.
8. Add a Gemini semantic pass that classifies:
   - narrativeFunction: HOOK | SETUP | TENSION | QUESTION | EVIDENCE | REVEAL | REFLECTION | CTA | TRANSITION
   - emotion
   - intensity 0..1
   - semanticShift boolean
   - majorShift boolean
9. Visual action policy:
   - no significant pause + no semantic shift => HOLD
   - phrase pause => MICRO_MOTION
   - semantic shift => COMPOSITION_CHANGE
   - strong pause or semantic shift + strong pause => SHOT_CHANGE
   - major topic shift => SCENE_CHANGE
   - dramatic pause after high-intensity statement => SILENCE_HOLD
10. Generate visual fields:
   - subject
   - environment
   - action
   - camera
   - motion
   - imagePrompt
   - videoPrompt
11. Export:
   - visual_timeline.json
   - prompts.json
   - transcript.txt
   - subtitle.srt
   - beat_sheet.csv

## UI
- White background, blue accents, high readability.
- Mobile-friendly.
- Project name + channel profile.
- Upload card.
- Waveform/timeline area.
- Transcript aligned to time.
- Narrative Beat lane.
- Visual Beat lane.
- Inspector panel for selected beat.
- Buttons: Analyze Voice, Generate Visual Timeline, Export JSON, CSV, SRT.
- Allow manual split/merge and visual-action override.

## IMPORTANT
- Do not generate a new image for every sentence.
- Preserve visual continuity.
- Separate narrative beats from visual beats.
- A visual may span multiple phrases.
- Prefer motion inside an existing composition before cutting.
- Every beat must have exact start/end seconds.
- JSON must validate against `schemas/voice_visual_timeline.schema.json`.
- Add clear upload/transcription/quota errors.
- Never expose API keys client-side.

## CHANNEL PROFILE SYSTEM
Create a profile abstraction so later we can add:
- THE_IRON_MIND
- EARTH_STORY
- PERSONAL_FINANCE_VN
- 3D_MEDICAL

For MVP provide THE_IRON_MIND profile:
minimal hand-drawn illustration, black visual canvas, simple symbolic compositions, continuous subtle movement, low-cost production, narration-led storytelling.

## DEFINITION OF DONE
Working upload -> transcription -> pause segmentation -> editable timeline -> visual beat generation -> JSON/CSV/SRT export.
Do not stop at mock UI.
