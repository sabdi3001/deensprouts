// auth-ui.v1103.js
// Hides all Upload links unless user is signed-in via Netlify Identity.
// Works even if Identity is disabled (keeps links hidden).
(function(){
  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  function $$ (sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  async function identityAvailable(){
    try{
      const r = await fetch('/.netlify/identity/settings', { cache:'no-store' });
      return r.ok;
    }catch(e){ return false; }
  }

  function hideUploadLinks(){
    $$('a[href$="upload.html"]').forEach(a=>{
      a.dataset._origDisplay = getComputedStyle(a).display;
      a.style.display = 'none';
      a.addEventListener('click', (e)=>{ e.preventDefault(); return false; }, { once: true });
    });
  }
  function showUploadLinks(){
    $$('a[href$="upload.html"]').forEach(a=>{
      a.style.display = a.dataset._origDisplay || '';
      a.onclick = null;
    });
  }

  ready(async function(){
    hideUploadLinks(); // hide by default

    const ok = await identityAvailable();
    if(!ok){
      // Identity not enabled => keep hidden
      return;
    }
    // Load widget
    const s=document.createElement('script');
    s.src='https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.defer=true;
    s.onload=function(){
      if(!window.netlifyIdentity){ return; }
      function updateUI(user){
        if(user){ showUploadLinks(); }
        else { hideUploadLinks(); }
      }
      netlifyIdentity.on('init', updateUI);
      netlifyIdentity.on('login', user=>{ updateUI(user); });
      netlifyIdentity.on('logout', ()=>{ hideUploadLinks(); });
      netlifyIdentity.init();
    };
    document.head.appendChild(s);
  });
})();