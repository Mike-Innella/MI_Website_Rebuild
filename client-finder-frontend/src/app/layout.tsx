import "./globals.css";
import "../components/skeleton/skeleton.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Footer from "@/components/layout/Footer";
import { siteConfig, siteUrl } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  keywords: siteConfig.keywords,
  applicationName: siteConfig.siteName,
  creator: siteConfig.orgName,
  publisher: siteConfig.orgName,
  category: "Business",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.siteName,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.socialImagePath,
        alt: `${siteConfig.siteName} logo`,
        width: siteConfig.socialImageWidth,
        height: siteConfig.socialImageHeight,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: [siteConfig.socialImagePath],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: siteConfig.faviconPath,
    shortcut: siteConfig.faviconPath,
    apple: siteConfig.logoPath,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor.dark },
  ],
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: siteConfig.themeColor.light,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
