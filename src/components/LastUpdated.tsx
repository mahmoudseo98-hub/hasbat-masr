import { formatDateAr } from "@/lib/format";

export function LastUpdated({ date }: { date: string }) {
  return (
    <p className="text-sm text-muted">
      آخر تحديث: <time dateTime={date}>{formatDateAr(date)}</time>
    </p>
  );
}
