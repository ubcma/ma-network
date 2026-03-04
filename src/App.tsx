// src/App.tsx
import * as React from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { Directory } from "./components/Directory";
import SignInPage from "./pages/(auth)/sign-in/page";

function ProtectedLayout() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const [raw, setRaw] = React.useState<any>(null);
  const [err, setErr] = React.useState<string | null>(null);

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

        let data: any = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = { _nonJson: text?.slice(0, 400) };
        }

        if (cancelled) return;

        setRaw({
          url: "/api/auth/get-session",
          status: res.status,
          ok: res.ok,
          contentType: res.headers.get("content-type"),
          data,
        });

        setAuthed(!!data?.user);
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message ?? String(e));
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
      <div style={{ padding: 24 }}>
        <h2>ProtectedLayout</h2>
        <div>Loading session…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={{ padding: 24 }}>
        <Navigate
          to="/sign-in"
          replace
          state={{ returnTo: location.pathname + location.search }}
        />
        {/* Optional debug */}
        <h2>Not authed ❌</h2>
        {err && (
          <div>
            <b>Error:</b> {err}
          </div>
        )}
        {raw && (
          <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(raw, null, 2)}
          </pre>
        )}
      </div>
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
            <div>
              <Directory />
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
