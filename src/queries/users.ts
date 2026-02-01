import { MOCK_PROFILES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicGoogleSheet } from "./googleSheets";
import type { NetworkProfile } from "@/utils/networkProfileUtils";


async function fetchNetworkProfiles(): Promise<NetworkProfile[]> {

  const googleSheetData = await fetchPublicGoogleSheet();
  return googleSheetData as NetworkProfile[];
}

export function useNetworkProfiles() {
  return useQuery<NetworkProfile[]>({
    queryKey: ["networkProfile"],
    queryFn: fetchNetworkProfiles,
  });
}
