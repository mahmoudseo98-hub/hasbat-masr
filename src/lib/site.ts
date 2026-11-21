// Site-wide settings. Everything environment-specific comes from env vars (see .env.example).
export const SITE = {
  name: "حاسبات مصر",
  tagline: "حاسبات مصرية دقيقة بمصادر رسمية",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
};

/** Absolute URL for a site path. Arabic paths are percent-encoded so canonical/sitemap URLs are valid. */
export function absoluteUrl(path = "/") {
  return SITE.url + encodeURI(path);
}
