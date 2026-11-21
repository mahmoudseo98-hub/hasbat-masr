import type { CalculatorContent } from "@/calculators/types";
import { categoryById } from "@/content";
import { Breadcrumbs } from "./Breadcrumbs";
import { CalculatorWidget } from "./CalculatorWidget";
import { Blocks } from "./Blocks";
import { FAQAccordion } from "./FAQAccordion";
import { SourceReferences } from "./SourceReferences";
import { LastUpdated } from "./LastUpdated";
import { RelatedCalculators } from "./RelatedCalculators";
import { AdSlot } from "./AdSlot";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="mb-4 text-2xl font-bold text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CalculatorLayout({ calc }: { calc: CalculatorContent }) {
  const cat = categoryById(calc.category);
  return (
    <article className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={[{ name: cat.name, href: `/${cat.slug}` }, { name: calc.shortTitle, href: `/${calc.slug}` }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-bold leading-tight text-primary sm:text-4xl">{calc.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-ink">{calc.intro}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <LastUpdated date={calc.lastUpdated} />
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${calc.status === "verified" ? "bg-secondary-50 text-secondary" : "bg-accent-50 text-[#8a5a00]"}`}>
            {calc.status === "verified" ? "مبنية على مصادر موثّقة" : "نموذج أولي — بعض البيانات محتاجة تحقق رسمي"}
          </span>
        </div>
      </header>

      <div className="mt-6">
        <CalculatorWidget id={calc.id} title={calc.title} />
      </div>
      <p className="mt-3 text-sm text-muted">
        النتائج تقديرية لأغراض المعلومات، والمبلغ الملزم بتحدده الجهة المختصة. الموقع مستقل ومش تابع لأي جهة حكومية أو بنك.
      </p>

      <AdSlot slot="calc-after-widget" />

      <Section id="how" title="إزاي تستخدم الحاسبة">
        <ol className="list-decimal space-y-1.5 pr-6 marker:font-bold marker:text-secondary">
          {calc.howTo.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Section>

      <Section id="methodology" title="طريقة الحساب">
        <Blocks blocks={calc.methodology} />
      </Section>

      <Section id="example" title="مثال عملي">
        <div className="rounded-2xl bg-bg p-5">
          <h3 className="mb-3 font-bold text-primary">{calc.example.title}</h3>
          <Blocks blocks={calc.example.blocks} />
        </div>
      </Section>

      <Section id="assumptions" title="افتراضات مهمة">
        <ul className="list-disc space-y-1.5 pr-6 marker:text-accent">
          {calc.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="أسئلة شائعة">
        <FAQAccordion faqs={calc.faqs} />
      </Section>

      <Section id="sources" title="المصادر الرسمية والمراجع">
        <SourceReferences sources={calc.sources} />
        <div className="mt-3">
          <LastUpdated date={calc.lastUpdated} />
        </div>
      </Section>

      {calc.partnerLinks && calc.partnerLinks.length > 0 && (
        <aside aria-label="روابط شركاء" className="mt-10 rounded-2xl border border-line p-4 text-sm">
          <p className="mb-2 text-xs text-muted">روابط شركاء — ممكن نحصل على عمولة بدون أي تكلفة عليك</p>
          <ul className="space-y-1">
            {calc.partnerLinks.map((l) => (
              <li key={l.url}>
                <a href={l.url} rel="sponsored noopener" target="_blank" className="text-secondary underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <Section id="related" title="حاسبات ممكن تفيدك">
        <RelatedCalculators ids={calc.related} />
      </Section>
    </article>
  );
}
