import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

export const metadata: Metadata = {
  title: "Art Portfolio",
  description: "A digital catalog of my artwork",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={comfortaa.variable}>
        {/* Global White Frame */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '12px solid #ffffff',
          pointerEvents: 'none',
          zIndex: 9999,
        }} />

        <Header />
        {children}
      </body>
    </html>
  );
}
