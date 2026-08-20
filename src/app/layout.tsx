import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.linacymart.co.ke'),
  title: {
    default: "BF Suma Kenya | Premium Health & Wellness Products",
    template: "%s | BF Suma Kenya"
  },
  description: "Shop authentic BF Suma health, wellness, and beauty products in Kenya. Fast delivery nationwide. Enhance your vitality and well-being today.",
  keywords: ["BF Suma Kenya", "Health supplements", "Wellness products", "BF Suma distributor", "Buy BF Suma online"],
  openGraph: {
    title: "BF Suma Kenya | Premium Health & Wellness Products",
    description: "Shop authentic BF Suma health, wellness, and beauty products in Kenya. Fast delivery nationwide.",
    url: "https://www.linacymart.co.ke",
    siteName: "BF Suma Kenya",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BF Suma Kenya | Premium Health & Wellness",
    description: "Shop authentic BF Suma health, wellness, and beauty products in Kenya.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
