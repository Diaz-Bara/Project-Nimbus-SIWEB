"use client";

import { useCallback, useState } from "react";
import type { FieldErrorMap } from "@/lib/form-errors";

export function useFormErrors<T extends string>() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap<T>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const clearFieldError = useCallback((field: T) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setFormError(null);
  }, []);

  const setFieldErrorMap = useCallback((errors: FieldErrorMap<T>) => {
    setFieldErrors(errors);
  }, []);

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return {
    fieldErrors,
    formError,
    hasFieldErrors,
    setFormError,
    setFieldErrorMap,
    clearFieldError,
    clearAllErrors,
  };
}