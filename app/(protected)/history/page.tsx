"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/Card";
import CopyButton from "@/components/CopyButton";
import toast from "react-hot-toast";

export default function History() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiFetch("/history");
        setData(res);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Your History</h1>

      {/* LOADING */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && data.length === 0 && (
        <p className="text-gray-400">No history found</p>
      )}

      {/* DATA */}
      <div className="space-y-8">
        {data.map((item, index) => {
          const ideas = JSON.parse(item.ideas || "[]");
          const titles = JSON.parse(item.titles || "[]");

          return (
            <div key={index} className="space-y-4">

              <h2 className="text-xl font-semibold">
                {item.topic}
              </h2>

              {/* IDEAS */}
              <Card title="Ideas">
                <ul className="list-disc pl-5 space-y-1">
                  {ideas.map((idea: string, i: number) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </Card>

              {/* TITLES */}
              <Card title="Titles">
                <ul className="list-disc pl-5 space-y-1">
                  {titles.map((title: string, i: number) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>{title}</span>
                      <CopyButton text={title} />
                    </li>
                  ))}
                </ul>
              </Card>

              {/* SCRIPT */}
              <Card title="Script">
                <div className="flex justify-end mb-2">
                  <CopyButton text={item.script} />
                </div>

                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {item.script}
                </div>
              </Card>

            </div>
          );
        })}
      </div>
    </div>
  );
}