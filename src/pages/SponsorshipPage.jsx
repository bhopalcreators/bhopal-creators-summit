import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import { sponsorship2026 } from '../data/siteContent';

const s = sponsorship2026;

function StatStrip({ items, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-6 sm:grid-cols-4 ${className}`}>
      {items.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-panel-line bg-panel px-4 py-5 text-center">
          <p className="font-display text-3xl text-flare sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-fog">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 10%, rgba(255,90,31,0.18), transparent 55%), radial-gradient(circle at 85% 0%, rgba(224,166,64,0.12), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-flare">{s.hero.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-bone sm:text-6xl">
          {s.hero.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-fog">{s.hero.subtitle}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-marigold">{s.hero.location}</p>

        <div className="mt-10">
          <StatStrip items={s.hero.stats} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="#tiers" variant="flare">
            View Sponsorship Tiers
          </Button>
          <Button href="#contact" variant="outline">
            Talk to Us
          </Button>
        </div>
      </div>
    </section>
  );
}

function WhyPartner() {
  return (
    <section className="bg-charcoal px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={s.whyPartner.eyebrow} title={s.whyPartner.title} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.whyPartner.reasons.map((r) => (
            <div key={r.number} className="rounded-2xl border border-panel-line bg-panel p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-flare text-sm font-bold text-flare">
                {r.number}
              </span>
              <h3 className="mt-4 font-display text-lg uppercase text-bone">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{r.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Properties() {
  return (
    <section className="bg-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={s.properties.eyebrow} title={s.properties.title} />
        <p className="mt-5 max-w-2xl text-fog">{s.properties.intro}</p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {s.properties.items.map((item) => (
            <div key={item.number} className="rounded-lg border border-panel-line bg-panel p-4">
              <p className="font-display text-lg text-flare">{item.number}</p>
              <p className="mt-1 text-sm font-semibold leading-tight text-bone">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-flare/40 px-6 py-4">
          <Sparkles className="shrink-0 text-flare" size={20} />
          <p className="text-sm text-bone">{s.properties.note}</p>
        </div>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers" className="bg-charcoal px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={s.tiers.eyebrow} title={s.tiers.title} align="center" className="mx-auto" />
        <p className="mt-5 text-center text-fog">
          Season sponsorship raise target{' '}
          <span className="rounded-md bg-flare px-2 py-1 font-bold text-ink">{s.tiers.target}</span>
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-panel-line">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-flare px-6 py-4 text-xs font-bold uppercase tracking-wide text-ink sm:gap-8">
            <span>Tier</span>
            <span>Investment</span>
            <span>Availability</span>
          </div>
          {s.tiers.rows.map((row) => (
            <div
              key={row.tier}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-panel-line bg-panel px-6 py-4 sm:gap-8"
            >
              <span className="text-sm font-semibold text-bone">
                <span className="mr-2 text-fog">{row.number}</span>
                {row.tier}
              </span>
              <span className="whitespace-nowrap font-display text-lg text-flare">
                {row.investment} <span className="text-xs text-fog">{row.unit}</span>
              </span>
              <span className="text-sm font-bold text-bone">{row.availability}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-marigold">{s.tiers.note}</p>
      </div>
    </section>
  );
}

function TierDetails() {
  return (
    <section className="bg-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="TIER DELIVERABLES" title="What Each Tier Includes" align="center" className="mx-auto" />

        <div className="mt-12 space-y-6">
          {s.tierDetails.map((detail) => (
            <div key={detail.title} className="rounded-2xl border border-panel-line bg-panel p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-panel-line pb-6">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-flare">
                    {detail.tier}
                  </p>
                  <h3 className="mt-1 font-display text-2xl uppercase text-bone sm:text-3xl">{detail.title}</h3>
                  {detail.subtitle && <p className="mt-1 text-sm text-fog">{detail.subtitle}</p>}
                </div>
                <div className="flex gap-3">
                  <span className="rounded-full bg-flare px-4 py-2 text-xs font-bold text-ink">
                    {detail.investment}
                  </span>
                  <span className="rounded-full border border-panel-line px-4 py-2 text-xs font-bold text-fog">
                    {detail.availability}
                  </span>
                </div>
              </div>

              <div className={`mt-6 grid gap-6 ${detail.groups.length > 1 ? 'lg:grid-cols-2' : ''}`}>
                {detail.groups.map((group) => (
                  <div key={group.heading}>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-marigold">{group.heading}</h4>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-relaxed text-fog">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flare" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnershipTiers() {
  return (
    <section className="bg-charcoal px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={s.partnershipTiers.eyebrow} title={s.partnershipTiers.title} />
        <p className="mt-5 max-w-2xl text-fog">{s.partnershipTiers.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {s.partnershipTiers.highlights.map((h) => (
            <span key={h} className="rounded-full border border-panel-line px-4 py-2 text-xs font-bold uppercase text-fog">
              {h}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {s.partnershipTiers.rows.map((row) => (
            <div key={row.tier} className="rounded-2xl border border-panel-line bg-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg uppercase text-bone">{row.tier}</h3>
                <span className="whitespace-nowrap rounded-full bg-flare px-3 py-1 text-xs font-bold text-ink">
                  {row.investment}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {row.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-fog">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flare" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-flare/40 bg-gradient-to-br from-panel to-charcoal p-6 sm:p-8">
          <h3 className="font-display text-xl uppercase text-flare">{s.partnershipTiers.why.title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-fog">{s.partnershipTiers.why.copy}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {s.partnershipTiers.why.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl text-bone">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-fog">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-flare">{s.cta.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">{s.cta.title}</h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-fog">{s.cta.copy}</p>

        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 rounded-xl border border-panel-line bg-panel p-6">
          {s.cta.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="focus-flare flex items-center justify-center gap-2 text-lg font-bold text-bone hover:text-flare"
            >
              <Phone size={18} className="text-flare" />
              {phone}
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="mailto:hello@bhopalcreatorssummit.com" variant="flare">
            Email Us
          </Button>
          <Button as={Link} to="/" variant="outline" className="gap-2">
            Back to Home <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function SponsorshipPage() {
  return (
    <>
      <Hero />
      <WhyPartner />
      <Properties />
      <Tiers />
      <TierDetails />
      <PartnershipTiers />
      <CTA />
    </>
  );
}