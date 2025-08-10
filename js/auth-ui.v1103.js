// js/auth-ui.v1103.js — hide Upload links unless signed in
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  function $all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel));}
  async function identityAvailable(){
    try{ const r=await fetch('/.netlify/identity/settings',{cache:'no-store'}); return r.ok; }catch(e){ return false; }
  }
  function hideUploads(){ $all('a[href$="upload.html"],[data-requires-auth]').forEach(a=>{ a.style.display='none'; }); }
  function showUploads(){ $all('a[href$="upload.html"],[data-requires-auth]').forEach(a=>{ a.style.display=''; }); }
  ready(async function(){
    hideUploads();
    if(!(await identityAvailable())) return;
    var s=document.createElement('script'); s.src='https://identity.netlify.com/v1/netlify-identity-widget.js'; s.defer=true;
    s.onload=function(){
      if(!window.netlifyIdentity) return;
      function update(u){ if(u) showUploads(); else hideUploads(); }
      netlifyIdentity.on('init', update);
      netlifyIdentity.on('login', update);
      netlifyIdentity.on('logout', ()=>hideUploads());
      netlifyIdentity.init();
    };
    document.head.appendChild(s);
  });
})();