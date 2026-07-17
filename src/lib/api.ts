import { fetchFromAPI } from "./httpHandlers";

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers =
    init.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : Array.isArray(init.headers)
        ? Object.fromEntries(init.headers)
        : (init.headers ?? {});

  const method = (init.method ?? "GET") as "GET" | "POST" | "PUT" | "DELETE";

  const res = await fetchFromAPI(path, {
    method,
    body: init.body as unknown,
    credentials: init.credentials,
    headers: headers as Record<string, string>,
  });

  // Parse JSON payload for successful responses
  const data = await res.json().catch(() => null);
  return data as T;
}