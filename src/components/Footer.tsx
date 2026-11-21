import Link from "next/link";
import { SITE } from "@/lib/site";
import { CALCULATORS } from "@/content";
import { INFO_PAGES } from "@/content/pages";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary text-white/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{SITE.name}</p>
          <p className="mt-2 text-sm leading-7">
            منصة معلوماتية مستقلة — غير تابعة لأي جهة حكومية أو بنك. النتائج تقديرية؛ ارجع للجهة الرسمية قبل أي قرار مالي.
          </p>
        </div>
        <nav aria-label="الحاسبات">
          <p className="font-semibold text-white">الحاسبات</p>
          <ul className="mt-2 space-y-1 text-sm">
            {CALCULATORS.map((c) => (
              <li key={c.id}>
                <Link href={`/${c.slug}`} className="hover:text-accent">
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="عن الموقع">
          <p className="font-semibold text-white">عن الموقع</p>
          <ul className="mt-2 space-y-1 text-sm">
            {INFO_PAGES.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">© {SITE.name}</p>
    </footer>
  );
}
