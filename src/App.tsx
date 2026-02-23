import { Routes, Route } from "react-router-dom";
import { Directory } from "./components/Directory";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: 24 }}>
            <h1>App mounted ✅</h1>
          </div>
        }
      />

      <Route
        path="/directory"
        element={
          <div style={{ padding: 24 }}>
            <h1>Directory route reached ✅</h1>
            <Directory />
          </div>
        }
      />
    </Routes>
  );
}
