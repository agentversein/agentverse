import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const AI_MODELS = {
  GROQ: "groq",
  GEMINI: "gemini",
  OPENAI: "openai",
  OPENROUTER: "openrouter",
};
// ==========================
// GROQ
// ==========================

async function runGroq(messages) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
  });

  return {
    provider: "Groq",
    output: response.choices[0].message.content,
  };
}

// ==========================
// GEMINI
// ==========================

async function runGemini(messages) {
  const prompt = messages
    .map((m) => `${m.role.toUpperCase()}:\n${m.content}`)
    .join("\n\n");

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    provider: "Gemini",
    output: response.text,
  };
}
// ==========================
// OPENAI
// ==========================

async function runOpenAI(messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
  });

  return {
    provider: "OpenAI",
    output: response.choices[0].message.content,
  };
}

// ==========================
// OPENROUTER
// ==========================

async function runOpenRouter(messages) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       model: "google/gemini-2.5-flash",
        messages,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("OpenRouter request failed");
  }

  const data = await response.json();

  return {
    provider: "OpenRouter",
    output: data.choices[0].message.content,
  };
}
// ==========================
// AI ROUTER
// ==========================

export async function runAI(messages) {
  const providers = [
    { name: "Groq", fn: runGroq },
    { name: "Gemini", fn: runGemini },
    { name: "OpenRouter", fn: runOpenRouter },
    { name: "OpenAI", fn: runOpenAI },
  ];

  const errors = [];

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);

      const result = await provider.fn(messages);

      console.log(`✅ ${provider.name} Success`);

      return {
        ...result,
        provider: provider.name,
      };
    } catch (err) {
      console.error(`❌ ${provider.name} Failed`);

      errors.push({
        provider: provider.name,
        error: err.message,
      });

      continue;
    }
  }

  console.error("All Providers Failed", errors);

  throw new Error(
    "All AI providers failed.\n" +
    JSON.stringify(errors, null, 2)
  );
}