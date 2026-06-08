import { FORM_ERRORS, isBlank } from "@/lib/form-errors";

export function validateTrackingAwb(awb: string): string | null {
  if (isBlank(awb)) return FORM_ERRORS.required;
  return null;
}