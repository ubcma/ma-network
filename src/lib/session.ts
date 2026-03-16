import { api } from "./api";

type SessionResponse = {
  user?: unknown;
} | null;

export async function getSession() {
  try {
    return await api<SessionResponse>("/api/auth/get-session", { method: "GET" });
  } catch {
    return null;
  }
}