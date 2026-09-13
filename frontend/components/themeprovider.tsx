"use client";

import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const cookies = document.cookie.split("; ");

    const themeCookie = cookies.find((cookie) =>
      cookie.startsWith("theme=")
    );

    const savedTheme =
      themeCookie?.split("=")[1] || "dark";

    document.documentElement.classList.remove(
      "light-theme",
      "dark-theme"
    );

    document.documentElement.classList.add(
      savedTheme === "light"
        ? "light-theme"
        : "dark-theme"
    );
  }, []);

  return <>{children}</>;
}