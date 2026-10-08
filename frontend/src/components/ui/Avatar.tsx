/** Foto profil bulat; tanpa foto memakai inisial di atas gradient biru. */
export default function Avatar({ src, initials, className = "" }: { src: string | null; initials: string; className?: string }) {
  if (src) return <img src={src} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />;
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-orbit font-semibold text-white ${className}`}>
      {initials}
    </span>
  );
}
