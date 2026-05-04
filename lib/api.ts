import { getToken } from "./auth";

const BASE_URL = "https://youtube-ai-service-606049491946.us-central1.run.app";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    body: options.body,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  let data = null;

  try {
    data = await res.json(); // 🔥 SAFE PARSE
  } catch {
    // ❗ No JSON returned (happens in cancel sometimes)
    data = null;
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    throw new Error(data?.detail || `API error: ${res.status}`);
  }

  return data;
}