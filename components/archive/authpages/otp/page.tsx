"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { jwtDecode } from "jwt-decode";

// UI Components
import { Button } from "@/components/ui/button";

// Hooks & Redux state tracking
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { validateRequestOtp } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error: reduxError } = useSelector((state: any) => state.auth);
  
  const email = typeof window !== "undefined" ? localStorage.getItem("tp_otp_email") : null;

  // Fallback protection if user reaches OTP route without an active recovery email context
  useEffect(() => {
    if (!email) {
      router.push("/forget-password");
    }
  }, [email, router]);

  // Restricts non-numeric characters while managing granular keyboard backspaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      !/^[0-9]$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      setLocalError("");
      
      setOtp((prev) => {
        const nextOtp = [...prev];
        nextOtp[index] = "";
        return nextOtp;
      });

      // Shifting focus left safely on clearing inputs
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Captures and pipes keyboard string input arrays sequentially forward
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    setLocalError("");
    const singleDigit = val.slice(-1);

    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = singleDigit;
      return nextOtp;
    });

    // Auto-focus the next sequential input node
    if (index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Handles clipboard paste parsing specifically across multi-input frames
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    
    if (text.length !== otp.length) return;

    const digits = text.split("");
    setOtp(digits);
    inputRefs.current[otp.length - 1]?.focus();
  };

  // Submission pipeline via Redux request validation action
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email) {
      router.push("/forgot-password");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      setLocalError("Please enter all 4 verification digits.");
      return;
    }

    const result: any = await dispatch(
      validateRequestOtp({ email, otp: otpCode })
    );

    if (result?.payload?.success) {
      const token = result?.payload?.data?.resetToken;
      const decoded = jwtDecode(token);
      
      localStorage.setItem(
        "tp_user_data",
        JSON.stringify({ ...decoded, token })
      );
      
      router.push("/new-password");
    } else {
      setLocalError(result?.payload?.message || "Invalid or expired verification token.");
    }
  };

  const activeErrorMessage = localError || reduxError;

  return (
    <div className="min-h-screen bg-zinc-950 text-white items-center justify-center grid grid-cols-1 lg:grid-cols-12 overflow-hidden selection:bg-primary-foreground selection:text-white">
      
      {/* Left Column: Authentic Split Screen Visual Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative h-full w-full bg-zinc-900 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,33,39,0.15),transparent_60%)] pointer-events-none" />
        <Image
          src="/about-burger.jpg" // Retaining your background theme structure cleanly
          alt="Searing premium burgers"
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
            Verify possession.
            <br />
            <span className="text-primary-foreground">Lock your session down.</span>
          </h1>
          <h4 className="text-zinc-100 text-sm font-medium leading-relaxed">
            We have submitted a numeric string configuration directly to your communication vector. Enter your active handshake token inputs inside the block frames to access the state change.
          </h4>
        </div>
      </div>

      {/* Right Column: Interactive Core OTP Token Form Frame */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative z-10 bg-zinc-950 border-l border-zinc-900 h-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 w-full max-w-sm mx-auto"
        >
          {/* Back routing path pointer */}
          <div>
            <Link
              href="/forget-password"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">Back to Password Recovery</span>
            </Link>
          </div>

          {/* Section Typography Headers */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight scale-y-105">
              Enter Verification Code
            </h2>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              A 4-digit code block was dispatched to <span className="text-zinc-200 font-bold break-all">{email || "your registered email"}</span>. Input the values below to verify.
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-5">
            
            {/* Realtime Context Failure Box Output */}
            {activeErrorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-sm text-xs flex items-center gap-2.5 font-medium"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{activeErrorMessage}</span>
              </motion.div>
            )}

            {/* Segmented OTP Blocks Wrapper */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-zinc-400 block">
                Secure Pin Entry
              </label>
              
              <div className="flex gap-3 justify-between items-center" id="otp-form">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    disabled={loading}
                    className="w-full aspect-square bg-zinc-900 border border-zinc-800 text-white focus:border-primary-foreground focus:ring-1 focus:ring-primary-foreground text-center text-2xl font-extrabold outline-none rounded-sm transition-all disabled:opacity-50"
                  />
                ))}
              </div>
            </div>

            {/* Verification Fire Action Trigger */}
            <Button
              disabled={loading || otp.some((digit) => digit === "")}
              type="submit"
              className="w-full h-11 bg-primary-foreground hover:bg-primary-foreground/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-sm transition-all shadow-xl active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none mt-2"
            >
              {loading ? "Verifying Token..." : "Verify OTP Code"}
            </Button>

            {/* Navigation options to Sign Up layout */}
            <div className="text-center pt-2">
              <h3 className="text-xs text-zinc-100 font-medium">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary hover:text-primary/90 font-bold uppercase tracking-wider text-[11px] ml-1 transition-colors"
                >
                  Sign Up
                </Link>
              </h3>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}