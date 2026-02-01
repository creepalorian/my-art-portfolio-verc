import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import TopHeader from "@/components/TopHeader";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Creepalorian',
    default: 'Creepalorian | Artist in Singapore',
  },
  description: 'Portfolio of AD (Creepalorian), a left-handed artist from Singapore specializing in digital art, anime-inspired works, and sketches.',
  keywords: ['Creepalorian', 'Singapore Artist', 'Digital Art', 'Anime Art', 'Left-handed artist', 'Singapore', 'Speedcubing'],
  openGraph: {
    title: 'Creepalorian | Artist in Singapore',
    description: 'Explore the digital art portfolio of AD (Creepalorian).',
    url: 'https://creepalorian.vercel.app', // Update if custom domain
    siteName: 'Creepalorian Art',
    locale: 'en_SG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creepalorian | Artist in Singapore',
    description: 'Explore the digital art portfolio of AD (Creepalorian).',
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
    <html lang="en" className={comfortaa.variable}>
      <body>
        <TopHeader />
        <Sidebar />

        {/* Main Content Area - Responsive margin */}
        <div className="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
