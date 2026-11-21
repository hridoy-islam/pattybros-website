"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import { Loading } from "@/components/admin/ui/bits";
import ServiceForm, { type ServiceInput } from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/button";
import type { ServiceItem } from "@/types";

// A service opened from the list's View button: edit it, or delete it
export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [service, setService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/services/${id}`)
      .then((r) => setService(r.data.data))
      .catch((e) => toast({ title: "Error", description: apiError(e, "Service not found"), variant: "destructive" }));
  }, [id, toast]);

  if (!service) return <Loading />;
  const { _id, slug, order, ...initial } = service;

  const remove = async () => {
    if (!window.confirm(`Delete ${service.name}?`)) return;
    try {
      await axiosInstance.delete(`/services/${id}`);
      toast({ title: "Service deleted" });
      router.replace("/admin/services");
    } catch (e) {
      toast({ title: "Error", description: apiError(e), variant: "destructive" });
    }
  };

  return (
    <>
      <Link className="crumb" href="/admin/services">
        &larr; All services
      </Link>
      <div className="head">
        <h1>{service.name}</h1>
      </div>
      <ServiceForm
        initial={initial as ServiceInput}
        submitLabel="Save changes"
        onSubmit={async (v) => {
          try {
            await axiosInstance.patch(`/services/${id}`, v);
            toast({ title: "Service saved" });
            router.push("/admin/services");
          } catch (e) {
            toast({ title: "Error", description: apiError(e), variant: "destructive" });
          }
        }}
        extraActions={
          <Button variant="destructive" type="button" onClick={remove}>
            Delete service
          </Button>
        }
      />
    </>
  );
}
