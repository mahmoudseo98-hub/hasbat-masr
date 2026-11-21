import Link from "next/link";
import { SITE } from "@/lib/site";
import { LIVE_CATEGORIES } from "@/content";

export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white" aria-hidden="true">
            ح
          </span>
          {SITE.name}
        </Link>
        <nav aria-label="الأقسام">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-muted">
            {LIVE_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/${c.slug}`} className="hover:text-primary">
                  {c.name.split(" ")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
