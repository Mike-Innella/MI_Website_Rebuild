import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: "Website Rebuild",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.themeColor.light,
    theme_color: siteConfig.themeColor.light,
    icons: [
      {
        src: siteConfig.faviconPath,
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: siteConfig.logoPath,
        sizes: `${siteConfig.socialImageWidth}x${siteConfig.socialImageHeight}`,
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
