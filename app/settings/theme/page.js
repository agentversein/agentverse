"use client";

import { useEffect, useState } from "react";

export default function ThemePage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  const changeTheme = (mode) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
    document.documentElement.className = mode;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        🌙 Theme Settings
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">

        <button
          onClick={() => changeTheme("light")}
          className={`w-full p-3 rounded-lg mb-3 ${
            theme === "light"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          ☀️ Light Mode
        </button>

        <button
          onClick={() => changeTheme("dark")}
          className={`w-full p-3 rounded-lg ${
            theme === "dark"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          🌙 Dark Mode
        </button>

      </div>
    </div>
  );
}