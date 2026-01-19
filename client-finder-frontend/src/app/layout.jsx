import "./globals.css";
import "../components/skeleton/skeleton.css";
import Providers from "./providers";
import Footer from "@/components/layout/Footer";
import RelayWidget from "@/components/relay/RelayWidget";
import { siteConfig, siteUrl } from "@/lib/siteConfig";

export const metadata = {
  title: siteConfig.siteName,
  description: siteConfig.description,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: siteConfig.faviconPath,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Footer />
          <RelayWidget />
        </Providers>
      </body>
    </html>
  );
}
