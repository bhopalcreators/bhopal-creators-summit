import { motion } from 'framer-motion';
import Button from './Button';
import { heroCtas, siteSettings } from '../data/siteContent';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-ink pt-24">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/favicon.svg"
      />

      {/* Dark overlay so the text/buttons stay legible over any footage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-8"
        >
          <div>
            <p className="font-display text-5xl uppercase text-bone sm:text-6xl">{siteSettings.date}</p>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-bone/80">{siteSettings.venue}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
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