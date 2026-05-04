"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/Card";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiFetch("/history");
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">History</h1>

      {history.length === 0 && (
        <p className="text-gray-400">No history yet</p>
      )}

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-3">
          {history.map((item, i) => (
            <div
              key={i}
              className="p-3 border border-gray-700 rounded cursor-pointer hover:bg-gray-800"
              onClick={() => setSelected(item)}
            >
              <p className="text-sm text-gray-300">{item.topic}</p>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div>
          {selected ? (
            <div className="space-y-4">

              <Card title="Ideas">
                <ul className="list-disc pl-5">
                  {selected.ideas?.map((i: string, idx: number) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Titles">
                <ul className="list-disc pl-5">
                  {selected.titles?.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Script">
                <div className="whitespace-pre-wrap">
                  {selected.script}
                </div>
              </Card>

            </div>
          ) : (
            <p className="text-gray-500">
              Select a history item
            </p>
          )}
        </div>

      </div>
    </div>
  );
}