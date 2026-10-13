import type { TextareaFieldValidation, TextFieldSingleValidation } from "payload";

/**
 * Localized fields are mandatory in English only. Saving the Bangla version must not
 * be blocked by Bangla fields that are still empty: the site shows the English text
 * wherever Bangla is missing (localization fallback).
 */
const requiredInEnglish = (value: string | null | undefined, locale: string | undefined) =>
  !locale || locale === "en" ? Boolean(value && value.trim()) : true;

export const requiredText: TextFieldSingleValidation = (value, { req }) =>
  requiredInEnglish(value, req?.locale ?? undefined) || "This field is required (English).";

export const requiredTextarea: TextareaFieldValidation = (value, { req }) =>
  requiredInEnglish(value, req?.locale ?? undefined) || "This field is required (English).";
