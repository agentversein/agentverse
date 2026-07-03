"use client";

import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          💳 Subscription Plans
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold">FREE</h2>

            <h1 className="text-5xl font-bold mt-4">
              ₹0
            </h1>

            <ul className="mt-8 space-y-3">
              <li>✅ AI Chat</li>
              <li>✅ Resume Builder</li>
              <li>✅ Image Generator</li>
              <li>❌ Premium Models</li>
              <li>❌ Priority Support</li>
            </ul>

            <button
              className="mt-8 w-full bg-gray-800 text-white py-3 rounded-xl"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-600 text-white rounded-2xl shadow-xl p-8">

            <h2 className="text-2xl font-bold">
              ⭐ PRO
            </h2>

            <h1 className="text-5xl font-bold mt-4">
              ₹499
            </h1>

            <p className="mt-2">
              Per Month
            </p>

            <ul className="mt-8 space-y-3">
              <li>✅ Unlimited AI Chat</li>
              <li>✅ GPT + Gemini + Groq</li>
              <li>✅ Premium Resume</li>
              <li>✅ Premium Image Generation</li>
              <li>✅ Priority Support</li>
            </ul>

            <button
              onClick={() => router.push("/pricing")}
              className="mt-8 w-full bg-white text-blue-600 py-3 rounded-xl font-bold"
            >
              Upgrade Now
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}