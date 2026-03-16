// src/App.tsx
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Directory } from "./components/Directory";
import { Spinner } from "./components/ui/spinner";
import { SignOutButton } from "./components/SignOutButton";
import { getSession } from "./lib/auth-client";
import { getUserRole } from "./lib/get-user-role";
import SignInPage from "./pages/(auth)/sign-in/page";

function ProtectedLayout() {
  const location = useLocation();
  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    staleTime: 60_000,
    retry: 1,
  });

  const isAuthed = !!sessionQuery.data?.user;

  const portal_origin = import.meta.env?.VITE_PORTAL_ORIGIN ?? "";

  const roleQuery = useQuery({
    queryKey: ["user-role"],
    queryFn: getUserRole,
    enabled: isAuthed,
    staleTime: 60_000,
    retry: 1,
  });

  const loading = sessionQuery.isPending || (isAuthed && roleQuery.isPending);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-container min-h-screen flex items-center justify-center">
          <Spinner className="size-6 text-(--brand)" />
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ returnTo: location.pathname + location.search }}
      />
    );
  }

  if (roleQuery.data === "Basic") {
    return (
      <div className="app-shell">
        <div className="app-container min-h-screen flex items-center justify-center px-4">
          <div className="glass-panel rounded-xs max-w-xl w-full p-8 text-center space-y-4">
            <div className="brand-pill w-fit mx-auto">UBC Marketing Association</div>
            <h1 className="hero-title text-xl md:text-2xl">This feature is only available for members.</h1>
            <p className="subtitle text-sm md:text-base">
              Please purchase a membership on the UBCMA membership portal to access this feature.
            </p>
            <a
              href={'https://app.ubcma.ca'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xs bg-(--brand) px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              Visit the Membership Portal
            </a>
            <div className="flex justify-center pt-1">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (roleQuery.isError) {
    return (
      <div className="app-shell">
        <div className="app-container min-h-screen flex items-center justify-center px-4">
          <div className="glass-panel rounded-xs max-w-xl w-full p-8 text-center space-y-4">
            <h1 className="hero-title text-xl md:text-2xl">Couldn’t Verify Access</h1>
            <p className="subtitle text-sm md:text-base">
              We couldn’t verify your role right now. Please refresh and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Allows /directory to render if authed! (child components can also access session data via /api/auth/get-session)
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/directory" replace />} />

      <Route path="/sign-in" element={<SignInPage />} />

      {/* PROTECTED BY CHECK */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/directory"
          element={
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
                          A directory of UBCMA executives and alumni to facilitate connection
                          and career development across multiple generations of UBC's marketing
                          association.
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
          }
        />
      </Route>

      {/* Simple fallback for testing */}
      <Route
        path="*"
        element={
          <div style={{ padding: 24 }}>
            <h1>404</h1>
            <p>
              Go to <a href="/">/</a> or <a href="/directory">/directory</a>
            </p>
          </div>
        }
      />
    </Routes>
  );
}
