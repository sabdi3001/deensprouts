// identity.v1101.js — robust Login/Signup with fallback
(function(){
  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  function attach(){
    var login=document.getElementById('loginLink');
    var signup=document.getElementById('signupLink');
    var widgetLoaded=false;

    function fallbackLogin(e){
      if(e) e.preventDefault();
      window.location.href='auth.html#login';
    }
    function fallbackSignup(e){
      if(e) e.preventDefault();
      window.location.href='signup.html';
    }

    // Try loading widget
    var s=document.createElement('script');
    s.src='https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.defer=true;
    s.onload=function(){
      widgetLoaded=true;
      if(window.netlifyIdentity && login){
        login.addEventListener('click', function(e){ e.preventDefault(); netlifyIdentity.open('login'); });
      }
      if(window.netlifyIdentity && signup){
        signup.addEventListener('click', function(e){ e.preventDefault(); window.location.href='signup.html'; });
      }
    };
    document.head.appendChild(s);

    // Fallback if widget fails/disabled
    setTimeout(function(){
      if(!widgetLoaded){
        if(login){ login.removeEventListener && login.removeEventListener('click', ()=>{}); login.addEventListener('click', fallbackLogin); }
        if(signup){ signup.removeEventListener && signup.removeEventListener('click', ()=>{}); signup.addEventListener('click', fallbackSignup); }
      }
    }, 1200);
  }
  ready(attach);
})();