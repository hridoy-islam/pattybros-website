export default function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform duration-200 group-hover:translate-x-[3px] ${className}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6h9M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  );
}
