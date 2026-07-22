import Button from './Button';
import { tickets as fallbackTickets, siteSettings } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value; // already a display string (fallback data)
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
    .replace(/ /g, '-');
}

// Normalizes both the static fallback shape and the live API/Ticket-model
// shape into one consistent set of props the stub renders from.
function normalizeTicket(t) {
  return {
    id: t.id || t._id,
    label: t.label,
    date: formatDate(t.date || t.eventDate),
    price: t.price ?? null,
    originalPrice: t.originalPrice ?? null,
    startsFrom: t.startsFrom || formatDate(t.salesStartAt),
    status: t.status,
  };
}

function TicketStub({ ticket }) {
  const soldOut = ticket.status === 'sold-out';
  const upcoming = ticket.status === 'upcoming';

  return (
    <div className="grid items-center gap-4 border-b border-panel-line py-8 last:border-0 sm:grid-cols-[220px_1fr_auto] sm:gap-8">
      <div
        className={`relative flex aspect-[16/10] flex-col justify-center rounded-lg px-6 ${
          soldOut ? 'bg-panel-line/60' : 'bg-marigold'
        }`}
        style={{
          maskImage:
            'radial-gradient(circle 8px at 0 50%, transparent 98%, black 100%), radial-gradient(circle 8px at 100% 50%, transparent 98%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(circle 8px at 0 50%, transparent 98%, black 100%), radial-gradient(circle 8px at 100% 50%, transparent 98%, black 100%)',
        }}
      >
        <p className="font-display text-lg uppercase leading-none text-ink">{ticket.label}</p>
        {ticket.price && (
          <p className="mt-2 font-display text-2xl leading-none text-ink">
            {ticket.originalPrice && (
              <span className="mr-2 text-base line-through opacity-60">\u20b9{ticket.originalPrice}</span>
            )}
            \u20b9{ticket.price}
          </p>
        )}
        {ticket.startsFrom && (
          <p className="mt-2 font-display text-sm uppercase leading-none text-ink">
            Starts from {ticket.startsFrom}
          </p>
        )}
        {soldOut && (
          <p className="mt-2 font-display text-base uppercase leading-none text-ink/70">
            Out of stock
          </p>
        )}
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-fog">{ticket.date}</p>
        <p className="mt-1 font-display text-xl uppercase text-bone">{ticket.label}</p>
      </div>

      <div>
        {soldOut && (
          <span className="inline-flex rounded-full bg-flare/20 px-5 py-2 text-sm font-bold text-flare">
            Out of Stock
          </span>
        )}
        {!soldOut && !upcoming && <Button href="#buy">Get Tickets</Button>}
        {upcoming && (
          <span className="inline-flex rounded-full border border-panel-line px-5 py-2 text-sm font-bold text-fog">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function Tickets() {
  const { data: rawTickets } = useApiContent('/tickets', fallbackTickets);
  const tickets = rawTickets.map(normalizeTicket);

  return (
    <section id="tickets" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-flare">2025</p>
        <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">
          {siteSettings.eventName}
        </h2>

        <div className="mt-12">
          {tickets.map((t) => (
            <TicketStub key={t.id} ticket={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
