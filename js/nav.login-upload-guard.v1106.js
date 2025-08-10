document.addEventListener('DOMContentLoaded', function() {
  const loginLink = document.querySelectorAll('a[href="auth.html"], a[href="/auth.html"]');
  loginLink.forEach(link => { link.textContent = "Log in/Sign up"; });
  const signupLinks = document.querySelectorAll('a[href*="signup"], a[href*="sign-up"], a#signup');
  signupLinks.forEach(link => link.remove());
  const uploadLink = document.querySelector('a[href="upload.html"], a[href="/upload.html"]');
  if(uploadLink){
    uploadLink.style.display = 'none';
    if(window.netlifyIdentity){
      window.netlifyIdentity.on('init', user => { uploadLink.style.display = user ? '' : 'none'; });
      window.netlifyIdentity.on('login', () => { uploadLink.style.display = ''; });
      window.netlifyIdentity.on('logout', () => { uploadLink.style.display = 'none'; });
    }
  }
});
