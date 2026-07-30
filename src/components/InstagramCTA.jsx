import Button from './Button';
import { socialLinksFallback } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

function InstagramGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function InstagramCTA() {
  const { data: settings } = useApiContent('/settings', { socialLinks: socialLinksFallback }, 'settings');
  const socialLinks = settings?.socialLinks?.length ? settings.socialLinks : socialLinksFallback;
  const instagramUrl =
    socialLinks.find((s) => s.platform?.toLowerCase() === 'instagram' && s.isActive !== false && s.url)?.url ||
    'https://instagram.com';

  return (
    <section className="bg-charcoal px-5 py-20 text-center sm:px-8">
      <h2
        className="font-display text-4xl uppercase sm:text-5xl"
        style={{
          background: 'linear-gradient(90deg, var(--color-magenta), var(--color-flare-hot))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        What&rsquo;s Poppin&rsquo; on the &lsquo;Gram
      </h2>
      <div className="mt-8">
        <Button
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          variant="ghost"
          className="gap-2 !bg-[#1877F2] !text-white hover:!bg-[#1666d6]"
        >
          <InstagramGlyph />
          Follow on Instagram
        </Button>
      </div>
    </section>
  );
}