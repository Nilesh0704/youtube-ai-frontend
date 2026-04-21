"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // 👈 triggers re-check on route change

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // 👇 also listen for storage changes (logout in other tabs etc.)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]); // 👈 key fix

  return (
    <header className="w-full border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <a href="/" className="font-semibold cursor-pointer">
          🚀 YouTube AI
        </a>

        <div className="space-x-4 flex items-center">

          {!isLoggedIn ? (
            <a href="/login" className="text-sm text-gray-300 hover:text-white">
              Login
            </a>
          ) : (
            <>
              <a href="/dashboard" className="text-sm text-gray-300 hover:text-white">
                Dashboard
              </a>

              <button
                className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}