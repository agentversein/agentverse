"use client";

import { useEffect, useState } from "react";

const MODELS = [
  "GPT-5.5",
  "GPT-4o",
  "Gemini 2.5 Flash",
  "Gemini 2.5 Pro",
  "Groq Llama 4",
];

export default function AISettingsPage() {
  const [model, setModel] = useState("GPT-5.5");

  useEffect(() => {
    const saved = localStorage.getItem("agentverse-model");
    if (saved) {
      setModel(saved);
    }
  }, []);

  const saveModel = () => {
    localStorage.setItem("agentverse-model", model);
    alert("✅ AI model saved successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl bg-white rounded-xl shadow-lg p-6">

        <h1 className="text-3xl font-bold mb-6">
          🤖 AI Model Settings
        </h1>

        <label className="block mb-2 font-semibold">
          Select Default AI Model
        </label>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={saveModel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Save
        </button>

      </div>
    </div>
  );
}