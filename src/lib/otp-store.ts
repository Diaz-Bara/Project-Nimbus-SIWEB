type OtpRecord = {
  otp: string;
  email: string;
  empId: string;
  expiresAt: number;
};

type ResetGrant = {
  email: string;
  empId: string;
  expiresAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __nimbusOtpStore?: Map<string, OtpRecord>;
  __nimbusResetGrants?: Map<string, ResetGrant>;
};

const store = globalStore.__nimbusOtpStore ?? new Map<string, OtpRecord>();
globalStore.__nimbusOtpStore = store;

const resetGrants = globalStore.__nimbusResetGrants ?? new Map<string, ResetGrant>();
globalStore.__nimbusResetGrants = resetGrants;

function keyFor(email: string, empId: string) {
  return `${email.trim().toLowerCase()}::${empId.trim().toUpperCase()}`;
}

export function createOtp(email: string, empId: string) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const record: OtpRecord = {
    otp,
    email: email.trim().toLowerCase(),
    empId: empId.trim().toUpperCase(),
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  store.set(keyFor(email, empId), record);
  return otp;
}

export function verifyOtp(email: string, empId: string, otp: string) {
  const record = store.get(keyFor(email, empId));
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    store.delete(keyFor(email, empId));
    return false;
  }
  const valid = record.otp === otp.trim();
  if (valid) store.delete(keyFor(email, empId));
  return valid;
}

export function grantPasswordReset(email: string, empId: string) {
  const record: ResetGrant = {
    email: email.trim().toLowerCase(),
    empId: empId.trim().toUpperCase(),
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
  resetGrants.set(keyFor(email, empId), record);
}

export function hasResetGrant(email: string, empId: string) {
  const grant = resetGrants.get(keyFor(email, empId));
  if (!grant) return false;
  if (Date.now() > grant.expiresAt) {
    resetGrants.delete(keyFor(email, empId));
    return false;
  }
  return true;
}

export function consumeResetGrant(email: string, empId: string) {
  if (!hasResetGrant(email, empId)) return false;
  resetGrants.delete(keyFor(email, empId));
  return true;
}

export function verifyOtpAndGrantReset(email: string, empId: string, otp: string) {
  const valid = verifyOtp(email, empId, otp);
  if (valid) grantPasswordReset(email, empId);
  return valid;
}