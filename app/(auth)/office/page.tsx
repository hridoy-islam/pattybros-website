"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert, ArrowLeft } from "lucide-react";

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

// Hooks, Redux & Utilities
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/features/authSlice";

// Form validation schema via Zod
const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type UserFormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Safe fallback selector handling inside context
  const { user, loading, error } = useSelector(
    (state: any) => state?.auth || { user: null, loading: false, error: null }
  );

  useEffect(() => {
    if (!user) return;

    if (user?.role === "admin") {
      router.push("/admin");
    } else if (user?.role === "customer") {
      router.push("/");
    }
  }, [user, router]);

  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Submission handler using Redux feature action
  const onSubmit = async (data: UserFormValues) => {
    await dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white items-center justify-center grid grid-cols-1 lg:grid-cols-12 overflow-hidden selection:bg-primary-foreground selection:text-white">
      {/* Left Column: Authentic Split Screen Visual Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative h-full w-full bg-zinc-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,33,39,0.15),transparent_60%)] pointer-events-none" />
        <Image
          src="/about-burger.jpg"
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
            Smashed with Passion.
            <br />
            <span className="text-primary-foreground">
              Crafted for Purists.
            </span>
          </h1>
        </div>
      </div>

      {/* Right Column: High Fidelity Shadcn UI Login Frame */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative z-10 bg-zinc-950 border-l border-zinc-900 h-full">
        <div className="space-y-8 w-full max-w-sm mx-auto">
          {/* Back to home utility row */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Section Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight scale-y-105">
              Sign In to Patty Bro's
            </h2>
          </div>

          {/* Form Implementation wrapper */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Dynamic Error Messaging Container */}
              {error && (
                <div className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-sm text-xs flex items-center gap-2.5 font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Form Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="chef@pattybros.com"
                        disabled={loading}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary-foreground focus-visible:ring-offset-0 rounded-sm h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Form Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
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
                className="w-full h-11 bg-primary-foreground hover:bg-primary-foreground/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-sm transition-all shadow-xl active:scale-[0.99]"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}