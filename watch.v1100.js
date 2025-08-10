(function(){
  function q(k){ return new URLSearchParams(location.search).get(k); }
  function embedURL(videoId){ return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`; }
  function relatedHTML(id,title,thumb){
    return `<a class="related-item" href="video.html?id=${id}&type=youtube">
      <div class="related-title">${title}</div>
      <img class="related-thumb" src="${thumb||''}" alt="">
    </a>`;
  }
  function skel(n=6){ return Array.from({length:n}).map(()=>'<div class="sk-rel skeleton"></div>').join(''); }
  async function getJSON(url){ const r=await fetch(url); const t=await r.text(); let d=null; try{d=JSON.parse(t);}catch(_){}
    if(!r.ok) throw new Error((d&&(d.error||JSON.stringify(d)))||t||('HTTP '+r.status)); return d||{}; }

  async function fetchMeta(id){
    try{ const d=await getJSON('/.netlify/functions/video_meta?id='+encodeURIComponent(id));
      const items=(d.items||[]); return items[0]||null; }catch(e){ return null; }
  }
  async function fetchRelated(id){
    const d=await getJSON('/.netlify/functions/related?id='+encodeURIComponent(id));
    return (d.items||[]).filter(it=>it && it.id && it.id.videoId && it.snippet);
  }
  async function fetchSearch(q){
    const d=await getJSON('/.netlify/functions/videos?q='+encodeURIComponent(q));
    return (d.items||[]).filter(it=>it && it.id && it.id.videoId && it.snippet);
  }

  async function loadRelatedSmart(id){
    const list=document.getElementById('related-videos'); list.innerHTML=skel(6);
    let items=[]; try{ items=await fetchRelated(id);}catch(e){}
    if(!items.length){
      const meta=await fetchMeta(id); const title=meta&&meta.snippet&&meta.snippet.title? meta.snippet.title : 'islamic kids';
      try{ const srch=await fetchSearch(title+' islamic kids'); items=srch.filter(x=>x.id.videoId!==id).slice(0,10);}catch(e){}
    }
    list.innerHTML=''; if(!items.length){ list.innerHTML='<div class="muted">No related videos found.</div>'; return; }
    for(const it of items){
      const v=it.id.videoId, t=it.snippet.title, th=(it.snippet.thumbnails&&(it.snippet.thumbnails.medium||it.snippet.thumbnails.default)||{}).url||'';
      list.insertAdjacentHTML('beforeend', relatedHTML(v,t,th));
    }
  }

  function initComments(id){
    const key='ds_comments_'+id, box=document.getElementById('comments');
    const esc=(s)=> (s||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
    function render(){
      const arr=JSON.parse(localStorage.getItem(key)||'[]');
      box.innerHTML=arr.map((c,i)=>`<div class="comment-card"><b>${esc(c.n||'Anon')}</b><div>${esc(c.t||'')}</div>
        <div style="text-align:right"><a href="#" data-i="${i}" class="del" style="color:#a00">Report</a></div></div>`).join('');
      box.querySelectorAll('.del').forEach(a=>a.onclick=(e)=>{e.preventDefault();const idx=+a.dataset.i,arr=JSON.parse(localStorage.getItem(key)||'[]');arr.splice(idx,1);localStorage.setItem(key,JSON.stringify(arr));render();});
    }
    document.getElementById('cBtn').onclick=()=>{
      const n=document.getElementById('cName').value.trim(), t=document.getElementById('cText').value.trim();
      if(!t) return; const arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.unshift({n,t,ts:Date.now()});
      localStorage.setItem(key,JSON.stringify(arr)); document.getElementById('cText').value=''; render();
    }; render();
  }

  async function main(){
    const id=(q('id')||'').trim(); const type=(q('type')||'youtube').trim();
    const box=document.getElementById('playerBox'); const titleEl=document.getElementById('watch-title');
    if(!id){ box.innerHTML=''; titleEl.textContent='No video selected.'; return; }
    if(type==='upload'){
      // get a signed url for the uploaded blob
      try{
        const d = await getJSON('/.netlify/functions/upload_url?id='+encodeURIComponent(id));
        const url = d && d.url;
        if(!url) throw new Error('No URL for upload.');
        box.innerHTML = '<video id="upVid" controls playsinline style="background:#000"></video>';
        document.getElementById('upVid').src = url;
        titleEl.textContent = d.title || 'User upload';
      }catch(e){
        box.innerHTML = '<div class="muted">Could not load uploaded video.</div>';
      }
      // Show other uploads as "related"
      try{
        const list = await getJSON('/.netlify/functions/uploads_list?page=0');
        const items=(list.items||[]).filter(x=>x.id!==id).slice(0,10);
        const host=document.getElementById('related-videos'); host.innerHTML='';
        for(const it of items){ host.insertAdjacentHTML('beforeend', `<a class="related-item" href="video.html?id=${encodeURIComponent(it.id)}&type=upload"><div class="related-title">${it.title||'User upload'}</div><img class="related-thumb" src="" alt=""></a>`); }
      }catch(e){ /* ignore */ }
    }else{
      box.innerHTML='<iframe id="ytPlayer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen playsinline referrerpolicy="strict-origin-when-cross-origin" src="'+embedURL(id)+'"></iframe>';
      titleEl.textContent=' ';
      loadRelatedSmart(id);
    }
    initComments(id);
  }
  document.addEventListener('DOMContentLoaded', main);
})();