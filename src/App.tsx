// src/App.tsx
import * as React from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { Directory } from "./components/Directory";
import { Spinner } from "./components/ui/spinner";
import SignInPage from "./pages/(auth)/sign-in/page";

function ProtectedLayout() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/get-session", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const text = await res.text();

        let data: { user?: unknown } | null = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (cancelled) return;

        setAuthed(!!data?.user);
      } catch {
        if (cancelled) return;
        setAuthed(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-container min-h-screen flex items-center justify-center">
          <Spinner className="size-6 text-(--brand)" />
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ returnTo: location.pathname + location.search }}
      />
    );
  }

  // Allows /directory to render if authed! (child components can also access session data via /api/auth/get-session)
  return <Outlet />;
}

//   // TEMP: do NOT redirect. Show the result
//   if (!authed) {
//     return (
//       <div style={{ padding: 24 }}>
//         <h2>Not authed ❌</h2>
//         <div style={{ marginTop: 12 }}>
//           <div>
//             <b>Current path:</b> {location.pathname}
//           </div>
//           {err && (
//             <div>
//               <b>Error:</b> {err}
//             </div>
//           )}
//           {raw && (
//             <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
//               {JSON.stringify(raw, null, 2)}
//             </pre>
//           )}
//         </div>

//         <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
//           <a href="/" style={{ textDecoration: "underline" }}>
//             Go to /
//           </a>
//           <a href="/directory" style={{ textDecoration: "underline" }}>
//             Try /directory again
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Authed ✅</h2>
//       <div style={{ marginBottom: 12 }}>
//         <b>Current path:</b> {location.pathname}
//       </div>
//       {raw && (
//         <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
//           {JSON.stringify(raw, null, 2)}
//         </pre>
//       )}
//       <Outlet />
//     </div>
//   );
// }

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
