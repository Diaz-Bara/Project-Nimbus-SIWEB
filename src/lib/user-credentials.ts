export const PRIMARY_ADMIN_EMAIL = "op1@nimbus.cargo";

export const OPERATOR_EMAILS_IN_ORDER = [
  "op3@nimbus.cargo",
  "op4@nimbus.cargo",
  "op5@nimbus.cargo",
  "op7@nimbus.cargo",
  "op8@nimbus.cargo",
  "op9@nimbus.cargo",
  "op11@nimbus.cargo",
  "op12@nimbus.cargo",
  "op14@nimbus.cargo",
  "op15@nimbus.cargo",
  "op16@nimbus.cargo",
  "op17@nimbus.cargo",
  "op19@nimbus.cargo",
  "op20@nimbus.cargo",
] as const;

export function getPasswordForUser(email: string): string {
  const normalized = email.trim().toLowerCase();

  if (normalized === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return "admin123";
  }

  const operatorIndex = OPERATOR_EMAILS_IN_ORDER.findIndex(
    (value) => value.toLowerCase() === normalized
  );

  if (operatorIndex >= 0) {
    return `operator${operatorIndex + 1}.`;
  }

  return "admin123";
}

export function resolveAccountEmail(input: string): string {
  const trimmed = input.trim();
  const value = trimmed.toLowerCase();

  if (value === "admin") {
    return PRIMARY_ADMIN_EMAIL;
  }

  const operatorMatch = value.match(/^operator\s+(\d+)$/);
  if (operatorMatch) {
    const index = Number(operatorMatch[1]) - 1;
    if (index >= 0 && index < OPERATOR_EMAILS_IN_ORDER.length) {
      return OPERATOR_EMAILS_IN_ORDER[index];
    }
  }

  return trimmed;
}