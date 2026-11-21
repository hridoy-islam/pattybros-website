"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import { ANY, DepositBadge, fmtDate, Loading, Pagination, StatusBadge, STATUS_OPTIONS } from "@/components/admin/ui/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Booking } from "@/types";

const WHEN_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: ANY, label: "All dates" },
];

function BookingsList() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const startWhen = params.get("when") || "upcoming";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ANY);
  const [whenFilter, setWhenFilter] = useState(startWhen);
  const [active, setActive] = useState({ search: "", status: ANY, when: startWhen });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const entriesPerPage = 12;

  useEffect(() => {
    let alive = true;
    setPageLoading(true);
    axiosInstance
      .get("/bookings", {
        params: {
          page: currentPage,
          limit: entriesPerPage,
          searchTerm: active.search || undefined,
          status: active.status === ANY ? undefined : active.status,
          when: active.when === ANY ? undefined : active.when,
        },
      })
      .then((res) => {
        if (!alive) return;
        setBookings(res.data.data.result || []);
        setTotalPages(res.data.data.meta?.totalPage || 1);
        setTotal(res.data.data.meta?.total || 0);
      })
      .catch((e) => toast({ title: "Error", description: apiError(e, "Failed to fetch bookings"), variant: "destructive" }))
      .finally(() => alive && setPageLoading(false));
    return () => {
      alive = false;
    };
  }, [currentPage, active, toast]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActive({ search: searchQuery, status: statusFilter, when: whenFilter });
  };

  return (
    <>
      <div className="head">
        <div>
          <h1>Bookings</h1>
          <p>{total} found</p>
        </div>
        <Button asChild>
          <Link href="/admin/bookings/create">Add a booking</Link>
        </Button>
      </div>

      <form className="filters" onSubmit={onSearch}>
        <Input
          className="max-w-xs"
          placeholder="Search name, email, phone or reference"
          aria-label="Search bookings"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44" aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={whenFilter} onValueChange={setWhenFilter}>
          <SelectTrigger className="w-40" aria-label="When">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WHEN_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="dark" type="submit">
          Search
        </Button>
      </form>

      <div className="table-wrap">
        {pageLoading ? (
          <Loading />
        ) : bookings.length === 0 ? (
          <p className="empty">No bookings match.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date and time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow
                  key={b._id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    // a click on the row opens it; the View link and other buttons in the row do their own thing
                    if ((e.target as HTMLElement).closest("a, button")) return;
                    router.push(`/admin/bookings/${b._id}`);
                  }}
                >
                  <TableCell className="num">
                    {fmtDate(b.date)}
                    <span className="sub">{b.time}</span>
                  </TableCell>
                  <TableCell>
                    {b.customerName}
                    <span className="sub">{b.ref}</span>
                  </TableCell>
                  <TableCell>{b.serviceName}</TableCell>
                  <TableCell className="num">{b.price ? `£${b.price}` : "Free"}</TableCell>
                  <TableCell>
                    <DepositBadge amount={b.depositAmount} paid={b.depositPaid} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bookings/${b._id}`} aria-label={`View booking ${b.ref}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
    </>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookingsList />
    </Suspense>
  );
}
