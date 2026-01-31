import { MOCK_PROFILES } from "@/lib/constants";
import type { NetworkProfile } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";


async function fetchNetworkProfiles(): Promise<NetworkProfile[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROFILES);
    }, 500);
  });
}

export function useNetworkProfiles() {
  return useQuery<NetworkProfile[]>({
    queryKey: ["networkProfile"],
    queryFn: fetchNetworkProfiles,
  });
}
