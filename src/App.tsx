import { useEffect, useState } from "react";
import { Directory } from "@/components/Directory";
import { Menu } from "lucide-react";
import { fetchPublicGoogleSheet } from "./queries/googleSheets";

export default function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [data, setData] = useState<string[][]>([])

  useEffect(() => {

    async function fetchData() {
      const googleSheetData = await fetchPublicGoogleSheet();
      setData(googleSheetData)
    }

    fetchData();

  }, [])

  return (
    <div className="min-h-screen bg-secondary/50 font-sans">
      {/* Main Content */}
      {JSON.stringify(data)}
      <div className="min-h-screen transition-all duration-300">
        <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <Directory />
        </main>
      </div>
    </div>
  );
}
