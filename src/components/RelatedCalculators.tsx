import { calculatorById } from "@/content";
import { CalculatorCard } from "./CalculatorCard";

export function RelatedCalculators({ ids }: { ids: string[] }) {
  const items = ids.map(calculatorById).filter((c) => c !== undefined);
  if (!items.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((c) => (
        <CalculatorCard key={c.id} calc={c} />
      ))}
    </div>
  );
}
