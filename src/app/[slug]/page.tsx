import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_SLUGS, CALCULATORS, calculatorsIn, resolveSlug } from "@/content";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Blocks } from "@/components/Blocks";
import { SourceReferences } from "@/components/SourceReferences";

type Props = { params: Promise<{ slug: string }> };

// Arabic slugs can arrive percent-encoded; decode defensively.
function decode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decode((await params).slug);
  const r = resolveSlug(slug);
  if (!r) return {};
  const path = `/${slug}`;
  const [title, description] =
    r.kind === "calculator" ? [r.item.seoTitle, r.item.metaDescription] : r.kind === "category" ? [`حاسبات ${r.item.name} في مصر`, r.item.description] : [r.item.title, r.item.description];
  return {
    title: r.kind === "calculator" ? { absolute: title } : title,
    description,
    keywords: r.kind === "calculator" ? r.item.keywords : undefined,
    alternates: { canonical: encodeURI(path) },
    openGraph: { title, description, url: encodeURI(path), type: r.kind === "calculator" ? "article" : "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function Page({ params }: Props) {
  const slug = decode((await params).slug);
  const r = resolveSlug(slug);
  if (!r) notFound();

  if (r.kind === "calculator") return <CalculatorLayout calc={r.item} />;

  if (r.kind === "category") {
    const cat = r.item;
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Breadcrumbs items={[{ name: cat.name, href: `/${cat.slug}` }]} />
        <h1 className="mt-4 text-3xl font-bold text-primary">حاسبات {cat.name}</h1>
        <p className="mt-3 max-w-3xl text-lg">{cat.description}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {calculatorsIn(cat.id).map((c) => (
            <CalculatorCard key={c.id} calc={c} showDate />
          ))}
        </div>
        {cat.upcoming.length > 0 && <p className="mt-6 text-sm text-muted">قريبًا في القسم ده: {cat.upcoming.join("، ")}.</p>}
      </div>
    );
  }

  const page = r.item;
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: page.title, href: `/${page.slug}` }]} />
      <h1 className="mt-4 mb-6 text-3xl font-bold text-primary">{page.title}</h1>
      <Blocks blocks={page.blocks} />
      {page.slug === "المصادر-ومنهجية-الحساب" && (
        <section aria-labelledby="per-calc" className="mt-10">
          <h2 id="per-calc" className="mb-4 text-2xl font-bold text-primary">مصادر كل حاسبة</h2>
          {CALCULATORS.map((c) => (
            <div key={c.id} className="mb-8">
              <h3 className="mb-3 font-bold text-primary">{c.title}</h3>
              <SourceReferences sources={c.sources} />
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
