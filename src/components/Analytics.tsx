"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const KEY = "cookie-consent";

/** GA4 + AdSense load only after explicit consent. Without any IDs configured, nothing renders. */
export function Analytics() {
  const [consent, setConsent] = useState<"granted" | "denied" | null | undefined>(undefined);
  useEffect(() => {
    try {
      // localStorage exists only after hydration; reading it here is intended.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent((localStorage.getItem(KEY) as "granted" | "denied" | null) ?? null);
    } catch {
      setConsent(null);
    }
  }, []);
  if (!SITE.gaId && !SITE.adsenseClient) return null;

  function choose(v: "granted" | "denied") {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setConsent(v);
  }

  return (
    <>
      {consent === "granted" && SITE.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${SITE.gaId}');`}
          </Script>
        </>
      )}
      {consent === "granted" && SITE.adsenseClient && (
        <Script src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`} strategy="lazyOnload" crossOrigin="anonymous" />
      )}
      {consent === null && (
        <div role="dialog" aria-label="الموافقة على الكوكيز" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-line bg-white p-4 shadow-card sm:flex sm:items-center sm:gap-4">
          <p className="text-sm text-ink">
            بنستخدم كوكيز لقياس الزيارات وعرض الإعلانات. الحاسبات شغالة في الحالتين. <Link href="/سياسة-الخصوصية" className="text-secondary underline">سياسة الخصوصية</Link>
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <button onClick={() => choose("granted")} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">
              موافق
            </button>
            <button onClick={() => choose("denied")} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted">
              رفض
            </button>
          </div>
        </div>
      )}
    </>
  );
}
