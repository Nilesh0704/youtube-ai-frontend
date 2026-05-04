"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await apiFetch("/history");
    setHistory(data);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-2xl mb-6">History</h1>

      {history.map((item, i) => (
        <div
          key={i}
          className="p-3 border mb-2 cursor-pointer hover:bg-gray-800"
          onClick={() => {
            localStorage.setItem("selectedContent", JSON.stringify(item));
            router.push("/dashboard");
          }}
        >
          {item.topic}
        </div>
      ))}

    </div>
  );
}