DS SAFE PATCH v1107 — zero-layout change
==========================================
What this does (and nothing else):
- Renames "Log in" to "Log in/Sign up" everywhere (same link target)
- Removes separate "Sign up" links/buttons
- Hides "Upload" link unless the user is signed in (Netlify Identity)
- Makes no edits to your HTML except adding ONE <script> tag at the end

Files
-----
js/nav.login-upload-guard.v1107.js
tools/patch_nav.ps1       (Windows PowerShell)
tools/patch_nav.sh        (macOS/Linux)

Quick install
-------------
1) Copy the /js and /tools folders into your project root.
2) Windows PowerShell (from your project root):
   powershell -ExecutionPolicy Bypass -File tools/patch_nav.ps1

   macOS/Linux:
   chmod +x tools/patch_nav.sh && ./tools/patch_nav.sh

   Both scripts create .bak backups before editing.

3) Commit & deploy:
   git add js/nav.login-upload-guard.v1107.js tools/patch_nav.* *.html
   git commit -m "v1107: login relabel, remove signup, upload guard (non-destructive)"
   git push

Roll back
---------
- Replace any page with its .bak counterpart (e.g., index.html.bak → index.html)
- Or remove the inserted line:
  <script src="js/nav.login-upload-guard.v1107.js?v=1107"></script>

Notes
-----
- If Netlify Identity is disabled, Upload remains hidden by design.
- This patch does not delete your signup page file. If you want it gone,
  delete signup.html manually or add a redirect (/signup → /auth.html).
