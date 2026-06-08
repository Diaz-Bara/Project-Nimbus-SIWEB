import {
  FORM_ERRORS,
  isAirportCode,
  isBlank,
  validateRequiredNumber,
  type FieldErrorMap,
} from "@/lib/form-errors";
import type { FlightFormData } from "@/components/flights/FlightFormModal";

export type FlightField = keyof FlightFormData;

export function validateFlightForm(form: FlightFormData, isEdit: boolean): FieldErrorMap<FlightField> {
  const errors: FieldErrorMap<FlightField> = {};

  if (!isEdit) {
    const code = form.code.trim().toUpperCase();
    if (isBlank(code)) {
      errors.code = FORM_ERRORS.required;
    } else if (code.length < 3) {
      errors.code = FORM_ERRORS.invalidFlightCode;
    }
  }

  if (isBlank(form.aircraft)) errors.aircraft = FORM_ERRORS.required;

  if (isBlank(form.origin_code)) {
    errors.origin_code = FORM_ERRORS.required;
  } else if (!isAirportCode(form.origin_code)) {
    errors.origin_code = FORM_ERRORS.invalidAirportCode;
  }

  if (isBlank(form.origin_city)) errors.origin_city = FORM_ERRORS.required;

  if (isBlank(form.destination_code)) {
    errors.destination_code = FORM_ERRORS.required;
  } else if (!isAirportCode(form.destination_code)) {
    errors.destination_code = FORM_ERRORS.invalidAirportCode;
  }

  if (isBlank(form.destination_city)) errors.destination_city = FORM_ERRORS.required;
  if (isBlank(form.departure_time)) errors.departure_time = FORM_ERRORS.required;
  if (isBlank(form.arrival_time)) errors.arrival_time = FORM_ERRORS.required;
  if (isBlank(form.status)) errors.status = FORM_ERRORS.required;

  const capacityError = validateRequiredNumber(form.capacity_tons);
  if (capacityError) errors.capacity_tons = capacityError;

  const usedError = validateRequiredNumber(form.used_tons, { allowZero: true });
  if (usedError) {
    errors.used_tons = usedError;
  } else if (form.used_tons > form.capacity_tons) {
    errors.used_tons = FORM_ERRORS.usedExceedsCapacity;
  }

  return errors;
}