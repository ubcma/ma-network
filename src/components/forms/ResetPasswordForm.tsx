import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Key, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import Spinner from "../common/Spinner";
import AuthCardHeader from "../auth/AuthCardHeader";
import { RenderInputField } from "../../components/forms/FormComponents";


import { Button } from "../ui/button";
import { resetPassword } from "../../lib/better-auth/forgot-password";
import { handleClientError } from "../../lib/error/handleClient";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = React.useState(false);

  // If no token, redirect to forgot password page
  React.useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Invalid reset token");
        return;
      }

      if (value.password !== value.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        await resetPassword(token, value.password);
        setIsSuccess(true);
        toast.success("Password reset successful!");

        // Redirect to sign in after 2 seconds
        window.setTimeout(() => {
          navigate("/sign-in", { replace: true });
        }, 2000);
      } catch (error) {
        handleClientError("Reset Password Error", error);
      }
    },
  });

  // Success screen
  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6 place-items-center text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-ma-red" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Password Reset Complete</h2>
            <p className="text-gray-600">
              Your password has been successfully updated. Redirecting to sign in...
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner size={50} />
            <span>Redirecting...</span>
          </div>

          <div className="text-sm">
            If you’re not redirected,{" "}
            <Link to="/sign-in" className="text-ma-red font-semibold hover:underline">
              click here to sign in
            </Link>
            .
          </div>
        </motion.div>
      </div>
    );
  }

  // While useEffect redirects, render nothing (or a small message)
  if (!token) return null;

  return (
    <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 place-items-center text-center"
      >
        {/* ✅ Vite public asset */}
        <img src="/logos/logo_red.svg" width={128} height={128} alt="UBC MA Logo" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AuthCardHeader heading="Reset Password" subheading="Enter your new password below." />
        </motion.div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 w-full"
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Password is required."
                    : value.length < 8
                      ? "Password must be at least 8 characters."
                      : undefined,
              }}
            >
              {(field) => <RenderInputField type="password" label="New Password" field={field} />}
            </form.Field>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  const password = fieldApi.form.getFieldValue("password");
                  return !value
                    ? "Please confirm your password."
                    : value !== password
                      ? "Passwords do not match."
                      : undefined;
                },
              }}
            >
              {(field) => <RenderInputField type="password" label="Confirm New Password" field={field} />}
            </form.Field>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  className="cursor-pointer font-regular bg-ma-red text-white hover:bg-ma-red/90 w-full"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      <div>Resetting Password</div>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <div>Reset Password</div>
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}