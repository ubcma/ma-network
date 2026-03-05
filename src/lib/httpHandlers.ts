import { handleServerError } from "./error/handleServer";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown; // allow any JSON payload
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export async function fetchFromAPI(endpoint: string, options: FetchOptions = {}): Promise<Response> {
  const { method = "GET", body, credentials, headers: customHeaders = {} } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...customHeaders,
  };

  const res = await fetch(`${import.meta.env?.VITE_BACKEND_URL}${endpoint}`, {
    method,
    headers,
    credentials: credentials ?? "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = `Failed to fetch ${endpoint}`;

    try {
      const json = JSON.parse(text);
      message = json?.message ?? message;
    } catch {
      // keep message
    }

    if (res.status === 429) {
      throw new Error("Too many attempts. Please wait 10 minutes before trying again.");
    }

    handleServerError("An error occurred, please contact our team for support");
    throw new Error(message);
  }

  return res;
}