"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginBtn() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-3 py-1 rounded-full bg-red-500 text-white"
      >
        Logout ({session.user.name})
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-3 py-1 rounded-full bg-blue-500 text-white"
    >
      Login
    </button>
  );
}