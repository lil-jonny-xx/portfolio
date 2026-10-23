export function SectionHeader({
  index,
  label,
  title,
  intro,
  id,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id: string;
}) {
  return (
    <header className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12" data-reveal>
      <p className="meta md:col-span-3">
        <span className="!text-fg">{index}</span> / {label}
      </p>
      <div className="md:col-span-9">
        <h2 id={id} className="display text-[length:var(--text-h2)]">
          {title}
        </h2>
        {intro && <p className="mt-6 max-w-[60ch] text-[length:var(--text-lead)] leading-snug text-muted">{intro}</p>}
      </div>
    </header>
  );
}
