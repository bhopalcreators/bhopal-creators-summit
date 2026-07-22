export default function SectionHeading({ eyebrow, title, align = 'left', className = '' }) {
  return (
    <div className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-tight text-bone sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  );
}
