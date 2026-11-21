import type { CategoryId } from "@/calculators/types";

const PATHS: Record<CategoryId, string> = {
  taxes: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6M9 12h6M9 16h3",
  customs: "M21 8 12 3 3 8v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  electricity: "M13 2 4 14h7l-1 8 9-12h-7l1-8z",
  banking: "M3 10h18L12 4 3 10zm2 0v8m4-8v8m6-8v8m4-8v8M3 21h18",
  insurance: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3zm-3 9 2 2 4-4",
  travel: "M2 16l20-8-3-2-7 3-5-4-2 1 3 5-4 2-2-1-1 1 3 3z",
};

export function CategoryIcon({ id, className = "h-6 w-6" }: { id: CategoryId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={PATHS[id]} />
    </svg>
  );
}
