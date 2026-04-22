"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    //  MULTI USER (ADMIN + OPERATOR)
    const users = [
      {
        email: "admin",
        password: "admin123",
        role: "admin",
      },
      {
        email: "operator",
        password: "operator123",
        role: "operator",
      },
    ];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));

      // redirect (semua ke dashboard dulu)
      router.push("/dashboard");
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">

      {/* CARD */}
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-4">
          <Image src="/logo.png" alt="logo" width={60} height={60} />
          <h1 className="text-sm font-semibold mt-2 text-gray-700">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </h1>
        </div>

        {/* TITLE */}
        <h2 className="text-center font-semibold text-gray-700 mb-1">
          Login
        </h2>
        <p className="text-center text-xs text-gray-400 mb-4">
          Enter your credentials to access the system
        </p>

        {/* INPUT (TIDAK DIUBAH UI) */}
        <input
          ref={emailRef}
          type="text"
          placeholder="Email or Username"
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />

        {/* OPTIONS */}
        <div className="flex justify-between text-xs mb-4">
          <label className="flex items-center gap-1">
            <input type="checkbox" />
            Remember me
          </label>
          <span className="text-blue-500 cursor-pointer">
            Forgot password?
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3 hover:bg-blue-700 transition"
        >
          LOGIN
        </button>

        {/* CREATE ACCOUNT */}
        <Link href="/register">
          <button className="w-full border py-2 rounded-lg text-sm">
            Create Account
          </button>
        </Link>

      </div>
    </div>
  );
}