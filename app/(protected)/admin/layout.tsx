import { AdminSidebar } from "@/components/shared/adminNav";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-primary selection:text-primary-foreground">
      {/* Component manages its own positioning framework dynamically */}
      <AdminSidebar />

      {/* Main viewport block. pt-16 makes space for mobile header. lg:pl-64 creates room for desktop sidebar. */}
      <div className="lg:pl-64 pt-16 lg:pt-0 min-h-screen w-full flex flex-col">
        <main className="flex-1 p-4 mx-auto w-full transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}