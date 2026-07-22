const variants = {
  flare: 'bg-flare text-ink hover:bg-flare-hot',
  light: 'bg-bone text-ink hover:bg-white',
  outline: 'border border-panel-line text-bone hover:border-flare hover:text-flare',
  ghost: 'bg-panel text-bone hover:bg-panel-line',
};

export default function Button({
  as: Tag = 'a',
  variant = 'flare',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`focus-flare inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-bold tracking-wide transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
