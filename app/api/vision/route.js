import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req) {
  try {
    const form = await req.formData();
    const image = form.get("image");

    if (!image) {
      return Response.json({ reply: "No image ❌" });
    }

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image in detail.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
    });

    return Response.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      reply: "AI failed ❌",
    });
  }
}