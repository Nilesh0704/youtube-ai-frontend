"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/lib/auth";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/app");
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", email);   // ⚠️ OAuth expects "username"
      formData.append("password", password);

      const res = await fetch(
        "https://youtube-ai-service-606049491946.us-central1.run.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.access_token) {
        setToken(data.access_token);
        router.push("/dashboard")
      } else {
        throw new Error(data.error || "Login failed");
      }
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to YouTube AI
        </h1>

        <input
          className="border border-gray-700 bg-black p-3 w-full mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border border-gray-700 bg-black p-3 w-full mb-4 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}