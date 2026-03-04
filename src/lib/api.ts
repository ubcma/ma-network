export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
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
    const msg = (data as any)?.message ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}