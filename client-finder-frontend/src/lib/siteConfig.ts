const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baseSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const siteUrl = baseSiteUrl.replace(/\/$/, "");

export const siteConfig = {
  siteName: "7-Day Website Rebuild",
  description: "Conversion-focused 7-day website rebuilds with SEO, speed, and CRO baked in.",
  orgName: "M. I. Website Rebuilds",
  logoPath: "/assets/MILogo.png",
  faviconPath: "/assets/favicon.ico",
  socialImagePath: "/assets/MILogo.png",
  locale: "en_US",
  language: "en-US",
  keywords: [
    "website rebuild",
    "conversion-focused website",
    "small business website",
    "seo upgrade",
    "website redesign",
    "performance optimization",
    "landing page",
    "web development",
    "ai website assistant",
    "fast website launch",
  ],
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.orgName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}${siteConfig.logoPath}`,
      },
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.siteName,
      url: siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteConfig.siteName,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
    },
  ],
};
