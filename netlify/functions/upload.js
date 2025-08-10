import { getStore } from '@netlify/blobs';

function extFromMime(mime){
  if(!mime) return 'bin';
  if(mime.includes('mp4')) return 'mp4';
  if(mime.includes('webm')) return 'webm';
  return 'bin';
}
function makeId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

export async function handler(event, context) {
  const user = context.clientContext && context.clientContext.user;
  if(!user){
    return { statusCode: 401, body: JSON.stringify({ error: 'Authentication required to upload.' }) };
  }
  if(event.httpMethod!=='POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const isB64 = event.isBase64Encoded;
  const ct = event.headers['content-type'] || event.headers['Content-Type'] || 'application/octet-stream';
  const title = event.headers['x-title'] || 'Untitled';
  const filename = event.headers['x-file-name'] || `upload.${extFromMime(ct)}`;
  const buf = Buffer.from(event.body || '', isB64 ? 'base64' : undefined);
  if(!buf.length) return { statusCode: 400, body: JSON.stringify({ error: 'No file uploaded' }) };
  if(buf.length > 90*1024*1024) return { statusCode: 413, body: JSON.stringify({ error: 'File too large' }) };

  const store = getStore('uploads');
  const idxStore = getStore('uploads-index');
  const id = makeId();
  const key = `videos/${id}/${filename}`;

  await store.set(key, buf, { contentType: ct });
  let index = await idxStore.get('index.json', { type: 'json' });
  if(!Array.isArray(index)) index = [];
  const item = { id, key, title, filename, mime: ct, size: buf.length, createdAt: new Date().toISOString(), user: { id: user.sub, email: user.email } };
  index.unshift(item);
  await idxStore.set('index.json', JSON.stringify(index), { contentType: 'application/json; charset=utf-8' });

  return { statusCode: 200, body: JSON.stringify(item) };
}