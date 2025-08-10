// js/nav.login-label.js — relabel login and remove separate signup link (no layout changes)
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    var a=document.getElementById('loginLink'); if(a) a.textContent='Log in/Sign up';
    var s=document.getElementById('signupLink'); if(s && s.parentNode) s.parentNode.removeChild(s);
  });
})();