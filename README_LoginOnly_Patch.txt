DeenSprouts Login-Only Patch v1105
===================================
This patch does two things only:
1) Renames your nav label "Log in" -> "Log in/Sign up" (keeps the same link).
2) Removes any separate "Sign up" link/button if present.
It does NOT change your layout/styles.

Files in this patch:
- nav.login-signup-label.v1105.js
- _redirects  (optional: routes /signup and /signup.html to your login page to avoid 404s)

How to apply:
1) Copy nav.login-signup-label.v1105.js into your site's /js/ (or root) folder.
2) On EVERY page where the nav appears (index.html, video.html, contact.html, policy.html, upload.html, auth.html),
   add this single line just before </body>:
     <script src="js/nav.login-signup-label.v1105.js?v=1105"></script>
   (Adjust the path if you place the file somewhere else.)

3) If you want to prevent broken links to an old signup page, add the included _redirects file to your repo root.
   - If you already have a _redirects file, simply append these lines to it:
       /signup        /auth        301
       /signup.html   /auth.html   301

4) (Optional) Delete signup.html from your repo if it exists.

5) Commit & push:
   git add js/nav.login-signup-label.v1105.js _redirects
   git commit -m "Patch v1105: remove separate signup; relabel login to 'Log in/Sign up'"
   git push

6) Netlify: Deploys → Clear cache and deploy site. Then hard refresh your browser.

Rollback:
- Remove the <script> include from your pages.
- Remove the lines from _redirects if you added them.
