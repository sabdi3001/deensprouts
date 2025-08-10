(function(){
  function q(k){ return new URLSearchParams(location.search).get(k); }
  const isShort = q('short') === '1';
  function embedURL(videoId){ return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`; }
  function relatedHTML(id,title,thumb){
    return `<a class="related-item" href="video.html?id=${id}&type=youtube${isShort?'&short=1':''}">
      <div class="related-title">${title}</div>
      <img class="related-thumb" src="${thumb||''}" alt="">
    </a>`;
  }
  function skel(n=6){ return Array.from({length:n}).map(()=>'<div class="sk-rel skeleton"></div>').join(''); }
  async function getJSON(url){ const r=await fetch(url); const t=await r.text(); let d=null; try{d=JSON.parse(t);}catch(_){}
    if(!r.ok) throw new Error((d&&(d.error||JSON.stringify(d)))||t||('HTTP '+r.status)); return d||{}; }
  function dedupe(items, currentId){
    const seen=new Set(); const out=[];
    for(const it of items||[]){
      const v=it && it.id && (it.id.videoId || it.id);
      if(!v || v===currentId || seen.has(v)) continue;
      seen.add(v); out.push(it);
    }
    return out;
  }
  function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

  async function fetchMeta(id){
    try{ const d=await getJSON('/.netlify/functions/video_meta?id='+encodeURIComponent(id));
      const items=(d.items||[]); return items[0]||null; }catch(e){ return null; }
  }
  async function fetchRelated(id){
    const d=await getJSON('/.netlify/functions/related?id='+encodeURIComponent(id));
    return (d.items||[]).filter(it=>it && it.id && it.id.videoId && it.snippet);
  }
  async function fetchSearchShorts(q){
    const d=await getJSON('/.netlify/functions/shorts?q='+encodeURIComponent(q)+'&max=50');
    return (d.items||[]).filter(it=>it && it.id && it.id.videoId && it.snippet);
  }
  async function fetchSearchLong(q){
    const d=await getJSON('/.netlify/functions/videos?q='+encodeURIComponent(q)+'&max=50');
    return (d.items||[]).filter(it=>it && it.id && it.id.videoId && it.snippet);
  }

  async function loadRelatedSmart(id){
    const list=document.getElementById('related-videos'); if(!list) return; list.innerHTML=skel(8);
    let items=[]; 
    try{ items=await fetchRelated(id);}catch(e){}
    items = dedupe(items, id);
    if(items.length < 6){
      const meta=await fetchMeta(id); 
      const rawTitle=meta&&meta.snippet&&meta.snippet.title? meta.snippet.title : 'islamic kids';
      const cleaned=rawTitle.replace(/#\w+/g,'').replace(/\s+/g,' ').trim();
      try{ 
        const srch = isShort ? await fetchSearchShorts(cleaned+' islamic kids') : await fetchSearchLong(cleaned+' islamic kids');
        items = dedupe(items.concat(srch), id);
      }catch(e){ /* ignore */ }
    }
    items = shuffle(items).slice(0,12);
    list.innerHTML=''; 
    if(!items.length){ list.innerHTML='<div class="muted">No related videos found.</div>'; return; }
    for(const it of items){
      const v=it.id.videoId, t=it.snippet.title, th=(it.snippet.thumbnails&&(it.snippet.thumbnails.medium||it.snippet.thumbnails.default)||{}).url||'';
      list.insertAdjacentHTML('beforeend', relatedHTML(v,t,th));
    }
  }

  async function main(){
    const id=(q('id')||'').trim(); const type=(q('type')||'youtube').trim();
    const box=document.getElementById('playerBox'); const titleEl=document.getElementById('watch-title');
    if(!id){ if(titleEl) titleEl.textContent='No video selected.'; return; }
    if(type==='upload'){
      try{
        const d = await getJSON('/.netlify/functions/upload_url?id='+encodeURIComponent(id));
        const url = d && d.url;
        if(!url) throw new Error('No URL for upload.');
        if(box){ box.innerHTML = '<video id="upVid" controls playsinline style="background:#000"></video>'; document.getElementById('upVid').src = url; }
        if(titleEl) titleEl.textContent = d.title || 'User upload';
      }catch(e){
        if(box) box.innerHTML = '<div class="muted">Could not load uploaded video.</div>';
      }
    }else{
      if(box) box.innerHTML='<iframe id="ytPlayer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen playsinline referrerpolicy="strict-origin-when-cross-origin" src="'+embedURL(id)+'"></iframe>';
      if(titleEl) titleEl.textContent=' ';
      loadRelatedSmart(id);
    }
  }
  document.addEventListener('DOMContentLoaded', main);
})();