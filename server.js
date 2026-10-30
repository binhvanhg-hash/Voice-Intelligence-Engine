import express from "express";
import cors from "cors";
import multer from "multer";
import os from "os";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3001;
const TRANSCRIBE_MODEL = process.env.TRANSCRIBE_MODEL || "gemini-3.5-transcribe";
const SEMANTIC_MODEL = process.env.SEMANTIC_MODEL || "gemini-3.8-flash";
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const uploadDir = path.join(os.tmpdir(), "avenan-voice-intelligence");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir, limits: { fileSize: 500 * 1024 * 1024 } });

function aiClient() {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY on server.");
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}
function parseOffset(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  const m = s.match(/^([\d.]+)s$/);
  return m ? Number(m[1]) : Number(s) || 0;
}
function cleanText(words) {
  return words.map(w => w.text).join(" ").replace(/\s+([,.;!?])/g, "$1").replace(/\s+/g, " ").trim();
}
function extractWords(interaction) {
  const words = [];
  for (const step of interaction.steps ?? []) for (const content of step.content ?? []) for (const a of content.annotations ?? []) {
    if (a.type === "word_info") words.push({ text: a.text ?? "", start: parseOffset(a.start_offset), end: parseOffset(a.end_offset) });
  }
  return words.filter(w => w.text && Number.isFinite(w.start) && Number.isFinite(w.end));
}
function addPauseMetrics(input) {
  return input.map((w, i) => ({ ...w, pauseAfterMs: i < input.length - 1 ? Math.max(0, Math.round((input[i + 1].start - w.end) * 1000)) : 0 }));
}
function pauseClass(ms) {
  if (ms >= 1000) return "dramatic";
  if (ms >= 700) return "strong";
  if (ms >= 320) return "phrase";
  if (ms >= 180) return "micro";
  return "none";
}
function phraseSegments(input, phrasePauseMs = 320, maxPhraseSec = 10) {
  const words = addPauseMetrics(input); const out = []; let bucket = [];
  const flush = () => {
    if (!bucket.length) return;
    const start = bucket[0].start, end = bucket[bucket.length - 1].end;
    const duration = Math.max(.001, end - start); const pauseAfterMs = bucket[bucket.length - 1].pauseAfterMs || 0;
    out.push({ id: `P${String(out.length + 1).padStart(3,"0")}`, start:+start.toFixed(3), end:+end.toFixed(3), duration:+duration.toFixed(3), text:cleanText(bucket), pauseAfterMs, pauseClass:pauseClass(pauseAfterMs), wordsPerSecond:+(bucket.length/duration).toFixed(2), words:bucket });
    bucket=[];
  };
  for (const w of words) {
    bucket.push(w);
    const duration = w.end - bucket[0].start;
    if ((w.pauseAfterMs || 0) >= phrasePauseMs || duration >= maxPhraseSec) flush();
  }
  flush(); return { words, phrases: out };
}
function parseJson(text) {
  const c = String(text || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(c); } catch {}
  const a=c.indexOf("["); const b=c.lastIndexOf("]"); if(a>=0&&b>a) return JSON.parse(c.slice(a,b+1));
  const x=c.indexOf("{"); const y=c.lastIndexOf("}"); if(x>=0&&y>x) return JSON.parse(c.slice(x,y+1));
  throw new Error("Model returned non-JSON output.");
}
const ACTIONS = new Set(["HOLD","MICRO_MOTION","COMPOSITION_CHANGE","SHOT_CHANGE","SCENE_CHANGE","SILENCE_HOLD"]);
function fallbackAction(p) {
  if (p.pauseAfterMs >= 1000) return "SILENCE_HOLD";
  if (p.pauseAfterMs >= 700) return "SHOT_CHANGE";
  if (p.pauseAfterMs >= 320) return "MICRO_MOTION";
  return "HOLD";
}

app.get("/api/health", (req,res)=>res.json({ok:true, app:"AVENAN Voice Intelligence Engine", version:"1.0.0", transcribeModel:TRANSCRIBE_MODEL, semanticModel:SEMANTIC_MODEL}));

app.post("/api/transcribe", upload.single("audio"), async (req,res) => {
  try {
    if (!req.file) return res.status(400).json({error:"Audio file is required."});
    const language = String(req.body.language || "").trim();
    const phrasePauseMs = Math.max(120, Number(req.body.phrasePauseMs || 320));
    const ai = aiClient();
    const f = await ai.files.upload({ file:req.file.path, config:{ mimeType:req.file.mimetype || "audio/mpeg" } });
    const transcription_config = { mode:{type:"verbatim"}, timestamp_granularities:["word"] };
    if (language && language !== "auto") transcription_config.language_codes=[language];
    const interaction = await ai.interactions.create({ model:TRANSCRIBE_MODEL, input:[{type:"audio",uri:f.uri,mime_type:f.mimeType}], generation_config:{transcription_config} });
    const rawWords = extractWords(interaction);
    if (!rawWords.length) throw new Error("No word-level timestamps returned.");
    const { words, phrases } = phraseSegments(rawWords, phrasePauseMs);
    const duration = words[words.length-1].end;
    res.json({ transcript:interaction.output_text || cleanText(words), duration, wordCount:words.length, phraseCount:phrases.length, words, phrases });
  } catch(e) { console.error(e); res.status(500).json({error:e.message || "Transcription failed."}); }
  finally { if(req.file?.path) fs.unlink(req.file.path,()=>{}); }
});

app.post("/api/analyze-beats", async (req,res) => {
  try {
    const { phrases=[], profile="GENERIC_VOICE_FIRST", projectId="AVENAN_VOICE_PROJECT" } = req.body || {};
    if (!Array.isArray(phrases) || !phrases.length) return res.status(400).json({error:"Phrases are required."});
    const compact = phrases.map(p=>({id:p.id,start:p.start,end:p.end,text:p.text,pauseAfterMs:p.pauseAfterMs,wordsPerSecond:p.wordsPerSecond,pauseClass:p.pauseClass}));
    const profileText = profile === "THE_IRON_MIND" ? "Minimal hand-drawn symbolic illustration, dark/black scene canvas, chalk/charcoal feeling, simple figures/objects, subtle continuous motion, narration-led, low production cost." : "Voice-first visual essay, simple symbolic or realistic composition, restrained motion, continuity before novelty.";
    const prompt = `You are AVENAN Voice Intelligence. Timing is LOCKED and must never change. Return JSON object {\"items\":[...]} with exactly one item per input phrase in same order. Each item fields: id, narrativeFunction (HOOK|SETUP|TENSION|QUESTION|EVIDENCE|REVEAL|REFLECTION|TRANSITION|CTA), emotion, intensity (0..1), semanticShift boolean, majorShift boolean, visualAction (HOLD|MICRO_MOTION|COMPOSITION_CHANGE|SHOT_CHANGE|SCENE_CHANGE|SILENCE_HOLD), subject, environment, action, camera, motion, imagePrompt, videoPrompt. Prefer HOLD/MICRO_MOTION over cuts unless meaning truly changes. Do not create one new image per sentence. Profile: ${profileText}. Project: ${projectId}. Phrases: ${JSON.stringify(compact)}`;
    const ai=aiClient();
    const result=await ai.models.generateContent({model:SEMANTIC_MODEL,contents:prompt,config:{responseMimeType:"application/json",temperature:.25}});
    const parsed=parseJson(result.text); const items=Array.isArray(parsed)?parsed:parsed.items;
    if(!Array.isArray(items)) throw new Error("Semantic analysis returned no items.");
    const beats=phrases.map((p,i)=>{ const x=items[i]||{}; return { id:`V${String(i+1).padStart(3,"0")}`, phraseId:p.id, start:p.start, end:p.end, duration:p.duration, narration:p.text, pauseAfterMs:p.pauseAfterMs, pauseClass:p.pauseClass, wordsPerSecond:p.wordsPerSecond, narrativeFunction:x.narrativeFunction||"SETUP", emotion:x.emotion||"neutral", intensity:Number.isFinite(Number(x.intensity))?Math.max(0,Math.min(1,Number(x.intensity))):.5, semanticShift:!!x.semanticShift, majorShift:!!x.majorShift, visualAction:ACTIONS.has(x.visualAction)?x.visualAction:fallbackAction(p), visual:{ subject:x.subject||"", environment:x.environment||"", action:x.action||"", camera:x.camera||"locked or subtle push-in", motion:x.motion||"subtle continuous motion", imagePrompt:String(x.imagePrompt||"").replace(/[\r\n]+/g," ").trim(), videoPrompt:String(x.videoPrompt||"").replace(/[\r\n]+/g," ").trim() } }; });
    res.json({beats});
  } catch(e) { console.error(e); res.status(500).json({error:e.message || "Beat analysis failed."}); }
});

app.post("/api/regenerate-beat", async (req,res)=>{
  try {
    const { beat, profile="GENERIC_VOICE_FIRST" }=req.body||{}; if(!beat) return res.status(400).json({error:"Beat is required."});
    const ai=aiClient();
    const prompt=`Regenerate only the visual plan for this narration beat. Keep start/end/narration unchanged. Return JSON with visualAction, subject, environment, action, camera, motion, imagePrompt, videoPrompt. Profile=${profile}. Beat=${JSON.stringify(beat)}. Prefer continuity and subtle motion; no readable generated text or logos.`;
    const r=await ai.models.generateContent({model:SEMANTIC_MODEL,contents:prompt,config:{responseMimeType:"application/json",temperature:.4}}); const x=parseJson(r.text);
    res.json({ visualAction:ACTIONS.has(x.visualAction)?x.visualAction:beat.visualAction, visual:{subject:x.subject||"",environment:x.environment||"",action:x.action||"",camera:x.camera||"",motion:x.motion||"",imagePrompt:String(x.imagePrompt||"").replace(/[\r\n]+/g," ").trim(),videoPrompt:String(x.videoPrompt||"").replace(/[\r\n]+/g," ").trim()} });
  } catch(e){ console.error(e); res.status(500).json({error:e.message||"Regeneration failed."}); }
});

const dist=path.resolve("dist");
if(fs.existsSync(dist)){ app.use(express.static(dist)); app.get("*",(req,res)=>res.sendFile(path.join(dist,"index.html"))); }
app.listen(PORT,()=>console.log(`AVENAN Voice Intelligence Engine running on ${PORT}`));
