"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function Landing() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token) {
      setRedirecting(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">

      <h1 className="text-4xl font-bold mb-4">
        🚀 YouTube AI Generator
      </h1>

      <p className="text-gray-400 mb-6">
        Generate video ideas, titles & scripts instantly using AI
      </p>

      <button
        className="bg-blue-600 px-6 py-3 rounded"
        onClick={() => router.push("/login")}
      >
        Get Started
      </button>

      {redirecting && (
        <p className="text-gray-500 mt-4">
          Redirecting to dashboard...
        </p>
      )}

    </div>
  );
}