const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baseSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const siteUrl = baseSiteUrl.replace(/\/$/, "");

export const siteConfig = {
  siteName: "7-Day Website Rebuild",
  description: "7-day website rebuild for small businesses and creators.",
  orgName: "M. I. Website Rebuilds",
  logoPath: "/assets/MILogo.png",
  faviconPath: "/assets/favicon.ico",
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.orgName,
      url: siteUrl,
      logo: `${siteUrl}${siteConfig.logoPath}`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.siteName,
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};
