export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    // 🔥 Simple AI (dummy response)
    const reply = `AI: ${message}`;

    return Response.json({ reply });

  } catch (error) {
    console.error("AI Error:", error);

    return Response.json(
      { error: "AI failed" },
      { status: 500 }
    );
  }
}