export async function handler() {
  return { statusCode: 200, body: JSON.stringify({ youtube_api_key: !!process.env.YOUTUBE_API_KEY }) };
}