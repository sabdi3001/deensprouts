DeenSprouts FINAL KIT (Minimal, non-destructive)
==============================================

This kit avoids touching your page layout. You only add 1-line <script> includes
and deploy the functions. It covers:
- Nav relabel: "Log in/Sign up" + removes separate Sign up link
- Hide "Upload" link unless user is signed in (Netlify Identity)
- Robust Identity loader
- Related rail de-duplication + Shorts awareness (watch page)
- YouTube search endpoints that only return EMBEDDABLE results
- Upload endpoints (auth-guarded) using Netlify Blobs

-------------------------------------
1) Files to copy into your repo
-------------------------------------
/js/nav.login-label.js
/js/auth-ui.v1103.js
/js/identity.v1104.js
/js/app.v1102.js          (ONLY if you want the deenshorts/discover loaders from me)
/js/watch.v1102.js        (ONLY if you want the related de-dup/shuffle from me)

/netlify/functions/health.js
/netlify/functions/videos.js
/netlify/functions/shorts.js
/netlify/functions/related.js
/netlify/functions/video_meta.js
/netlify/functions/upload.js
/netlify/functions/upload_url.js
/netlify/functions/uploads_list.js

-------------------------------------
2) Add these ONE-LINE includes (keeps your formatting intact)
-------------------------------------
Place BEFORE </body> on every page (index.html, video.html, contact.html, policy.html, upload.html, auth.html):
  <script src="js/nav.login-label.js?v=final"></script>
  <script src="js/auth-ui.v1103.js?v=final"></script>
  <script src="js/identity.v1104.js?v=final"></script>

On index.html (if you want my loaders), add:
  <script src="js/app.v1102.js?v=final"></script>

On video.html (for fixed related rail), add:
  <script src="js/watch.v1102.js?v=final"></script>

-------------------------------------
3) Netlify settings
-------------------------------------
- Enable Identity: Site settings → Identity → Enable
- Environment variables (Site settings → Build & deploy → Environment):
  YT_API_KEY=YOUR_YOUTUBE_API_KEY

- Optional (if using uploads): no extra config; Netlify Blobs is on by default.
  This kit stores:
    store 'uploads'       → binary video blobs
    store 'uploads-index' → JSON list of uploads

-------------------------------------
4) Deploy
-------------------------------------
git add js/*.js netlify/functions/*.js
git commit -m "Final kit: nav label, identity UI, videos/shorts api, uploads, related dedupe"
git push

Then in Netlify: Deploys → Clear cache and deploy site. Hard refresh browser.

-------------------------------------
5) Notes
-------------------------------------
- The API routes only return embeddable content (videoEmbeddable=true & videoSyndicated=true).
- "Upload" links are hidden unless a user is logged in via Identity.
- watch.v1102.js de-dupes related results and prefers Shorts on Shorts pages.

