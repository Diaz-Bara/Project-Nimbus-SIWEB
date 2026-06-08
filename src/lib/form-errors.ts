export const FORM_ERRORS = {
  required: "This field is required",
  invalidEmail: "Invalid email format",
  invalidPhone: "Invalid phone number",
  invalidNumber: "Enter a valid number",
  minWeight: "Enter a valid number",
  minCapacity: "Enter a valid number",
  usedExceedsCapacity: "Used tonnage cannot exceed capacity",
  invalidFlightCode: "Invalid flight code (min. 3 characters)",
  invalidAirportCode: "Airport code must be 3 letters",
  formInvalid: "Please review the fields highlighted in red",
  saveFailed: "Failed to save data. Please try again",
  network: "Unable to connect to the server. Please try again",
} as const;

export type FieldErrorMap<T extends string> = Partial<Record<T, string>>;

export function isBlank(value: unknown) {
  return value === null || value === undefined || String(value).trim() === "";
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string) {
  return /^[0-9+\-\s()]{8,20}$/.test(value.trim());
}

export function isAirportCode(value: string) {
  return /^[A-Z]{3}$/.test(value.trim().toUpperCase());
}

export function validateRequiredNumber(
  value: string | number,
  options?: { min?: number; allowZero?: boolean },
) {
  if (isBlank(value)) return FORM_ERRORS.required;
  const numeric = typeof value === "number" ? value : parseFloat(String(value));
  if (Number.isNaN(numeric)) return FORM_ERRORS.invalidNumber;
  if (!options?.allowZero && numeric <= 0) return FORM_ERRORS.invalidNumber;
  if (options?.min !== undefined && numeric < options.min) return FORM_ERRORS.invalidNumber;
  return null;
}

export function firstFieldError<T extends string>(errors: FieldErrorMap<T>) {
  const key = Object.keys(errors)[0] as T | undefined;
  return key ? errors[key] : null;
}

export function countFieldErrors<T extends string>(errors: FieldErrorMap<T>) {
  return Object.keys(errors).length;
}