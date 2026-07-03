import Memory from "@/models/Memory";
import Groq from "groq-sdk";
import axios from "axios";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DecisionSchema = z.object({
  webSearch: z.boolean(),
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const message = formData.get("message");
    const image = formData.get("image");

    let reply = "";

    if (image) {
      // Image ko buffer me convert karo
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Base64 convert
      const base64Image = buffer.toString("base64");

      // 👇 Yaha Vision AI call hoga (example Gemini FREE)
      const res = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: "Is image ko detail me describe karo" },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  }
);

      const data = await res.json();

console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

let text = "";

// 👇 SAFE EXTRACTION
if (data?.candidates?.length > 0) {
  const parts = data.candidates[0]?.content?.parts;

  if (parts && parts.length > 0) {
    text = parts.map(p => p.text || "").join(" ");
  }
}

// 👇 FINAL REPLY
reply = text && text.trim() !== ""
  ? text
  : "❌ AI ne response nahi diya";
    } else {
      reply = "Sirf text aaya hai 👍";
    }

    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error aa gaya" }, { status: 500 });
  }
}