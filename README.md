# DeenSprouts — Full site (v9)

## What’s fixed
- Shorts truly come from YouTube Shorts: server filters to **<= 60s** and **embeddable** only.
- Regular videos exclude Shorts (`videoDuration=medium`).
- Logo shows on every page (`assets/logo.png`); replace with your real logo file.
- Related videos populate; comments and Login/Sign up visible.

## Deploy from GitHub (auto, no cache issues)
1) Replace your repo files with this folder (or unzip and commit).
2) Commit & push:
   ```bash
   git add .
   git commit -m "Deploy v9: shorts filter <=60s, logo, related, comments, headers"
   git push
   ```
3) In Netlify:
   - **Build command:** (leave blank)
   - **Publish directory:** `.`
   - **Env var:** `YOUTUBE_API_KEY=<your key>`
4) After “Published”, verify:
   - `/.netlify/functions/health` → `youtube_api_key: present`
   - `/.netlify/functions/videos?q=islamic%20kids` → JSON with `items`
   - `/.netlify/functions/shorts?q=islamic%20kids` → JSON with `items` (all <= 60s)

The JS filenames are versioned (`app.v901.js`, `watch.v901.js`) and headers enforce `Cache-Control: no-store`, so old cache won't persist.
