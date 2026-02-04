import { Directory } from "@/components/Directory";

export default function App() {

  return (
    <div className="app-shell">
      <div className="app-container">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-6 -mb-8">
              <div className="brand-pill w-fit">UBC Marketing Association</div>
              <div className="flex flex-col gap-4">
                <h1 className="hero-title text-2xl md:text-4xl hero-glow">
                  MA Mentorship Hub
                </h1>
                <p className="subtitle text-base md:text-md max-w-2xl">
                  A directory of UBCMA executives and alumni to facilitate connection and career development across multiple generations of UBC's marketing association. 
                </p>
              </div>
            </header>
            <main className="transition-all duration-300">
              <Directory />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
