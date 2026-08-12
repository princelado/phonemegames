"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="flex gap-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <Link href="/wordle" className="hover:underline">
            Wordle
          </Link>

          <Link href="/word-search" className="hover:underline">
            Word Search
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-11 h-11 border rounded-md flex items-center justify-center text-xl menu-button"
            aria-label="Open menu"
          >
            ☰
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 border rounded-md shadow-lg z-20 overflow-hidden menu-dropdown">

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 menu-link"
              >
                About
              </Link>

              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 menu-link"
              >
                Settings
              </Link>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}