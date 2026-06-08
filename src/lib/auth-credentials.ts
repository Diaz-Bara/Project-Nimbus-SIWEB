export const AUTH_ERRORS = {
  required: "This field is required",
  invalidCredentials: "Invalid username or password.",
  invalidForgotDetails: "Invalid email or Employee ID.",
  otpSent: "An OTP code has been sent to your email.",
  otpInvalid: "The OTP code is invalid or has expired.",
  otpVerified: "OTP verified. Set your new password below.",
  passwordMinLength: "Password must be at least 6 characters.",
  passwordMismatch: "Passwords do not match.",
  passwordResetSuccess: "Password updated. Sign in with your new password.",
  resetExpired: "Reset session expired. Request a new OTP.",
};

export function mapDbRole(role: string | null | undefined) {
  return role?.toUpperCase() === "ADMIN" ? ("admin" as const) : ("operator" as const);
}

export function validateLoginInput(username: string, password: string) {
  const user = username.trim();
  const pass = password;

  if (!user && !pass) {
    return {
      ok: false as const,
      usernameError: AUTH_ERRORS.required,
      passwordError: AUTH_ERRORS.required,
    };
  }
  if (!user) {
    return { ok: false as const, usernameError: AUTH_ERRORS.required, passwordError: null };
  }
  if (!pass) {
    return { ok: false as const, usernameError: null, passwordError: AUTH_ERRORS.required };
  }
  return { ok: true as const };
}