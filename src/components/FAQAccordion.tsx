// Native <details>: works without JS and stays fully crawlable.
export function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-primary">
            <h3 className="text-base">{f.q}</h3>
            <span aria-hidden="true" className="text-xl text-secondary transition group-open:rotate-45 motion-reduce:transition-none">
              +
            </span>
          </summary>
          <p className="mt-2 text-ink">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
