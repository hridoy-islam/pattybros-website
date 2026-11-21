import Header from "./Header";
import SiteFooter from "./SiteFooter";

// Long-text pages (privacy, terms, 404)
export default function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="top" className="pt-16 md:pt-[72px]">
        <section className="section" aria-labelledby="page-h">
          <div className="container">
            <div className="grid max-w-[680px] gap-4 [&_h2]:mt-6 [&_h2]:text-[28px] [&_li]:ml-5 [&_li]:list-disc">
              <h1 id="page-h" className="text-4xl md:text-5xl">
                {title}
              </h1>
              {children}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter close={{ title: "Book your lash appointment", line: "Full sets from £45. A £15 deposit holds your time." }} />
    </>
  );
}
