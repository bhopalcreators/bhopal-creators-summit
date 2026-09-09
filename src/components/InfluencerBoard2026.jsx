// "Our Influencer Board" — embedded as-is from the BCS 2026 deck artwork.
// This is a single flattened image (not a data-driven grid) per request;
// the individual, admin-editable creator profiles live in
// KeyInfluencers2026.jsx just below.
export default function InfluencerBoard2026() {
  return (
    <section className="bg-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border border-panel-line">
          <img
            src="/our-influencer-board-2026.jpg"
            alt="Bhopal Creator Summit 2026 — Our Influencer Board"
            className="w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}