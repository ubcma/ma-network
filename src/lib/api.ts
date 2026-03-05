function resolveApiURL(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const backendBaseURL = import.meta.env?.VITE_BACKEND_URL?.replace(/\/$/, "");
  if (backendBaseURL && path.startsWith("/api/")) {
    return `${backendBaseURL}${path}`;
  }

  return path;
}

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(resolveApiURL(path), {
    ...init,
    credentials: "include", // ⭐ sends/receives auth cookies
    headers: {
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  // Try to parse JSON (even on errors)
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}