import { Directory } from "@/components/Directory";

export default function App() {

  return (
    <div className="min-h-screen bg-secondary/50 font-sans">
      {/* Main Content */}
      <div className="min-h-screen transition-all duration-300">
        <main className="p-4 md:p-8">
          <Directory />
        </main>
      </div>
    </div>
  );
}
