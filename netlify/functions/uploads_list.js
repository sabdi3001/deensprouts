import { getStore } from '@netlify/blobs';

export async function handler(event) {
  const page = parseInt((event.queryStringParameters && event.queryStringParameters.page) || '0', 10);
  const pageSize = 24;
  const idxStore = getStore('uploads-index');
  let index = await idxStore.get('index.json', { type: 'json' });
  if(!Array.isArray(index)) index = [];
  const start = page * pageSize;
  const slice = index.slice(start, start+pageSize);
  const nextPage = (start + pageSize) < index.length ? page + 1 : null;
  return { statusCode: 200, body: JSON.stringify({ items: slice, nextPage }) };
}