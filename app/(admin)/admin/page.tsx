"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance, { apiError } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { useToast } from "@/components/admin/ui/Toast";
import { DepositBadge, fmtDate, Loading, StatusBadge } from "@/components/admin/ui/bits";
import type { Booking } from "@/types";
import { now } from "@/lib/moment-setup";
import { Button } from "@/components/ui/button";

interface Dashboard {
  todayCount: number;
  pendingCount: number;
  upcomingCount: number;
  depositsDue: number;
  monthRevenue: number;
  next: Booking[];
}

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { toast } = useToast();
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard")
      .then((r) => setData(r.data.data))
      .catch((e) => toast({ title: "Error", description: apiError(e, "Could not load the dashboard"), variant: "destructive" }));
  }, [toast]);

  return (
    <>
      <div className="head">
        <div>
          <h1>Good to see you, {user?.name}</h1>
          <p>{now().format("dddd D MMMM")}</p>
        </div>
        <Button asChild>
          <Link href="/admin/bookings/create">Add a booking</Link>
        </Button>
      </div>

      {!data ? (
        <Loading />
      ) : (
        <>
          <div className="stats">
            <div className="stat">
              <div className="stat__label">Appointments today</div>
              <div className="stat__value">{data.todayCount}</div>
            </div>
            <div className="stat">
              <div className="stat__label">Waiting for confirmation</div>
              <div className="stat__value">{data.pendingCount}</div>
            </div>
            <div className="stat">
              <div className="stat__label">Deposits not paid yet</div>
              <div className="stat__value">{data.depositsDue}</div>
            </div>
            <div className="stat stat--gold">
              <div className="stat__label">Completed this month</div>
              <div className="stat__value">£{data.monthRevenue.toLocaleString("en-GB")}</div>
            </div>
          </div>

          <div className="card">
            <div className="head" style={{ marginBottom: 8 }}>
              <h2>Next appointments</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/bookings?when=upcoming">See all {data.upcomingCount} upcoming</Link>
              </Button>
            </div>
            {data.next.length === 0 ? (
              <p className="empty">No upcoming appointments.</p>
            ) : (
              <ul className="next">
                {data.next.map((b) => (
                  <li key={b._id}>
                    <time>
                      {fmtDate(b.date).replace(/ \d{4}$/, "")}
                      <span className="sub" style={{ display: "block", fontWeight: 400 }}>
                        {b.time}
                      </span>
                    </time>
                    <Link href={`/admin/bookings/${b._id}`} style={{ textDecoration: "none" }}>
                      <b style={{ fontWeight: 500 }}>{b.customerName}</b>
                      <span className="sub">{b.serviceName}</span>
                    </Link>
                    <span style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "end" }}>
                      <StatusBadge status={b.status} />
                      <DepositBadge amount={b.depositAmount} paid={b.depositPaid} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}
