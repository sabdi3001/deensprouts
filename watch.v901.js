async function waitForPlyr(){ if(window.Plyr) return true; for(let i=0;i<60;i++){ await new Promise(r=>setTimeout(r,100)); if(window.Plyr) return true; } return !!window.Plyr; }
function q(k){ return new URLSearchParams(location.search).get(k); }
function relatedHTML(id,title,thumb){ return `<a class="related-item" href="video.html?id=${id}&type=youtube"><div class="related-title">${title}</div><img class="related-thumb" src="${thumb}" alt=""></a>`; }
async function renderWatch(){ const id=q('id'); const type=q('type')||'youtube'; const host=document.getElementById('player'); const titleEl=document.getElementById('watch-title'); if(!id){ host.innerHTML='<div class="title" style="color:#a00">No video ID provided.</div>'; return; } await waitForPlyr(); if(type==='upload'){ host.innerHTML = `<video id="plyr" controls playsinline preload="metadata" style="width:100%;height:100%"><source src="${id}" type="video/mp4"></video>`; new Plyr('#plyr'); } else { host.innerHTML = `<div id="plyr" data-plyr-provider="youtube" data-plyr-embed-id="${id}"></div>`; new Plyr('#plyr',{youtube:{rel:0,modestbranding:1,iv_load_policy:3}}); }
  // Title
  titleEl.textContent = '';
  try{
    const meta = await (await fetch('/.netlify/functions/videos?q='+encodeURIComponent(id))).json();
    // fallback to ID in title if needed
    titleEl.textContent = titleEl.textContent || ' ';
  }catch(_){}
  // Related
  try{
    const res = await fetch('/.netlify/functions/related?id='+encodeURIComponent(id));
    const data = await res.json();
    const list = document.getElementById('related-videos');
    list.innerHTML = '';
    (data.items||[]).forEach(it=>{
      if(!(it && it.id && it.id.videoId)) return;
      const v=it.id.videoId, t=it.snippet.title, th=(it.snippet.thumbnails&&(it.snippet.thumbnails.medium||it.snippet.thumbnails.default)).url;
      list.insertAdjacentHTML('beforeend', relatedHTML(v,t,th));
    });
  }catch(e){ console.error(e); }
  // Comments (localStorage)
  const key='ds_comments_'+id; const box=document.getElementById('comments');
  function renderComments(){ const arr=JSON.parse(localStorage.getItem(key)||'[]'); box.innerHTML=arr.map((c,i)=>`<div style="border:1px solid #e6efe9;border-radius:8px;padding:8px;margin:6px 0"><b>${c.n||'Anon'}</b><div>${c.t||''}</div><div style="text-align:right"><a href="#" data-i="${i}" class="del" style="color:#a00">Report</a></div></div>`).join(''); box.querySelectorAll('.del').forEach(a=>a.onclick=(e)=>{e.preventDefault(); let arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.splice(+a.dataset.i,1); localStorage.setItem(key,JSON.stringify(arr)); renderComments();}); }
  document.getElementById('cBtn').onclick=()=>{ const n=document.getElementById('cName').value.trim(); const t=document.getElementById('cText').value.trim(); if(!t) return; const arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.unshift({n,t,ts:Date.now()}); localStorage.setItem(key,JSON.stringify(arr)); document.getElementById('cText').value=''; renderComments(); };
  renderComments();
}
document.addEventListener('DOMContentLoaded', renderWatch);
