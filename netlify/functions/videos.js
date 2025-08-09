
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
  const q = (event.queryStringParameters && event.queryStringParameters.q) || "islamic kids";
  const pageToken = (event.queryStringParameters && event.queryStringParameters.pageToken) || "";
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(q)}&type=video&videoEmbeddable=true&safeSearch=strict&videoDuration=medium&key=${API_KEY}`;
  if(pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;
  try{ const data=await getJSON(url); return { statusCode:200, headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }; }
  catch(e){ return { statusCode:500, body: JSON.stringify({ error:'Function fetch failed', detail:e.message }) }; }
};
