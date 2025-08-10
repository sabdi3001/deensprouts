DeenSprouts — Infinite Scale Patch (v1204)
==========================================
Hybrid loader: try Netlify Functions first; if quota/errors, fall back to static JSON under /data/*.json.

Install
-------
1) Copy `js/data-mode.v1204.js` and the entire `data` folder into your site root.
2) In index.html and video.html, include this before </body>:
   <script src="js/data-mode.v1204.js?v=1204"></script>
3) (Optional) Add a banner that appears only when fallback is used:
   <div id="quotaBanner" style="display:none;margin:10px auto;max-width:960px;padding:10px 14px;border:1px solid #e6efe9;border-radius:8px;background:#f7fbf9;color:#0b6b53;font:14px system-ui">
     Showing cached videos while we update new content.
   </div>

Populate static JSON
--------------------
A) Quick: when API works, open your live endpoints and paste the JSON into `data/videos.json` and `data/shorts.json`:
   /.netlify/functions/videos?q=islamic%20kids&max=20
   /.netlify/functions/shorts?q=islamic%20kids&max=21

B) Later: schedule a job (GitHub Actions or Netlify Scheduled Functions + KV/Blobs) to refresh these JSONs hourly.

Result
------
Your homepage and related sidebar will always render—even during quotaExceeded.
