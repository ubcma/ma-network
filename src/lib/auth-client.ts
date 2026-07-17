// src/lib/auth-client.ts
import { api } from "./api";
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env?.VITE_BACKEND_URL,
  fetchOptions: { credentials: "include" },
});

type SessionResponse = {
  user?: unknown;
} | null;

export async function signInEmail(email: string, password: string) {
  return api("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe: true }),
  });
}

export async function signOut() {
  return api("/api/auth/sign-out", { method: "POST" });
}

export async function getSession() {
  try {
    return await api<SessionResponse>("/api/auth/get-session", { method: "GET" });
  } catch {
    return null;
  }
}