"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import ServiceForm, { emptyService } from "@/components/admin/ServiceForm";

export default function CreateServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <>
      <Link className="crumb" href="/admin/services">
        &larr; All services
      </Link>
      <div className="head">
        <h1>Add a service</h1>
      </div>
      <ServiceForm
        initial={emptyService}
        submitLabel="Add service"
        onSubmit={async (v) => {
          try {
            await axiosInstance.post("/services", v);
            toast({ title: "Service added" });
            router.push("/admin/services");
          } catch (e) {
            toast({ title: "Error", description: apiError(e), variant: "destructive" });
          }
        }}
      />
    </>
  );
}
