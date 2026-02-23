// src/lib/auth-client.ts
import { api } from "./api";
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080", // e.g. "http://localhost:8080"
  fetchOptions: { credentials: "include" },
});

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
    return await api("/api/auth/get-session", { method: "GET" });
  } catch {
    return null;
  }
}