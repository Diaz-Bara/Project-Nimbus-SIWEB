import {
  FORM_ERRORS,
  isBlank,
  isValidPhone,
  validateRequiredNumber,
  type FieldErrorMap,
} from "@/lib/form-errors";

export type ShipmentField =
  | "sender_name"
  | "recipient_name"
  | "origin"
  | "destination"
  | "phone_number"
  | "item_type"
  | "weight"
  | "shipping_date"
  | "service_level"
  | "status"
  | "description";

export type ShipmentFormValues = {
  sender_name: string;
  recipient_name: string;
  origin: string;
  destination: string;
  phone_number: string;
  item_type: string;
  weight: string;
  shipping_date: string;
  service_level: string;
  status: string;
  description: string;
};

export function validateShipmentForm(form: ShipmentFormValues): FieldErrorMap<ShipmentField> {
  const errors: FieldErrorMap<ShipmentField> = {};

  if (isBlank(form.sender_name)) errors.sender_name = FORM_ERRORS.required;
  if (isBlank(form.recipient_name)) errors.recipient_name = FORM_ERRORS.required;
  if (isBlank(form.origin)) errors.origin = FORM_ERRORS.required;
  if (isBlank(form.destination)) errors.destination = FORM_ERRORS.required;

  if (isBlank(form.phone_number)) {
    errors.phone_number = FORM_ERRORS.required;
  } else if (!isValidPhone(form.phone_number)) {
    errors.phone_number = FORM_ERRORS.invalidPhone;
  }

  if (isBlank(form.item_type)) errors.item_type = FORM_ERRORS.required;

  const weightError = validateRequiredNumber(form.weight);
  if (weightError) errors.weight = weightError;

  if (isBlank(form.shipping_date)) errors.shipping_date = FORM_ERRORS.required;
  if (isBlank(form.service_level)) errors.service_level = FORM_ERRORS.required;
  if (isBlank(form.status)) errors.status = FORM_ERRORS.required;
  if (isBlank(form.description)) errors.description = FORM_ERRORS.required;

  return errors;
}