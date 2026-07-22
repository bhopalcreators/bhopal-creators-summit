import { motion } from 'framer-motion';
import Button from './Button';
import { heroCtas, siteSettings } from '../data/siteContent';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-ink pt-24">
      {/* Radial flare backdrop — the signature element */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130vmax] w-[130vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--color-flare-hot) 0%, var(--color-flare) 32%, #7a1f0a 58%, var(--color-ink) 78%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink/10" />

      {/* Statue line-art motif */}
      <svg
        aria-hidden
        viewBox="0 0 200 400"
        className="pointer-events-none absolute left-[6%] top-1/2 hidden h-[60vh] -translate-y-[58%] opacity-40 md:block"
        fill="none"
        stroke="var(--color-bone)"
        strokeWidth="1.5"
      >
        <ellipse cx="100" cy="60" rx="26" ry="30" />
        <path d="M60 110 Q100 90 140 110 L150 260 Q100 300 50 260 Z" />
        <rect x="35" y="270" width="130" height="18" rx="4" />
        <line x1="20" y1="288" x2="180" y2="288" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-display text-outline text-[16vw] uppercase leading-[0.82] sm:text-[13vw] lg:text-[9vw]"
        >
          iAMA
          <br />
          Bhopali
          <br />
          Creator
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-8"
        >
          <div>
            <p className="font-display text-4xl uppercase text-bone sm:text-5xl">{siteSettings.date}</p>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-bone/80">{siteSettings.venue}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {heroCtas.map((cta) => (
            <Button key={cta.label} href={cta.href} variant={cta.variant === 'light' ? 'light' : 'flare'}>
              {cta.label}
            </Button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
