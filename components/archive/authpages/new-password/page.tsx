"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldAlert } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Hooks & Redux state tracking
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
// NOTE: Make sure to replace `requestOtp` with your actual reset password action (e.g., `confirmNewPassword`) if you have a separate thunk for it
import { requestOtp, resetError } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

// Form validation schema enforcing field match via .refine
const formSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Emits the structural error message cleanly directly on the confirmation node
  });

type NewPasswordFormValues = z.infer<typeof formSchema>;

export default function NewPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: any) => state.auth);

  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Clear any existing global authentication errors on mount
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // Submission handler via Redux dispatch pipeline
  const onSubmit = async (data: NewPasswordFormValues) => {
    // Pull the active validation email context from storage
    const email = localStorage.getItem("tp_otp_email") || "";

    const payload = {
      email,
      password: data.password,
    };

    const result: any = await dispatch(requestOtp(payload));
    if (result?.payload?.success) {
      // Clear out the tracking email context key cleanly post-reset
      localStorage.removeItem("tp_otp_email");
      router.push("/sign-in");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white items-center justify-center grid grid-cols-1 lg:grid-cols-12 overflow-hidden selection:bg-primary-foreground selection:text-white">
      
      {/* Left Column: Authentic Split Screen Visual Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative h-full w-full bg-zinc-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,33,39,0.15),transparent_60%)] pointer-events-none" />
        <Image
          src="/about-burger.jpg" // Keeping your branded background setup intact
          alt="Searing the perfect smash burger"
          fill
          className="object-cover opacity-40 mixed-blend-luminosity"
          priority
        />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 font-black text-xl tracking-tighter uppercase text-white hover:opacity-90 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="Patty Bro's"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <h1 className="text-4xl xl:text-5xl font-black uppercase tracking-tight leading-none scale-y-105 origin-left">
            Secure your credentials.
            <br />
            <span className="text-primary-foreground">Lock in your setup.</span>
          </h1>
          <h4 className="text-zinc-100 text-sm font-medium leading-relaxed">
            Configure your strong new access variable strings below. Ensure your validation fields match exactly to instantly clear out past credential definitions and restore security protocols to your global profile.
          </h4>
        </div>
      </div>

      {/* Right Column: High Fidelity Shadcn UI Password Reset Frame */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative z-10 bg-zinc-950 border-l border-zinc-900 h-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 w-full max-w-sm mx-auto"
        >
          {/* Back to sign in routing link */}
          <div>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">Back to Sign In</span>
            </Link>
          </div>

          {/* Section Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight scale-y-105">
              New Password
            </h2>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Set your new account password rules below to restore seamless authentication routines.
            </p>
          </div>

          {/* Form Implementation wrapper */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Redux Error Messaging Display Component */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-sm text-xs flex items-center gap-2.5 font-medium"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* New Password Input Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary-foreground focus-visible:ring-offset-0 rounded-sm h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Input Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary-foreground focus-visible:ring-offset-0 rounded-sm h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Trigger Button */}
              <Button
                disabled={loading}
                type="submit"
                className="w-full h-11 bg-primary-foreground hover:bg-primary-foreground/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-sm transition-all shadow-xl active:scale-[0.99] mt-2"
              >
                {loading ? "Updating Credentials..." : "Update Password & Login"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}