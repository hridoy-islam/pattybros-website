// Short videos of the work. Each clip plays muted on a loop once Zee's file is in /public/videos;
// until then its poster (a stand-in photograph) shows in the frame.
export type Clip = { src?: string; poster: string; label: string; pos?: string };

export default function VideoClips({ clips }: { clips: Clip[] }) {
  return (
    <section className="section" id="videos" aria-labelledby="videos-h2">
      <div className="container">
        <h2 id="videos-h2" className="h2 max-w-[18ch]">
          Short videos of the work
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-0.5 md:grid-cols-3">
          {clips.map((c, i) => (
            <div
              key={c.poster}
              className={`group relative aspect-[9/16] overflow-hidden bg-cream ${i === 2 ? "col-span-2 aspect-[16/9] md:col-span-1 md:aspect-[9/16]" : ""}`}
            >
              {c.src ? (
                <video
                  src={c.src}
                  poster={c.poster}
                  aria-label={c.label}
                  className="zoom-img"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img src={c.poster} alt={c.label} loading="lazy" className="zoom-img" style={c.pos ? { objectPosition: c.pos } : undefined} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
