// identity.v1104.js — login-only UI hooks (no separate signup link)
(function(){
  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  async function identityAvailable(){
    try{ const r=await fetch('/.netlify/identity/settings',{cache:'no-store'}); return r.ok; }catch(e){ return false; }
  }
  ready(async function(){
    const login = document.getElementById('loginLink');
    // Ensure label is "Log in/Sign up"
    if(login) login.textContent = 'Log in/Sign up';
    const ok = await identityAvailable();
    if(!ok){
      // If Identity isn't enabled, keep the link pointing to auth.html
      return;
    }
    // Load Identity widget for modal login/signup
    const s=document.createElement('script');
    s.src='https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.defer=true;
    s.onload=function(){
      if(window.netlifyIdentity && login){
        login.addEventListener('click', function(e){ e.preventDefault(); netlifyIdentity.open('login'); });
      }
    };
    document.head.appendChild(s);
  });
})();