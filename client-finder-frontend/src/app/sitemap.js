const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ];
}
