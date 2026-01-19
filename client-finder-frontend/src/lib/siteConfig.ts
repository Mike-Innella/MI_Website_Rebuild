const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baseSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const siteUrl = baseSiteUrl.replace(/\/$/, "");

export const siteConfig = {
  siteName: "7-Day Website Rebuild",
  description: "7-day website rebuild for small businesses and creators.",
  orgName: "M. I. Website Rebuilds",
  logoPath: "/assets/MILogo.png",
  faviconPath: "/assets/favicon.ico",
  socialImagePath: "/assets/MILogo.png",
  locale: "en_US",
  language: "en-US",
  keywords: [
    "website rebuild",
    "small business website",
    "conversion-focused design",
    "website redesign",
    "performance optimization",
    "seo upgrade",
    "landing page",
    "web development",
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
