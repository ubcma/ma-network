import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import Spinner from "../common/Spinner";
import AuthCardHeader from "../auth/AuthCardHeader";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

// --- minimal API helpers ---
async function signUpWithEmail(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/sign-up/email", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? "Sign up failed");
  return data;
}

async function getSession() {
  const res = await fetch("/api/auth/get-session", {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return res.json().catch(() => null);
}

export default function SignUpForm() {
  const navigate = useNavigate();

  const [isWaitingForVerification, setIsWaitingForVerification] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);

  const errors = React.useMemo(() => {
    const e: Record<string, string> = {};

    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";

    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) e.email = "Invalid email address.";

    if (!password) e.password = "Password is required.";
    if (!agreeToTerms) e.agreeToTerms = "You must agree to the privacy policy.";

    return e;
  }, [firstName, lastName, email, password, agreeToTerms]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canSubmit) {
      const firstErr = Object.values(errors)[0];
      if (firstErr) toast.error(firstErr);
      return;
    }

    setSubmitting(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await signUpWithEmail(fullName, email.trim(), password);

      setUserEmail(email.trim());
      setIsWaitingForVerification(true);
      toast.success("Account created! Please check your email for verification.");
    } catch (err: any) {
      toast.error(err?.message ?? "Sign Up Error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  // Poll for email verification status
  React.useEffect(() => {
    if (!isWaitingForVerification) return;

    let cancelled = false;
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const checkVerificationStatus = async () => {
      try {
        const session = await getSession();
        if (cancelled) return;

        if (session?.user?.emailVerified) {
          toast.success("Email verified! Redirecting to onboarding...");
          navigate("/onboarding", { replace: true });
        }
      } catch (error) {
        // keep silent-ish, but log for dev
        console.error("Error checking verification status:", error);
      }
    };

    checkVerificationStatus();
    intervalId = window.setInterval(checkVerificationStatus, 3000);

    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      window.clearInterval(intervalId);
      toast.error("Verification timeout. Please try signing in.");
      setIsWaitingForVerification(false);
    }, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isWaitingForVerification, navigate]);

  // Waiting screen
  if (isWaitingForVerification) {
    return (
      <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6 place-items-center text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-ma-red" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Check your email</h2>
            <p className="text-gray-600">
              We&apos;ve sent a verification link to <strong>{userEmail}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner size={50} />
            <span>Waiting for verification...</span>
          </div>

          <p className="text-xs text-gray-500">
            Can&apos;t find the email? Check your spam folder or{" "}
            <button
              className="text-ma-red hover:underline"
              onClick={() => setIsWaitingForVerification(false)}
              type="button"
            >
              try a different email
            </button>
          </p>

          <div className="text-sm">
            Already verified?{" "}
            <Link to="/sign-in" className="text-ma-red font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form
  return (
    <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 place-items-center text-center"
      >
        {/* Vite public asset */}
        <img src="/logos/logo_red.svg" width={128} height={128} alt="UBC MA Logo" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AuthCardHeader heading="Sign Up" subheading="Enter your details to register for an account." />
        </motion.div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <Label className="text-xs text-muted-foreground">First Name</Label>
              <input
                className="w-full border rounded px-3 py-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
              {errors.firstName && <div className="text-xs text-red-600 mt-1">{errors.firstName}</div>}
            </div>

            <div className="text-left">
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <input
                className="w-full border rounded px-3 py-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
              {errors.lastName && <div className="text-xs text-red-600 mt-1">{errors.lastName}</div>}
            </div>
          </div>

          <div className="text-left">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
          </div>

          <div className="text-left">
            <Label className="text-xs text-muted-foreground">Password</Label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
          </div>

          <div className="text-left">
            <div className="flex items-start gap-2">
              <Checkbox
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-none"
                checked={agreeToTerms}
                onCheckedChange={(v) => setAgreeToTerms(v === true)}
              />
              <Label className="inline text-xs text-muted-foreground font-normal select-none">
                By signing up, you are agreeing to our{" "}
                <Link to="/terms-of-service" className="text-blue-500 hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-blue-500 hover:underline">
                  privacy policy
                </Link>
                .
              </Label>
            </div>
            {errors.agreeToTerms && <div className="text-xs text-red-600 mt-1">{errors.agreeToTerms}</div>}
          </div>

          <Button className="cursor-pointer font-regular bg-ma-red w-full" variant="ma" type="submit" disabled={!canSubmit}>
            {submitting ? (
              <>
                <Spinner />
                <div>Loading</div>
              </>
            ) : (
              <div>Create Account</div>
            )}
          </Button>
        </form>

        <div className="text-sm">
          Have an account?{" "}
          <Link to="/sign-in" className="text-ma-red font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}