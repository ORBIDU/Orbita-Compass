/**
 * Jeda buatan supaya mode dummy dan simulasi AI (src/data/) terasa seperti
 * memanggil server.
 */
export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Jeda 2–3 detik untuk simulasi fitur AI (aturan data nomor 4 di CLAUDE.md). */
export function aiDelay(): Promise<void> {
  return delay(2000 + Math.round(Math.random() * 1000));
}
