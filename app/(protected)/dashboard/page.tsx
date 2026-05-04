"use client";

import { useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/Card";
import CopyButton from "@/components/CopyButton";
import toast from "react-hot-toast";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastTopic, setLastTopic] = useState("");
  const [status, setStatus] = useState("");

  // 🔥 important: store interval to clear later
  const intervalRef = useRef<any>(null);

  // -----------------------------
  // GENERATE
  // -----------------------------
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult(null);
      setLastTopic(topic);
      setStatus("pending");

      const data = await apiFetch("/generate", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });

      const jobId = data.job_id;

      toast.success("Processing started 🚀");

      pollJob(jobId);

    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  // -----------------------------
  // POLLING
  // -----------------------------
  const pollJob = (jobId: number) => {
    // clear old interval if exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const statusData = await apiFetch(`/status/${jobId}`);

        const currentStatus = statusData.status;
        setStatus(currentStatus);

        if (statusData.status === "completed") {
          clearInterval(intervalRef.current);

          const resultData = await apiFetch(`/result/${jobId}`);

          setResult(resultData);
          setLoading(false);

          toast.success("Content ready 🎉");
          setStatus("completed");
        }

        if (statusData.status === "failed") {
          clearInterval(intervalRef.current);
          setLoading(false);

          toast.error("Generation failed ❌");
        }

      } catch (err) {
        clearInterval(intervalRef.current);
        setLoading(false);
        toast.error("Something went wrong");
      }
    }, 2000);
  };

  // -----------------------------
  // CLEAR RESULT
  // -----------------------------
  const handleClear = () => {
    setResult(null);
    setStatus("");
    setTopic("");
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

      {/* STATUS TEXT */}
      {loading && (
        <p className="text-sm text-gray-400 mt-2">
          Status: {status || "starting..."}
        </p>
      )}

      {/* EMPTY STATE */}
      {!result && !loading && (
        <div className="mt-10 text-center text-gray-500">
          Enter a topic and generate content 🚀
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="mt-6 space-y-4">

          {/* STATUS BADGE */}
          <div className="text-sm text-gray-400">
            {status === "pending" && "🕒 Queued..."}
            {status === "processing" && "⚙️ Generating content..."}
            {!status && "Starting..."}
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-800 rounded h-2 overflow-hidden">
            <div className="bg-blue-500 h-2 animate-pulse w-full"></div>
          </div>

          {/* SKELETON */}
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>

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

          {/* SOURCE BADGE */}
          <div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                result.source === "memory"
                  ? "bg-green-700"
                  : "bg-blue-700"
              }`}
            >
              {result.source === "memory"
                ? "⚡ From Memory"
                : "🤖 AI Generated"}
            </span>
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
              onClick={handleClear}
            >
              Clear
            </button>

          </div>

        </div>
      )}

    </div>
  );
}