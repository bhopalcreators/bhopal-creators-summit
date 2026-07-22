import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { footerLinks, siteSettings } from '../data/siteContent';

export default function Footer() {
  return (
    <footer id="contact" className="bg-charcoal px-5 pb-8 pt-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex h-11 w-24 items-center justify-center rounded-md bg-gradient-to-br from-flare via-magenta to-marigold font-display text-xs text-ink">
              iAMA
            </div>
            <h3 className="mt-5 font-display text-base uppercase text-bone">All Rounder Services</h3>
            <p className="mt-3 text-sm leading-relaxed text-fog">
              The Bhopal Creators Summit brings India&rsquo;s creative minds together in the heart of
              Madhya Pradesh. Fueled by digital ambition and cultural roots, it&rsquo;s more than a
              SUMMIT&mdash;it&rsquo;s a MOVEMENT.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base uppercase text-bone">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-fog">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-flare" />
                <a href={`mailto:${siteSettings.email}`} className="focus-flare hover:text-flare">
                  {siteSettings.email}
                </a>
              </li>
              {siteSettings.phones.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Phone size={15} className="text-flare" />
                  <a href={`tel:${p.replace(/\s/g, '')}`} className="focus-flare hover:text-flare">
                    {p}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-flare" />
                {siteSettings.venueFull}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base uppercase text-bone">Links</h3>
            <ul className="mt-5 space-y-3 text-sm text-fog">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('/') ? (
                    <Link to={l.href} className="focus-flare hover:text-flare">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="focus-flare hover:text-flare">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base uppercase text-bone">Get in Touch</h3>
            <p className="mt-5 text-sm text-fog">
              Follow along and reach out&mdash;we reply fast during summit season.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-panel-line pt-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()}. All Rights Reserved.</p>
          <p>
            Site designed &amp; Managed by:{' '}
            <a href="https://vistaarwebx.com/" target="_blank" rel="noreferrer" className="focus-flare font-semibold text-bone hover:text-flare">
              Vistaar WebX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
