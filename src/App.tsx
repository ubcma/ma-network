import { useState } from "react";
import { Directory } from "@/components/Directory";
import { Menu } from "lucide-react";

export default function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/50 font-sans">
      {/* Main Content */}
      <div className="min-h-screen transition-all duration-300">
        <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <Directory />
        </main>
      </div>
    </div>
  );
}
