const API = 'https://www.googleapis.com/youtube/v3';
function pickMaxThumb(sn){ const th=sn.thumbnails||{}; return (th.maxres||th.high||th.medium||th.default||{}).url||''; }
function cors(body,status=200){ return { statusCode: status, headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store'}, body: JSON.stringify(body) }; }
function err(e,code=500){ return cors({ error: String(e&&e.message||e) }, code); }
function qp(obj){ return Object.entries(obj).filter(([,v])=>v!=null && v!=='').map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'); }
async function yt(path, params){
  const key = process.env.YT_API_KEY;
  if(!key) throw new Error('Missing YT_API_KEY');
  const url = `${API}${path}?${qp({ key, ...params })}`;
  const r = await fetch(url); const t = await r.text(); let d=null; try{ d=JSON.parse(t);}catch(_){}
  if(!r.ok) throw new Error((d&&(d.error&&d.error.message))||t||('HTTP '+r.status));
  return d||{};
}
export { yt, cors, err, pickMaxThumb };
