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
  const isAbsoluteURL = /^https?:\/\//.test(endpoint);
  const backendBaseURL = import.meta.env?.VITE_BACKEND_URL ?? "";
  const requestURL = isAbsoluteURL
    ? endpoint
    : backendBaseURL
      ? `${backendBaseURL}${endpoint}`
      : endpoint;
  const hasStringBody = typeof body === "string";

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined && !hasStringBody ? { "Content-Type": "application/json" } : {}),
    ...customHeaders,
  };

  const res = await fetch(requestURL, {
    method,
    headers,
    credentials: credentials ?? "include",
    body:
      body !== undefined
        ? hasStringBody
          ? body
          : JSON.stringify(body)
        : undefined,
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