import { FORM_ERRORS, isBlank, isValidEmail, type FieldErrorMap } from "@/lib/form-errors";

export type UserField = "name" | "email" | "empId" | "terminal" | "role" | "status";

export type UserFormValues = {
  name: string;
  email: string;
  empId: string;
  terminal: string;
  role: string;
  status: string;
};

export function validateUserForm(form: UserFormValues): FieldErrorMap<UserField> {
  const errors: FieldErrorMap<UserField> = {};

  if (isBlank(form.name)) errors.name = FORM_ERRORS.required;

  if (isBlank(form.email)) {
    errors.email = FORM_ERRORS.required;
  } else if (!isValidEmail(form.email)) {
    errors.email = FORM_ERRORS.invalidEmail;
  }

  if (isBlank(form.empId)) errors.empId = FORM_ERRORS.required;
  if (isBlank(form.terminal)) errors.terminal = FORM_ERRORS.required;

  return errors;
}