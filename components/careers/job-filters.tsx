"use client";

import React from "react";
import { Filter } from "lucide-react";
import { jobCategories, jobTypes, jobLocations } from "@/utils/jobData"; // Adjust path if needed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // shadcn ui imports

interface JobFiltersProps {
  onFilterChange: (filters: { category: string; type: string; location: string }) => void;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  // Initialize states with the "All" options (which are at index 0)
  const [selectedCategory, setSelectedCategory] = React.useState(jobCategories[0]);
  const [selectedType, setSelectedType] = React.useState(jobTypes[0]);
  const [selectedLocation, setSelectedLocation] = React.useState(jobLocations[0]);

  // Notify parent component when any filter changes
  React.useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      type: selectedType,
      location: selectedLocation,
    });
  }, [selectedCategory, selectedType, selectedLocation, onFilterChange]);

  // Reusable classes for the trigger (matching your previous styling closely)
  const triggerClasses = "w-full rounded-2xl border-input bg-background py-6 pl-4 pr-4 text-[13px] font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer";

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 py-2">
      <div className="flex items-center gap-2  mr-2 shrink-0">
        <Filter size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className={triggerClasses}>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {jobCategories.map((c) => (
              <SelectItem key={c} value={c} className="cursor-pointer text-[13px] font-medium py-2">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className={triggerClasses}>
            <SelectValue placeholder="Select Job Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {jobTypes.map((t) => (
              <SelectItem key={t} value={t} className="cursor-pointer text-[13px] font-medium py-2">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className={triggerClasses}>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {jobLocations.map((l) => (
              <SelectItem key={l} value={l} className="cursor-pointer text-[13px] font-medium py-2">
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}