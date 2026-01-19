import "./globals.css";
import "../components/skeleton/skeleton.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Footer from "@/components/layout/Footer";
import RelayWidget from "@/components/relay/RelayWidget";
import { siteConfig, siteUrl } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Footer />
          <RelayWidget />
        </Providers>
      </body>
    </html>
  );
}
