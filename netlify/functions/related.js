
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

exports.handler = async (event)=>{
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if(!API_KEY) return { statusCode:500, body: JSON.stringify({ error:'YOUTUBE_API_KEY not set' }) };
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if(!id) return { statusCode:400, body: JSON.stringify({ error:'Missing video ID' }) };
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&relatedToVideoId=${encodeURIComponent(id)}&type=video&videoEmbeddable=true&safeSearch=strict&key=${API_KEY}`;
  try{ const data=await getJSON(url); const items=(data.items||[]).filter(it=>it.snippet && it.snippet.liveBroadcastContent!=='live'); return { statusCode:200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items }) }; }
  catch(e){ return { statusCode:500, body: JSON.stringify({ error:'Function fetch failed', detail:e.message }) }; }
};
