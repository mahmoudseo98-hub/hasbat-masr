import { SITE } from "@/lib/site";

/**
 * Reserved, clearly labelled ad area. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set,
 * so there are no empty boxes before monetisation. Fixed min-height prevents layout shift (CLS).
 */
export function AdSlot({ slot }: { slot: string }) {
  if (!SITE.adsenseClient) return null;
  return (
    <aside aria-label="إعلان" className="my-8 min-h-[120px] rounded-xl border border-line bg-bg p-2 text-center">
      <span className="block text-xs text-muted">إعلان</span>
      <ins className="adsbygoogle block" data-ad-client={SITE.adsenseClient} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
