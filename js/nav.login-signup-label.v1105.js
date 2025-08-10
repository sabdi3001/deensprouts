// nav.login-signup-label.v1105.js
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  function normTxt(s){ return (s||'').replace(/\s+/g,' ').trim().toLowerCase(); }

  ready(function(){
    var login = document.getElementById('loginLink');
    if(login){ login.textContent = 'Log in/Sign up'; }

    if(!login){
      var anchors = document.querySelectorAll('a,button');
      anchors.forEach(function(a){
        var label = normTxt(a.textContent);
        var href  = (a.getAttribute('href')||'').toLowerCase();
        if(label === 'log in' || label === 'login' || /auth\.html|#login|\/auth/.test(href)){
          a.textContent = 'Log in/Sign up';
          if(!login) login = a;
        }
      });
    }

    var signup = document.getElementById('signupLink');
    if(signup && signup.parentNode){ signup.parentNode.removeChild(signup); }

    Array.prototype.slice.call(document.querySelectorAll('a,button')).forEach(function(el){
      var t = normTxt(el.textContent);
      var h = (el.getAttribute('href')||'').toLowerCase();
      if(el.id==='signupLink' || /signup/.test(h) || t==='sign up' || t==='signup'){
        if(el !== login && el.parentNode){ el.parentNode.removeChild(el); }
      }
    });
  });
})();