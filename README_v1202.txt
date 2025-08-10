DeenSprouts FIX PACK v1202
===========================
A) Strong HTML cleanup (weird chars + remove "Sign up" + relabel "Log in" + footer normalize)
B) DS Health tester to debug video loading (calls your Netlify Functions from the page).

FILES
-----
tools/cleanup_site.ps1        ← sanitize all *.html (recursively). Creates .bak backups.
tools/add_health_include.ps1  ← injects one line into index.html & video.html to load the tester.
js/ds-health.v1202.js         ← health panel (press H to toggle).

USAGE
-----
1) Copy /tools and /js into your project root.
2) Cleanup HTML:
   powershell -ExecutionPolicy Bypass -File tools/cleanup_site.ps1 -Root .
3) Add health tester:
   powershell -ExecutionPolicy Bypass -File tools/add_health_include.ps1
4) Commit & redeploy. Open your site, click DS Health buttons.

If Videos Still Don’t Load
--------------------------
• Ensure Netlify env var: YT_API_KEY (Build & deploy → Environment).
• Test endpoints:
  /.netlify/functions/health
  /.netlify/functions/videos?q=islamic%20kids&max=6
  /.netlify/functions/shorts?q=islamic%20kids&max=6
• Check Netlify → Functions logs for errors.
• Clear cache and redeploy, then hard refresh (Ctrl/Cmd+Shift+R).

Rollback
--------
Each script creates .bak backups next to edited files.
