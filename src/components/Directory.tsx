import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { NetworkGraph } from "@/components/NetworkGraph";
import { SearchBar } from "@/components/SearchBar";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileDetail } from "@/components/ProfileDetail";
import { Network, Users, List } from "lucide-react";

import { fetchPublicGoogleSheet } from "@/queries/googleSheets";
import { googleSheetToProfiles } from "@/utils/googleSheetToProfiles";
import type { NetworkProfile } from "@/utils/networkProfileUtils";

import {
  generateGraphData,
  searchProfiles,
  type GraphNode,
} from "@/utils/graphUtils";

function uniqSorted(values: string[]) {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b),
  );
}

function getAllCompaniesFromProfiles(profiles: NetworkProfile[]) {
  return uniqSorted(profiles.map((p) => p.current_company ?? ""));
}

function getAllRolesFromProfiles(profiles: NetworkProfile[]) {
  return uniqSorted(profiles.map((p) => p.current_role ?? ""));
}

function getAllTopicsFromProfiles(profiles: NetworkProfile[]) {
  // hobbies already includes hobbies + expertise from your transformer
  return uniqSorted(profiles.flatMap((p) => p.hobbies ?? []));
}

export function Directory() {
  const [profiles, setProfiles] = useState<NetworkProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterContactType, setFilterContactType] = useState("");

  const [selectedProfile, setSelectedProfile] = useState<NetworkProfile | null>(
    null,
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [graphDimensions, setGraphDimensions] = useState({
    width: 1000,
    height: 800,
  });
  const [viewMode, setViewMode] = useState<"graph" | "list">("list");

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

  // get all memoized options from the network profiles
  const companies = useMemo(
    () => getAllCompaniesFromProfiles(profiles),
    [profiles],
  );
  const roles = useMemo(() => getAllRolesFromProfiles(profiles), [profiles]);
  const topics = useMemo(() => getAllTopicsFromProfiles(profiles), [profiles]);

  const filteredProfiles = useMemo(() => {
    const normalizedCompany = filterCompany === "all" ? "" : filterCompany;
    const normalizedRole = filterRole === "all" ? "" : filterRole;
    const normalizedTopic = filterTopic === "all" ? "" : filterTopic;
    const normalizedContactType =
      filterContactType === "all" ? "" : filterContactType;

    return searchProfiles(
      profiles,
      searchTerm,
      normalizedCompany,
      normalizedRole,
      normalizedTopic,
      normalizedContactType,
    );
  }, [
    profiles,
    searchTerm,
    filterCompany,
    filterRole,
    filterTopic,
    filterContactType,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCompany, filterRole, filterTopic, filterContactType]);

  const graphData = useMemo(() => generateGraphData(profiles), [profiles]);
  const visibleProfileIds = useMemo(
    () => new Set(filteredProfiles.map((profile) => profile.id)),
    [filteredProfiles],
  );

  const totalPages = Math.ceil(filteredProfiles.length / pageSize);
  const paginatedProfiles =
    viewMode === "list"
      ? filteredProfiles.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        )
      : filteredProfiles;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleNodeClick = (node: GraphNode) => {
    if (node.profile) {
      setSelectedProfile(node.profile);
      setIsProfileOpen(true);
    }
  };

  const handleProfileCardClick = (profile: NetworkProfile) => {
    setSelectedProfile(profile);
    setIsProfileOpen(true);
  };
  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth =
        document.getElementById("directory-container")?.clientWidth ||
        window.innerWidth;
      const width = Math.min(containerWidth - 48, 1400);
      const height = Math.min(window.innerHeight - 300, 700);
      setGraphDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [reloadKey]);

  if (loading)
    return (
      <div className="glass-panel rounded-xs p-8 flex flex-col items-center gap-3 text-center">
        <Spinner className="size-5 text-(--brand)" />
        <div className="text-sm text-(--muted-ink)">Loading directory…</div>
      </div>
    );

  if (error)
    return (
      <div className="glass-panel rounded-xs p-8 flex flex-col items-start gap-4">
        <div>
          <div className="text-(--brand) font-semibold text-lg">Couldn’t load directory</div>
          <div className="text-(--muted-ink) mt-2 text-sm">
            {error}
          </div>
        </div>
        <Button
          variant="outline"
          className="border-white/15 text-(--ink) hover:bg-white/10"
          onClick={() => setReloadKey((prev) => prev + 1)}
        >
          Try again
        </Button>
      </div>
    );

  return (
    <div className="space-y-6" id="directory-container">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

        {/* View Toggle */}
        <div className="segmented-control fixed bottom-4 left-1/2 z-100 -translate-x-1/2 flex backdrop-blur-lg">
          <button
            onClick={() => setViewMode("list")}
            className={`segmented-button cursor-pointer ${
              viewMode === "list"
                ? "active"
                : ""
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`segmented-button cursor-pointer ${
              viewMode === "graph"
                ? "active"
                : ""
            }`}
          >
            <Network className="w-4 h-4" />
            Graph
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          companies={companies}
          roles={roles}
          topics={topics}
          filterCompany={filterCompany}
          setFilterCompany={setFilterCompany}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterTopic={filterTopic}
          setFilterTopic={setFilterTopic}
          filterContactType={filterContactType}
          setFilterContactType={setFilterContactType}
        />
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-xs overflow-hidden">
        {viewMode === "graph" ? (
          <div className="relative w-full h-full overflow-hidden">
            {filteredProfiles.length > 0 ? (
              <NetworkGraph
                data={graphData}
                visibleProfileIds={visibleProfileIds}
                onNodeClick={handleNodeClick}
                width={graphDimensions.width}
                height={graphDimensions.height}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full min-h-128 text-(--muted-ink)">
                <Network className="text-(--border-strong)" />
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            {filteredProfiles.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => handleProfileCardClick(profile)}
                  />
                  ))}
                </div>
                {viewMode === "list" && totalPages > 1 && (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="mono-label text-[11px] text-(--muted-ink)">
                      Showing{" "}
                      {(currentPage - 1) * pageSize + 1}–{Math.min(
                        currentPage * pageSize,
                        filteredProfiles.length,
                      )}{" "}
                      of {filteredProfiles.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="h-9 border-white/15 text-(--ink) hover:bg-white/10 disabled:opacity-40"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                      >
                        Prev
                      </Button>
                      <div className="mono-label text-[11px] text-(--muted-ink)">
                        Page {currentPage} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        className="h-9 border-white/15 text-(--ink) hover:bg-white/10 disabled:opacity-40"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-(--muted-ink)">
                <Users className="w-16 h-16 mb-4 text-(--border-strong)" />
                <p className="text-lg font-medium">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ProfileDetail
        profile={selectedProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
