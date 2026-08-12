"use client";

import { useState } from "react";

function getSavedTheme() {
  if (typeof document === "undefined") {
    return "dark";
  }

  const cookies = document.cookie.split("; ");

  const themeCookie = cookies.find((cookie) =>
    cookie.startsWith("theme=")
  );

  return themeCookie?.split("=")[1] || "dark";
}

export default function Settings() {
  const [theme, setTheme] = useState(getSavedTheme);

  function changeTheme(newTheme: string) {
    setTheme(newTheme);

    document.documentElement.classList.remove(
      "light-theme",
      "dark-theme"
    );

    document.documentElement.classList.add(
      newTheme === "light"
        ? "light-theme"
        : "dark-theme"
    );

    document.cookie =
      `theme=${newTheme}; path=/; max-age=31536000`;
  }

  return (
    <main className="p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Settings
        </h1>

        <section className="border rounded-lg p-6">

          <h2 className="text-2xl font-semibold mb-2">
            Theme
          </h2>

          <p className="mb-6">
            Choose how you would like Phoneme Games to appear.
          </p>

          <div className="flex gap-4">

            <button
              onClick={() => changeTheme("light")}
              className={`border rounded px-6 py-3 ${
                theme === "light"
                  ? "font-bold ring-2"
                  : ""
              }`}
            >
              Light
            </button>

            <button
              onClick={() => changeTheme("dark")}
              className={`border rounded px-6 py-3 ${
                theme === "dark"
                  ? "font-bold ring-2"
                  : ""
              }`}
            >
              Dark
            </button>

          </div>

          <p className="mt-6">
            Current theme:{" "}
            <strong>
              {theme === "dark" ? "Dark" : "Light"}
            </strong>
          </p>

        </section>

      </div>
    </main>
  );
}