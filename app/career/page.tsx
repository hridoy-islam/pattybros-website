"use client";

import React from "react";
import { careerContent } from "@/utils/content";
import { CareerHero } from "@/components/careers/career-hero";
import { JobFilters } from "@/components/careers/job-filters";
import { JobListings } from "@/components/careers/job-listings";
import { Cta } from "@/components/home/cta";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { MouseFollower } from "@/components/shared/mouse-follower";
import { Hero } from "@/components/shared/Hero";
// Add the import for your new jobData
import { jobData } from "@/utils/jobData"; 

export default function CareerPage() {
  // Initialize with jobData so all jobs show on first load
const [filteredJobs, setFilteredJobs] = React.useState(
  jobData
    .slice() // avoid mutating original
    .sort((a, b) => a.id - b.id)
    .map(job => ({ ...job, id: String(job.id) }))
);


 const handleFilterChange = React.useCallback(
  (filters: { category: string; type: string; location: string }) => {
    let tempJobs = jobData;

    if (filters.category && filters.category !== "All Job Category") {
      tempJobs = tempJobs.filter(job => job.category === filters.category);
    }
    if (filters.type && filters.type !== "All Job Type") {
      tempJobs = tempJobs.filter(job => job.jobType === filters.type);
    }
    if (filters.location && filters.location !== "All Job Location") {
      tempJobs = tempJobs.filter(job => job.jobLocation === filters.location);
    }

    // ✅ Sort ascending by id
    tempJobs = tempJobs.slice().sort((a, b) => a.id - b.id);

    setFilteredJobs(tempJobs.map(job => ({ ...job, id: String(job.id) })));
  },
  []
);

  const { title, subtitle } = careerContent.hero;

  return (
    <SmoothScroll>
      <MouseFollower />
      <Hero title={title} subtitle={subtitle} />
              
        <div className="container">
            <JobFilters onFilterChange={handleFilterChange} />
            <JobListings jobs={filteredJobs} />
        </div>
    </SmoothScroll>
  );
}