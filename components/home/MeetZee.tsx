import Link from "next/link";

// Who runs the studio, beside a photograph of lash work in progress
export default function MeetZee() {
  return (
    <section className="section" id="zee" aria-labelledby="zee-h">
      <div className="container grid items-start gap-8 md:grid-cols-2 md:gap-6">
        <div className="grid gap-5 md:pr-12">
          <h2 id="zee-h" className="h2">
            Meet Zee, your lash artist
          </h2>
          <p className="lead">
            Zee has loved lashes since she was young, practising new looks on her mum and aunties. LashesByZee is that
            passion turned into her own studio: one artist, one client at a time, and a set made for you.
          </p>
          <Link href="/about" className="link-arrow">
            Read Zee&rsquo;s story
          </Link>
        </div>
        <Link href="/about" className="group block aspect-square overflow-hidden" aria-label="Read Zee's story">
          <img
            src="/images/artist-at-work.jpg"
            alt="A lash artist applying extensions with tweezers to a client lying back"
            loading="lazy"
            className="zoom-img"
          />
        </Link>
      </div>
    </section>
  );
}
