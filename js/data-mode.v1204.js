// js/data-mode.v1204.js
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  async function fetchJSON(url){
    const r = await fetch(url, { cache:'no-store' });
    const txt = await r.text();
    let data; try{ data = JSON.parse(txt); }catch{ data = { raw: txt }; }
    if(!r.ok || data.error){ throw Object.assign(new Error(data.error||('HTTP '+r.status)), { status:r.status, data }); }
    return data;
  }
  function cardHTML(vid, title, thumb){
    return `<a class="card" href="video.html?id=${vid}&type=youtube">
      <img src="${thumb}" alt="">
      <div class="title">${title}</div>
    </a>`;
  }
  async function loadSection(opts){
    const { hostId, moreId, fnUrl, fallbackUrl, mapItem, max } = opts;
    const host = document.getElementById(hostId);
    const more = moreId ? document.getElementById(moreId) : null;
    if(!host) return;
    async function fromFunction(){
      const data = await fetchJSON(fnUrl);
      const items = (data.items||[]).slice(0, max||20);
      return items.map(mapItem);
    }
    async function fromStatic(){
      const data = await fetchJSON(fallbackUrl);
      const items = (data.items||[]).slice(0, max||20);
      return items.map(mapItem);
    }
    try{
      const cards = await fromFunction();
      if(cards.length===0) throw new Error('empty');
      host.innerHTML = cards.join('');
      if(more) more.style.display = 'none';
    }catch(e){
      console.warn('[DeenSprouts] Falling back to static', e);
      try{
        const cards = await fromStatic();
        if(cards.length===0) throw new Error('empty static');
        host.innerHTML = cards.join('');
        if(more) more.style.display = 'none';
        const banner = document.getElementById('quotaBanner');
        if(banner){ banner.style.display='block'; }
      }catch(err){
        host.innerHTML = `<div class="title" style="color:#a00">No videos available yet.</div>`;
        console.error(err);
      }
    }
  }
  window.DSDataMode = {
    initHome: function(){
      loadSection({
        hostId:'home-videos',
        moreId:'load-more-container',
        fnUrl:'/.netlify/functions/videos?q=islamic%20kids&max=20',
        fallbackUrl:'data/videos.json',
        mapItem: (it)=>{
          const v = it.id?.videoId || it.videoId;
          const s = it.snippet||{};
          const t = s.title || it.title || 'Untitled';
          const th = (s.thumbnails?.high || s.thumbnails?.medium || s.thumbnails?.default || {}).url || it.thumbnail || '';
          return cardHTML(v,t,th);
        },
        max: 20
      });
      loadSection({
        hostId:'shorts-container',
        moreId:'load-more-shorts-container',
        fnUrl:'/.netlify/functions/shorts?q=islamic%20kids&max=21',
        fallbackUrl:'data/shorts.json',
        mapItem: (it)=>{
          const v = it.id?.videoId || it.videoId;
          const s = it.snippet||{};
          const t = s.title || it.title || 'Untitled';
          const th = (s.thumbnails?.high || s.thumbnails?.medium || s.thumbnails?.default || {}).url || it.thumbnail || '';
          return cardHTML(v,t,th);
        },
        max: 21
      });
    },
    initWatch: function(){
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const host = document.getElementById('related-list');
      if(!host) return;
      async function fnRelated(){
        const d = await fetchJSON('/.netlify/functions/related?id='+encodeURIComponent(id));
        return (d.items||[]).map(it=>{
          const v = it.id?.videoId || it.videoId;
          const s = it.snippet||{};
          const th = (s.thumbnails?.medium || s.thumbnails?.default || s.thumbnails?.high || {}).url || it.thumbnail || '';
          const t = s.title || it.title || 'Untitled';
          return `<a class="rel" href="video.html?id=${v}&type=youtube">
            <img src="${th}" alt=""><div class="meta"><div class="t">${t}</div></div></a>`;
        });
      }
      async function staticRelated(){
        const d = await fetchJSON('data/videos.json');
        return (d.items||[]).slice(0,12).map(it=>{
          const v = it.id?.videoId || it.videoId;
          const t = (it.snippet?.title) || it.title || 'Untitled';
          const th = (it.snippet?.thumbnails?.medium || it.snippet?.thumbnails?.default || it.snippet?.thumbnails?.high || {}).url || it.thumbnail || '';
          return `<a class="rel" href="video.html?id=${v}&type=youtube">
            <img src="${th}" alt=""><div class="meta"><div class="t">${t}</div></div></a>`;
        });
      }
      (async ()=>{
        try{
          const html = (await fnRelated()).join('');
          if(!html) throw new Error('empty');
          host.innerHTML = html;
        }catch(e){
          console.warn('[DeenSprouts] related fallback → static');
          const html = (await staticRelated()).join('');
          host.innerHTML = html || '<div class="muted">No related videos.</div>';
        }
      })();
    }
  };
  ready(function(){
    if(document.getElementById('home-videos')){ window.DSDataMode.initHome(); }
    if(document.getElementById('related-list')){ window.DSDataMode.initWatch(); }
  });
})();