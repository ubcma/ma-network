import { fetchFromAPI } from "./httpHandlers";

type UserProfileData = {
  role: string;
};

export async function getUserRole(): Promise<string> {
  const res = await fetchFromAPI("/api/me", { method: "GET" });
  const data = (await res.json()) as UserProfileData;
  return data.role;
}
