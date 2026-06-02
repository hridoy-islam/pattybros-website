import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <span className="text-9xl font-black text-slate-100">404</span>
      <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-4">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We could not find the page you were looking for. It might have been moved or deleted.
      </p>
      <Link href="/">
        <Button variant="brand" size="xl">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}