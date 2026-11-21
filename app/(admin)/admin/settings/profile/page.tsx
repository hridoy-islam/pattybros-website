"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile, updateUserProfile } from "@/redux/features/profileSlice";
import { useToast } from "@/components/admin/ui/Toast";
import { Loading } from "@/components/admin/ui/bits";
import { Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const { profileData, loading } = useAppSelector((s) => s.profile);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user?._id) dispatch(fetchUserProfile(user._id));
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (profileData) {
      setName(profileData.name || "");
      setPhone(profileData.phone || "");
    }
  }, [profileData]);

  if (!profileData) return <Loading />;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password.length < 8) return setErr("Use at least 8 characters for the new password");
    if (password !== confirm) return setErr("The two passwords do not match");
    setErr("");
    const r = await dispatch(
      updateUserProfile({ userId: user!._id, profileData: { name, phone, ...(password ? { password } : {}) } })
    );
    if (updateUserProfile.fulfilled.match(r)) {
      toast({ title: "Profile saved" });
      setPassword("");
      setConfirm("");
    } else toast({ title: "Error", description: "Could not save", variant: "destructive" });
  };

  return (
    <>
      <div className="head">
        <div>
          <h1>My profile</h1>
          <p>{profileData.email}</p>
        </div>
      </div>
      <form className="card" onSubmit={save} noValidate>
        <div className="form-grid">
          <Field label="Name" htmlFor="name">
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Mobile number" htmlFor="mobileNumber">
            <Input id="mobileNumber" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="New password" htmlFor="newPassword">
            <Input id="newPassword" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Repeat new password" htmlFor="repeatNewPassword">
            <Input id="repeatNewPassword" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </Field>
        </div>
        {err && (
          <p className="err" style={{ marginTop: 12 }}>
            {err}
          </p>
        )}
        <div className="mt-5">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving" : "Save profile"}
          </Button>
        </div>
      </form>
    </>
  );
}
