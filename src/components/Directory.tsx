import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { NetworkGraph } from "@/components/NetworkGraph";
import { SearchBar } from "@/components/SearchBar";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileDetail } from "@/components/ProfileDetail";
import { Network, Users, Info, List } from "lucide-react";

import { fetchPublicGoogleSheet } from "@/queries/googleSheets";
import { googleSheetToProfiles } from "@/utils/googleSheetToProfiles";
import type { NetworkProfile } from "@/utils/networkProfileUtils";

import {
  generateGraphData,
  searchProfiles,
  type GraphNode,
} from "@/utils/graphUtils";

function uniqSorted(values: string[]) {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
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

  // filtering 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterContactType, setFilterContactType] = useState("");

  const [selectedProfile, setSelectedProfile] = useState<NetworkProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 });
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
  const companies = useMemo(() => getAllCompaniesFromProfiles(profiles), [profiles]);
  const roles = useMemo(() => getAllRolesFromProfiles(profiles), [profiles]);
  const topics = useMemo(() => getAllTopicsFromProfiles(profiles), [profiles]);

  const filteredProfiles = useMemo(() => {
    const normalizedCompany = filterCompany === "all" ? "" : filterCompany;
    const normalizedRole = filterRole === "all" ? "" : filterRole;
    const normalizedTopic = filterTopic === "all" ? "" : filterTopic;
    const normalizedContactType = filterContactType === "all" ? "" : filterContactType;

    return searchProfiles(
      profiles,
      searchTerm,
      normalizedCompany,
      normalizedRole,
      normalizedTopic,
      normalizedContactType,
    );
  }, [profiles, searchTerm, filterCompany, filterRole, filterTopic, filterContactType]);


  const graphData = useMemo(() => generateGraphData(filteredProfiles), [filteredProfiles]);


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
        document.getElementById("directory-container")?.clientWidth || window.innerWidth;
      const width = Math.min(containerWidth - 48, 1400);
      const height = Math.min(window.innerHeight - 300, 700);
      setGraphDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);


  if (loading) return <div className="p-6 text-gray-600">Loading directory…</div>;

  if (error)
    return (
      <div className="p-6">
        <div className="text-red-600 font-medium">Couldn’t load directory</div>
        <div className="text-gray-600 mt-2 text-sm">{error}</div>
      </div>
    );

  return (
    <div className="space-y-6" id="directory-container">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Directory</h2>
          <p className="text-muted-foreground mt-1">
            Connect with {filteredProfiles.length} alumni and executives
          </p>
        </div>

        {/* View Toggle */}
        <div className="bg-white p-1 rounded-lg border border-gray-200 flex items-center shadow-sm">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "graph"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Network className="w-4 h-4" />
            Graph
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-6 border-0 shadow-sm bg-white ring-1 ring-gray-100">
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
          resultCount={filteredProfiles.length}
        />
      </Card>

      {/* Legend - Only show for Graph view */}
      {viewMode === "graph" && (
        <Card className="p-4 bg-white/80 backdrop-blur border-0 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-gray-700">Legend:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#e11d48] ring-2 ring-red-100" />
              <span className="text-sm text-gray-600">Alumni</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#374151] ring-2 ring-gray-200" />
              <span className="text-sm text-gray-600">Executive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#94a3b8] ring-2 ring-slate-100" />
              <span className="text-sm text-gray-600">Company</span>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden min-h-[600px]">
        {viewMode === "graph" ? (
          <div className="relative w-full h-[700px]">
            {filteredProfiles.length > 0 ? (
              <NetworkGraph
                data={graphData}
                onNodeClick={handleNodeClick}
                width={graphDimensions.width}
                height={graphDimensions.height}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Network className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => handleProfileCardClick(profile)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Users className="w-16 h-16 mb-4 text-gray-200" />
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
