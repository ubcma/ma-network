import { useState } from "react";
import { LogOut } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { signOut } from "../lib/better-auth/sign-out";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await signOut();
      // Force a full navigation so session/cookies are re-evaluated immediately.
      window.location.assign("/sign-in");
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