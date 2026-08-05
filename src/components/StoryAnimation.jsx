import { useMemo } from 'react'

export default function StoryAnimation() {
  // Generate random star positions once on mount
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      delay: `${Math.random() * 3}s`,
    }))
  }, [])

  // Generate wind streak lines
  const windStreaks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      height: `${30 + Math.random() * 80}px`,
      delay: `${Math.random() * 0.5}s`,
      opacity: Math.random() * 0.4 + 0.2,
    }))
  }, [])

  // Orbit ring configs with planets
  const orbitRings = useMemo(() => [
    { size: 160, speed: '20s', planetColor: '#FF7000', planetSize: 10, startAngle: 0 },
    { size: 240, speed: '20s', planetColor: '#00B2DD', planetSize: 8, startAngle: 120 },
    { size: 320, speed: '20s', planetColor: '#F1AD00', planetSize: 12, startAngle: 240 },
  ], [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-space-1 to-space-2">
      {/* ── Layer 1: Launch Scene (0–20%) ── */}
      <div className="absolute inset-0 flex items-center justify-center animate-launchFade">
        {/* Ground platform */}
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[280px] h-[3px] bg-gradient-to-r from-transparent via-cloud/20 to-transparent rounded-full" />
        
        {/* Student Figure 1 */}
        <div className="absolute bottom-[29%] left-[32%]">
          {/* Body */}
          <div className="w-8 h-12 bg-gradient-to-b from-orbit-1 to-orbit-2 rounded-t-xl rounded-b-md relative">
            {/* Head */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 bg-cloud/90 rounded-full" />
            {/* Helmet visor */}
            <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-br from-orbit-1/60 to-orbit-2/60 rounded-full" />
          </div>
          {/* Legs */}
          <div className="flex gap-1 justify-center -mt-0.5">
            <div className="w-2.5 h-5 bg-space-1 rounded-b-md" />
            <div className="w-2.5 h-5 bg-space-1 rounded-b-md" />
          </div>
        </div>

        {/* Student Figure 2 */}
        <div className="absolute bottom-[29%] left-[42%]">
          <div className="w-8 h-12 bg-gradient-to-b from-sun-1 to-sun-2 rounded-t-xl rounded-b-md relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 bg-cloud/90 rounded-full" />
            <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-br from-sun-1/60 to-sun-2/60 rounded-full" />
          </div>
          <div className="flex gap-1 justify-center -mt-0.5">
            <div className="w-2.5 h-5 bg-space-1 rounded-b-md" />
            <div className="w-2.5 h-5 bg-space-1 rounded-b-md" />
          </div>
        </div>

        {/* Rocket */}
        <div className="absolute bottom-[28%] right-[28%] flex flex-col items-center">
          {/* Nose cone */}
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-cloud/90" />
          {/* Body */}
          <div className="w-7 h-20 bg-gradient-to-b from-cloud/90 to-cloud/70 rounded-b-lg relative">
            {/* Window */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-orbit-1 to-orbit-2 rounded-full border-2 border-cloud/50" />
            {/* Stripe */}
            <div className="absolute top-11 left-0 w-full h-2 bg-gradient-to-r from-sun-1 to-sun-2" />
          </div>
          {/* Fins */}
          <div className="flex justify-between w-12 -mt-3 relative z-0">
            <div className="w-3 h-6 bg-gradient-to-b from-orbit-1 to-orbit-2 rounded-bl-lg skew-x-[-10deg]" />
            <div className="w-3 h-6 bg-gradient-to-b from-orbit-1 to-orbit-2 rounded-br-lg skew-x-[10deg]" />
          </div>
          {/* Flame */}
          <div className="flex gap-0.5 -mt-1">
            <div className="w-2 h-6 bg-gradient-to-b from-sun-1 to-sun-2 rounded-b-full animate-flamePulse opacity-80" />
            <div className="w-3 h-8 bg-gradient-to-b from-sun-2 to-red-500 rounded-b-full animate-flamePulse" />
            <div className="w-2 h-6 bg-gradient-to-b from-sun-1 to-sun-2 rounded-b-full animate-flamePulse opacity-80" />
          </div>
        </div>

        {/* Ambient stars for launch scene */}
        {stars.slice(0, 15).map((star) => (
          <div
            key={`launch-${star.id}`}
            className="absolute rounded-full bg-cloud"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity * 0.5,
            }}
          />
        ))}
      </div>

      {/* ── Layer 2: Portal (20–30%) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="animate-portalGrow rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #0965FA, #00B2DD, #FF7000, #F1AD00, #0965FA)',
            filter: 'blur(1px)',
            boxShadow: '0 0 40px rgba(9,101,250,0.4), 0 0 80px rgba(0,178,221,0.2)',
          }}
        />
      </div>

      {/* ── Layer 3: Lid Top & Bottom (28–42%) ── */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[#05070f] animate-lidTop z-10" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#05070f] animate-lidBottom z-10" />

      {/* ── Layer 4: Galaxy (30–90%) ── */}
      <div className="absolute inset-0 animate-galaxyFade">
        {/* Stars */}
        {stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full bg-cloud"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}

        {/* Orbit Rings with Planets */}
        {orbitRings.map((ring, idx) => (
          <div
            key={`ring-${idx}`}
            className="absolute rounded-full border border-cloud/10 animate-ringSpin"
            style={{
              width: ring.size,
              height: ring.size,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animationDuration: ring.speed,
              animationDirection: idx % 2 === 0 ? 'normal' : 'reverse',
            }}
          >
            {/* Planet */}
            <div
              className="absolute rounded-full shadow-lg"
              style={{
                width: ring.planetSize,
                height: ring.planetSize,
                backgroundColor: ring.planetColor,
                top: -ring.planetSize / 2,
                left: '50%',
                transform: `translateX(-50%) rotate(${ring.startAngle}deg)`,
                boxShadow: `0 0 12px ${ring.planetColor}60`,
              }}
            />
          </div>
        ))}

        {/* Central glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(9,101,250,0.6), transparent 70%)',
            boxShadow: '0 0 60px 30px rgba(9,101,250,0.15)',
          }}
        />
      </div>

      {/* ── Layer 5: Wind Streaks (44–64%) ── */}
      <div className="absolute inset-0 animate-windFade">
        {windStreaks.map((streak) => (
          <div
            key={`wind-${streak.id}`}
            className="absolute animate-streakUp"
            style={{
              left: streak.left,
              bottom: '-20%',
              width: '1.5px',
              height: streak.height,
              background: 'linear-gradient(to top, transparent, rgba(239,246,255,0.3), transparent)',
              animationDelay: streak.delay,
              opacity: streak.opacity,
            }}
          />
        ))}
      </div>

      {/* ── Layer 6: Logo Reveal (56–90%) ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center animate-logoFade">
        {/* Logo mark */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orbit-1 to-orbit-2 rounded-lg shadow-lg shadow-orbit-1/30" />
          <div className="w-14 h-10 bg-gradient-to-br from-sun-1 to-sun-2 rounded-lg shadow-lg shadow-sun-1/30" />
        </div>
        {/* Wordmark */}
        <h2 className="text-4xl font-bold text-cloud tracking-widest mb-3">ORBITA</h2>
        {/* Tagline */}
        <p className="text-sm text-cloud/50 tracking-wide">Arahkan Masa Depanmu</p>
        {/* Decorative line */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-orbit-1 to-orbit-2 rounded-full mt-4 opacity-60" />
      </div>

      {/* ── Layer 7: Wipe Across (88–100%) ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-1 to-space-2 animate-wipeAcross z-20" />

      {/* Persistent ambient decorations */}
      <div className="absolute top-[15%] left-[10%] w-[200px] h-[200px] rounded-full bg-orbit-1/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[150px] h-[150px] rounded-full bg-sun-1/5 blur-3xl pointer-events-none" />
    </div>
  )
}
