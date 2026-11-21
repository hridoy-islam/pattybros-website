import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// One admin form field: a shadcn Label over its control, with the error under it.
export function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <span className="err" id={`${htmlFor}-err`}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

// A shadcn Checkbox with its label beside it.
export function CheckField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}
