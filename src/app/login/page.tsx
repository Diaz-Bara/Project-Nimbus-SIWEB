"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loginAction } from "@/app/login/actions";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", username.trim());
      formData.append("password", password);

      const result = await loginAction(undefined, formData);

      if (typeof result === "string") {
        setError(result);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Link>

      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <Image src="/logo.png" alt="logo" width={60} height={60} />
          <h1 className="text-sm font-semibold mt-2 text-gray-700">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </h1>
        </div>

        <h2 className="text-center font-semibold text-gray-700 mb-1">Login</h2>
        <p className="text-center text-xs text-gray-400 mb-4">
          Enter your credentials to access the system
        </p>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="admin or operator 1"
            className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between text-xs mb-4">
            <label className="flex items-center gap-1">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-blue-500 cursor-pointer">Forgot password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
