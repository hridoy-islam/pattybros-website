import { hours } from "@/lib/site";

export default function Hours({ className = "" }: { className?: string }) {
  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 tabular-nums ${className}`}>
      {hours.map((h) => (
        <div key={h.days} className="contents">
          <dt>{h.label}</dt>
          <dd className="whitespace-nowrap">{h.time}</dd>
        </div>
      ))}
    </dl>
  );
}
