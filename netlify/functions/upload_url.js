import { getStore } from '@netlify/blobs';

export async function handler(event) {
  const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
  if(!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };
  const idxStore = getStore('uploads-index');
  let index = await idxStore.get('index.json', { type: 'json' });
  if(!Array.isArray(index)) index = [];
  const item = index.find(x=>x.id===id);
  if(!item) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  const store = getStore('uploads');
  const url = await store.getPresignedUrl(item.key, { expiry: 3600 }); // 1-hour URL
  return { statusCode: 200, body: JSON.stringify({ url, title: item.title }) };
}