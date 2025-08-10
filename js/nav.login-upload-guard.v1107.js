// js/nav.login-upload-guard.v1107.js
// Non-destructive runtime patch:
// 1) Rename "Log in" -> "Log in/Sign up" (keeps link target)
// 2) Remove separate "Sign up" links/buttons
// 3) Hide Upload link(s) unless user is signed in (Netlify Identity)
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  function normTxt(s){ return (s||'').replace(/\s+/g,' ').trim().toLowerCase(); }
  function $all(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  function tweakNav(){
    var login = document.getElementById('loginLink');
    if(login){ login.textContent = 'Log in/Sign up'; }
    if(!login){
      $all('a,button').forEach(function(a){
        var label = normTxt(a.textContent);
        var href  = (a.getAttribute('href')||'').toLowerCase();
        if(label==='log in' || label==='login' || /auth\.html|#login|\/auth/.test(href)){
          a.textContent = 'Log in/Sign up';
          if(!login) login = a;
        }
      });
    }
    // Remove standalone signup links/buttons
    var signup = document.getElementById('signupLink');
    if(signup && signup.parentNode){ signup.parentNode.removeChild(signup); }
    $all('a,button').forEach(function(el){
      var t = normTxt(el.textContent);
      var h = (el.getAttribute('href')||'').toLowerCase();
      if(el.id==='signupLink' || /signup/.test(h) || t==='sign up' || t==='signup'){
        if(el !== login && el.parentNode){ el.parentNode.removeChild(el); }
      }
    });
    // Open Identity modal on click (keeps href fallback)
    if(login){
      login.addEventListener('click', function(e){
        if(window.netlifyIdentity){ e.preventDefault(); window.netlifyIdentity.open('login'); }
      });
    }
  }

  function hideUpload(){
    $all('a[href$="upload.html"],[data-requires-auth]').forEach(function(a){
      if(a.dataset._origDisplay===undefined){ a.dataset._origDisplay = getComputedStyle(a).display || ''; }
      a.style.display = 'none';
    });
  }
  function showUpload(){
    $all('a[href$="upload.html"],[data-requires-auth]').forEach(function(a){
      a.style.display = a.dataset._origDisplay || '';
    });
  }

  async function identityEnabled(){
    try{ const r=await fetch('/.netlify/identity/settings',{cache:'no-store'}); return r.ok; }catch(e){ return false; }
  }
  function bootIdentity(){
    var s=document.createElement('script');
    s.src='https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.defer=true;
    s.onload=function(){
      if(!window.netlifyIdentity) return;
      function update(u){ if(u){ showUpload(); } else { hideUpload(); } }
      window.netlifyIdentity.on('init', update);
      window.netlifyIdentity.on('login', update);
      window.netlifyIdentity.on('logout', function(){ hideUpload(); });
      window.netlifyIdentity.init();
    };
    document.head.appendChild(s);
  }

  ready(async function(){
    tweakNav();
    hideUpload(); // default hidden
    if(await identityEnabled()){ bootIdentity(); }
  });
})();