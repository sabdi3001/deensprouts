export async function handler(event) {
  const key = process.env.YOUTUBE_API_KEY;
  if(!key) return { statusCode: 500, body: JSON.stringify({ error: "Missing YOUTUBE_API_KEY" }) };
  const q = (event.queryStringParameters && event.queryStringParameters.q) || "islamic kids";
  const pageToken = (event.queryStringParameters && event.queryStringParameters.pageToken) || "";
  const max = Math.max(1, Math.min(50, parseInt((event.queryStringParameters && event.queryStringParameters.max) || "20", 10)));

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", key);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(max));
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("regionCode", "US");
  if(pageToken) url.searchParams.set("pageToken", pageToken);

  const r = await fetch(url, { headers: { "Accept": "application/json" } });
  const body = await r.text();
  if(!r.ok) return { statusCode: r.status, body };
  return { statusCode: 200, body };
}