const logos = [
  { name: 'Canon', logo: { url: '/past-collaborations/canon.png' } },
  { name: 'Snapchat', logo: { url: '/past-collaborations/snapchat.png' } },
  { name: 'IndiGo', logo: { url: '/past-collaborations/indigo.png' } },
  { name: 'Madhya Pradesh Tourism', logo: { url: '/past-collaborations/mp-tourism.png' } },
  { name: 'Pandav Hotels', logo: { url: '/past-collaborations/pandav-hotels.png' } },
  { name: 'OM System', logo: { url: '/past-collaborations/om-system.png' } },
  { name: 'Lucia', logo: { url: '/past-collaborations/lucia.png' } },
  { name: 'BNI Bhopal', logo: { url: '/past-collaborations/bni-bhopal.png' } },
  { name: 'SAM Global University', logo: { url: '/past-collaborations/sam-global-university.png' } },
];

function LogoCard({ s }) {
  return (
    <div className="flex h-20 items-center justify-center rounded-xl bg-bone p-4 sm:h-24">
      <img src={s.logo.url} alt={s.name} className="h-full w-full object-contain" loading="lazy" />
    </div>
  );
}

export default function PastCollaborations() {
  return (
    <div className="grid gap-10 pb-10 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-14">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
          Creator Season 2026
        </p>
        <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
          <span className="text-bone">Past </span>
          <span className="bg-gradient-to-r from-marigold via-flare to-magenta bg-clip-text text-transparent">
            Collaborations
          </span>
        </h2>
        <p className="mt-3 text-sm text-fog">Brands that trusted us previously &amp; their feedback</p>

        <p className="mt-8 max-w-lg text-sm leading-relaxed text-fog">
          BCS 2025 brought together a strong mix of national brands, local businesses and leading
          institutions, creating meaningful opportunities for brands to connect with Bhopal&rsquo;s
          growing creator community. These collaborations helped us build trust, credibility and
          stronger brand-creator connections, while proving the potential of BCS as a platform for
          brands to engage with the creative ecosystem.
        </p>
        <p className="mt-4 max-w-lg text-sm font-semibold text-bone">
          This year, with BCS 2026 Season 4, we&rsquo;re taking that collaboration ecosystem even
          further.
        </p>
      </div>

      <div className="rounded-2xl border border-flare/30 bg-gradient-to-br from-marigold/50 via-flare/40 to-magenta/50 p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {logos.map((s) => (
            <LogoCard key={s.name} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}