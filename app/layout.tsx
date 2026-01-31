import type { Metadata } from "next";
import { Comfortaa } from "next/font/google"; // Ensure this matches the previous import exactly if needed, likely just correct
import Sidebar from "@/components/Sidebar";
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
        <Sidebar />

        {/* Main Content Area - Pushed right by Sidebar */}
        <div style={{ marginLeft: '250px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
