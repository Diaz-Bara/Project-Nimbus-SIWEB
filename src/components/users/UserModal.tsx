"use client";

import { useEffect, useState } from "react";
import FormAlert from "@/components/ui/FormAlert";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { useFormErrors } from "@/hooks/useFormErrors";
import { FORM_ERRORS } from "@/lib/form-errors";
import { validateUserForm, type UserField } from "@/lib/validators/user-form";

type User = {
  id?: number;
  initials?: string;
  name: string;
  email: string;
  empId: string;
  role: string;
  terminal: string;
  status: string;
};

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
  userData?: User | null;
  isSaving?: boolean;
  errorMessage?: string | null;
};

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  userData,
  isSaving = false,
  errorMessage,
}: UserModalProps) {
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    empId: "",
    role: "OPERATOR",
    terminal: "",
    status: "ACTIVE",
  });
  const {
    fieldErrors,
    formError,
    setFormError,
    setFieldErrorMap,
    clearFieldError,
    clearAllErrors,
  } = useFormErrors<UserField>();

  useEffect(() => {
    if (userData) {
      setForm(userData);
    } else {
      setForm({
        name: "",
        email: "",
        empId: "",
        role: "OPERATOR",
        terminal: "",
        status: "ACTIVE",
      });
    }
    clearAllErrors();
  }, [userData, isOpen, clearAllErrors]);

  if (!isOpen) return null;

  const updateField = <K extends keyof User>(key: K, value: User[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    clearFieldError(key as UserField);
    setFormError(null);
  };

  const submitForm = async () => {
    clearAllErrors();

    const errors = validateUserForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrorMap(errors);
      return;
    }

    try {
      await onSave(form);
    } catch {
      setFormError(FORM_ERRORS.saveFailed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const inputClass = (field: UserField, extra = "") =>
    `${fieldControlClass(Boolean(fieldErrors[field]), "form")} ${extra}`.trim();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">
            {userData ? "Update User" : "New User"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            aria-label="Close user modal"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
        <div className="p-6">
          {(formError || errorMessage) && <FormAlert message={formError || errorMessage || FORM_ERRORS.saveFailed} />}

          <div className="space-y-4">
            <FormField label="Name" htmlFor="user-name" required error={fieldErrors.name}>
              <input
                id="user-name"
                placeholder="Full Name"
                aria-invalid={Boolean(fieldErrors.name)}
                className={inputClass("name")}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </FormField>

            <FormField label="Email" htmlFor="user-email" required error={fieldErrors.email}>
              <input
                id="user-email"
                type="text"
                inputMode="email"
                placeholder="email@nimbus.cargo"
                aria-invalid={Boolean(fieldErrors.email)}
                className={inputClass("email")}
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Employee ID"
                htmlFor="user-emp-id"
                required
                error={fieldErrors.empId}
              >
                <input
                  id="user-emp-id"
                  placeholder="e.g. ADM-99210"
                  aria-invalid={Boolean(fieldErrors.empId)}
                  className={inputClass("empId", "uppercase")}
                  value={form.empId}
                  onChange={(e) => updateField("empId", e.target.value.toUpperCase())}
                />
              </FormField>

              <FormField
                label="Terminal Access"
                htmlFor="user-terminal"
                required
                error={fieldErrors.terminal}
              >
                <input
                  id="user-terminal"
                  placeholder="e.g. Global Access"
                  aria-invalid={Boolean(fieldErrors.terminal)}
                  className={inputClass("terminal")}
                  value={form.terminal}
                  onChange={(e) => updateField("terminal", e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role" htmlFor="user-role" required>
                <select
                  id="user-role"
                  className={`${inputClass("role")} bg-white cursor-pointer`}
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="OPERATOR">OPERATOR</option>
                </select>
              </FormField>

              <FormField label="Status" htmlFor="user-status" required>
                <select
                  id="user-status"
                  className={`${inputClass("status")} bg-white cursor-pointer`}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </FormField>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void submitForm()}
            disabled={isSaving}
            className="px-6 py-2 bg-[#1a4bba] hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}