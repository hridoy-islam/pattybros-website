"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  slug: string;
  title: string;
  category: string;
  jobType: string;
  jobLocation: string;
  [key: string]: any;
}

export function JobListings({ jobs }: { jobs: Job[] }) {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-16">
      {jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200"
        >
          <p className="font-medium">
            No positions found for these filters.
          </p>
        </motion.div>
      ) : (
        jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/career/${job.slug}`)}
            className="group relative cursor-pointer bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200/40 hover:border-primary/20 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-2 font-bold bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                    <Briefcase size={14} className="text-primary" />
                    {job.category}
                  </span>

                  <span className="flex items-center gap-2 font-bold bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                    <MapPin size={14} className="text-primary" />
                    {job.jobType} • {job.jobLocation}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 lg:pt-0">
                <div className="flex items-center gap-3 font-black group-hover:text-primary uppercase tracking-[2px] text-[12px] transition-all">
                  More Details
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-100 bg-white group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all transform group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
