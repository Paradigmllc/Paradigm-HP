/**
 * PageHero — shared hero for all inner pages
 * Server component: CSS-only animations, no framer-motion needed.
 *
 * Visual layers (back → front):
 *  1. Deep dark gradient base
 *  2. Animated color blobs (violet / indigo / purple)
 *  3. Subtle grid overlay
 *  4. Optional sakura petals (light pages)
 *  5. Text content
 */

interface PageHeroProps {
  badge: string
  title: string
  desc?: string
  /** Optional emoji icon shown above the title */
  icon?: string
  /** Accent color variant — defaults to violet */
  accent?: "violet" | "indigo" | "emerald" | "rose" | "amber"
}

const ACCENT_BLOBS: Record<NonNullable<PageHeroProps["accent"]>, { a: string; b: string; c: string }> = {
  violet:  { a: "bg-violet-500/30",  b: "bg-indigo-600/25",  c: "bg-purple-400/20" },
  indigo:  { a: "bg-indigo-500/30",  b: "bg-blue-600/25",    c: "bg-violet-400/20" },
  emerald: { a: "bg-emerald-500/30", b: "bg-teal-600/25",    c: "bg-green-400/20"  },
  rose:    { a: "bg-rose-500/30",    b: "bg-pink-600/25",    c: "bg-red-400/20"    },
  amber:   { a: "bg-amber-500/30",   b: "bg-orange-600/25",  c: "bg-yellow-400/20" },
}

const SAKURA_CSS = `
@keyframes sakuraFallHero{
  0%  { transform:translateY(-50px) rotate(0deg);   opacity:0; }
  8%  { opacity:.55; }
  88% { opacity:.35; }
  100%{ transform:translateY(110%) rotate(480deg) translateX(60px); opacity:0; }
}
.ph-petal{
  position:absolute; top:-40px; pointer-events:none; user-select:none;
  animation: sakuraFallHero linear infinite;
  filter: blur(0.5px);
}
`

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left:     `${5 + (i * 6.8) % 88}%`,
  delay:    `${(i * 0.55) % 4}s`,
  duration: `${9 + (i * 1.2) % 7}s`,
  size:     `${14 + (i * 4) % 12}px`,
  opacity:  0.3 + (i % 3) * 0.12,
}))

export default function PageHero({ badge, title, desc, icon, accent = "violet" }: PageHeroProps) {
  const blobs = ACCENT_BLOBS[accent]

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-[#05070d]">
      {/* ── Animated color blobs ── */}
      <div className={`ph-blob-1 absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-[120px] ${blobs.a}`} />
      <div className={`ph-blob-2 absolute top-10 right-[-80px] w-[400px] h-[400px] rounded-full blur-[100px] ${blobs.b}`} />
      <div className={`ph-blob-3 absolute bottom-[-60px] left-1/3 w-[320px] h-[320px] rounded-full blur-[90px] ${blobs.c}`} />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 section-grid opacity-60 pointer-events-none" />

      {/* ── Sakura petals (decorative, low opacity) ── */}
      <style dangerouslySetInnerHTML={{ __html: SAKURA_CSS }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {PETALS.map((p, i) => (
          <span key={i} className="ph-petal" style={{
            left: p.left, fontSize: p.size, opacity: p.opacity,
            animationDelay: p.delay, animationDuration: p.duration,
          }}>🌸</span>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-block text-xs font-bold tracking-[0.22em] uppercase text-violet-400 mb-4 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
          {badge}
        </span>
        {icon && (
          <span className="text-6xl block mb-4" style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}>
            {icon}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
          {title}
        </h1>
        {desc && (
          <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
            {desc}
          </p>
        )}
      </div>
    </section>
  )
}
