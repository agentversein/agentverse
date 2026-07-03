"use client";

import { useSession, signOut } from "next-auth/react";

export default function SecurityPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          🔐 Security Center
        </h1>

        {/* Google Account */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

          <h2 className="text-2xl font-bold mb-5">
            Google Account
          </h2>

          <div className="flex items-center gap-4">

            <img
              src={session?.user?.image}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />

            <div>

              <h3 className="font-bold text-xl">
                {session?.user?.name}
              </h3>

              <p className="text-gray-500">
                {session?.user?.email}
              </p>

              <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                ✅ Verified Google Account
              </span>

            </div>

          </div>

        </div>

        {/* Current Session */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            💻 Current Session
          </h2>

          <div className="border rounded-xl p-4">

            <p>
              Browser: Chrome
            </p>

            <p>
              Device: Current Device
            </p>

            <p>
              Login: Google OAuth
            </p>

          </div>

        </div>

        {/* Logout */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            🚪 Logout
          </h2>

          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl"
          >
            Logout Account
          </button>

        </div>

        {/* Danger Zone */}

        <div className="bg-red-50 border border-red-300 rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-red-600">
            Danger Zone
          </h2>

          <p className="mt-2 text-gray-700">
            Delete your AgentVerse account permanently.
          </p>

         <button
  onClick={async () => {
    const ok = confirm(
      "Are you sure? This action cannot be undone."
    );

    if (!ok) return;

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Account deleted successfully.");
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  }}
  className="mt-5 bg-red-600 text-white px-6 py-3 rounded-xl"
>
  Delete Account
</button>

        </div>

      </div>

    </div>
  );
}