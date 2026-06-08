"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import AuthShell from "@/components/auth/AuthShell";
import FormAlert from "@/components/ui/FormAlert";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { AUTH_ERRORS, validateLoginInput } from "@/lib/auth-credentials";
import { FORM_ERRORS } from "@/lib/form-errors";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateLoginInput(username, password);
    if (!validation.ok) {
      setUsernameError(validation.usernameError);
      setPasswordError(validation.passwordError);
      return;
    }

    setUsernameError(null);
    setPasswordError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json();

      if (result.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({ email: result.email, role: result.role }),
        );
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setUsernameError(result.usernameError || null);
      setPasswordError(result.passwordError || null);
      setFormError(result.error || AUTH_ERRORS.invalidCredentials);
    } catch {
      setFormError(FORM_ERRORS.network);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Login"
      subtitle="Enter your credentials to access the system"
      backHref="/"
      backLabel="Back"
    >
      <form onSubmit={handleLogin} noValidate>
        <FormField label="Email or Username" htmlFor="username" required error={usernameError}>
          <input
            id="username"
            type="text"
            placeholder="admin or operator 1"
            aria-invalid={Boolean(usernameError)}
            className={fieldControlClass(Boolean(usernameError), "form")}
            autoComplete="username"
            disabled={isLoading}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (usernameError) setUsernameError(null);
            }}
          />
        </FormField>

        <div className="mt-3">
          <FormField label="Password" htmlFor="password" required error={passwordError}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                aria-invalid={Boolean(passwordError)}
                className={`${fieldControlClass(Boolean(passwordError), "form")} pr-10`}
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormField>
        </div>

        {formError && (
          <div className="mt-3">
            <FormAlert message={formError} />
          </div>
        )}

        <div className="flex justify-between items-center text-xs mb-5 mt-4">
          <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Remember me
          </label>
          <Link
            href="/login/forgot-password"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors disabled:opacity-70"
        >
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>
    </AuthShell>
  );
}