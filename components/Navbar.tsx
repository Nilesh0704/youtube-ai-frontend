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
    <div className="flex justify-between p-4 border-b">

      <div className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/history">History</Link>
      </div>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}