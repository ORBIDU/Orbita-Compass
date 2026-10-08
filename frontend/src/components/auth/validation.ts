import { AUTH_ERRORS } from "@/content/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pesan error email, atau undefined jika sudah benar. */
export function emailError(email: string): string | undefined {
  const value = email.trim();
  if (!value) return AUTH_ERRORS.emailEmpty;
  if (!EMAIL_PATTERN.test(value)) return AUTH_ERRORS.emailFormat;
  return undefined;
}

/** Membuang field tanpa error, supaya "masih ada error?" cukup dicek dari isinya. */
export function compact<T extends Record<string, string | undefined>>(errors: T): Partial<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as Partial<T>;
}
