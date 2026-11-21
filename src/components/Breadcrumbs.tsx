import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "الرئيسية", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="مسار التنقل" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">‹</span>}
              {i < all.length - 1 ? (
                <Link href={it.href} className="hover:text-primary">
                  {it.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
        }}
      />
    </>
  );
}
