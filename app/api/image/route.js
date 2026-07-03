export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return Response.json({ error: "No prompt provided" }, { status: 400 });
  }

  // Free image generation API
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}`;

  return Response.json({
    image: imageUrl,
  });
}