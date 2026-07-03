"use client";

import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          ⚙️ Settings
        </h2>

        <div className="space-y-3">

          <Link href="/" className="block hover:text-blue-600">
            🏠 Dashboard
          </Link>

          <Link href="/settings/profile" className="block hover:text-blue-600">
            👤 Profile
          </Link>

          <Link href="/settings/theme" className="block hover:text-blue-600">
            🌙 Theme
          </Link>

          <Link href="/settings/ai" className="block hover:text-blue-600">
            🤖 AI Model
          </Link>

          <Link href="/settings/subscription" className="block hover:text-blue-600">
            💳 Subscription
          </Link>

          <Link href="/settings/security" className="block hover:text-blue-600">
            🔐 Security
          </Link>
          <Link
  href="/settings/billing"
  className="block hover:text-blue-600"
>
  💳 Billing History
</Link>

        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold">
          Welcome to Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your AgentVerse account.
        </p>

      </div>

    </div>
  );
}