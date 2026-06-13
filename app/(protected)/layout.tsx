// app/(protected)/layout.tsx
import { Metadata } from "next"
import ProtectedRoute from "@/components/shared/ProtectedRoute";


export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}