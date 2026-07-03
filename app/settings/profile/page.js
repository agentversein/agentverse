"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">
        👤 My Profile
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl">

        <img
          src={session?.user?.image || "/user.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-6"
        />

        <div className="space-y-4">

          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">
              {session?.user?.name || "Guest"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">
              {session?.user?.email || "Not Logged In"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Plan</p>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full">
              FREE
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}