"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/Card";
import CopyButton from "@/components/CopyButton";
import toast from "react-hot-toast";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastTopic, setLastTopic] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setLastTopic(topic);

      const data = await apiFetch("/generate", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });

      setResult(data);
      toast.success("Content generated!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto relative">

      <h1 className="text-3xl font-bold mb-6">
        Generate YouTube Content
      </h1>

      <p className="text-sm text-gray-400 mb-4">
        Free plan: 10 generations per minute
      </p>

      {/* INPUT */}
      <input
        value={topic}
        className="border p-3 w-full mb-4 rounded bg-black"
        placeholder="Enter topic..."
        onChange={(e) => setTopic(e.target.value)}
      />

      {/* BUTTON */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading || !topic}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* EMPTY STATE */}
      {!result && !loading && (
        <div className="mt-10 text-center text-gray-500">
          Enter a topic and generate content 🚀
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="mt-6 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-700 rounded w-2/3"></div>
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-8 space-y-6">

          {/* IDEAS */}
          <Card title="Ideas">
            <ul className="list-disc pl-5 space-y-1">
              {result.ideas?.map((idea: string, i: number) => (
                <li key={i}>{idea}</li>
              ))}
            </ul>
          </Card>

          {/* TITLES */}
          <Card title="Titles">
            <ul className="list-disc pl-5 space-y-1">
              {result.titles?.map((title: string, i: number) => (
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
              <CopyButton text={result.script} />
            </div>

            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {result.script}
            </div>
          </Card>

          {/* SOURCE */}
          <div className="text-xs text-gray-400">
            Source: {result.source}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-4">

            <button
              className="bg-yellow-500 px-4 py-2 rounded text-black font-medium"
              onClick={() => {
                setTopic(lastTopic);
                handleGenerate();
              }}
            >
              Regenerate
            </button>

            <button
              className="bg-gray-700 px-4 py-2 rounded"
              onClick={() => setResult(null)}
            >
              Clear
            </button>

          </div>

        </div>
      )}

    </div>
  );
}