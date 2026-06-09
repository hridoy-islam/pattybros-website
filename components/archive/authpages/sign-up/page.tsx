"use client";

import React, { useState } from "react";
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

// Hooks & Utilities
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Form validation schema via Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phone: z.string().min(6, { message: "Enter a valid phone number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.string().default("user"),
});

type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  };

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Submission handler via Axios custom pipeline
  const onSubmit = async (data: SignUpFormValues) => {
    setLoading(true);
    setFormError(null);
    try {
      const result = await axiosInstance.post(`/auth/signup`, data);
      if (result?.data?.success) {
        toast({
          title: "Account Created",
          description: "You have successfully created an account",
        });
        router.push("/sign-in");
      } else {
        const msg = result.data.message || "Something went wrong";
        setFormError(msg);
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("API Error:", error);
      const fallbackMsg = error.response?.data?.message || "Server not reachable";
      setFormError(fallbackMsg);
      toast({
        title: "Error",
        description: fallbackMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <span className="text-primary-foreground">Crafted for Purists.</span>
          </h1>
          <h4 className="text-zinc-100 text-sm font-medium leading-relaxed">
            Join the table. Create your account to start customizing flavor maps, tracking custom crust profiles, and ordering fresh batches of premium smashed craft directly to your location.
          </h4>
        </div>
      </div>

      {/* Right Column: High Fidelity Shadcn UI Signup Frame */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative z-10 bg-zinc-950 border-l border-zinc-900 h-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 w-full max-w-sm mx-auto"
        >
          {/* Back to home utility row */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">Back to home</span>
            </Link>
          </div>

          {/* Section Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight scale-y-105">
              Create Your Account
            </h2>
          </div>

          {/* Google Authentication Integration Block */}
          <div className="space-y-3">
            <Button
              type="button"
              disabled={true}
              className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-[11px] rounded-sm transition-all flex items-center justify-center gap-2.5 opacity-60 cursor-not-allowed"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign Up with Google
            </Button>
          </div>

          {/* Form Implementation wrapper */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Dynamic Error Messaging Container */}
              {formError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-sm text-xs flex items-center gap-2.5 font-medium"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </motion.div>
              )}

              {/* Name Form Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Name"
                        disabled={loading}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary-foreground focus-visible:ring-offset-0 rounded-sm h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Email Form Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        disabled={loading}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary-foreground focus-visible:ring-offset-0 rounded-sm h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone Form Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Phone Number"
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
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                      Password
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
                {loading ? "Creating Profile..." : "Create Account"}
              </Button>

              {/* Navigation Link to Existing Account Gateway */}
              <div className="text-center pt-2">
                <h3 className="text-xs text-zinc-100 font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-primary hover:text-primary/90 font-bold uppercase tracking-wider text-[11px] ml-1 transition-colors"
                  >
                    Sign In
                  </Link>
                </h3>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}