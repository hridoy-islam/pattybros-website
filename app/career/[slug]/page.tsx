import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Clock, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { jobData } from "@/utils/jobData"; 
import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return jobData.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = jobData.find((j) => j.slug === slug);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} | Careers`,
    description: job.jobdescription.substring(0, 150) + "...",
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = jobData.find((j) => j.slug === slug);

  if (!job) notFound();

  return (
    <article className="pt-24 md:pt-32 pb-24 bg-white min-h-screen text-black">
      {/* Reduced max-width to 4xl for optimal reading length now that it's a single column */}
      <div className="container  mx-auto">
        
        {/* Back Button */}
        <div className="mb-8 flex flex-row item-center justify-end">
          <Button  size="sm" className="-ml-3" asChild>
            <Link href="/careers">
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              Back
            </Link>
          </Button>
        </div>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight">
            {job.title}
          </h1>
          <p className="text-lg md:text-xl  max-w-5xl leading-relaxed font-medium">
            Join our team and help build the future of secure, scalable, and high-performance applications.
          </p>
        </header>

        {/* Top Job Overview Bar (Replaces the sticky sidebar) */}
        <div className="border-[2.5px] border-primary rounded-xl p-6 md:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(247,135,7,1)] mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-black mb-0.5">Category</p>
                <p className="font-bold text-black text-sm">{job.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-black mb-0.5">Type</p>
                <p className="font-bold text-black text-sm">{job.jobType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-black mb-0.5">Location</p>
                <p className="font-bold text-black text-sm">{job.jobLocation}</p>
              </div>
            </div>
          </div>

          <Button className="w-full md:w-auto h-12 px-8 text-white  rounded-sm text-lg tracking-widest uppercase transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0 group" asChild>
            <a href={job.link || "#"} target="_blank" rel="noopener noreferrer">
              Apply Now <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Button>
        </div>

        {/* Main Content divs */}
        <div className="space-y-8">
          
          <div>
            <h2 className="text-xl font-black text-black mb-5 tracking-tight uppercase border-b-2 border-black/10 pb-3">About Cyberpeers</h2>
            <div className="text-black leading-relaxed text-lg font-medium opacity-90">
              <p>{job.jobdescription}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-black mb-6 tracking-tight uppercase border-b-2 border-black/10 pb-3">Essential Skills</h2>
            <div className="space-y-8">
              {Object.entries(job.skills).map(([heading, points], idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-[16px] font-bold text-black">{heading}</h3>
                  <ul className="space-y-3">
                    {(points as string[]).map((point: string, pIdx: number) => (
                      <li key={pIdx} className="flex items-start gap-3 text-black text-[15px] leading-relaxed font-medium"> 
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="opacity-90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {job.qualification && job.qualification.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-black mb-5 tracking-tight uppercase border-b-2 border-black/10 pb-3">Qualifications</h2>
              <ul className="space-y-3">
                {job.qualification.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-black text-[15px] leading-relaxed font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="opacity-90">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.weOffer && job.weOffer.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-black mb-5 tracking-tight uppercase border-b-2 border-black/10 pb-3">What We Offer</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.weOffer.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-[2px] border-black/10 p-4 rounded-xl text-black font-medium text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} />
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Apply Action */}
          <div className="pt-12 mt-12  flex flex-col md:flex-row items-center justify-between gap-6">
          
            <Button className="w-full md:w-auto h-14 px-10   text-sm  uppercase transition-transform active:scale-95 flex items-center justify-center gap-2 group" asChild>
              <a href={job.link || "#"} target="_blank" rel="noopener noreferrer">
                Apply for this role <Send className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Button>
          </div>

        </div>
      </div>
    </article>
  );
}