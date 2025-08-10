// js/ds-health.v1202.js
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  function el(tag,attrs){ var e=document.createElement(tag); for(var k in attrs||{}) e.setAttribute(k,attrs[k]); return e; }
  async function ping(path){
    const box = document.getElementById('__ds_health_log');
    try{
      const r = await fetch(path + '?t=' + Date.now(), { cache:'no-store' });
      const txt = await r.text();
      box.value = '['+new Date().toLocaleTimeString()+'] '+path+' -> '+r.status+'\n' + txt + '\n\n' + box.value;
    }catch(e){
      box.value = '['+new Date().toLocaleTimeString()+'] '+path+' -> ERROR '+e.message+'\n\n' + box.value;
    }
  }
  ready(function(){
    var wrap = el('div',{ id:'__ds_health_wrap', style:'position:fixed;right:12px;bottom:12px;width:340px;background:#fff;border:1px solid #dfe7e2;box-shadow:0 10px 30px rgba(0,0,0,.08);border-radius:10px;font-family:system-ui,Arial,sans-serif;z-index:99999' });
    var head = el('div',{ style:'display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid #e9f2ee;color:#0b6b53;font-weight:600' });
    head.innerHTML = 'DS Health <button id="__ds_health_hide" style="margin-left:auto;border:0;background:#f3f7f5;padding:6px 10px;border-radius:6px;cursor:pointer">Hide</button>';
    var body = el('div',{ style:'padding:10px' });
    body.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">'+
      '<button class="__dsbtn" data-u="/.netlify/functions/health">Health</button>'+
      '<button class="__dsbtn" data-u="/.netlify/functions/videos?q=islamic%20kids&max=6">Videos</button>'+
      '<button class="__dsbtn" data-u="/.netlify/functions/shorts?q=islamic%20kids&max=6">Shorts</button>'+
      '<button class="__dsbtn" data-u="/.netlify/functions/related?id=dQw4w9WgXcQ">Related</button>'+
      '</div><textarea id="__ds_health_log" style="width:100%;height:180px;font:12px/1.4 monospace;white-space:pre;overflow:auto"></textarea>';
    wrap.appendChild(head); wrap.appendChild(body); document.body.appendChild(wrap);
    document.querySelectorAll('.__dsbtn').forEach(b=> b.addEventListener('click', ()=> ping(b.getAttribute('data-u')) ));
    document.getElementById('__ds_health_hide').addEventListener('click', ()=> wrap.style.display='none' );
    window.addEventListener('keydown',e=>{ if(e.key==='H') wrap.style.display = (wrap.style.display==='none'?'block':'none'); });
  });
})();