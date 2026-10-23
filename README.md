# Off the Scale: render pipeline

Rendering code for the YouTube channel Off the Scale (Remotion + GitHub Actions). This repository is a mirror;
it is generated from a private studio repository and changes made here are overwritten.

Run a render: Actions → Render → Run workflow (`kind=video`, `composition=<id>`, `output=<name>`,
`episode=<slug>`). Finished files go to the `renders` release. Narration needs the `GEMINI_API_KEY` secret.
Footage and photos are public domain / CC0 / CC BY and are fetched at render time with their credits
(`studio/assets/manifest.json`).
