let nextPageToken=null, shortsPageToken=null, currentQuery="islamic kids", uploadsPage=0;

function cardHTML(vid, title, thumb, type='yt', kind='long'){
  const shortFlag = (type==='yt' && kind==='short') ? '&short=1' : '';
  const href = type==='upload' 
    ? `video.html?id=${encodeURIComponent(vid)}&type=upload`
    : `video.html?id=${encodeURIComponent(vid)}&type=youtube${shortFlag}`;
  return `<a class="card" href="${href}">
    <div class="thumb-wrap">${ thumb ? `<img src="${thumb}" alt="">` : ''}</div>
    <div class="title">${title}</div>
  </a>`;
}

async function fetchJSON(url){
  const r = await fetch(url);
  const txt = await r.text();
  let parsed = null; try{ parsed = JSON.parse(txt); }catch(e){}
  if(!r.ok) throw new Error((parsed && (parsed.error||JSON.stringify(parsed))) || txt || ('HTTP '+r.status));
  if(parsed && parsed.error) throw new Error(parsed.error);
  return parsed || {};
}

async function loadHomeVideos(reset=false){
  const host=document.getElementById('home-videos');
  const btnC=document.getElementById('load-more-container');
  if(reset){ host.innerHTML=''; nextPageToken=null; }
  try{
    let url='/.netlify/functions/videos?q='+encodeURIComponent(currentQuery)+'&max=24';
    if(nextPageToken) url += '&pageToken='+encodeURIComponent(nextPageToken);
    const data=await fetchJSON(url);
    const items=(data.items||[]).filter(it=>it.id && it.id.videoId);
    if(reset && !items.length){ host.innerHTML='<div class="muted">No videos found.</div>'; return; }
    for(const it of items){
      const v=it.id.videoId, t=it.snippet.title, th=(it.snippet.thumbnails && (it.snippet.thumbnails.high||it.snippet.thumbnails.medium||it.snippet.thumbnails.default)).url;
      host.insertAdjacentHTML('beforeend', cardHTML(v,t,th,'yt','long'));
    }
    nextPageToken=data.nextPageToken||null;
    btnC.innerHTML = nextPageToken ? '<button class="btn" id="moreBtn">Load more</button>' : '';
    document.getElementById('moreBtn')?.addEventListener('click', ()=>loadHomeVideos(false));
  }catch(e){ if(reset) host.innerHTML='<div class="muted">Error loading videos.</div>'; console.error(e); }
}

async function loadDeenShorts(reset=false){
  const host=document.getElementById('shorts-container');
  const btnC=document.getElementById('load-more-shorts-container');
  if(reset){ host.innerHTML=''; shortsPageToken=null; }
  try{
    let url='/.netlify/functions/shorts?q='+encodeURIComponent("islamic kids")+'&max=50';
    if(shortsPageToken) url += '&pageToken='+encodeURIComponent(shortsPageToken);
    const data=await fetchJSON(url);
    const items=(data.items||[]).filter(it=>it.id && it.id.videoId);
    if(reset && !items.length){ host.innerHTML='<div class="muted">No shorts found.</div>'; return; }
    for(const it of items){
      const v=it.id.videoId, t=it.snippet.title, th=(it.snippet.thumbnails && (it.snippet.thumbnails.high||it.snippet.thumbnails.medium||it.snippet.thumbnails.default)).url;
      host.insertAdjacentHTML('beforeend', cardHTML(v,t,th,'yt','short'));
    }
    shortsPageToken=data.nextPageToken||null;
    btnC.innerHTML = shortsPageToken ? '<button class="btn" id="moreShortsBtn">Load 50 more</button>' : '';
    document.getElementById('moreShortsBtn')?.addEventListener('click', ()=>loadDeenShorts(false));
  }catch(e){ if(reset) host.innerHTML='<div class="muted">Error loading DeenShorts.</div>'; console.error(e); }
}

async function loadUploads(reset=false){
  const host=document.getElementById('uploads-container');
  const btnC=document.getElementById('uploads-more-container');
  if(reset){ uploadsPage=0; host.innerHTML=''; }
  try{
    const data=await fetchJSON('/.netlify/functions/uploads_list?page='+uploadsPage);
    const items=(data.items||[]);
    if(reset && !items.length){ host.innerHTML='<div class="muted">No uploads yet.</div>'; return; }
    for(const it of items){
      host.insertAdjacentHTML('beforeend', cardHTML(it.id, it.title || 'User upload', '', 'upload'));
    }
    uploadsPage = data.nextPage || null;
    btnC.innerHTML = (uploadsPage!=null) ? '<button class="btn" id="moreUploadsBtn">Load more uploads</button>' : '';
    document.getElementById('moreUploadsBtn')?.addEventListener('click', ()=>loadUploads(false));
  }catch(e){ if(reset) host.innerHTML='<div class="muted">Error loading uploads.</div>'; console.error(e); }
}

document.getElementById('searchBtn')?.addEventListener('click', ()=>{
  const q=(document.getElementById('search').value||'').trim();
  if(q){ currentQuery=q; loadHomeVideos(true); }
});
document.addEventListener('DOMContentLoaded', ()=>{ loadHomeVideos(true); loadDeenShorts(true); loadUploads(true); });
