// Fetch config and render cards
const RESULTS = document.getElementById('results');
const CATEGORY = document.getElementById('category');
const AGE = document.getElementById('age');
const SEARCH = document.getElementById('search');
const NO_MUSIC = document.getElementById('no-music-only');
let DB = [];
function ytIframe(id){
const src = `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1`;
return `<iframe loading="lazy" src="${src}" title="YouTube video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
function cardTemplate(v){
const reportMail = encodeURIComponent(`Please review this video:\n\nTitle: ${v.title}\nVideo ID: ${v.id}\nReason:`);
return `
<article class="card" data-category="${v.category}" data-age="${v.age}" data-tags="${(v.tags||[]).join(' ').toLowerCase()}" data-nomusic="${v.no_music ? '1':'0'}">
<div class="thumb-wrap">${ytIframe(v.id)}</div>
<div class="card-body">
<h3 class="card-title">${v.title}</h3>
<div class="card-meta">${v.category} • Age ${v.age}</div>
<div class="badges">
${(v.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}
${v.no_music ? `<span class="badge">No instruments</span>` : `<span class="badge">Check audio</span>`}
</div>
</div>
<div class="card-actions">
<a class="button-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Watch on YouTube</a>
<a class="small" href="mailto:hello@example.com?subject=Flag video&body=${reportMail}">Report</a>
</div>
</article>`;
}
function render(){
RESULTS.setAttribute('aria-busy', 'true');
const q = (SEARCH.value||'').trim().toLowerCase();
const cat = CATEGORY.value;
const age = AGE.value;
const onlyNoMusic = NO_MUSIC.checked;
const list = DB.filter(v=>{ if(v.embeddable===false) return false;
if(cat!=='all' && v.category!==cat) return false;
if(age!=='all' && v.age!==age) return false;
if(onlyNoMusic && !v.no_music) return false;
if(q){
const hay = `${v.title} ${v.category} ${(v.tags||[]).join(' ')} ${v.age}`.toLowerCase();
if(!hay.includes(q)) return false;
}
return true;
});
RESULTS.innerHTML = list.map(cardTemplate).join('') || `<p class="small">No results. Try a different filter.</p>`;
RESULTS.removeAttribute('aria-busy');
}
function populateFilters(){
const cats = Array.from(new Set(DB.map(v=>v.category))).sort();
for(const c of cats){
const opt = document.createElement('option');
opt.value = c; opt.textContent = c;
CATEGORY.appendChild(opt);
}
}
fetch('videos.json')
.then(r=>r.json())
.then(data=>{
DB = data.videos || [];
populateFilters();
render();
});
[SEARCH, CATEGORY, AGE, NO_MUSIC].forEach(el=>el.addEventListener('input', render));
// ---------- Shorts (YouTube) ----------
const SHORTS = document.getElementById('shorts');
function ytShortIframe(id){
const src = `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1&controls=1`;
return `<iframe loading="lazy" src="${src}" title="YouTube Short" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
function shortCard(s){
return `
<article class="card">
<div class="thumb-wrap">${ytShortIframe(s.id)}</div>
<div class="card-body">
<h3 class="card-title">${s.title}</h3>
<div class="badges">${(s.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}</div>
</div>
<div class="card-actions">
<a class="button-link" href="https://www.youtube.com/shorts/${s.id}" target="_blank" rel="noopener">Open Short</a>
</div>
</article>`;
}
function renderShorts(list){
if(!SHORTS) return;
SHORTS.setAttribute('aria-busy', 'true');
const items = (list||[]).filter(s=>s.no_music !== false && (s.embeddable !== false));
SHORTS.innerHTML = items.map(shortCard).join('') || `<p class="small">No shorts yet.</p>`;
SHORTS.removeAttribute('aria-busy');
}
fetch('shorts.json')
.then(r=>r.json())
.then(data=>{ renderShorts(data.shorts || []); })
.catch(()=>{});