import { useState } from "react";
import OrbitaHome from "@/imports/OrbitaHome/index";
import OrbitaProfile from "@/imports/OrbitaProfile/index";
import OrbitaFaq from "@/imports/OrbitaFaq/index";
import JurusanPage from "./JurusanPage";

type LandingTab = "home" | "profile" | "faq" | "explore";

const PP = "Poppins, sans-serif";

const NAV_ITEMS: { key: LandingTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "profile", label: "Profile" },
  { key: "faq", label: "FAQ" },
  { key: "explore", label: "Explore Jurusan" },
];

function LandingNav({
  tab,
  setTab,
  onMasuk,
}: {
  tab: LandingTab;
  setTab: (t: LandingTab) => void;
  onMasuk: () => void;
}) {
  const isDark = tab === "home";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-xl border-b"
      style={{
        fontFamily: PP,
        background: isDark ? "rgba(16, 20, 33, 0.85)" : "rgba(255, 255, 255, 0.92)",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
        boxShadow: "0 1px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 h-[65px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setTab("home")}
          className="flex items-center gap-0 shrink-0"
          style={{ outline: "none" }}
        >
          <span
            className="text-[26px] font-bold leading-none"
            style={{ fontFamily: PP }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #0965fa, #00b2dd)" }}
            >
              ORB
            </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #ff7000, #f1ad00)" }}
            >
              ITA
            </span>
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className="relative text-[15px] font-medium transition-all"
                style={{
                  fontFamily: PP,
                  outline: "none",
                  color: active
                    ? "#0965fa"
                    : isDark
                    ? "rgba(193,196,230,0.9)"
                    : "#535353",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #0965fa, #00b2dd)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMasuk}
            className="text-[14px] font-semibold transition-colors hidden sm:block"
            style={{
              fontFamily: PP,
              outline: "none",
              color: isDark ? "rgba(193,196,230,0.9)" : "#535353",
            }}
          >
            Masuk
          </button>
          <button
            onClick={onMasuk}
            className="text-[14px] font-bold px-6 py-2 rounded-full transition-opacity hover:opacity-90"
            style={{
              fontFamily: PP,
              outline: "none",
              background: "#f59e0b",
              color: "#000",
            }}
          >
            Daftar
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className="shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all"
              style={{
                fontFamily: PP,
                outline: "none",
                background: active
                  ? "linear-gradient(90deg, #0965fa, #00b2dd)"
                  : isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
                color: active ? "#fff" : isDark ? "rgba(193,196,230,0.9)" : "#535353",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function LandingPage({ onMasuk }: { onMasuk: () => void }) {
  const [tab, setTab] = useState<LandingTab>("home");

  const NAV_H = 65;

  return (
    <div className="relative h-screen overflow-hidden" style={{ fontFamily: PP }}>
      {/* Functional nav — fixed, z-[1000] covers the imports' own nav which is z-[4] */}
      <LandingNav tab={tab} setTab={setTab} onMasuk={onMasuk} />

      {/* Scrollable content — starts at top-0, import's own nav scrolls under ours */}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        {tab === "home" && (
          <div className="relative w-full min-w-0">
            <OrbitaHome />
            {/* CTA overlay so "Eksplorasi Jurusan" button works */}
            <button
              onClick={() => setTab("explore")}
              className="hidden"
              aria-hidden
            />
          </div>
        )}

        {tab === "profile" && (
          <div className="relative w-full min-w-0">
            <OrbitaProfile />
          </div>
        )}

        {tab === "faq" && (
          <div className="relative w-full min-w-0">
            <OrbitaFaq />
          </div>
        )}

        {tab === "explore" && (
          <div
            className="flex flex-col"
            style={{ paddingTop: NAV_H, minHeight: "100vh" }}
          >
            <div className="flex-1 overflow-hidden flex flex-col">
              <JurusanPage />
            </div>
          </div>
        )}
      </div>

      {/* Floating "Masuk ke Portal" hint pill — bottom right */}
      <div className="fixed bottom-8 right-6 z-[1001]">
        <button
          onClick={onMasuk}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-[13px] font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
          style={{
            fontFamily: PP,
            background: "linear-gradient(135deg, #0965fa, #00b2dd)",
            boxShadow: "0 8px 24px rgba(9,101,250,0.35)",
            outline: "none",
          }}
        >
          <span>🚀</span>
          Masuk ke Portal
        </button>
      </div>
    </div>
  );
}
