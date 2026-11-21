import Link from "next/link";
import { CALCULATORS } from "@/content";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-primary">الصفحة دي مش موجودة</h1>
      <p className="mt-3 text-muted">يمكن الرابط اتغير. جرّب واحدة من الحاسبات دي:</p>
      <ul className="mt-6 space-y-2">
        {CALCULATORS.map((c) => (
          <li key={c.id}>
            <Link href={`/${c.slug}`} className="font-semibold text-secondary underline">
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
