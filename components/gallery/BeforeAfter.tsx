// "Before and after" pairs: the natural lashes, then the finished set, side by side.
// STAND-INS: these pairs are different people from Wikimedia Commons and stock, not Zee's results.
// Replace every pair with Zee's own before and after photographs of the same client before launch.
// Credits: before-open-eye.jpg Rapidreflex, CC BY 4.0; before-side-eye.jpg Micky Zlimen, CC BY-SA 2.0;
// before-closed-eye.jpg Rapidreflex, CC BY-SA 4.0 (all Wikimedia Commons).
export type BeforeAfterPair = {
  title: string;
  before: { src: string; alt: string; pos?: string };
  after: { src: string; alt: string; pos?: string };
};

function Frame({ src, alt, pos, tag }: { src: string; alt: string; pos?: string; tag: string }) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden bg-cream">
      <img src={src} alt={alt} loading="lazy" className="zoom-img" style={pos ? { objectPosition: pos } : undefined} />
      <span
        aria-hidden="true"
        className={`absolute left-3 top-3 px-2.5 py-1 text-[12px] font-medium uppercase tracking-[0.08em] ${
          tag === "After" ? "bg-primary text-ink" : "bg-ivory text-ink"
        }`}
      >
        {tag}
      </span>
    </div>
  );
}

export default function BeforeAfter({ pairs }: { pairs: BeforeAfterPair[] }) {
  return (
    <section className="section" id="before-after" aria-labelledby="ba-h2">
      <div className="container">
        <h2 id="ba-h2" className="h2 max-w-[18ch]">
          Before and after: natural lashes to a full set
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
          {pairs.map((p) => (
            <article key={p.title} aria-label={`${p.title}, before and after`}>
              <h3 className="mb-4 font-display text-[22px] leading-snug">{p.title}</h3>
              <div className="grid grid-cols-2 gap-0.5">
                <Frame {...p.before} tag="Before" />
                <Frame {...p.after} tag="After" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
