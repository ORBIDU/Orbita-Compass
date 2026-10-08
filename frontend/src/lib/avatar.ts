// Foto profil: cek tipe/ukuran, lalu kecilkan supaya muat disimpan
// (mode dummy dan mode backend sementara menyimpan di browser).

import { AVATAR_MAX_BYTES, AVATAR_TYPES } from "@/types/profil";

export type AvatarError = "type" | "size";

export function checkAvatarFile(file: File): AvatarError | null {
  if (!AVATAR_TYPES.includes(file.type)) return "type";
  if (file.size > AVATAR_MAX_BYTES) return "size";
  return null;
}

/** Potong tengah jadi persegi dan kecilkan ke `size` px. Hasilnya data URL JPEG. */
export function resizeAvatar(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}
