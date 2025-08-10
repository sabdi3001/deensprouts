export async function handler(event) {
  const key = process.env.YOUTUBE_API_KEY;
  if(!key) return { statusCode: 500, body: JSON.stringify({ error: "Missing YOUTUBE_API_KEY" }) };
  const id = (event.queryStringParameters && event.queryStringParameters.id) || "";
  if(!id) return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("key", key);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", id);
  const r = await fetch(url, { headers: { "Accept": "application/json" } });
  const body = await r.text();
  if(!r.ok) return { statusCode: r.status, body };
  return { statusCode: 200, body };
}