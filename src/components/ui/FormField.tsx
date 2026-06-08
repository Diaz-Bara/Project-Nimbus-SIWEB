"use client";

import { ReactNode } from "react";

export type FormFieldVariant = "form" | "boxed" | "underline" | "modal";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  variant?: FormFieldVariant;
  children: ReactNode;
};

export function fieldControlClass(hasError: boolean, variant: FormFieldVariant = "form") {
  if (variant === "underline") {
    return `w-full pb-2 border-b outline-none text-sm text-gray-800 bg-transparent transition-colors ${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-[#0a327d]"
    }`;
  }

  const base =
    variant === "modal"
      ? "w-full border p-2.5 rounded-lg outline-none transition text-sm"
      : "w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors";

  return hasError
    ? `${base} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white`
    : `${base} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white`;
}

export function fieldErrorTextClass() {
  return "mt-1 text-sm text-red-600";
}

export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  variant = "form",
  children,
}: FormFieldProps) {
  const labelClass =
    variant === "modal"
      ? "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
      : "block text-sm font-medium text-gray-800 mb-1.5";

  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} className={fieldErrorTextClass()} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}