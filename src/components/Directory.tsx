import { useEffect, useMemo, useState } from "react";
import { fetchPublicGoogleSheet } from "@/queries/googleSheets";
import { googleSheetToProfiles } from "@/utils/googleSheetToProfiles";
import type { NetworkProfile } from "@/utils/networkProfileUtils";
import { ProfileCard } from "./ProfileCard";
import { ProfileDetail } from "./ProfileDetail";
import { NetworkGraph } from "@/components/NetworkGraph";

export function Directory() {
  const [profiles, setProfiles] = useState<NetworkProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<NetworkProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const rows = await fetchPublicGoogleSheet();
        const parsedProfiles = googleSheetToProfiles(rows);

        if (!cancelled) setProfiles(parsedProfiles);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedProfiles = useMemo(() => {
    // optional: consistent ordering
    return [...profiles].sort((a, b) =>
      `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`)
    );
  }, [profiles]);

  if (loading) return <div className="p-6 text-gray-600">Loading directory…</div>;

  if (error)
    return (
      <div className="p-6">
        <div className="text-red-600 font-medium">Couldn’t load directory</div>
        <div className="text-gray-600 mt-2 text-sm">{error}</div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProfiles.map((p) => (
          <ProfileCard
            key={p.id}
            profile={p}
            onClick={() => {
              setSelected(p);
              setIsOpen(true);
            }}
          />
        ))}
      </div>

      <ProfileDetail
        profile={selected}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
