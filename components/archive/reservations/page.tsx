"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, CalendarClock, Users, Clock, Search } from "lucide-react";
import Select from "react-select";
import axiosInstance from "@/lib/axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import { BlinkingDots } from "@/components/ui/blinking-dots";
import { useToast } from "@/components/ui/use-toast";
import moment from "@/lib/moment-setup"
interface IReservation {
  _id: string;
  customerName: string; 
  customerPhone: string; 
  customerEmail: string; 
  partySize: number;
  reservationDate: string;
  preferredTime: string;
  tableId?: {
    _id: string;
    tableNumber: string;
    capacity: number;
  };
  startTime?: string;
  endTime?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border border-green-300",
  completed: "bg-blue-100 text-blue-800 border border-blue-300",
  cancelled: "bg-red-100 text-red-800 border border-red-300",
};

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ReservationPage() {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const { toast } = useToast();
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("");
const [searchTrigger, setSearchTrigger] = useState<number>(0);
  const fetchReservations = async (
    page: number,
    limit: number,
    search: string,
    status: string
  ) => {
    try {
      setPageLoading(true);
      const response = await axiosInstance.get("/reservation", {
        params: {
          page,
          limit,
          searchTerm: search || undefined,
          status: status || undefined,
        },
      });
      const data = response?.data?.data?.result || [];
      const metaTotal = response?.data?.data?.meta?.totalPage || 1;
      setReservations(data);
      setTotalPages(metaTotal);
    } catch (error: any) {
      console.error("Failed to fetch reservations:", error);
      const fallbackMsg =
        error?.response?.data?.message || "Failed to fetch reservations";
      toast({
        title: "Error",
        description: fallbackMsg,
        variant: "destructive",
      });
    } finally {
      setPageLoading(false);
    }
  };

  // ── Corrected Dependencies Array ──────────────────────────────────────────

useEffect(() => {
  fetchReservations(currentPage, entriesPerPage, activeSearch, activeStatusFilter);
}, [currentPage, entriesPerPage, activeSearch, activeStatusFilter]);

const handleSearchSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setCurrentPage(1);
  setActiveSearch(searchQuery);
  setActiveStatusFilter(statusFilter); // commit on button click
};

  

  // Custom react-select styles matching admin panel aesthetic
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#fff",
      borderColor: state.isFocused ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.2)",
      minHeight: "40px",
      height: "40px",
      fontSize: "14px",
      color: "#000",
      boxShadow: "none",
      borderRadius: "5px",
      "&:hover": {
        borderColor: "rgba(0,0,0,0.4)",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#000",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "rgba(0,0,0,0.4)",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "5px",
      zIndex: 40,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "#000"
        : state.isFocused
        ? "rgba(0,0,0,0.05)"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      "&:active": {
        backgroundColor: "rgba(0,0,0,0.1)",
      },
    }),
  };

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === statusFilter) || STATUS_OPTIONS[0];

  return (
    <div className="mx-auto space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center flex-1">
          <h1 className="text-2xl font-bold tracking-tight shrink-0">Reservations</h1>

          {/* Filter Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 w-full sm:flex-row sm:items-center lg:max-w-2xl"
          >
            <div className="relative w-full lg:w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <Input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-black/20 rounded-[5px] h-10 focus-visible:ring-black"
              />
            </div>

            {/* React Select Status Filter */}
            <div className="w-full sm:w-[180px] shrink-0" data-lenis-prevent>
              <Select
                options={STATUS_OPTIONS}
                value={currentStatusOption}
               onChange={(selected) => {
    if (selected) {
      setStatusFilter(selected.value); // Just updates the state, doesn't fetch yet
    }
  }}
                styles={selectStyles}
                isSearchable={false}
                placeholder="All Statuses"
              />
            </div>

            <Button
              type="submit"
              className="h-10 w-full sm:w-auto px-5 rounded-sm font-medium"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <BlinkingDots />
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-black/20 rounded-lg py-16">
          <CalendarClock className="w-12 h-12 text-black/30 mb-4" />
          <h3 className="text-lg font-semibold text-primary">No Reservations Found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try modifying your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[820px] w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/30 hover:bg-transparent">
                  <TableHead className="text-black font-semibold h-12">
                    Guest Details
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Guests
                    </div>
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    Table
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    Status
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12 text-right pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((item) => (
                  <TableRow
                    key={item._id}
                    className="border-b border-black/10 hover:bg-black/[0.02]"
                  >
                    <TableCell className="py-4 pl-4">
                      <div className="font-bold text-black text-sm">
                        {item.customerName}
                      </div>
                      <div className="text-xs text-black/50 mt-0.5">
                        {item.customerPhone}
                      </div>
                      <div className="text-xs text-black/40">
                        {item.customerEmail}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-1 font-semibold text-black">
                        <Users className="w-3.5 h-3.5 text-black/40" />
                        {item.partySize} {item.partySize === 1 ? "Guest" : "Guests"}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-black">
                        {moment(item.reservationDate).format('DD MMM, yyyy')}
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1 text-sm font-medium text-black mt-0.5">
                        <Clock className="w-3 h-3" />
                        Preferred: {item.preferredTime}
                      </div>
                      {item.startTime && item.endTime && (
                        <div className="text-xs text-green-700 font-medium mt-0.5">
                          {item.startTime} – {item.endTime}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      {item.tableId ? (
                        <div className="text-sm font-semibold text-black">
                          {item.tableId.tableNumber}
                          <span className="text-xs text-black/40 font-normal ml-1">
                            ({item.tableId.capacity} seats)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-black/35 italic">
                          Not assigned
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right py-4 pr-4">
                      <Link href={`/admin/reservations/${item._id}`} passHref>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 rounded-sm font-medium border-black/20 hover:bg-black hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Assign Table
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-black/5 overflow-x-auto">
              <DynamicPagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}