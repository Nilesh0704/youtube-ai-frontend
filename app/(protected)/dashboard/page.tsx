"use client";

import { useState, useRef, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/Card";
import CopyButton from "@/components/CopyButton";
import toast from "react-hot-toast";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [lastJobId, setLastJobId] = useState<number | null>(null);

  const intervalRef = useRef<any>(null);

  // 🔥 Load from history
  useEffect(() => {
    const stored = localStorage.getItem("selectedContent");

    if (stored) {
      setResult(JSON.parse(stored));
      localStorage.removeItem("selectedContent");
    }
  }, []);

  // -----------------------------
  // GENERATE
  // -----------------------------
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult(null);
      setStatus("pending");

      const data = await apiFetch("/generate", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });

      const jobId = data.job_id;
      setCurrentJobId(jobId);
      setLastJobId(jobId);

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const statusData = await apiFetch(`/status/${jobId}`);
        const currentStatus = statusData.status;

        setStatus(currentStatus);

        if (currentStatus === "completed") {
          clearInterval(intervalRef.current);

          const resultData = await apiFetch(`/result/${jobId}`);

          setResult(resultData);
          setLoading(false);
          setCurrentJobId(null);

          toast.success("Content ready 🎉");
        }

        if (currentStatus === "failed" || currentStatus === "cancelled") {
          clearInterval(intervalRef.current);
          setLoading(false);
          setCurrentJobId(null);

          toast.error(`Job ${currentStatus}`);
        }

      } catch {
        clearInterval(intervalRef.current);
        setLoading(false);
        setCurrentJobId(null);
      }
    }, 2000);
  };

  // -----------------------------
  // CANCEL
  // -----------------------------
  const handleCancel = async () => {
    if (!currentJobId) return;

    try {
      await apiFetch(`/cancel/${currentJobId}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Cancel failed:", err);
    }

    // 🔥 ALWAYS update UI (even if API fails)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setLoading(false);
    setStatus("cancelled");
    setCurrentJobId(null);

    toast("Cancelled ❌");
  };

  // -----------------------------
  // RETRY
  // -----------------------------
  const handleRetry = async () => {
    if (!lastJobId) return;

    const data = await apiFetch(`/retry/${lastJobId}`, {
      method: "POST",
    });

    setLoading(true);
    setResult(null);
    setCurrentJobId(data.job_id);
    setLastJobId(data.job_id);
    setStatus("pending");

    pollJob(data.job_id);
  };

  // -----------------------------
  // CLEAR
  // -----------------------------
  const handleClear = () => {
    setResult(null);
    setTopic("");
    setStatus("");
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Generate YouTube Content
      </h1>

      <input
        value={topic}
        className="border p-3 w-full mb-4 rounded bg-black"
        placeholder="Enter topic..."
        onChange={(e) => setTopic(e.target.value)}
      />

      <button
        className="bg-blue-600 px-6 py-2 rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading || !topic}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* STATUS */}
      {status && (
        <div className="mt-2">
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
            {status.toUpperCase()}
          </span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-6 space-y-3">
          <div className="h-4 bg-gray-700 animate-pulse rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 animate-pulse rounded w-2/3"></div>

          {currentJobId && (
            <button
              className="mt-4 bg-red-600 px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* EMPTY */}
      {!result && !loading && (
        <div className="mt-10 text-gray-500 text-center">
          Try: iPhone review, fitness vlog, crypto news 🚀
        </div>
      )}

      {/* RESULT */}
      {(result || status === "cancelled") && (
        <div className="mt-8 space-y-6">

          <Card title="Ideas">
            <ul className="list-disc pl-5">
              {result.ideas?.map((i: string, idx: number) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </Card>

          <Card title="Titles">
            <ul className="list-disc pl-5">
              {result.titles?.map((t: string, idx: number) => (
                <li key={idx} className="flex justify-between">
                  <span>{t}</span>
                  <CopyButton text={t} />
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Script">
            <CopyButton text={result.script} />
            <div className="whitespace-pre-wrap mt-2">
              {result.script}
            </div>
          </Card>

          <div className="flex gap-3">
            <button
              className="bg-yellow-500 px-4 py-2 rounded"
              onClick={handleRetry}
              disabled={loading}
            >
              Retry
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