import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";

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
  title: "Kohinoor Complex | Premium Dual-Tower Commercial Destination",
  description:
    "Welcome to Kohinoor Complex, a futuristic dual-tower corporate landmark where business meets modern excellence. Offering state-of-the-art office spaces, sky lounges, helipads, and smart-automation facilities.",
  keywords: [
    "Kohinoor Complex",
    "Commercial Real Estate",
    "Futuristic Office Space",
    "Luxury Corporate Offices",
    "Towers Zenith and Apex",
    "Smart Commercial Towers",
  ],
  authors: [{ name: "Kohinoor Landmark Group" }],
  robots: "index, follow",
  openGraph: {
    title: "Kohinoor Complex | Futuristic Commercial Landmarks",
    description:
      "Explore Kohinoor Complex, featuring Tower Zenith and Tower Apex. State-of-the-art corporate offices designed for modern operational excellence.",
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
      className={`${plusJakartaSans.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-navy-900 selection:bg-sky-500/20 selection:text-sky-900">
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
      </body>
    </html>
  );
}
