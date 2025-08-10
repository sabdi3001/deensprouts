// identity.v1005.js — Login via widget; Signup via custom page with DOB
(function(){
  function ready(fn){ document.readyState!=='loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var login = document.getElementById('loginLink');
    var signup = document.getElementById('signupLink');
    var s = document.createElement('script');
    s.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    s.defer = true;
    s.onload = function(){
      if(window.netlifyIdentity && login){
        login.addEventListener('click', function(e){ e.preventDefault(); netlifyIdentity.open('login'); });
      }
    };
    document.head.appendChild(s);
    if(signup){
      signup.addEventListener('click', function(e){
        e.preventDefault();
        window.location.href = 'signup.html';
      });
    }
  });
})();