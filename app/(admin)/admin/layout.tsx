import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="shell">
        <AdminSidebar />
        <main className="content" id="main">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
