"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import AuthShell from "@/components/auth/AuthShell";
import FormAlert from "@/components/ui/FormAlert";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { AUTH_ERRORS } from "@/lib/auth-credentials";
import { FORM_ERRORS } from "@/lib/form-errors";

type Step = "details" | "otp" | "password";
type AlertVariant = "error" | "info" | "success";

function resolveAlertVariant(message: string): AlertVariant {
  const normalized = message.trim().toLowerCase();
  if (
    normalized.includes("otp verified") ||
    normalized.includes("password updated")
  ) {
    return "success";
  }
  if (normalized.includes("otp code has been sent")) {
    return "info";
  }
  return "error";
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [email, setEmail] = useState("");
  const [empId, setEmpId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [empIdError, setEmpIdError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [verifiedBanner, setVerifiedBanner] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);
    setVerifiedBanner(null);
    setDemoOtp(null);
    setEmailError(null);
    setEmpIdError(null);
    setOtpError(null);

    if (!email.trim() && !empId.trim()) {
      setEmailError(AUTH_ERRORS.required);
      setEmpIdError(AUTH_ERRORS.required);
      return;
    }
    if (!email.trim()) {
      setEmailError(AUTH_ERRORS.required);
      return;
    }
    if (!empId.trim()) {
      setEmpIdError(AUTH_ERRORS.required);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, empId }),
      });
      const result = await res.json();

      if (!result.success) {
        setEmailError(result.emailError || null);
        setEmpIdError(result.empIdError || null);
        if (result.error) setInfoMessage(result.error);
        return;
      }

      setInfoMessage(result.message);
      setDemoOtp(result.demoOtp || null);
      setStep("otp");
    } catch {
      setInfoMessage(FORM_ERRORS.network);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setInfoMessage(null);

    if (!otp.trim()) {
      setOtpError(AUTH_ERRORS.required);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, empId, otp }),
      });
      const result = await res.json();

      if (!result.success) {
        setOtpError(result.error || AUTH_ERRORS.otpInvalid);
        return;
      }

      setInfoMessage(null);
      setVerifiedBanner(result.message);
      setOtp("");
      setStep("password");
    } catch {
      setOtpError(FORM_ERRORS.network);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setConfirmPasswordError(null);
    setInfoMessage(null);

    if (!newPassword.trim() && !confirmPassword.trim()) {
      setPasswordError(AUTH_ERRORS.required);
      setConfirmPasswordError(AUTH_ERRORS.required);
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError(AUTH_ERRORS.required);
      return;
    }
    if (!confirmPassword.trim()) {
      setConfirmPasswordError(AUTH_ERRORS.required);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(AUTH_ERRORS.passwordMinLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(AUTH_ERRORS.passwordMismatch);
      return;
    }

    setIsLoading(true);
    setVerifiedBanner(null);
    try {
      const res = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, empId, newPassword, confirmPassword }),
      });
      const result = await res.json();

      if (!result.success) {
        setPasswordError(result.passwordError || null);
        setConfirmPasswordError(result.confirmPasswordError || null);
        if (result.error) setInfoMessage(result.error);
        return;
      }

      setInfoMessage(result.message);
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setInfoMessage(FORM_ERRORS.network);
    } finally {
      setIsLoading(false);
    }
  };

  const subtitle =
    step === "details"
      ? "Verify your Nimbus Cargo account to receive an OTP"
      : step === "otp"
        ? "Enter the OTP code sent to your email"
        : "Choose a new password for your account";

  return (
    <AuthShell
      title="Forgot Password"
      subtitle={subtitle}
      backHref="/login"
      backLabel="Back to Login"
    >
      {step === "details" ? (
        <form onSubmit={handleRequestOtp} noValidate>
          <FormField label="Nimbus Cargo Email" htmlFor="email" required error={emailError}>
            <input
              id="email"
              type="text"
              inputMode="email"
              placeholder="e.g. op1@nimbus.cargo"
              aria-invalid={Boolean(emailError)}
              className={fieldControlClass(Boolean(emailError), "form")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              disabled={isLoading}
            />
          </FormField>

          <div className="mt-3">
            <FormField label="Employee ID" htmlFor="emp-id" required error={empIdError}>
              <input
                id="emp-id"
                type="text"
                placeholder="e.g. ADM-99210"
                aria-invalid={Boolean(empIdError)}
                className={fieldControlClass(Boolean(empIdError), "form")}
                value={empId}
                onChange={(e) => {
                  setEmpId(e.target.value);
                  if (empIdError) setEmpIdError(null);
                }}
                disabled={isLoading}
              />
            </FormField>
          </div>

          {infoMessage && (
            <div className="mt-3">
              <FormAlert variant={resolveAlertVariant(infoMessage)} message={infoMessage} />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors disabled:opacity-70"
          >
            {isLoading ? "PROCESSING..." : "SEND OTP"}
          </button>
        </form>
      ) : step === "otp" ? (
        <form onSubmit={handleVerifyOtp} noValidate>
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
            <p>
              OTP sent to <span className="font-semibold">{email}</span>
            </p>
            {demoOtp && (
              <p className="mt-1">
                Demo OTP: <span className="font-mono font-bold">{demoOtp}</span>
              </p>
            )}
          </div>

          <FormField label="OTP Code" htmlFor="otp" required error={otpError}>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              aria-invalid={Boolean(otpError)}
              className={fieldControlClass(Boolean(otpError), "form")}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                if (otpError) setOtpError(null);
              }}
              disabled={isLoading}
            />
          </FormField>

          {infoMessage && (
            <div className="mt-3">
              <FormAlert variant={resolveAlertVariant(infoMessage)} message={infoMessage} />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors disabled:opacity-70 mb-3 mt-4"
          >
            {isLoading ? "VERIFYING..." : "VERIFY OTP"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("details");
              setOtp("");
              setOtpError(null);
              setInfoMessage(null);
              setVerifiedBanner(null);
              setDemoOtp(null);
            }}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Change email / employee ID
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} noValidate>
          {verifiedBanner && (
            <div className="mb-4">
              <FormAlert variant="success" message={verifiedBanner} />
            </div>
          )}

          {infoMessage && (
            <div className="mb-4">
              <FormAlert variant={resolveAlertVariant(infoMessage)} message={infoMessage} />
            </div>
          )}

          <FormField label="New Password" htmlFor="new-password" required error={passwordError}>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                aria-invalid={Boolean(passwordError)}
                className={`${fieldControlClass(Boolean(passwordError), "form")} pr-10`}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormField>

          <div className="mt-3">
            <FormField
              label="Confirm Password"
              htmlFor="confirm-password"
              required
              error={confirmPasswordError}
            >
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  aria-invalid={Boolean(confirmPasswordError)}
                  className={`${fieldControlClass(Boolean(confirmPasswordError), "form")} pr-10`}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError(null);
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </FormField>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors disabled:opacity-70"
          >
            {isLoading ? "SAVING..." : "RESET PASSWORD"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}