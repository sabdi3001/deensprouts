DeenSprouts — Mods Only Patch v1106
===================================
This patch ONLY:
1) Renames "Log in" -> "Log in/Sign up" (keeps same link).
2) Removes separate "Sign up" links/buttons.
3) Hides the Upload link until a user is signed in via Netlify Identity.

Files included:
- js/nav.login-upload-guard.v1106.js

How to apply (non-destructive):
1) Copy js/nav.login-upload-guard.v1106.js into your repo (e.g., /js/).
2) Add ONE line before </body> on every page with the nav (index, video, contact, policy, upload, auth):
   <script src="js/nav.login-upload-guard.v1106.js?v=1106"></script>
3) Commit & deploy.

Tip: If Netlify Identity is disabled, Upload will remain hidden by design.
