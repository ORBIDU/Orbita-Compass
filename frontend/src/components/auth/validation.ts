import { AUTH_ERRORS, MIN_PASSWORD } from "@/content/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pesan error email, atau undefined jika sudah benar. */
export function emailError(email: string): string | undefined {
  const value = email.trim();
  if (!value) return AUTH_ERRORS.emailEmpty;
  if (!EMAIL_PATTERN.test(value)) return AUTH_ERRORS.emailFormat;
  return undefined;
}

/** Password saat daftar: wajib dan minimal MIN_PASSWORD karakter. */
export function newPasswordError(password: string): string | undefined {
  if (!password) return AUTH_ERRORS.passwordEmpty;
  if (password.length < MIN_PASSWORD) return AUTH_ERRORS.passwordShort;
  return undefined;
}

/** Membuang field tanpa error, supaya "masih ada error?" cukup dicek dari isinya. */
export function compact<T extends Record<string, string | undefined>>(errors: T): Partial<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as Partial<T>;
}
