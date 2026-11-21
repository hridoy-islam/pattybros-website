"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser, requestOtp, resetError, validateRequestOtp } from "@/redux/features/authSlice";
import AdminRedirectGuard from "@/components/admin/AdminRedirectGuard";
import { USE_MOCK } from "@/lib/axios";
import { Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "forgot" | "otp";

export default function OfficeSignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error, message } = useAppSelector((s) => s.auth);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.role === "admin") router.push("/admin");
  }, [user, router]);

  useEffect(() => {
    dispatch(resetError());
  }, [mode, dispatch]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) fe.email = "Enter a valid email address";
    if (!password) fe.password = "Password is required";
    setFieldErr(fe);
    if (Object.keys(fe).length) return;
    await dispatch(loginUser({ email, password }));
  };

  const onForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setFieldErr({ email: "Enter a valid email address" });
    setFieldErr({});
    const r = await dispatch(requestOtp({ email }));
    if (requestOtp.fulfilled.match(r)) setMode("otp");
  };

  const onOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await dispatch(validateRequestOtp({ email, otp }));
    if (validateRequestOtp.fulfilled.match(r)) setMode("login");
  };

  return (
    <AdminRedirectGuard>
      <div className="login">
        <div className="login__art">
          <img className="bg" src="/images/hero-lash-application.jpg" alt="" />
          <div className="over">
            <h1>LashesByZee studio</h1>
            <p>Bookings, services and studio settings in one place.</p>
          </div>
        </div>
        <div className="login__form">
          <div className="login__box">
            <a href="/" aria-label="Back to the website">
              <img className="logo" src="/logo-256.png" alt="LashesByZee" />
            </a>
            <h2>{mode === "login" ? "Sign in to the studio admin" : mode === "forgot" ? "Reset your password" : "Enter your code"}</h2>

            {error && (
              <div className="alert" role="alert">
                {error}
              </div>
            )}
            {message && !error && <div className="note">{message}</div>}

            {mode === "login" && (
              <form onSubmit={onLogin} noValidate className="login__box" style={{ gap: 16 }}>
                <Field label="Email address" htmlFor="email" error={fieldErr.email}>
                  <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fieldErr.email || undefined} />
                </Field>
                <Field label="Password" htmlFor="password" error={fieldErr.password}>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErr.password || undefined}
                  />
                </Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in" : "Sign in"}
                </Button>
                <Button variant="outline" type="button" onClick={() => setMode("forgot")}>
                  Forgot password
                </Button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={onForgot} noValidate className="login__box" style={{ gap: 16 }}>
                <Field label="Email address" htmlFor="reset-email" error={fieldErr.email}>
                  <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fieldErr.email || undefined} />
                </Field>
                <Button type="submit" disabled={loading}>
                  Send a reset code
                </Button>
                <Button variant="outline" type="button" onClick={() => setMode("login")}>
                  Back to sign in
                </Button>
              </form>
            )}

            {mode === "otp" && (
              <form onSubmit={onOtp} noValidate className="login__box" style={{ gap: 16 }}>
                <Field label="Six-digit code" htmlFor="otp">
                  <Input id="otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </Field>
                <Button type="submit" disabled={loading}>
                  Check the code
                </Button>
              </form>
            )}

            {USE_MOCK && (
              <p className="note">
                Demo data. Sign in with <b>admin@gmail.com</b> and <b>123456</b>
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminRedirectGuard>
  );
}
