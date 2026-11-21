import Link from "next/link";
import type { Metadata } from "next";
import { CALCULATORS, CATEGORIES, calculatorsIn, LIVE_CATEGORIES } from "@/content";
import { SITE, absoluteUrl } from "@/lib/site";
import { SearchBar } from "@/components/SearchBar";
import { CalculatorCard } from "@/components/CalculatorCard";
import { CategoryIcon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} — حاسبات الضرائب والتأمينات والشهادات والكهرباء في مصر` },
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: SITE.name, description: "احسب ضريبتك وتأميناتك وعائد شهادتك واستهلاك أجهزتك بأرقام رسمية محدّثة." },
};

const GUIDES = [
  { title: "النظام الضريبي المبسط ولا الشرائح؟ إزاي الفريلانسر يختار", href: "/حاسبة-ضريبة-الفريلانسر#methodology" },
  { title: "ليه التكييف بيزوّد الفاتورة أكتر من استهلاكه؟ شرح نظام الشرائح", href: "/حاسبة-استهلاك-الكهرباء-للاجهزة#methodology" },
  { title: "حدود أجر الاشتراك التأميني 2026 و2027 بالأرقام", href: "/حاسبة-التأمينات-الاجتماعية#methodology" },
  { title: "إزاي بنتحقق من الأرقام ونفرّق بين الرسمي والتقديري", href: "/المصادر-ومنهجية-الحساب" },
];

export default function Home() {
  const popular = CALCULATORS.filter((c) => c.popular);
  const recent = [...CALCULATORS].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 3);
  return (
    <>
      <section className="bg-primary px-4 pb-14 pt-12 text-center text-white">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">احسبها صح بأرقام مصر الرسمية</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
          ضريبتك كام، التأمينات بتخصم كام، الشهادة بتجيب كام، والتكييف بيزوّد الفاتورة كام — حاسبات مصرية بالمصدر وتاريخ التحديث.
        </p>
        <div className="mt-8">
          <SearchBar items={CALCULATORS.map((c) => ({ slug: c.slug, title: c.title, keywords: [c.shortTitle, ...c.keywords] }))} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <section aria-labelledby="popular" className="mt-12">
          <h2 id="popular" className="mb-5 text-2xl font-bold text-primary">الأكثر استخدامًا</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((c) => (
              <CalculatorCard key={c.id} calc={c} />
            ))}
          </div>
        </section>

        <section aria-labelledby="cats" className="mt-14">
          <h2 id="cats" className="mb-5 text-2xl font-bold text-primary">الأقسام</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const live = calculatorsIn(cat.id);
              const isLive = LIVE_CATEGORIES.includes(cat);
              const inner = (
                <>
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary-50 text-secondary">
                      <CategoryIcon id={cat.id} />
                    </span>
                    <span className="font-bold text-primary">{cat.name}</span>
                  </span>
                  <p className="mt-2 text-sm text-muted">{cat.description}</p>
                  <p className="mt-3 text-xs text-muted">
                    {live.length ? `${live.length} حاسبة متاحة` : "قريبًا"} · قريبًا: {cat.upcoming.join("، ")}
                  </p>
                </>
              );
              return isLive ? (
                <Link key={cat.id} href={`/${cat.slug}`} className="rounded-2xl border border-line bg-white p-5 shadow-card hover:border-secondary">
                  {inner}
                </Link>
              ) : (
                <div key={cat.id} className="rounded-2xl border border-dashed border-line bg-bg p-5">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        <AdSlot slot="home-mid" />

        <section aria-labelledby="recent" className="mt-14">
          <h2 id="recent" className="mb-5 text-2xl font-bold text-primary">اتحدثت مؤخرًا</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {recent.map((c) => (
              <CalculatorCard key={c.id} calc={c} showDate />
            ))}
          </div>
        </section>

        <section aria-labelledby="guides" className="mt-14">
          <h2 id="guides" className="mb-5 text-2xl font-bold text-primary">أدلة مفيدة</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="block rounded-xl border border-line bg-white px-5 py-4 font-semibold text-primary hover:border-secondary">
                  {g.title} ←
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE.name, url: absoluteUrl("/"), inLanguage: "ar-EG" },
            { "@type": "Organization", name: SITE.name, url: absoluteUrl("/") },
          ],
        }}
      />
    </>
  );
}
