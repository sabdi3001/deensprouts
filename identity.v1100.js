// identity.v1100.js — Login via Identity widget; Sign up via custom page with DOB
(function(){
  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    var s=document.createElement('script'); s.src='https://identity.netlify.com/v1/netlify-identity-widget.js'; s.defer=true;
    s.onload=function(){
      if(window.netlifyIdentity){
        var login=document.getElementById('loginLink');
        var signup=document.getElementById('signupLink');
        if(login){ login.addEventListener('click', function(e){ e.preventDefault(); netlifyIdentity.open('login'); }); }
        if(signup){ signup.addEventListener('click', function(e){ e.preventDefault(); window.location.href='signup.html'; }); }
      }
    };
    document.head.appendChild(s);
  });
})();