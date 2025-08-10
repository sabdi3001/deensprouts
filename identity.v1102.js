// identity.v1102.js — detect Identity settings; robust login/signup; upload guard helper
(function(){
  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  async function identityAvailable(){
    try{
      const r = await fetch('/.netlify/identity/settings', { cache:'no-store' });
      return r.ok;
    }catch(e){ return false; }
  }
  ready(async function(){
    const login = document.getElementById('loginLink');
    const signup = document.getElementById('signupLink');
    const ok = await identityAvailable();
    if(ok){
      const s=document.createElement('script');
      s.src='https://identity.netlify.com/v1/netlify-identity-widget.js'; s.defer=true;
      s.onload=function(){
        if(window.netlifyIdentity && login){
          login.addEventListener('click', function(e){ e.preventDefault(); netlifyIdentity.open('login'); });
        }
        if(window.netlifyIdentity && signup){
          signup.addEventListener('click', function(e){ e.preventDefault(); window.location.href='signup.html'; });
        }
      };
      document.head.appendChild(s);
    }else{
      function showMsg(e){
        e && e.preventDefault();
        alert('Sign in is not available yet. Please enable Netlify Identity in Site settings → Identity.');
      }
      login && login.addEventListener('click', showMsg);
      signup && signup.addEventListener('click', showMsg);
    }
    window.__dsIdentity = {
      available: ok,
      requireUser: async function(onReady){
        if(!ok){ onReady(null); return; }
        if(!window.netlifyIdentity){
          await new Promise(res=>setTimeout(res,300));
        }
        if(!window.netlifyIdentity){ onReady(null); return; }
        netlifyIdentity.on('init', async (user)=>{ onReady(user||null); });
        netlifyIdentity.init();
      },
      getToken: async function(){
        if(window.netlifyIdentity && netlifyIdentity.currentUser()){
          return await netlifyIdentity.currentUser().jwt();
        }
        return null;
      }
    };
  });
})();