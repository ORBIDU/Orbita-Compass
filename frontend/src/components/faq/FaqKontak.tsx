import { useState, type FormEvent } from "react";
import { AtSign, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { FAQ_KONTAK, faqWhatsappMessage, type KontakIcon } from "@/content/faq";
import { whatsappTextLink } from "@/config/brand";
import { Badge, pillClasses } from "@/components/landing/primitives";

const ICONS: Record<KontakIcon, { Icon: LucideIcon; tone: string }> = {
  mail: { Icon: Mail, tone: "bg-surface-blue text-orbit-1" },
  instagram: { Icon: AtSign, tone: "bg-sun-2/15 text-sun-1" },
  lokasi: { Icon: MapPin, tone: "bg-tint-green-bg text-tint-green-fg" },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT =
  "w-full rounded-xl border border-white/10 bg-white px-4 text-[15px] text-space-2 placeholder:text-prose-dim focus:border-sun-1 focus:outline-none focus:ring-2 focus:ring-sun-1/40";

/** Kontak resmi + form pesan. Form belum punya endpoint, jadi dikirim lewat WhatsApp. */
export default function FaqKontak() {
  const K = FAQ_KONTAK;
  const F = K.form;
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [peran, setPeran] = useState<string>(F.peranOptions[0]);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return setError(F.wajib);
    if (email.trim() && !EMAIL_RE.test(email.trim())) return setError(F.emailSalah);
    setError("");
    window.open(whatsappTextLink(faqWhatsappMessage({ nama, email, peran, pesan })), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="kontak" className="scroll-mt-20 bg-masalah-glow">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <Badge>{K.badge}</Badge>
        <h2 className="mt-3 max-w-[640px] text-balance text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-space-2 lg:text-[40px]">{K.title}</h2>
        <p className="mt-3 max-w-[640px] text-base leading-[1.65] text-prose">{K.body}</p>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          {/* Kontak resmi */}
          <div className="flex flex-col rounded-3xl border-[1.5px] border-sun-2/50 bg-white p-6 shadow-card lg:p-7">
            <h3 className="text-xl font-bold text-space-2">{K.resmi.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-prose">{K.resmi.body}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {K.resmi.items.map((item) => {
                const { Icon, tone } = ICONS[item.icon];
                const body = (
                  <>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-prose-dim">{item.label}</span>
                      <span className="truncate text-[15px] font-bold text-space-2">{item.value}</span>
                    </span>
                  </>
                );
                const cls = "flex items-center gap-3.5 rounded-2xl border border-rim bg-surface-soft/60 px-4 py-3";
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${cls} transition hover:border-orbit-1/40 hover:bg-white`}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 flex gap-2.5 rounded-2xl border border-sun-2/40 bg-sun-2/10 px-4 py-3 text-sm leading-relaxed text-space-2 lg:mt-auto">
              <MessageCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-sun-1" />
              {K.resmi.note}
            </p>
          </div>

          {/* Form pesan */}
          <form onSubmit={submit} noValidate className="on-dark flex flex-col gap-4 rounded-3xl bg-gradient-navy p-6 shadow-card lg:p-8">
            <div>
              <h3 className="text-xl font-bold text-sun-2">{F.title}</h3>
              <p className="mt-1 text-sm text-night-sub">{F.body}</p>
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              {F.nama}
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder={F.namaPlaceholder} autoComplete="name" className={`${INPUT} h-12`} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              {F.email}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={F.emailPlaceholder} autoComplete="email" className={`${INPUT} h-12`} />
            </label>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold text-white">{F.peran}</legend>
              <div className="flex flex-wrap gap-2">
                {F.peranOptions.map((opt) => {
                  const on = opt === peran;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPeran(opt)}
                      className={`h-9 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-gradient-sun-x text-white" : "bg-white text-space-2 hover:bg-surface-blue"}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              {F.pesan}
              <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} placeholder={F.pesanPlaceholder} rows={4} className={`${INPUT} resize-y py-3`} />
            </label>
            {error && (
              <p role="alert" className="text-sm font-semibold text-sun-2">
                {error}
              </p>
            )}
            <button type="submit" className={pillClasses("sun", "mt-1 h-12 w-full text-[15px]")}>
              {F.kirim}
            </button>
            <p className="text-center text-xs text-night-text">{F.hint}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
