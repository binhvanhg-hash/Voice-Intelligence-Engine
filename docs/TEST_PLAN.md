# V1 Validation Plan

## Gate 1 — Timing integrity
- Use a 20–40 second narration first.
- Confirm browser duration and transcript duration are close.
- Spot-check at least 10 word boundaries.
- Confirm pauses are computed from adjacent word timestamps.

PASS: no systematic drift and no reordered narration.

## Gate 2 — Narrative analysis
- Inspect HOOK / TENSION / REVEAL / REFLECTION assignments.
- Confirm semantic analysis does not change start/end.

PASS: timing remains identical before and after semantic analysis.

## Gate 3 — Visual policy
- Verify HOLD and MICRO_MOTION are common when meaning is continuous.
- Verify SHOT_CHANGE/SCENE_CHANGE only appear at meaningful shifts.

PASS: engine does not behave as 1 sentence = 1 image.

## Gate 4 — Editing
- Split a beat.
- Merge it with the next beat.
- Regenerate one selected beat only.

PASS: manual edits do not alter unrelated beats.

## Gate 5 — Export
Export JSON, CSV, SRT and TXT.

PASS:
- JSON contains project/audio/words/beats.
- CSV row count equals beat count.
- SRT uses beat start/end.
- TXT contains one production prompt per line.

## First production target
THE IRON MIND, 20–40 second voice sample before long-form episodes.
