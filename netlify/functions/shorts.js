
const https = require('https');
function getJSON(url){
  return new Promise((resolve, reject)=>{
    const req = https.get(url, (res)=>{
      let data=''; res.on('data', c=>data+=c);
      res.on('end', ()=>{
        try{
          const p = JSON.parse(data);
          if(res.statusCode>=200 && res.statusCode<300) return resolve(p);
          resolve({ error:'Upstream error', status:res.statusCode, detail:p });
        }catch(e){
          resolve({ error:'Invalid JSON', status:res.statusCode, detail:data });
        }
      });
    });
    req.on('error', reject); req.end();
  });
}

function durationSeconds(iso){
  if(!iso||typeof iso!=='string') return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if(!m) return 0;
  const h = parseInt(m[1]||'0',10), mn = parseInt(m[2]||'0',10), s = parseInt(m[3]||'0',10);
  return h*3600 + mn*60 + s;
}
exports.handler = async (event)=>{
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if(!API_KEY) return { statusCode:500, body: JSON.stringify({ error:'YOUTUBE_API_KEY not set' }) };
  const q = (event.queryStringParameters && event.queryStringParameters.q) || "islamic kids";
  const pageToken = (event.queryStringParameters && event.queryStringParameters.pageToken) || "";
  let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(q)}&type=video&videoDuration=short&videoEmbeddable=true&safeSearch=strict&key=${API_KEY}`;
  if(pageToken) searchUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
  try{
    const search = await getJSON(searchUrl);
    const items = (search.items||[]).filter(it=>it.id&&it.id.videoId && (!it.snippet || it.snippet.liveBroadcastContent!=='live'));
    if(!items.length) return { statusCode:200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: [] }) };
    const ids = items.map(it=>it.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${ids}&key=${API_KEY}`;
    const details = await getJSON(detailsUrl);
    const byId = new Map(); (details.items||[]).forEach(v=>byId.set(v.id, v));
    const filtered = items.filter(it=>{ const v = byId.get(it.id.videoId); if(!v||!v.contentDetails) return false; const secs = durationSeconds(v.contentDetails.duration); const emb = v.status ? v.status.embeddable !== false : true; return emb && secs>0 && secs<=60; });
    return { statusCode:200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: filtered, nextPageToken: search.nextPageToken||null }) };
  }catch(e){ return { statusCode:500, body: JSON.stringify({ error:'Function fetch failed', detail:e.message }) }; }
};
