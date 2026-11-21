"use client";

import Link from "next/link";
import { useId, useState } from "react";

export interface SearchItem { slug: string; title: string; keywords: string[] }

// Normalise common Arabic spelling variants so "اللاب توب" finds "اللابتوب" and "أ/إ/ا" match.
const norm = (s: string) => s.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, "").toLowerCase();

export function SearchBar({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const id = useId();
  const nq = norm(q);
  const results = nq ? items.filter((i) => norm([i.title, ...i.keywords].join(" ")).includes(nq)) : [];
  return (
    <div className="relative mx-auto w-full max-w-xl" role="search">
      <label htmlFor={id} className="mb-2 block text-base font-semibold text-white">
        بتدور على حاسبة معينة؟
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="مثلًا: التأمينات، الشهادات، التكييف…"
        autoComplete="off"
        className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-ink shadow-card placeholder:text-muted focus:ring-4 focus:ring-accent"
        aria-describedby={`${id}-status`}
      />
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {q ? `${results.length} نتيجة` : ""}
      </p>
      {q && (
        <ul className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-line bg-white text-right shadow-card">
          {results.length ? (
            results.map((r) => (
              <li key={r.slug}>
                <Link href={`/${r.slug}`} className="block px-5 py-3 text-ink hover:bg-bg">
                  {r.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-5 py-3 text-muted">مفيش حاسبة بالاسم ده لسه — ابعتلنا اقتراحك من صفحة «اتصل بنا».</li>
          )}
        </ul>
      )}
    </div>
  );
}
