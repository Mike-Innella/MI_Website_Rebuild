const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baseSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const siteUrl = baseSiteUrl.replace(/\/$/, "");

export const siteConfig = {
  siteName: "7-Day Website Rebuild",
  tagline: "Conversion-focused sites delivered in one week",
  description:
    "7-day conversion-focused website rebuilds for small businesses. Clearer messaging, faster load times, SEO tuning, and analytics so you get more calls and form submissions.",
  orgName: "M. I. Website Rebuilds",
  logoPath: "/assets/MILogo.png",
  faviconPath: "/assets/favicon.ico",
  socialImagePath: "/assets/MILogo.png",
  socialImageWidth: 729,
  socialImageHeight: 729,
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
    "fast website launch",
    "conversion rate optimization",
    "small business website redesign",
    "local service website",
  ],
  themeColor: {
    light: "#0B3D91",
    dark: "#0F161F",
  },
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.orgName,
      url: siteUrl,
      image: `${siteUrl}${siteConfig.socialImagePath}`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}${siteConfig.logoPath}`,
        width: siteConfig.socialImageWidth,
        height: siteConfig.socialImageHeight,
      },
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: `${siteConfig.siteName} | ${siteConfig.tagline}`,
      url: siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": `${siteUrl}/#organization` },
      image: `${siteUrl}${siteConfig.socialImagePath}`,
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: `${siteConfig.siteName} | ${siteConfig.tagline}`,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      primaryImageOfPage: `${siteUrl}${siteConfig.socialImagePath}`,
    },
  ],
};
