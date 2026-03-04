import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { signOut } from "../lib/better-auth/sign-out";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await signOut();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Sign out failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="segmented-button cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Spinner className="w-4 h-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}