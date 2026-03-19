import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebVitals from "@/components/WebVitals";
import { SITE_NAME, SITE_DESCRIPTION, BASE_URL, generateWebSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  verification: {
    google: siteConfig.googleVerification,
  },
  title: {
    default: `${SITE_NAME} - Free Online Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteJsonLd(BASE_URL, SITE_NAME)),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <GoogleAnalytics />
        <WebVitals />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
