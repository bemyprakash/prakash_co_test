import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SessionProvider from "@/components/providers/SessionProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "A. Prakash & Co. | Since 1928 — Heritage Tea, Coffee & Confectionery",
    template: "%s | A. Prakash & Co.",
  },
  description:
    "A. Prakash & Co. has been serving quality tea, coffee, jams, cheese, and confectionery since 1928. A heritage brand trusted by generations.",
  keywords: [
    "A. Prakash & Co.",
    "Prakash's",
    "heritage tea",
    "Darjeeling tea",
    "since 1928",
    "coffee",
    "jams",
    "confectionery",
    "heritage brand",
    "India",
  ],
  authors: [{ name: "A. Prakash & Co." }],
  creator: "A. Prakash & Co.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "A. Prakash & Co.",
    title: "A. Prakash & Co. | Since 1928",
    description: "Heritage tea, coffee, jams, cheese & confectionery since 1928.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "A. Prakash & Co." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A. Prakash & Co. | Since 1928",
    description: "Heritage tea, coffee, jams, cheese & confectionery since 1928.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <head>
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "A. Prakash & Co.",
              alternateName: "Prakash's",
              foundingDate: "1928",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: process.env.NEXT_PUBLIC_STORE_PHONE,
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [],
            }),
          }}
        />
        {/* Structured Data: LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "A. Prakash & Co.",
              description: "Heritage tea, coffee, jams, cheese and confectionery since 1928.",
              foundingDate: "1928",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              telephone: process.env.NEXT_PUBLIC_STORE_PHONE,
              email: process.env.NEXT_PUBLIC_STORE_EMAIL,
              currenciesAccepted: "INR",
              paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
              priceRange: "₹₹",
            }),
          }}
        />
      </head>
      <body className="bg-white text-charcoal antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
              borderRadius: "2px",
            },
          }}
        />
      </body>
    </html>
  );
}
