export const LOGIN_ACCOUNTS = {
  admin: {
    password: "admin123",
    role: "admin" as const,
    email: "op1@nimbus.cargo",
    empId: "ADM-99210",
  },
  operator: {
    password: "operator123",
    role: "operator" as const,
    email: "op4@nimbus.cargo",
    empId: "OPR-88544",
  },
};

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

export function resolveAccountEmail(input: string) {
  const value = input.trim().toLowerCase();
  if (value === "admin") return LOGIN_ACCOUNTS.admin.email;
  if (value === "operator") return LOGIN_ACCOUNTS.operator.email;
  return input.trim();
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

export function authenticateCredentials(username: string, password: string) {
  const key = username.trim().toLowerCase() as keyof typeof LOGIN_ACCOUNTS;
  const account = LOGIN_ACCOUNTS[key];
  if (!account || account.password !== password) {
    return { success: false as const, error: AUTH_ERRORS.invalidCredentials };
  }
  return {
    success: true as const,
    email: account.email,
    role: account.role,
  };
}