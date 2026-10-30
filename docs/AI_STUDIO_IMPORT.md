# Google AI Studio Import

1. Open Google AI Studio Build.
2. Import GitHub repository: `binhvanhg-hash/Voice-Intelligence-Engine`.
3. Use branch `main`.
4. Add server secret `GEMINI_API_KEY`.
5. Ask the builder to read `MASTER_BUILD_PROMPT.md` and preserve existing working code.
6. Run the app and test with a 20–40 second narration file.

Recommended builder instruction:

`Read MASTER_BUILD_PROMPT.md and the existing repository. Fix any environment-specific incompatibility without replacing the working architecture. Preserve audio timestamps as the source of truth. Finish the app until the V1 Definition of Done passes.`

Do not put the API key into React/client code.
