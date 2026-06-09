"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import moment from "@/lib/moment-setup";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface IReservation {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: number;
  reservationDate: string;
  preferredTime: string;
  startTime?: string;
  endTime?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface IFormInputs {
  startTime: string;
  endTime: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-300",
  confirmed: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  completed: "bg-blue-100 text-blue-800 border border-blue-300",
  cancelled: "bg-rose-100 text-rose-800 border border-rose-300",
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-black/5 last:border-0">
      <div className="w-8 h-8 rounded-md bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-black/70 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-black mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const reservationId = params?.id as string;

  const [reservation, setReservation] = useState<IReservation | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  // Reusable Dialog Control State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionButtonText: string;
    actionVariant?: "default" | "destructive" | "success";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionButtonText: "",
    onConfirm: () => {},
  });

  const form = useForm<IFormInputs>({
    defaultValues: { startTime: "", endTime: "" },
  });

  // ── Time Input Blur Normalization ──────────────────────────────────────────
  const handleTimeBlur = (value: string, onChangeFn: (v: string) => void) => {
    if (!value) return;
    let [hours, minutes] = value.split(":");
    if (!hours) hours = "00";
    if (!minutes) minutes = "00";
    if (hours.length === 1) hours = `0${hours}`;
    if (minutes.length === 1) minutes = `${minutes}0`;
    if (parseInt(hours) > 23) hours = "23";
    if (parseInt(minutes) > 59) minutes = "59";
    onChangeFn(`${hours}:${minutes}`);
  };

  // ── Fetch reservation detail ──────────────────────────────────────────────
  useEffect(() => {
    if (!reservationId) return;

    const fetchData = async () => {
      try {
        setPageLoading(true);
        const res = await axiosInstance.get(`/reservation/${reservationId}`);
        const data: IReservation = res?.data?.data || res?.data;
        setReservation(data);

        form.reset({
          startTime: data.startTime || "",
          endTime: data.endTime || "",
        });
      } catch (err) {
        console.error("Failed to fetch reservation:", err);
        toast({
          title: "Error",
          description: "Could not load reservation specifications.",
          variant: "destructive",
        });
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [reservationId, toast, form]);

  // ── Trigger Confirm Dialog ─────────────────────────────────────────────────
  const checkConfirmAssignment = (values: IFormInputs) => {
    const isUpdate = reservation?.status === "confirmed";

    setConfirmConfig({
      isOpen: true,
      title: isUpdate ? "Update Reservation Layout?" : "Confirm Reservation Request?",
      description: "Are you sure you want to allot timeline windows and confirm this reservation request?",
      actionButtonText: isUpdate ? "Update Details" : "Confirm Reservation",
      actionVariant: "default",
      onConfirm: () => executeConfirmAssignment(values),
    });
  };

  // ── Execute Confirm ────────────────────────────────────────────────────────
  const executeConfirmAssignment = async (values: IFormInputs) => {
    try {
      setSubmitLoading(true);
      const payload = {
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
        status: "confirmed",
      };

      await axiosInstance.patch(`/reservation/${reservationId}`, payload);

      setReservation((prev) =>
        prev
          ? {
              ...prev,
              startTime: values.startTime || undefined,
              endTime: values.endTime || undefined,
              status: "confirmed",
            }
          : prev
      );

      toast({
        title: "Reservation Confirmed",
        description: "Reservation parameters configured successfully.",
      });
    } catch (err: any) {
      console.error("Failed to confirm reservation:", err);
      toast({
        title: "Confirmation Failed",
        description: err?.response?.data?.message || "Internal error updating resource.",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Trigger Complete Dialog ────────────────────────────────────────────────
  const triggerCompleteDialog = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Mark Reservation as Completed?",
      description: "This structural update locks the record and completes the scheduled reservation timeline context.",
      actionButtonText: "Complete Reservation",
      actionVariant: "success",
      onConfirm: executeComplete,
    });
  };

  // ── Execute Complete ───────────────────────────────────────────────────────
  const executeComplete = async () => {
    try {
      setCompleteLoading(true);
      await axiosInstance.patch(`/reservation/${reservationId}`, { status: "completed" });

      setReservation((prev) => (prev ? { ...prev, status: "completed" } : prev));

      toast({
        title: "Reservation Completed",
        description: "Status marked as completed.",
      });
    } catch (err: any) {
      console.error("Failed to complete reservation:", err);
      toast({
        title: "Action Failed",
        description: err?.response?.data?.message || "Failed to finalize reservation status.",
        variant: "destructive",
      });
    } finally {
      setCompleteLoading(false);
    }
  };

  // ── Trigger Cancel Dialog ──────────────────────────────────────────────────
  const triggerCancelDialog = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Cancel Reservation Request?",
      description: "This action voids this timeline request completely. Removed parameters cannot be recovered retroactively.",
      actionButtonText: "Cancel Reservation",
      actionVariant: "destructive",
      onConfirm: executeReject,
    });
  };

  // ── Execute Cancel ─────────────────────────────────────────────────────────
  const executeReject = async () => {
    try {
      setRejectLoading(true);
      await axiosInstance.patch(`/reservation/${reservationId}`, {
        status: "cancelled",
        startTime: null,
        endTime: null,
      });

      setReservation((prev) =>
        prev
          ? {
              ...prev,
              status: "cancelled",
              startTime: undefined,
              endTime: undefined,
            }
          : prev
      );

      form.reset({ startTime: "", endTime: "" });

      toast({
        title: "Reservation Cancelled",
        description: "Status flag set to cancelled successfully.",
      });
    } catch (err: any) {
      console.error("Failed to reject reservation:", err);
      toast({
        title: "Action Failed",
        description: err?.response?.data?.message || "Failed to alter reservation status.",
        variant: "destructive",
      });
    } finally {
      setRejectLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex space-x-2 justify-center items-center">
          <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 bg-black rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-black/50 text-sm">Reservation record context not found.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const isCancelled = reservation.status === "cancelled";
  const isConfirmed = reservation.status === "confirmed";
  const isCompleted = reservation.status === "completed";

  return (
    <div className="mx-auto space-y-6 text-black">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Reservation Detail</h1>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[reservation.status]}`}>
            {reservation.status}
          </span>
        </div>
        <Button size="sm" onClick={() => router.back()} className="border-black/20">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ── LEFT: Guest Information Metadata Card ── */}
        <div className="lg:sticky lg:top-6 h-fit border border-black/10 rounded-xl p-5 space-y-1 bg-white shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-3">
            Guest Information
          </h2>
          <InfoRow icon={<User className="w-4 h-4 text-black/50" />} label="Name" value={reservation.customerName} />
          <InfoRow icon={<Phone className="w-4 h-4 text-black/50" />} label="Phone" value={reservation.customerPhone} />
          <InfoRow icon={<Mail className="w-4 h-4 text-black/50" />} label="Email" value={reservation.customerEmail} />
          <InfoRow icon={<Users className="w-4 h-4 text-black/50" />} label="Guests" value={`${reservation.partySize} guests`} />
          <InfoRow icon={<CalendarDays className="w-4 h-4 text-black/50" />} label="Date" value={moment(reservation.reservationDate).format("DD-MM-YYYY")} />
          <InfoRow icon={<Clock className="w-4 h-4 text-black/50" />} label="Preferred Arrival Slot" value={reservation.preferredTime} />

          {isConfirmed && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Reservation Confirmed
              </div>
              {reservation.startTime && reservation.endTime && (
                <p className="text-xs text-emerald-600 mt-1 ml-6">
                  Duration Window: {reservation.startTime} – {reservation.endTime}
                </p>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Reservation Completed
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Operations Card ── */}
        <div className="border border-black/10 rounded-xl p-5 bg-white space-y-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black">
            Control Operations Panel
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(checkConfirmAssignment)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Start Time Field */}
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wide text-black">
                        Start Time <span className="text-[10px] font-normal lowercase ">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={isCancelled || isCompleted ? '--:--' : '09:00'}
                          maxLength={5}
                          disabled={isCancelled || isCompleted}
                          className="font-mono border-black/20 focus-visible:ring-black"
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
                            if (val.length === 2 && field.value?.length === 1 && !val.includes(':')) {
                              val += ':';
                            }
                            field.onChange(val);
                          }}
                          onBlur={(e) => handleTimeBlur(e.target.value, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Time Field */}
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wide text-black">
                        End Time <span className="text-[10px] font-normal lowercase ">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={isCancelled || isCompleted ? '--:--' : '17:00'}
                          maxLength={5}
                          disabled={isCancelled || isCompleted}
                          className="font-mono border-black/20 focus-visible:ring-black"
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
                            if (val.length === 2 && field.value?.length === 1 && !val.includes(':')) {
                              val += ':';
                            }
                            field.onChange(val);
                          }}
                          onBlur={(e) => handleTimeBlur(e.target.value, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Operations Submission Layout */}
              <div className="space-y-2 pt-2 border-t border-black/5">
                {!isCompleted && !isCancelled && (
                  <Button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full h-11 font-semibold text-sm bg-black text-white hover:bg-black/90"
                  >
                    {submitLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {isConfirmed ? "Update" : "Confirm Reservation"}
                      </div>
                    )}
                  </Button>
                )}

                {isConfirmed && (
                  <Button
                    type="button"
                    onClick={triggerCompleteDialog}
                    disabled={completeLoading}
                    className="w-full h-11 font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {completeLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Mark as Completed
                      </div>
                    )}
                  </Button>
                )}

                {!isCancelled && !isCompleted && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={triggerCancelDialog}
                    disabled={rejectLoading}
                    className="w-full h-11 font-semibold text-sm bg-rose-600 hover:bg-rose-700"
                  >
                    {rejectLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Cancel Reservation
                      </div>
                    )}
                  </Button>
                )}

                {(isCompleted || isCancelled) && (
                  <p className="text-center text-xs font-medium text-black/40 pt-2">
                    This reservation record is locked and cannot be edited.
                  </p>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* ── GLOBAL SHADCN CONFIRMATION DIALOG ── */}
      <AlertDialog
        open={confirmConfig.isOpen}
        onOpenChange={(open) => setConfirmConfig((prev) => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent className="bg-white text-black border border-black/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">{confirmConfig.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-black/60">
              {confirmConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmConfig.onConfirm}
              className={`font-semibold text-white ${
                confirmConfig.actionVariant === "destructive"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : confirmConfig.actionVariant === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {confirmConfig.actionButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}