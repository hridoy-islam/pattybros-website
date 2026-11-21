"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import { ANY, fmtMinutes, Loading } from "@/components/admin/ui/bits";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ServiceItem } from "@/types";

const GROUPS: Record<ServiceItem["group"], string> = { sets: "Full sets", infills: "Infills", other: "Removal and patch test" };

export default function ServicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceItem[] | null>(null);
  const [group, setGroup] = useState<string>(ANY);

  const load = () =>
    axiosInstance
      .get("/services", { params: { group: group === ANY ? undefined : group } })
      .then((r) => setServices(r.data.data.result))
      .catch((e) => toast({ title: "Error", description: apiError(e), variant: "destructive" }));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const toggle = async (s: ServiceItem) => {
    try {
      await axiosInstance.patch(`/services/${s._id}`, { active: !s.active });
      toast({ title: s.active ? "Hidden from online booking" : "Bookable online" });
      load();
    } catch (e) {
      toast({ title: "Error", description: apiError(e), variant: "destructive" });
    }
  };

  return (
    <>
      <div className="head">
        <div>
          <h1>Services and prices</h1>
          <p>What clients can book, how long it takes and what it costs.</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/create">Add a service</Link>
        </Button>
      </div>
      <div className="filters">
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="w-56" aria-label="Group">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>All groups</SelectItem>
            {Object.entries(GROUPS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="table-wrap">
        {!services ? (
          <Loading />
        ) : services.length === 0 ? (
          <p className="empty">No services yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Online</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow
                  key={s._id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    // a click on the row opens it; the View link and other buttons in the row do their own thing
                    if ((e.target as HTMLElement).closest("a, button")) return;
                    router.push(`/admin/services/${s._id}`);
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {s.image ? <img src={s.image} alt="" className="h-[42px] w-14 rounded object-cover" /> : null}
                      <span>
                        {s.name}
                        {s.popular ? <span className="sub">Popular set</span> : null}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{GROUPS[s.group]}</TableCell>
                  <TableCell className="num">{fmtMinutes(s.minutes)}</TableCell>
                  <TableCell className="num">{s.price ? `£${s.price}` : "Free"}</TableCell>
                  <TableCell>
                    <button className={`badge ${s.active ? "badge--confirmed" : "badge--off"}`} type="button" onClick={() => toggle(s)}>
                      {s.active ? "Bookable" : "Hidden"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/services/${s._id}`} aria-label={`View ${s.name}`}>
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
    </>
  );
}
