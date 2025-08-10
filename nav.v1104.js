// nav.v1104.js — normalize nav labels across pages
(function(){
  function ready(fn){ document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    const login = document.getElementById('loginLink');
    if(login){ login.textContent = 'Log in/Sign up'; }
    const signup = document.getElementById('signupLink');
    if(signup && signup.parentNode){ signup.parentNode.removeChild(signup); }
  });
})();