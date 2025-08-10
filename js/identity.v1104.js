// js/identity.v1104.js — graceful Identity loader; click opens modal
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  async function identityAvailable(){
    try{ const r=await fetch('/.netlify/identity/settings',{cache:'no-store'}); return r.ok; }catch(e){ return false; }
  }
  ready(async function(){
    var login=document.getElementById('loginLink'); if(login) login.textContent='Log in/Sign up';
    if(!(await identityAvailable())) return;
    var s=document.createElement('script'); s.src='https://identity.netlify.com/v1/netlify-identity-widget.js'; s.defer=true;
    s.onload=function(){ if(window.netlifyIdentity && login){ login.addEventListener('click', function(e){ e.preventDefault(); netlifyIdentity.open('login'); }); } };
    document.head.appendChild(s);
  });
})();