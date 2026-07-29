import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { navLinks, siteSettings } from '../data/siteContent';
import { useAccount } from '../context/AccountContext';

function NavAnchor({ href, className, onClick, children }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('#')) {
    // Anchor links always need to resolve against the homepage, not whatever page we're currently on.
    return (
      <Link to={`/${href}`} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { attendee } = useAccount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-3 focus-flare">
          <img
            src="/i-am-a-bhopali-creator-2025.webp"
            alt="iAMA Bhopali Creator - Bhopal Creators Summit"
            className="h-16 w-auto object-contain sm:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <NavAnchor
              key={link.label}
              href={link.href}
              className="focus-flare text-sm font-semibold text-bone/90 transition-colors hover:text-flare"
            >
              {link.label}
            </NavAnchor>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href="#cart" className="focus-flare relative text-bone hover:text-flare" aria-label="Cart">
            <ShoppingBag size={20} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-flare text-[10px] font-bold text-ink">
              0
            </span>
          </a>
          <Link to="/my-account" className="focus-flare flex items-center gap-2 text-sm font-semibold text-bone hover:text-flare">
            <User size={16} />
            {attendee ? attendee.name.split(' ')[0] : 'Login / Register'}
          </Link>
        </div>

        <button
          className="focus-flare text-bone lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-panel-line bg-ink px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavAnchor
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-flare rounded-md px-2 py-3 text-base font-semibold text-bone hover:bg-panel hover:text-flare"
              >
                {link.label}
              </NavAnchor>
            ))}
            <Link
              to="/my-account"
              onClick={() => setOpen(false)}
              className="focus-flare mt-2 rounded-md px-2 py-3 text-base font-semibold text-bone hover:bg-panel hover:text-flare"
            >
              {attendee ? attendee.name.split(' ')[0] : 'Login / Register'}
            </Link>
          </nav>
        </div>
      )}
      <p className="sr-only">{siteSettings.eventName}</p>
    </header>
  );
}