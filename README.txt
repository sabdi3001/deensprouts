DeenSprouts — Command Prompt Cleanup Pack (v1201)
=================================================
What this does (recursively over *.html):
1) Removes standalone **Sign up** links/buttons (safe patterns).
2) Cleans footer text to a clean:  © DeenSprouts  (removes weird characters and duplicates).
3) Renames nav and button text **"Log in" / "Login" → "Log in/Sign up"** inside <a> or <button> tags ONLY.
4) Creates a backup *.bak next to every modified file.

It does NOT touch your CSS or layout; edits are conservative regex replacements.

Included
--------
- tools\cleanup_site.ps1    (PowerShell script that does the edits)
- tools\run_cleanup.bat     (Double‑click runner for Windows)
- README.txt                 (this file)

How to use (Windows)
--------------------
1) Copy the `tools` folder into the **root** of your website project (same level as your .html files).
2) Double‑click `tools\run_cleanup.bat` (or run it in Command Prompt).
   - It scans ALL *.html files in the current folder and subfolders.
   - Every changed file is backed up as <filename>.bak
3) Review the console output. If happy, delete the .bak files.
4) Commit and deploy your site.

Rollback
--------
Replace any file with its .bak counterpart.

Notes
-----
• "Sign up" removal targets elements by:
  - id="signupLink"
  - href containing "signup"
  - visible text "Sign up" (case‑insensitive; allows spaces like "Sign   up").
  It removes entire <a> or <button>, and cleans up empty <li> shells.

• "Log in" relabel only updates text INSIDE <a>…</a> or <button>…</button>.
  It won’t touch headings or paragraphs.

• Footer cleanup:
  - Normalizes &copy;, (c), &#169; → ©
  - Removes bad encoding artifacts (Â, �)
  - Normalizes variants to:  © DeenSprouts
