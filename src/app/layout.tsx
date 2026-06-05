import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";
import SmoothScroll from "@/components/SmoothScroll";

// Load Google Fonts for premium typography
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Premium SEO Metadata
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II",
  description:
    "Welcome to KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II, a premier commercial destination offering state-of-the-art workspaces and facilities.",
  keywords: [
    "Kohinoor City",
    "Kohinoor City Office Towers",
    "Industrial Estate",
    "Premises Co-Op Society Ltd",
    "Commercial II",
  ],
  authors: [{ name: "KOHINOOR CITY" }],
  robots: "index, follow",
  openGraph: {
    title: "KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II",
    description:
      "Explore KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II. Premium commercial and corporate office spaces designed for modern business operations.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-navy-900 selection:bg-sky-500/20 selection:text-sky-900">
        <SmoothScroll>
          {/* Ambient scrolling glowing backdrops */}
          <BackgroundGlow />

          {/* Global Navigation */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow pt-[72px] md:pt-[76px]">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
