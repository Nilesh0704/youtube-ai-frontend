"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-black">

      <div className="flex gap-6 text-sm">
        <Link href="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link href="/history" className="hover:text-blue-400">
          History
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="text-red-400 hover:text-red-300 text-sm"
      >
        Logout
      </button>
    </div>
  );
}