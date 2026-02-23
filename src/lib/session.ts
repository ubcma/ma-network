import { api } from "./api";

export async function getSession() {
  try {
    return await api<any>("/api/auth/get-session", { method: "GET" });
  } catch {
    return null;
  }
}