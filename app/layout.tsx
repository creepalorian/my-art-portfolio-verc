import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import Header from "@/components/Header";
import Frame from "@/components/Frame";
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
    <html lang="en" className={comfortaa.variable}>
      <body>
        <Frame />
        <Header />
        {children}
      </body>
    </html>
  );
}
